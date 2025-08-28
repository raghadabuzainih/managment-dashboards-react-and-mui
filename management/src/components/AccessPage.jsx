import { Typography } from "@mui/material"

export const AccessPage = ({message})=>{
    return(
        <Typography 
            component={'h1'}
            marginTop={'30%'}
        >
            {message}
        </Typography>        
    )
}