import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "../routes/AppRoutes"
import { AuthProvider } from "../contexts/AuthProvider"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { useState } from "react"
import { BuildTheme } from "../contexts/ThemeContext"

export const App = () => {
    const [mode, setMode] = useState(localStorage.getItem('mode')||'light')
    const theme = BuildTheme(mode)
    
    return(
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes theme={mode} updateTheme={setMode}/>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}
