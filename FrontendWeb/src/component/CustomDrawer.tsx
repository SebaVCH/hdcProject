import { IconButton, Drawer } from "@mui/material";
import DrawerList from "./DrawerList";
import { JSX, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';




export default function CustomDrawer({ DrawerList } : {DrawerList: () => JSX.Element}) {
    
    const [ openDrawer, setOpenDrawer ] = useState(false)

    const toggleDrawer = (toggleDrawer : boolean) => () => {
        setOpenDrawer(toggleDrawer)
    }
    
    return (
        <>
            <IconButton 
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr:0, ml: 0, p: 2}}
                onClick={toggleDrawer(true)}
            >
                <MenuIcon sx={{ fontSize: 40 }} />
            </IconButton>          
            <Drawer
                open={openDrawer}
                onClose={toggleDrawer(false)}
            >
                <DrawerList />
            </Drawer>
        </>

    )  
};
