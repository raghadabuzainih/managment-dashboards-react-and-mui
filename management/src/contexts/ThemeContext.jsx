import { createTheme } from "@mui/material/styles"

export const BuildTheme = (mode = 'light')=> createTheme({
    palette: {
        mode
    }
})