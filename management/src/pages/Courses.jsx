import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionActions from "@mui/material/AccordionActions"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from "@mui/material/Typography"
import courses from '../data/courses.json'
import Button from "@mui/material/Button"
import users from '../data/users.json'
import Box from "@mui/material/Box"
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import * as Yup from 'yup'
import React from "react"
import { SuccessOrFailMessage } from "../components/SuccessOrFailMessage"
import { DialogForm } from "../components/DialogForm"

export const Courses = () => {
    const [allCourses, setAllCourses] = React.useState(localStorage.getItem('courses') ?
                                                    JSON.parse(localStorage.getItem('courses')) : courses)
    const [isEditClicked, setIsEditClicked] = React.useState(false)
    const [isAddClicked, setIsAddClicked] = React.useState(false)
    const [openSuccessEdited, setopenSuccessEdited] = React.useState(false)
    const [openFailedEdited, setopenFailedEdited] = React.useState(false)
    const [isDeleteClicked, setIsDeleteClicked] = React.useState(false)
    const [openSuccessDeleted, setOpenSuccessDeleted] = React.useState(false)
    const [openSuccessAdded, setopenSuccessAdded] = React.useState(false)
    const [openFailedAdded, setopenFailedAdded] = React.useState(false)
    //store course id for edit & delete dialogs
    const [courseId, setCourseId] = React.useState('')
    //get data of the course to show it in edit dialog at the first time(initialValues)
    let course = allCourses.find(({id}) => id == courseId)

    const initialEditFormValues = {
        id: course?.id,
        title: course?.title,
        instructorId: course?.instructorId,
        hours: course?.hours,
        description: course?.description
    }

    const initialAddFormValues = {
        id: `crs_0${allCourses.length+1}`,
        title: "",
        instructorId: "",
        hours: "",
        description: ""
    }

    //Regular Expressions for testing: 
    const numberRegExp = /^[0-9]+$/
    const englishWithNumsAndSymbols = /^[A-Za-z0-9!@#$%^&*(),.?":{}/|<>_\-\s]+$/

    const commonValidation = Yup.object({
        id: Yup.string()
           .required('enter id')
            .matches(englishWithNumsAndSymbols, 'write in english please')
            .test('unique', 'enter unique id', (value) => 
            //x != course -> because maybe admin rewrite the same id for the same course & gave it enter unique id
            allCourses.find(x => x.id == value && x != course) == undefined)
            .test('valid', 'it must start by crs_ and 3 numbers', (value)=> 
            //check if it's unique
            //assume that id start from crs_001 to crs_999
            value.length == 7 && value.slice(0,4) == 'crs_' && numberRegExp.test(value.slice(4, 7))
            ),
        title: Yup.string()
                .required('enter course title')
               .matches(englishWithNumsAndSymbols, 'write only english letters'),
        instructorId: Yup.string()
                      .required('enter instructor id')
                      .test('checkInstID', 'instructor not exists', (value)=>
                      users.find(({id})=> id== value) != undefined),
        description: Yup.string()
                    .required('enter course description')
                    .matches(englishWithNumsAndSymbols, 'write only english letters'),
        hours: Yup.string()
               .required('enter hours')
               .matches(/^[0-9]+$/, "Must be only digits")
                .test('checkHourRange', 'enter number between 1-100', (value) => 
                value >= 1 && value <= 100)          
    })

    const editFormValidationSchema = commonValidation
    const addFormValidationSchema = commonValidation

    const coursesInLists = allCourses.map((course, index) => {
        const instructor = users.find(({id})=> id == course.instructorId)
        const instructorFullName = instructor.firstName + " " + instructor.lastName
        return(
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`course${index}-details`}
                    id={`course${index}-header`}          
                >
                    <Typography component="span">{course.title}</Typography>
                </AccordionSummary>
                <AccordionDetails id={`course${index}-details`}>
                    <Typography component="p">It's taught by: {instructorFullName}</Typography>
                    <Typography component="p">Total hours: {course.hours}</Typography>
                    <Typography component="p">Description: {course.description}</Typography>
                </AccordionDetails>      
                <AccordionActions>
                    <Button onClick={()=> {
                        //these two lines we will use it for edit dialog form
                        setCourseId(course.id)
                        setIsEditClicked(true)
                    }}
                    >
                        Edit
                    </Button>
                    <Button onClick={()=> {
                        setCourseId(course.id)
                        setIsDeleteClicked(true)
                    }}
                    >
                        Delete
                    </Button>
                </AccordionActions> 
            </Accordion>
        )
    })

    function deleteCourse(){
        const coursesAfterDelete = allCourses.filter(course => course.id != courseId)
        localStorage.setItem('courses', JSON.stringify(coursesAfterDelete))
        setAllCourses(coursesAfterDelete)
        setIsDeleteClicked(false)
        setOpenSuccessDeleted(true)
    }

    return(
        <Box>
            {coursesInLists}
            <Fab color='primary' onClick={()=> setIsAddClicked(true)}>
                <AddIcon />
            </Fab>
            {/* edit dialog form */}
            <DialogForm 
                formTitle='Add New Course'
                condition={isEditClicked}
                setCondition= {setIsEditClicked}
                initialValues={initialEditFormValues}
                validationSchema = {editFormValidationSchema}
                setSuccessAction ={setopenSuccessEdited}
                setFailedAction ={setopenFailedEdited}
                array= {allCourses}
                arrayName= 'courses'
                setArray= {setAllCourses}
                item= {course}
                purpose= 'edit'
            />
            {/* successful edit */}
            <SuccessOrFailMessage 
                open={openSuccessEdited}
                onClose={()=> setopenSuccessEdited(false)} 
                severity="success"
                message="Course Info edited successfully"
            />
            {/* failed edit */}
            <SuccessOrFailMessage 
                open={openFailedEdited}
                onClose={()=> setopenFailedEdited(false)} 
                severity="error"
                message="Failed to edit course info"
            />
            {/* delete dialog */}
            <Dialog open={isDeleteClicked} onClose={()=> setIsDeleteClicked(false)}>
                <DialogContent>
                    <DialogContentText>
                        Are you sure that you want to delete this course?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=> deleteCourse()}>Yes</Button>
                    <Button onClick={()=> setIsDeleteClicked(false)}>No</Button>
                </DialogActions>
            </Dialog>
            {/* successful delete */}
            <SuccessOrFailMessage 
                open={openSuccessDeleted}
                onClose={()=> setOpenSuccessDeleted(false)} 
                severity="success"
                message="Course deleted successfully"
            />
            {/* add dialog form */}
            <DialogForm 
                formTitle='Edit Course Info'
                condition={isAddClicked}
                setCondition= {setIsAddClicked}
                initialValues={initialAddFormValues}
                validationSchema = {addFormValidationSchema}
                setSuccessAction ={setopenSuccessAdded}
                setFailedAction ={setopenFailedAdded}
                array= {allCourses}
                arrayName = 'courses'
                setArray= {setAllCourses}
                purpose= 'add'
            />    
            {/* successful add */}
            <SuccessOrFailMessage 
                open={openSuccessAdded}
                onClose={()=> setopenSuccessAdded(false)} 
                severity="success"
                message="Course added successfully"
            />
            {/* failed add */}
            <SuccessOrFailMessage 
                open={openFailedAdded}
                onClose={()=> setopenFailedAdded(false)} 
                severity="error"
                message="Failed to add new course"
            />
        </Box>
    )
}