import {Routes, Route} from 'react-router-dom'
import { AppBarAndDrawer } from '../components/AppBarAndDrawer'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import {Students} from '../pages/Students'
import { StudentDetails } from '../pages/StudentDetails'
import { Courses } from '../pages/Courses'
import { Enrollments } from '../pages/Enrollments'
import { Reports } from '../pages/Reports'

export const AppRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={<AppBarAndDrawer />}>
                <Route index path='/login' element={<Login />}/>
                <Route path='/' element={<Dashboard />}/>
                <Route path='/students' element={<Students />}/>
                <Route path='/students/:id' element={<StudentDetails />}/>
                <Route path='/courses' element={<Courses />}/>
                <Route path='/enrollments' element={<Enrollments />}/>
                <Route path='/reports' element={<Reports />}/>
            </Route>
        </Routes>
    )
}