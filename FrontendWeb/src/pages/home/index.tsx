import { useNavigate } from "react-router-dom"
import useSessionStore from "../../stores/useSessionStore"
import { useState } from "react";
import DrawerList from "../../component/DrawerList";
import CustomDrawer from "../../component/CustomDrawer";
import { Divider, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import MensajesFijados from "../../component/MensajesFijados";
import Mapa from "../../component/Mapa";
import NavigationIcon from '@mui/icons-material/Navigation';
import ListIconHome from "../../component/ListIconHome";



const actions = [
    { icon: <NavigationIcon />, name: "Crear Ruta"}
]



export default function Home() {

    const [ openDrawer, setOpenDrawer ] = useState(false)
    const toggleDrawer = (toggleDrawer : boolean) => () => {
        setOpenDrawer(toggleDrawer)
    }


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
                <MensajesFijados />
                <SpeedDial className="absolute bottom-16 right-16 scale-110" ariaLabel={"agregar ruta"} FabProps={{ color: "secondary" }} icon={<SpeedDialIcon/>}>
                    {actions.map((value, index) => (
                        <SpeedDialAction 
                            key={index}
                            icon={value.icon}
                            slotProps={{
                                tooltip : {
                                    title: value.name
                                }
                            }}
                        />
                    ))}
                </SpeedDial>
            </div>
        </div>
    )
} 