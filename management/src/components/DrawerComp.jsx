import Drawer from "@mui/material/Drawer"
import { Link,Outlet } from "react-router-dom"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"

export const DrawerComp = () => {
    const drawerItems = [
        'Dashboard',
        'Students',
        'Courses',
        'Enrollments',
        'Reports',
        'Settings'
    ]

    return( 
        <Drawer 
            open={true} 
            slotProps={{backdrop: {invisible: true}}}
            variant='permanent'
        >
            <List>
                {drawerItems.map(itemName =>{
                    return <ListItem key={`${itemName}-drawerItem`}>
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