import {Bar} from 'react-chartjs-2'
import { Pie } from 'react-chartjs-2' 
import courses from '../data/courses.json'
import enrollments from '../data/enrollments.json'
import users from '../data/users.json'
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title,
    Tooltip, 
    Legend,
    ArcElement
} from 'chart.js';
//every import will put in:
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import {
  Card,
  CardContent,
  Container
} from '@mui/material'
import { AccessPage } from '../components/AccessPage'

const Reports = () => {
    const {userEmail} = useContext(AuthContext)
    let savedCourses = localStorage.getItem('courses') ? 
                        JSON.parse(localStorage.getItem('courses')) : courses
    let savedEnrollments = localStorage.getItem('enrollments') ?
                        JSON.parse(localStorage.getItem('enrollments')) : enrollments
    //1- students/courses chart info: 
    let coursesNames = savedCourses.map(course => { return course.title })
    let coursesIDs = savedCourses.map(course => { return course.id })
    let studentCountsPerCourse = coursesIDs.map(courseID => {
        return savedEnrollments.filter(({courseId}) => courseId == courseID).length
    })
    const bgColors = coursesNames.map((x, index)=>{
        return index%2==0 ? '#32a887ff' : '#324ea8ff'
    })
    const data = {
        labels: coursesNames, //x-axis
        datasets: [ //y-axis
            {
                label: 'Number of students',
                data: studentCountsPerCourse,
                backgroundColor: bgColors
            }
        ]
    }
    const options = {
        responsive: true,
        plugins: {
            legend: {display: false},
            title: {
                display: true,
                text: "Number of Students per Courses"
            }
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
    //2- courses/instructors chart info: 
    let instructors = users.filter(user => user.role == 'Instructor')
    let instructorsNames = instructors.map(inst => {return inst.firstName + " " + inst.lastName})
    let instructorsIDs = instructors.map(inst => {return inst.id})
    let coursesCountsPerInstructor = instructorsIDs.map(instructorID => {
        return savedCourses.filter(({instructorId}) => instructorId == instructorID).length
    })
    const bgColors2 = instructorsNames.map(()=>{
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    })
    const data2 = {
        labels: instructorsNames,
        datasets: [{
            label: 'Number of courses',
            data: coursesCountsPerInstructor,
            backgroundColor: bgColors2
        }]
    }

    const options2 = {
        responsive: true,
        plugins: {
            title: { display: true, text: "Number of Courses per Instructor" },
        },
        scales: {
            y: { ticks: { stepSize: 1 } }
        }
    }

    return(
        <Container sx={{display:'grid', gap:'3%', marginTop:'4.5%',marginBottom: '3%'}}>
            {userEmail?.role == 'Admin' ?
            <>
                {/* students/courses */}
                <Card>
                    <CardContent sx={{width:'80%', justifySelf:'center'}}>
                        <Bar data={data} options={options} />
                    </CardContent>
                </Card>
                {/* courses/instructors */}
                <Card>
                    <CardContent sx={{width:'60%', justifySelf:'center'}}>
                        <Pie data={data2} options={options2} />
                    </CardContent>
                </Card>
            </> : 
                <AccessPage message={"You don't have access to this page."}/>
            }
        </Container>
    )

}
export default Reports