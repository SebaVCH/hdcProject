import { useState } from "react";
import DrawerList from "../../component/DrawerList";
import CustomDrawer from "../../component/CustomDrawer";
import { Backdrop, BackdropRoot, Button, Card, Divider, Fab, Typography } from "@mui/material";
import MensajesFijados from "../../component/MensajesFijados";
import Mapa from "../../component/Mapa";
import ListIconHome from "../../component/ListIconHome";
import NavigationIcon from '@mui/icons-material/Navigation';
import DialogCreateRoute from "../../component/Dialog/DialogCreateRoute";
import useSessionStore from "../../stores/useSessionStore";
import ButtonFinalizarRuta from "../../component/Button/ButtonFinalizarRuta";
import SpeedDialRoute from "../../component/Button/SpeedDialRoute";
import { Position } from "../../utils/getCurrentLocation";



export default function Home() {


    const { routeStatus } = useSessionStore()
    const [ openDrawer, setOpenDrawer ] = useState(false)
    const [ openDialogRoute, setOpenDialogRoute ] = useState(false)
    const [ onSelectLocationMap, setOnSelectLocationMap ] = useState(false)

    const toggleDrawer = (toggleDrawer : boolean) => () => {
        setOpenDrawer(toggleDrawer)
    }

    const [ openDialRoute, setOpenDialRoute ] = useState(false)
    const [ openDialogAttended, setOpenDialogAttended] = useState(false) 


    const [ location, setLocation ] = useState<Position>({latitude : 0, longitude : 0})

    return (
        <div className="flex flex-grow">
            { !onSelectLocationMap ?
                <div className="flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.25)] z-30">
                    <CustomDrawer DrawerList={DrawerList}/>
                    <Divider variant="middle"/>
                    <ListIconHome />
                    <div className="flex grow justify-center items-end py-4">
                        <a href="https://www.hogardecristo.cl/" target="_blank" rel="noopener noreferrer"><img src={"https://hcstore.org/wp-content/uploads/2020/01/cropped-hc-192x192.png"} width={48} height={48}/></a>
                    </div>
                </div>
                :
                <></>
            }
            <div className={`relative flex grow flex-col justify-between`}>
                <Mapa 

                    setOnSelectLocationMap={setOnSelectLocationMap}
                    setLocation={setLocation}
                    setOpenDialogAttended={setOpenDialogAttended}
                />
                { !onSelectLocationMap ?
                    <>
                        <Backdrop open={openDialRoute}/>
                        { routeStatus ? <ButtonFinalizarRuta /> : <MensajesFijados />}
                        <div className="absolute bottom-16 right-16 scale-120">
                            {!routeStatus ? 
                                <Fab color="secondary" onClick={() => {setOpenDialogRoute(true)}}>
                                    <NavigationIcon />
                                </Fab> 
                                :
                                <SpeedDialRoute 
                                    open={openDialRoute} 
                                    setOpen={setOpenDialRoute}  
                                    openDialogAttended={openDialogAttended}
                                    setOpenDialogAttended={setOpenDialogAttended}
                                    setOnSelectLocationMap={setOnSelectLocationMap} 
                                    location={location}/>
                            }
                            
                            <DialogCreateRoute open={openDialogRoute} setOpen={setOpenDialogRoute} />
                        </div>
                    </>
                    :
                    <Card
                        sx={{
                            position: "absolute",
                            top: "10%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "rgba(46, 46, 46, 0.9)",
                            px: 3,
                            py: 2,
                            borderRadius: 2,
                            boxShadow: 3,
                            zIndex: 1000, 
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                        >
                        <Typography color="white" variant="h6" fontWeight={500}>
                            Selecciona un punto en el mapa
                        </Typography>
                    </Card>
                }
            </div>
        </div>
    )
} 