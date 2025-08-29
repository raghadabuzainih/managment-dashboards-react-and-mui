import {Routes, Route} from 'react-router-dom'
import { AppBarAndDrawer } from '../components/AppBarAndDrawer'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { lazy,Suspense } from 'react'
const Students = lazy(()=> import('../pages/Students'))
const StudentDetails = lazy(()=> import('../pages/StudentDetails'))
const Courses = lazy(()=> import('../pages/Courses'))
const Enrollments = lazy(()=> import('../pages/Enrollments'))
const Reports = lazy(()=> import('../pages/Reports'))
import { AccessPage } from '../components/AccessPage'

export const AppRoutes = ({theme, updateTheme}) => {
    return(
        <Routes>
            <Route path='/' element={<AppBarAndDrawer theme={theme} updateTheme={updateTheme}/>}>
                <Route path='/login' element={<Login />}/>
                <Route index path='/' element={<Dashboard />}/>
                <Route path='/students' element={<Suspense fallback={<p>Loading...</p>}><Students /></Suspense>}/>
                <Route path='/students/:id' element={<Suspense fallback={<p>Loading...</p>}><StudentDetails /></Suspense>}/>
                <Route path='/courses' element={<Suspense fallback={<p>Loading...</p>}><Courses /></Suspense>}/>
                <Route path='/enrollments' element={<Suspense fallback={<p>Loading...</p>}><Enrollments /></Suspense>}/>
                <Route path='/reports' element={<Suspense fallback={<p>Loading...</p>}><Reports /></Suspense>}/>
                <Route path='*' element={<AccessPage message={'Page Not Found'}/>}/>
            </Route>
        </Routes>
    )
}