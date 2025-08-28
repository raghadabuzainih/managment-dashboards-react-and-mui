import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Container,Typography } from "@mui/material"
import { AccessPage } from '../components/AccessPage'

export const Settings = ()=>{
    const {userEmail} = useContext(AuthContext)
    return(
        <Container>
            {userEmail?.role == 'Admin'?
                <Typography marginTop={'30%'} color="success" component={'h1'}>Welcome to settings page</Typography>
            :
                <AccessPage message={"You don't have access to this page."}/>
            }
        </Container>
    )
}