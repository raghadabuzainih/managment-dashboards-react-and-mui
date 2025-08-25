import { useParams } from "react-router-dom"
import users from '../data/users.json'
import enrollments from '../data/enrollments.json'
import courses from '../data/courses.json'
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

export const StudentDetails = () => {
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
        <Box>
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
        </Box>
    )
}