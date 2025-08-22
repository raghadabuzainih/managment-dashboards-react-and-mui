import React from 'react'
import users from '../data/users.json'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Grid from '@mui/material/Grid'
import { SuccessOrFailMessage } from '../components/SuccessOrFailMessage'

export const Students = () => {
    const [students, setStudents] = React.useState(localStorage.getItem('students') ?
                                                    JSON.parse(localStorage.getItem('students')) :
                                                    users.filter(({role}) => role == 'Student'))
    const [isEditClicked, setIsEditClicked] = React.useState(false)
    const [openSuccessEdited, setopenSuccessEdited] = React.useState(false)
    const [openFailedEdited, setopenFailedEdited] = React.useState(false)
    const [isDeleteClicked, setIsDeleteClicked] = React.useState(false)
    const [openSuccessDeleted, setOpenSuccessDeleted] = React.useState(false)
    const [isAddClicked, setIsAddClicked] = React.useState(false)
    const [openSuccessAdded, setopenSuccessAdded] = React.useState(false)
    const [openFailedAdded, setopenFailedAdded] = React.useState(false)
    //store student id for edit & delete dialogs
    const [studentId, setStudentId] = React.useState('')
    //get data of the student to show it in edit dialog at the first time(initialValues)
    const student = students.find(student => student.id == studentId)

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'firstName', headerName: 'First Name', width: 120 },
        { field: 'lastName', headerName: 'Last Name', width: 120 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone Number', type: 'number', width: 160 },
        {
            field: 'profileURL',
            headerName: 'Profile URL',
            width: 160,
            renderCell: (params) => (
                <Link to={params.value} target='_blank'>
                    {params.value}
                </Link>
            )
        },
        {
            headerName: 'Edit / Delete',
            width: 150,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box display={'flex'} gap={1}>
                    <Button sx={{cursor: 'pointer'}} onClick={()=> openEditDialog(params.id)}>
                        <EditIcon sx={{color: 'red'}}/>
                    </Button>
                    <Button sx={{cursor:'pointer'}} onClick={()=> openDeleteDialog(params.id)}>
                        <DeleteIcon sx={{color: 'green'}}/>
                    </Button>
                </Box>
            )
        }
    ]
    const rows = students
    const initialEditFormValues = {
        id: student?.id, //this (?) because student undefined before we press edit button..
                         //because we catch student id when click edit button then find the student
        firstName: student?.firstName,
        lastName: student?.lastName,
        email: student?.email,
        password: student?.password,
        phone: student?.phone,
        profileURL: student?.profileURL,
    }

    const initialAddFormValues = {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        //note in data -> password begin with order of student 
        password: `${students.length+1}Stude%@`,
        phone: "",
        profileURL: ""
    }

    //Regular Expressions for testing: 
    const numberRegExp = /^[0-9]+$/
    const englishCharactersOnly = /^[A-Za-z]+$/
    const englishWithNumsAndSymbols = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>_\-\s]+$/
    const phoneNumberRegExp = /^\+970-5[69]\d{7}$/

    const commonValidation = Yup.object({
        id: Yup.string()
            .required('enter id')
            .matches(englishWithNumsAndSymbols, 'write in english please')
            .test('unique', 'enter unique id', (value) => 
                //x != student -> because maybe admin rewrite the same id for the same student & gave it enter unique id
                students.find(x => x.id == value && x != student) == undefined)
            .test('valid', 'it must start by stu_ and 3 numbers', (value)=> 
                //wanna check if it's unique
                //assume that id start from stu_001 to stu_999
                value.length == 7 && value.slice(0,4) == 'stu_' && numberRegExp.test(value.slice(4, 7))
            ),
        firstName: Yup.string()
                   .required('enter first name')
                   .matches(englishCharactersOnly, 'write only english letters'),
        lastName: Yup.string()
                  .required('enter last name')
                  .matches(englishCharactersOnly, 'write only english letters'),
        email: Yup.string()
               .required('enter email')
               .email('enter valid email')
               .matches(englishWithNumsAndSymbols, 'write in english please')
               .test('exists', 'enter unique email', (value) => 
                students.find(st => st.email == value && st != student)== undefined),
        password: Yup.string()
                  .required('enter password')
                  .test('validPassword', 'password must contain "Stude%@"', (value)=>
                    value.includes("Stude%@")),
        phone: Yup.string()
               .required('enter phone')
               .matches(phoneNumberRegExp, 'must begin with +970'),
        profileURL: Yup.string()
                    .required('enter profile URL')
                    //contain english letters/-/_
                    .matches(/^[a-zA-Z0-9/_-]+$/, 'enter valid path')
                    .test('uniquePath', 'enter unique path "/students/{id}"', (value)=>
                    students.find(st => st.profileURL == value && st!= student)== undefined)
    })

    const validationEditFormSchema = commonValidation
    const validationAddFormSchema = commonValidation
    
    function openEditDialog(id) {
        setIsEditClicked(true)
        setStudentId(id)
    }

    function saveEdit(values, errors){
        setIsEditClicked(false)
        if(Object.keys(errors).length > 0){
            setopenFailedEdited(true)
            return
        }
        let editedStudents = students.map(x => {
            if(x == student) return values
            return x
        })
        localStorage.setItem('students', JSON.stringify(editedStudents))
        setopenSuccessEdited(true)
        setStudents(editedStudents)
    }

    function addNewStudent(values, errors){
        console.log(errors)
        setIsAddClicked(false)
        if(Object.keys(errors).length > 0){
            setopenFailedAdded(true)
            return
        }
        let newStudents = [...students, values]
        localStorage.setItem('students', JSON.stringify(newStudents))
        setStudents(newStudents)
        setopenSuccessAdded(true)
    }
    
    function openDeleteDialog(id) {
        setIsDeleteClicked(true)
        setStudentId(id)
    }

    function deleteStudent(){
        const studentsAfterDelete = students.filter(student => student.id != studentId)
        localStorage.setItem('students', JSON.stringify(studentsAfterDelete))
        setStudents(studentsAfterDelete)
        setIsDeleteClicked(false)
        setOpenSuccessDeleted(true)
    }

    return (
        <Box>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10
                        }
                    }
                }}
                pageSizeOptions={[10]}   
                disableRowSelectionOnClick      
            />
            <Fab color='primary' onClick={()=> setIsAddClicked(true)}>
                <AddIcon />
            </Fab>
            {/* edit dialog */}
            <Dialog open={isEditClicked} onClose={()=> setIsEditClicked(false)}>
                <DialogTitle>Edit Student Info</DialogTitle>
                <DialogContent sx={{display: 'grid', gap: '2rem'}}>
                    <Formik 
                        initialValues={initialEditFormValues} 
                        validationSchema={validationEditFormSchema}
                    >
                        {({values, touched, errors, handleBlur, handleChange}) => (
                            <Form>
                                {Object.keys(initialEditFormValues).map(fieldName => 
                                    //key={fieldName} becaues name of input or field is unique 
                                    <Grid key={`${fieldName}-input`}>
                                        <TextField
                                            name={fieldName}
                                            label={fieldName}
                                            variant="outlined"
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
                message="Student Info edited successfully"
            />
            {/* failed edit */}
            <SuccessOrFailMessage 
                open={openFailedEdited}
                onClose={()=> setopenFailedEdited(false)} 
                severity="error"
                message="Failed to edit student info"
            />
            {/* delete dialog */}
            <Dialog open={isDeleteClicked} onClose={()=> setIsDeleteClicked(false)}>
                <DialogContent>
                    <DialogContentText>
                        Are you sure that you want to delete this student?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=> deleteStudent()}>Yes</Button>
                    <Button onClick={()=> setIsDeleteClicked(false)}>No</Button>
                </DialogActions>
            </Dialog>
            {/* successful delete */}
            <SuccessOrFailMessage 
                open={openSuccessDeleted}
                onClose={()=> setOpenSuccessDeleted(false)} 
                severity="success"
                message="Student deleted successfully"
            />
            {/* add dialog */}
            <Dialog open={isAddClicked} onClose={()=> setIsAddClicked(false)}>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogContent>
                    <Formik 
                        initialValues={initialAddFormValues} 
                        validationSchema={validationAddFormSchema}
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
                                    <Button type='submit' onClick={()=> addNewStudent(values, errors)}>Submit</Button>
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
                message="Student added successfully"
            />
            {/* failed add */}
            <SuccessOrFailMessage 
                open={openFailedAdded}
                onClose={()=> setopenFailedAdded(false)} 
                severity="error"
                message="Failed to add new student"
            />
        </Box>
  )
}
