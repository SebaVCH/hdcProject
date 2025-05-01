import { useNavigate } from "react-router-dom"
import useSessionStore from "../../stores/useSessionStore"
import MenuIcon from '@mui/icons-material/Menu';

import { Drawer, IconButton } from '@mui/material';
import { useState } from "react";
import DrawerList from "../../component/DrawerList";

export default function Home() {

    const navigate = useNavigate()
    const { accessToken, clearSession } = useSessionStore()


    const [ openDrawer, setOpenDrawer ] = useState(false)

    const toggleDrawer = (toggleDrawer : boolean) => () => {
        setOpenDrawer(toggleDrawer)
    }

    const onCerrarSesion = () => {
        clearSession()
        navigate('/login')

    }

    return (
        <div className={"flex flex-grow"}>
            <div className="">
                <IconButton 
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 0 }}
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
            </div>
            <div className={"flex grow flex-col justify-between"}>
                <div className="justify-center justify-items-center">
                    <p>Mensajes</p>
                </div>
                <div className="flex grow flex-row items-center justify-center">
                    <p>
                        Mapa
                    </p>
                </div>
            </div>
        </div>
    )
} 