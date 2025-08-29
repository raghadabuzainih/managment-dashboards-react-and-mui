import { createTheme } from "@mui/material/styles"

export const BuildTheme = (mode = 'light')=> createTheme({
    palette: {
        mode
    },
    shape: {
        borderRadius: '10px'
    }
})