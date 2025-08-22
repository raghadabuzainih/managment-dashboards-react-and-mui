import {Routes, Route} from 'react-router-dom'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import {Students} from '../pages/Students'
import { StudentDetails } from '../pages/StudentDetails'

export const AppRoutes = () => {
    return(
        <Routes>
            <Route index path='/login' element={<Login />}/>
            <Route path='/' element={<Dashboard />}/>
            <Route path='/students' element={<Students />}/>
            <Route path='/students/:id' element={<StudentDetails />}/>
        </Routes>
    )
}