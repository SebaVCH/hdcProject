import { useNavigate } from "react-router-dom"
import useSessionStore from "../../stores/useSessionStore"
import { useState } from "react";
import DrawerList from "../../component/DrawerList";
import CustomDrawer from "../../component/CustomDrawer";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import { Divider, Paper } from "@mui/material";



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
        <div className="flex flex-grow">
            <div className="shadow-[4px_0_6px_-1px_rgba(0,0,0,0.25)] z-30 px-1">
                <CustomDrawer DrawerList={DrawerList}/>
            </div>
            <div className="relative flex grow flex-col justify-between">
                <MapContainer 
                    center={[-29.959003986327698, -71.34176826076656]} 
                    zoom={15} 
                    scrollWheelZoom={true} 
                    className="h-full w-full z-0"
                    zoomControl={false}
                >
                    <ZoomControl position="bottomleft" />
                    <TileLayer
                        attribution="Google Maps"
                        url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                        />
                    <Marker position={[-29.959003986327698, -71.34176826076656]}>
                        <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
                <Paper className="absolute top-4 left-1/2 -translate-x-1/2 w-3/5 flex flex-col items-start gap-2 bg-white p-2 z-10">
                    <p className="text-lg">Mensajes Importantes</p>
                    <Divider className="w-full" />
                    <div className="flex flex-row grow w-full gap-2">
                        <p>Cristian Nettle</p>
                        <Divider orientation="vertical" flexItem/>
                        <p>Este es un mensaje muy importante</p>
                    </div>
                </Paper>

            </div>
        </div>
    )
} 