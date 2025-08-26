import enrollments from '../data/enrollments.json'
import users from '../data/users.json'
import courses from '../data/courses.json'
import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import * as Yup from 'yup'
import { DialogForm } from '../components/DialogForm'
import { SuccessOrFailMessage } from '../components/SuccessOrFailMessage'
import {
    Container,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Typography,
    List,
    ListItem,
    Grid,
    Chip,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText
} from '@mui/material'

export const Enrollments = () => {
    const {userEmail} = useContext(AuthContext)
    const [savedEnrollments, setSavedEnrollments] = 
        React.useState(localStorage.getItem('enrollments') ?
        JSON.parse(localStorage.getItem('enrollments')) : enrollments)

    const students = localStorage.getItem('students') ?
        JSON.parse(localStorage.getItem('students')) : 
        users.filter(({role}) => role == 'Student')
    
    let savedCourses = localStorage.getItem('courses') ?
        JSON.parse(localStorage.getItem('courses')) : courses
    
    const [isEditClicked, setIsEditClicked] = React.useState(false)
    const [isAddClicked, setIsAddClicked] = React.useState(false)
    const [openSuccessEdited, setopenSuccessEdited] = React.useState(false)
    const [openFailedEdited, setopenFailedEdited] = React.useState(false)
    const [isDeleteClicked, setIsDeleteClicked] = React.useState(false)
    const [openSuccessDeleted, setOpenSuccessDeleted] = React.useState(false)
    const [openSuccessAdded, setopenSuccessAdded] = React.useState(false)
    const [openFailedAdded, setopenFailedAdded] = React.useState(false)
    //store enrollmentId for edit/delete operations
    const [enrollmentId, setEnrollmentId] = React.useState('')
    let enrollment = savedEnrollments.find(({id}) => id == enrollmentId)
    //show student name in edit/delete enrollment dialog title
    let editedOrDeletedStudent = students.find(({id})=> id == enrollment?.studentId)
    let editedOrDeletedStudentName = editedOrDeletedStudent?.firstName + " " + editedOrDeletedStudent?.lastName
    //using this for add new enrollment for course
    let [courseID, setCourseID] = React.useState("") 
    
    //we will use these lines to make courses enrollments cards
    let enrollmentsMap = new Map() //using map to make key always unique
    savedEnrollments.map(en => {
        let courseName = savedCourses.find(course => course.id == en.courseId).title
        let student = students.find(st => st.id == en.studentId)
        let studentName = student.firstName + " " + student.lastName
        enrollmentsMap.set(
            //key, value => courseName, array of objects that contain student name & his progress
            // || [] --> if key is not exists because [...enroll] will give error if key not defined --> [...undefined]
            courseName, [...enrollmentsMap.get(courseName) || [], {id: en.id , stName: studentName, progress: en.progress}]
        )
    })

    let enrollmentsMapToCards = Array.from(enrollmentsMap.entries()).map(([courseName, enrollment]) => {
        return(
            <ListItem key={`${courseName}-listItem`}>
                <Card>
                    <CardContent>
                        <Typography component={'h3'}>{courseName} Enrollments</Typography>
                        <Grid display={'flex'} gap={2}>
                            <Typography component={'h5'}>Students</Typography>
                            <Typography component={'h5'}>Progress</Typography>
                            <Typography component={'h5'}>Edit / UnEnroll</Typography>
                        </Grid>
                        {enrollment.map(en => {
                            return <Grid display={'flex'}>
                                <Typography component={'p'}>{en.stName}</Typography>
                                <Typography component={'p'}>{en.progress}</Typography>
                                <CircularProgress size={'2rem'} variant='determinate' value={en.progress}/>
                                <Chip 
                                    label="Edit progress" 
                                    onClick={()=> {
                                        setEnrollmentId(en.id)
                                        setIsEditClicked(true)
                                    }} 
                                    color='success'
                                />
                                {/* unEnroll -> delete */}
                                <Chip 
                                    label="UnEnroll" 
                                    onClick={()=> {
                                        setEnrollmentId(en.id)
                                        setIsDeleteClicked(true)
                                    }} 
                                    color='error'
                                />
                            </Grid>
                        })}
                    </CardContent>
                    <CardActions>
                        <Button 
                            variant='contained'
                            onClick={()=> {
                                setIsAddClicked(true)
                                setCourseID(courses.find(course => course.title == courseName).id)
                            }}
                        >
                            Add New Enrollment
                        </Button>
                    </CardActions>
                </Card>
            </ListItem>
        )     
    })

    //for operations -> edit, add, delete
    let initialEditFormValues= {
        progress: enrollment?.progress
    }

    const numberRegExp = /^[0-9]+$/
    let editFormValidationSchema = Yup.object({
        progress: Yup.string().required('enter progress')
            .matches(numberRegExp, 'must be a number')
            .test('validProgress', 'must be between 0-100', (value)=> value>=0 && value<=100)
    })

    let initialAddFormValues = {
        studentId: "",
        progress: "" 
    }

    let addFormValidationSchema = Yup.object({
        studentId: Yup.string().required('enter student id')
            .test('existStudent', 'student not exist', (value)=> students.find(({id})=> id == value))
            //prevent repeated enrollment if the student enrolled before at the same course(instedof it: edit his progress)
            .test('enrolledBefore', 'student enrolled before', (value)=> {
                const courseEnrollments = savedEnrollments.filter(({courseId}) => courseId == courseID)
                return courseEnrollments.find(({studentId})=> studentId == value) == undefined
            }),
        progress: Yup.string().required('enter progress')
            .matches(numberRegExp, 'must be a number')
            .test('validProgress', 'must be between 0-100', (value)=> value>=0 && value<=100)
    })

    function deleteEnrollment(){
        setIsDeleteClicked(false) //to close delete dialog
        const updatedEnrollments = savedEnrollments.filter(({id})=> id != enrollmentId)
        localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments))
        setSavedEnrollments(updatedEnrollments)
        setOpenSuccessDeleted(true)
    }
    
    return(
        <Container>
            {userEmail.role == 'Admin' && <>
                <List>{enrollmentsMapToCards}</List>
                    {/* edit dialog form */}
                    <DialogForm
                        formTitle='Edit Enrollment Info'
                        condition={isEditClicked}
                        setCondition= {setIsEditClicked}
                        initialValues={initialEditFormValues}
                        validationSchema = {editFormValidationSchema}
                        setSuccessAction ={setopenSuccessEdited}
                        setFailedAction ={setopenFailedEdited}
                        array= {savedEnrollments}
                        arrayName= 'enrollments'
                        setArray= {setSavedEnrollments}
                        item= {enrollment}
                        purpose= 'edit'
                    />
                    {/* successful edit */}
                    <SuccessOrFailMessage
                        open={openSuccessEdited}
                        onClose={()=> setopenSuccessEdited(false)}
                        severity="success"
                        message="Enrollment Info edited successfully"
                    />
                    {/* failed edit */}
                    <SuccessOrFailMessage
                        open={openFailedEdited}
                        onClose={()=> setopenFailedEdited(false)}
                        severity="error"
                        message="Failed to edit enrollment info"
                    />
                    {/* add dialog form */}
                    <DialogForm
                        formTitle='Add New Enrollment'
                        condition={isAddClicked}
                        setCondition= {setIsAddClicked}
                        initialValues={initialAddFormValues}
                        validationSchema = {addFormValidationSchema}
                        setSuccessAction ={setopenSuccessAdded}
                        setFailedAction ={setopenFailedAdded}
                        array= {savedEnrollments}
                        arrayName = 'enrollments'
                        setArray= {setSavedEnrollments}
                        courseId ={courseID}
                        purpose= 'add'
                    />
                {/* successful add */}
                <SuccessOrFailMessage
                    open={openSuccessAdded}
                    onClose={()=> setopenSuccessAdded(false)}
                    severity="success"
                    message="Enrollment added successfully"
                />
                {/* failed add */}
                <SuccessOrFailMessage
                    open={openFailedAdded}
                    onClose={()=> setopenFailedAdded(false)}
                    severity="error"
                    message="Failed to add new enrollment"
                />
                {/* delete dialog */}
                <Dialog open={isDeleteClicked} onClose={()=> setIsDeleteClicked(false)}>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete {editedOrDeletedStudentName} enrollment?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> deleteEnrollment()}>Yes</Button>
                        <Button onClick={()=> setIsDeleteClicked(false)}>No</Button>
                    </DialogActions>
                </Dialog>
                {/* successful delete */}
                <SuccessOrFailMessage
                    open={openSuccessDeleted}
                    onClose={()=> setOpenSuccessDeleted(false)}
                    severity="success"
                    message="Enrollment deleted successfully"
                />
            </>}
        </Container>
    )
}