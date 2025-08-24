import enrollments from '../data/enrollments.json'
import users from '../data/users.json'
import courses from '../data/courses.json'
import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { SuccessOrFailMessage } from '../components/SuccessOrFailMessage'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

export const Enrollments = () => {
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

    function addNewEnrollment(values, errors){
        setIsAddClicked(false) //to close addform dialog
        if(Object.keys(errors).length > 0){
            setopenFailedAdded(true)
            return
        }
        let newEnrollment = {
            id: `enr_${savedEnrollments.length}`,
            courseId: courseID,
            ...values
        }
        let updatedEnrollments = [...savedEnrollments, newEnrollment]
        setSavedEnrollments(updatedEnrollments)
        localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments))
        setopenSuccessAdded(true)
    }

    function saveEdit(values, errors){
        //only progress we can edit
        setIsEditClicked(false)
        if(Object.keys(errors).length > 0){
            setopenFailedEdited(true)
            return
        }
        //get saved info of updated enrollment (not edited)
        let {id, studentId, courseId} = savedEnrollments.find(({id})=> id == enrollmentId)
        let updatedEnrollmet = {id, studentId, courseId, progress: values.progress}
        let updatedEnrollments = savedEnrollments.map(en => {
            if(en.id == enrollmentId) return updatedEnrollmet
            return en
        })
        setSavedEnrollments(updatedEnrollments)
        localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments))
        setopenSuccessEdited(true)
    }

    function deleteEnrollment(){
        setIsDeleteClicked(false) //to close delete dialog
        const updatedEnrollments = savedEnrollments.filter(({id})=> id != enrollmentId)
        localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments))
        setSavedEnrollments(updatedEnrollments)
        setOpenSuccessDeleted(true)
    }
    
    return(
        <Box>
            <List>{enrollmentsMapToCards}</List>
            <Dialog open={isEditClicked} onClose={()=> setIsEditClicked(false)}>
                    <DialogTitle>Edit {editedOrDeletedStudentName} Progress</DialogTitle>
                    <DialogContent sx={{display: 'grid', gap: '2rem'}}>
                        <Formik
                            initialValues={initialEditFormValues}
                            validationSchema={editFormValidationSchema}
                        >
                            {({values, touched, errors, handleBlur, handleChange}) => (
                                <Form>
                                    {Object.keys(initialEditFormValues).map(fieldName =>
                                        <Grid key={`course-${fieldName}-input`}>
                                            <TextField
                                                name={fieldName}
                                                label={fieldName}
                                                variant="outlined"
                                                value={values[fieldName]}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                error={touched[fieldName] && Boolean(errors[fieldName])}
                                                helperText={touched[fieldName] && errors[fieldName]}
                                            />
                                        </Grid>
                                    )}
                                    <DialogActions>
                                        <Button type='submit' onClick={()=> saveEdit(values, errors)}>Save</Button>
                                        <Button onClick={()=> setIsEditClicked(false)}>Cancel</Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>
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
                {/* add dialog */}
            <Dialog open={isAddClicked} onClose={()=> setIsAddClicked(false)}>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogContent>
                    <Formik 
                        initialValues={initialAddFormValues} 
                        validationSchema={addFormValidationSchema}
                    >
                        {({values, touched, errors, handleBlur, handleChange}) => (
                            <Form>
                                {Object.keys(initialAddFormValues).map(fieldName => 
                                    //key={fieldName} becaues name of input or field is unique 
                                    <Grid key={`${fieldName}-input`}>
                                        <TextField
                                            name={fieldName}
                                            label={fieldName}
                                            variant="outlined"
                                            //to prevent make successful add with empty values
                                            autoFocus={true}
                                            //set value to dynamic value using values state from formik
                                            //becaues of we assign it to constant value we can't edit on it
                                            value={values[fieldName]}
                                            
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={touched[fieldName] && Boolean(errors[fieldName])}
                                            helperText={touched[fieldName] && errors[fieldName]}
                                        />
                                    </Grid>  
                                )}
                                <DialogActions>
                                    <Button type='submit' onClick={()=> addNewEnrollment(values, errors)}>Submit</Button>
                                    <Button onClick={()=> setIsAddClicked(false)}>Cancel</Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
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
        </Box>
    )
}