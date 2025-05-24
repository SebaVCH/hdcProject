import { useState } from "react";
import DrawerList from "../../component/DrawerList";
import CustomDrawer from "../../component/CustomDrawer";
import { Backdrop, Card, Divider, Fab, Typography } from "@mui/material";
import MensajesFijados from "../../component/MensajesFijados";
import Mapa from "../../component/Mapa";
import ListIconHome from "../../component/ListIconHome";
import NavigationIcon from '@mui/icons-material/Navigation';
import DialogCreateRoute from "../../component/Dialog/DialogCreateRoute";
import useSessionStore from "../../stores/useSessionStore";
import ButtonFinalizarRuta from "../../component/Button/ButtonFinalizarRuta";
import SpeedDialRoute from "../../component/Button/SpeedDialRoute";
import { Position } from "../../utils/getCurrentLocation";
import DialogCreateAttended from "../../component/Dialog/DialogCreateAttended";
import DialogCreateRisk from "../../component/Dialog/DialogCreateRisk";
import DialogResumeRoute from "../../component/Dialog/DialogResumeRoute";
import MapEvents from "../../component/MapEvents";
import { Risk } from "../../api/interfaces/IRoute";
import { LocationMethod } from "../../api/interfaces/Enums";





export default function Home() {


    const { routeStatus } = useSessionStore()
    const [ openDialRoute, setOpenDialRoute ] = useState(false)
    const [ onSelectLocationMap, setOnSelectLocationMap ] = useState(false)


    const [ openDialogRoute, setOpenDialogRoute ] = useState(false)
    const [ openDialogResumeRoute, setOpenDialogResumeRoute ] = useState(false)
    const [ openDialogAttended, setOpenDialogAttended] = useState(false) 
    const [ openDialogRisk, setOpenDialogRisk ] = useState(false)

    const [ locationMethod, setLocationMethod ] = useState<LocationMethod>(LocationMethod.None)


    const [ risks, setRisks ] = useState<Risk[]>([{
        _id : '123',
        description : 'No hay iluminación',
        createdAt : '15-05-2025',
        coords : [-29.952903159, -71.3408491873],
    }])

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
                    risks={risks}
                >
                    <MapEvents 
                        setLocation={setLocation}
                        setOnSelectLocationMap={setOnSelectLocationMap}
                        stateDialogAttended={[openDialogAttended, setOpenDialogAttended]}
                        stateDialogRisk={[openDialogRisk, setOpenDialogRisk]}
                    />
                </Mapa>
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
                                    stateOpen={[ openDialRoute, setOpenDialRoute ]}
                                    stateOpenDialogAttended={[ openDialogAttended, setOpenDialogAttended ]}
                                    stateOpenDialogRisk={[ openDialogRisk, setOpenDialogRisk ]}
                                    stateOpenDialogRoute={[ openDialogResumeRoute, setOpenDialogResumeRoute ]}
                                >
                                    <DialogCreateAttended 
                                        stateOpen={[openDialogAttended, setOpenDialogAttended]} 
                                        stateOnSelectLocationMap={[ onSelectLocationMap, setOnSelectLocationMap]} 
                                        location={location}
                                    />
                                    <DialogCreateRisk 
                                        stateOpen={[openDialogRisk, setOpenDialogRisk]} 
                                        stateOnSelectLocationMap={[ onSelectLocationMap, setOnSelectLocationMap]}
                                        stateRisk={[ risks, setRisks ]}
                                        stateLocationMethod={[ locationMethod, setLocationMethod ]}
                                        location={location}
                                    />
                                    <DialogResumeRoute 
                                        stateOpen={[ openDialogResumeRoute, setOpenDialogResumeRoute ]} 
                                    />
                                </SpeedDialRoute>
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