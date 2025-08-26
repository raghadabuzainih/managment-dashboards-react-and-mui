import users from '../data/users.json'
import enrollments from '../data/enrollments.json'
import courses from '../data/courses.json'
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Container
} from '@mui/material';

export const Dashboard = () => {
    const {userEmail}= useContext(AuthContext)
    const students = localStorage.getItem('students') ?
        JSON.parse(localStorage.getItem('students')) : users.filter(({role}) => role == 'Student')
    const savedEnrollments = localStorage.getItem('enrollments') ?
        JSON.parse(localStorage.getItem('enrollments')) : enrollments
    const savedCourses = localStorage.getItem('courses') ?
        JSON.parse(localStorage.getItem('courses')) : courses
    let progressSum = 0
    savedEnrollments.forEach(({progress})=> progressSum += +progress)

    const counts = {
        "Number Of Students": students.length,
        "Number Of Courses": savedCourses.length,
        "Number Of Enrollments": savedEnrollments.length,
        "Completion Rate": (progressSum / savedEnrollments.length).toFixed(2) + "%"
    }

    const last_5_students = students.slice(students.length-5, students.length)
    const last_5_studentsMap = last_5_students.map(st =>{
        return <ListItem key={`student-${st.id}`}>
            <Typography component={'h2'}>{st.firstName + " " + st.lastName}</Typography>
            <Typography component={'h3'}>{st.phone}</Typography>
        </ListItem>
    })

    let countsToCards = Object.keys(counts).map(key => {
        return <Card key={`${key}-dashboard-card`}>
                    <CardContent>
                        <Typography component={'h3'}>{key}</Typography>
                        <Typography component={'h1'}>{counts[key]}</Typography>
                    </CardContent>
                </Card>   
    })
    return(
        <Container>
            {userEmail?.role == 'Admin' &&
            <>
                {countsToCards}
                <List>
                    {last_5_studentsMap}
                </List>
            </>}
        </Container>
    )
}