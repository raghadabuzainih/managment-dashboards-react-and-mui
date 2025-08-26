import Box from "@mui/material/Box"
import { AppBarComp } from "./AppBarComp"
import { DrawerComp } from "./DrawerComp"
import { Outlet } from "react-router-dom"

export const AppBarAndDrawer= () => {
    return <Box>
        <AppBarComp />
        <DrawerComp />
        <Box>
            <Outlet />
        </Box>
    </Box>
}