import { useState } from "react";
import DrawerList from "../../component/DrawerList";
import CustomDrawer from "../../component/CustomDrawer";
import { Backdrop, BackdropRoot, Button, Divider, Fab, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import MensajesFijados from "../../component/MensajesFijados";
import Mapa, { Position } from "../../component/Mapa";
import ListIconHome from "../../component/ListIconHome";
import NavigationIcon from '@mui/icons-material/Navigation';
import DialogCreateRoute from "../../component/Dialog/DialogCreateRoute";
import useSessionStore from "../../stores/useSessionStore";
import ButtonFinalizarRuta from "../../component/Button/ButtonFinalizarRuta";
import SpeedDialRoute from "../../component/Button/SpeedDialRoute";




const actions = [
    { icon: <NavigationIcon />, name: "Crear Ruta"}
]



export default function Home() {


    const { routeStatus } = useSessionStore()
    const [ openDrawer, setOpenDrawer ] = useState(false)
    const [ openDialogRoute, setOpenDialogRoute ] = useState(false)


    const toggleDrawer = (toggleDrawer : boolean) => () => {
        setOpenDrawer(toggleDrawer)
    }

    const [ openDialRoute, setOpenDialRoute ] = useState(false)



    return (
        <div className="flex flex-grow">
            <div className="flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.25)] z-30">
                <CustomDrawer DrawerList={DrawerList}/>
                <Divider variant="middle"/>
                <ListIconHome />
                <div className="flex grow justify-center items-end py-4">
                    <a href="https://www.hogardecristo.cl/" target="_blank" rel="noopener noreferrer"><img src={"https://hcstore.org/wp-content/uploads/2020/01/cropped-hc-192x192.png"} width={48} height={48}/></a>
                </div>
            </div>
            <div className="relative flex grow flex-col justify-between">
                <Mapa />
                <Backdrop open={openDialRoute}/>
                { routeStatus ? <ButtonFinalizarRuta /> : <MensajesFijados />}
                <div className="absolute bottom-16 right-16 scale-120">
                    {!routeStatus ? 
                        <Fab color="secondary" onClick={() => {setOpenDialogRoute(true)}}>
                            <NavigationIcon />
                        </Fab> 
                        :
                        <SpeedDialRoute open={openDialRoute} setOpen={setOpenDialRoute} />
                    }
                    
                    <DialogCreateRoute open={openDialogRoute} setOpen={setOpenDialogRoute} />
                </div>
            </div>
        </div>
    )
} 