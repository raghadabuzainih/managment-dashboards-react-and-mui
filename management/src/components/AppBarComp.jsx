import {AppBar, Typography, Grid, Button} from '@mui/material'
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { DarkMode } from '@mui/icons-material'
import { LightMode } from '@mui/icons-material'

export const AppBarComp = ({theme,updateTheme})=> {
    const navigate = useNavigate()
    const {userEmail, logout}= useContext(AuthContext)
    function handleTheme(){
        const newTheme = theme == 'light' ? 'dark' : 'light'
        updateTheme(newTheme)
        localStorage.setItem('mode', newTheme)
    }
    return(
        <AppBar>
            <Grid display={'flex'} justifyContent={'space-around'}>
                <Typography component={'h1'}>Student Management System</Typography>
                {
                    userEmail?
                    <Button color='error' 
                        onClick={()=> {
                            navigate('/login')
                            logout()
                        }}
                    >
                        Log Out
                    </Button>
                
                    :
                    <Button 
                        color='error' 
                        onClick={()=> navigate('/login')}
                    >
                        Log In
                    </Button>
                }
                {
                    <Button 
                        color='error' 
                        onClick={handleTheme}
                        >
                            {theme == 'light' ? <DarkMode /> : <LightMode />}
                        </Button>
                }
            </Grid>
        </AppBar>
    )
}