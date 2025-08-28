import { useParams } from "react-router-dom"
import users from '../data/users.json'
import enrollments from '../data/enrollments.json'
import courses from '../data/courses.json'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import {
  Container,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { AccessPage } from "../components/AccessPage"

export const StudentDetails = () => {
    const {userEmail} = useContext(AuthContext)
    const students = localStorage.getItem('students') ?
        JSON.parse(localStorage.getItem('students')) : 
        users.filter(({role}) => role == 'Student')
    const savedEnrollments = localStorage.getItem('enrollments') ?
        JSON.parse(localStorage.getItem('enrollments')) : enrollments
    const savedCourses = localStorage.getItem('courses') ?
        JSON.parse(localStorage.getItem('courses')) : courses
    const {id} = useParams()
    const student = students.find(({id})=> id == id)
    const studentEnrollments = savedEnrollments.filter(({studentId})=> studentId == id)

    return(
        <Container>
            {userEmail?.role =='Admin' ?
            <>
                <Typography component={'h1'}>Personal Information:</Typography>
                <Typography component={'h2'}>
                    {`${student.firstName} ${student.lastName}`}
                </Typography>
                <Typography component={'h3'}>ID Number: {id}</Typography>
                <Typography component={'h4'}>Email: {student.email}</Typography>
                <Typography component={'h4'}>Phone Number: {student.phone}</Typography>
                <Typography component={'h1'}>Enrollment Details:</Typography>
                <Typography component={'h3'}>Total number of enrollments: {studentEnrollments.length}</Typography>
                {studentEnrollments.map(en => {
                    let {title, instructorId, hours} = savedCourses.find(({id})=> id == en.courseId)
                    let instructor = users.find(({id})=> id == instructorId)
                    return <Card>
                        <CardContent>
                            <Typography component={'p'}>Course Title: {title}</Typography>
                            <Typography component={'p'}>Tought By: {instructor.firstName} {instructor.lastName}</Typography>
                            <Typography component={'p'}>Course Hours: {hours}</Typography>
                            <Typography component={'p'}>Progress: {en.progress}%</Typography>
                        </CardContent>
                    </Card>
                })}
            </> : 
                <AccessPage message={"You don't have access to this page."}/>
            }
        </Container>
    )
}