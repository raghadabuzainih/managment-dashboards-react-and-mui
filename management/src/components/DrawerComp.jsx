import Drawer from "@mui/material/Drawer"
import { Link } from "react-router-dom"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import { Typography } from "@mui/material"
import { Dashboard, People, MenuBook, Assignment, Assessment } from "@mui/icons-material"

export const DrawerComp = () => {
    const drawerItems = [
        'Dashboard',
        'Students',
        'Courses',
        'Enrollments',
        'Reports',
    ]
    const drawerItemsIcons = [
        <Dashboard/>, 
        <People/>, 
        <MenuBook/>, 
        <Assignment/>, 
        <Assessment/>, 
    ]

    return( 
        <Drawer 
            open={true} 
            slotProps={{backdrop: {invisible: true}}}
            variant="permanent"
        >
            <List sx={{display: 'grid', gap:'1rem', marginTop: '50%'}}>
                {drawerItems.map((itemName, index) =>{
                    return <ListItem sx={{display: "flex", gap:'6%'}} key={`${itemName}-drawerItem`}>
                                <Typography color="primary">{drawerItemsIcons[index]}</Typography>
                                {itemName == 'Dashboard' ?
                                    <Link style={{textDecoration: 'none'}} to='/'>{itemName}</Link> :
                                    <Link style={{textDecoration: 'none'}} to={`/${itemName.toLowerCase()}`}>{itemName}</Link>
                                }
                            </ListItem>
                })}
            </List>
        </Drawer>
    )
}