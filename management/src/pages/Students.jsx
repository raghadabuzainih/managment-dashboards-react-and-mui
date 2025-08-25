import React from 'react'
import users from '../data/users.json'
//there is a relation between students & enrollments...
//so any delete on students will affect on enrollments
//--> add new student or edit not effect because add/edit forms contain info like info in users.json
//edit/add form don't contain enrollments or courses
import enrollments from '../data/enrollments.json'
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
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import * as Yup from 'yup'
import { DialogForm } from '../components/DialogForm'
import { SuccessOrFailMessage } from '../components/SuccessOrFailMessage'

export const Students = () => {
    const [students, setStudents] = 
        React.useState(localStorage.getItem('students') ?
        JSON.parse(localStorage.getItem('students')) :
        users.filter(({role}) => role == 'Student'))
    
        //run only the first time
    if(localStorage.getItem('enrollments') == null){
        localStorage.setItem('enrollments', JSON.stringify(enrollments))
    }
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
        id: `stu_0${students.length+1}`,
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
    const englishCharactersAndAcceptedSpaces = /^[A-Za-z\s]+$/
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
                  .matches(englishCharactersAndAcceptedSpaces, 'write only english letters'),
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
    
    function openDeleteDialog(id) {
        setIsDeleteClicked(true)
        setStudentId(id)
    }

    function deleteStudent(){
        const studentsAfterDelete = students.filter(student => student.id != studentId)
        localStorage.setItem('students', JSON.stringify(studentsAfterDelete))
        const savedEnrollments = JSON.parse(localStorage.getItem('enrollments'))
        //delete all student enrollments because this student will deleted from students
        const updatedEnrollments = savedEnrollments.filter(en => en.studentId != studentId)
        localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments))
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
            {/* edit dialog form */}
            <DialogForm 
                formTitle='Edit Student Info'
                condition={isEditClicked}
                setCondition= {setIsEditClicked}
                initialValues={initialEditFormValues}
                validationSchema = {validationEditFormSchema}
                setSuccessAction ={setopenSuccessEdited}
                setFailedAction ={setopenFailedEdited}
                array= {students}
                arrayName= 'students'
                setArray= {setStudents}
                item= {student}
                purpose= 'edit'
            />
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
            {/* add dialog form */}
            <DialogForm 
                formTitle='Add New Student'
                condition={isAddClicked}
                setCondition= {setIsAddClicked}
                initialValues={initialAddFormValues}
                validationSchema = {validationAddFormSchema}
                setSuccessAction ={setopenSuccessAdded}
                setFailedAction ={setopenFailedAdded}
                array= {students}
                arrayName = 'students'
                setArray= {setStudents}
                purpose= 'add'
            />
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
            <Fab color='primary' onClick={()=> setIsAddClicked(true)}>
                <AddIcon />
            </Fab>
        </Box>
  )
}
