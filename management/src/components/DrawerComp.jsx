import Drawer from "@mui/material/Drawer"
import { Link } from "react-router-dom"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import { Dashboard, People, MenuBook, Assignment, Assessment, Settings } from "@mui/icons-material"

export const DrawerComp = () => {
    const drawerItems = [
        'Dashboard',
        'Students',
        'Courses',
        'Enrollments',
        'Reports',
        'Settings'
    ]
    const drawerItemsIcons = [
        <Dashboard/>, 
        <People/>, 
        <MenuBook/>, 
        <Assignment/>, 
        <Assessment/>, 
        <Settings/>
    ]

    return( 
        <Drawer 
            open={true} 
            slotProps={{backdrop: {invisible: true}}}
            variant='permanent'
        >
            <List>
                {drawerItems.map((itemName, index) =>{
                    return <ListItem key={`${itemName}-drawerItem`}>
                        {drawerItemsIcons[index]}
                                {itemName == 'Dashboard' ? 
                                    <Link to='/'>{itemName}</Link> :
                                    <Link to={`/${itemName.toLowerCase()}`}>{itemName}</Link>
                                }
                            </ListItem>
                })}
            </List>
        </Drawer>
    )
}