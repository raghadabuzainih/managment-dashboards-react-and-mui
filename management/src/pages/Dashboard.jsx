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
  Container,
  Grid,
  Chip
} from '@mui/material';
import { AccessPage } from '../components/AccessPage'
import { People, MenuBook, Assignment, Unpublished } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
    const navigate = useNavigate()
    const {userEmail}= useContext(AuthContext)
    const students = localStorage.getItem('students') ?
        JSON.parse(localStorage.getItem('students')) : users.filter(({role}) => role == 'Student')
    const savedEnrollments = localStorage.getItem('enrollments') ?
        JSON.parse(localStorage.getItem('enrollments')) : enrollments
    const savedCourses = localStorage.getItem('courses') ?
        JSON.parse(localStorage.getItem('courses')) : courses
    let progressSum = 0
    savedEnrollments.forEach(({progress})=> progressSum += +progress)

    const icons = [
        <People sx={{fontSize: '5rem'}}/>, 
        <MenuBook sx={{fontSize: '5rem'}}/>, 
        <Assignment sx={{fontSize: '5rem'}}/>, 
        <Unpublished sx={{fontSize: '5rem'}}/>
    ]

    const counts = {
        "Number Of Students": students.length,
        "Number Of Courses": savedCourses.length,
        "Number Of Enrollments": savedEnrollments.length,
        "Completion Rate": (progressSum / savedEnrollments.length).toFixed(2) + "%"
    }

    const last_5_students = students.slice(students.length-5, students.length)
    const last_5_studentsMap = last_5_students.map(st =>{
        return <ListItem key={`student-${st.id}`} sx={{width: '30%', display: 'flex', gap:'2%'}}>
            <Typography component={'h2'}>{st.firstName + " " + st.lastName}</Typography>
            <Chip 
                color='info' 
                variant='outlined' 
                label='Click to see the profile link'
                onClick={()=> navigate(`/students/${st.id}`)}
            />
        </ListItem>
    })

    let countsToCards = Object.keys(counts).map((key,index) => {
        return <Card key={`${key}-dashboard-card`} sx={{width: '48%', margin: '8px', textAlign: 'center'}}>
                    <CardContent>
                        <Typography component={'h1'} color='info'>{icons[index]}</Typography>
                        <Typography component={'h3'} fontSize={'1.4rem'}>{key} :</Typography>
                        <Typography component={'h1'} color='info' fontSize={'1.2rem'}>{counts[key]}</Typography>
                    </CardContent>
                </Card>   
    })
    return(
        <Container sx={{marginTop:'4.5%' ,display:'grid',justifyItems:'center',textAlign: 'center'}}>
            {userEmail?.role == 'Admin' ?
            <>
                <Grid 
                    display={'flex'} 
                    flexWrap={'wrap'}
                    marginBottom={4}
                >
                    {countsToCards}
                </Grid>
                <Typography component={'h1'}>Last 5 Students Added :</Typography>
                <List sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {last_5_studentsMap}
                </List>
            </> : 
                <AccessPage message={"You don't have access to this page."}/>
            }
        </Container>
    )
}