import Box from "@mui/material/Box"
import { AppBarComp } from "./AppBarComp"
import { DrawerComp } from "./DrawerComp"
import { Outlet } from "react-router-dom"

export const AppBarAndDrawer= ({theme, updateTheme}) => {
    return <Box>
        <AppBarComp  theme={theme} updateTheme={updateTheme}/>
        <DrawerComp />
        <Box>
            <Outlet />
        </Box>
    </Box>
}