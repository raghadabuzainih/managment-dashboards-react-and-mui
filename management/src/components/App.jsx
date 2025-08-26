import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "../routes/AppRoutes"
import {AuthContext} from '../contexts/AuthContext'
import { AuthProvider } from "../contexts/AuthProvider"

export const App = () => {
    return(
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    )
}
