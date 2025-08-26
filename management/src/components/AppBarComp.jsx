import AppBar from "@mui/material/AppBar"
import Typography from "@mui/material/Typography"
import { Button } from "@mui/material"
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export const AppBarComp = ()=> {
    const navigate = useNavigate()
    const {userEmail, logout}= useContext(AuthContext)
    return(
        <AppBar>
            <Typography component={'h1'}>Student Management System</Typography>
            {
                userEmail ?
                <Button onClick={logout}>Log Out</Button> :
                <Button onClick={()=> navigate('/login')}>Log In</Button>
            }
        </AppBar>
    )
}