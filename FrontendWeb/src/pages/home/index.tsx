import { useEffect, useState } from "react";
import DrawerList from "../../component/DrawerList";
import CustomDrawer from "../../component/CustomDrawer";
import { Backdrop, Card, Divider, Typography } from "@mui/material";
import MensajesFijados from "../../component/MensajesFijados";
import ListIconHome from "../../component/ListIconHome";
import DialogCreateRoute from "../../component/Dialog/DialogCreateRoute";
import useSessionStore from "../../stores/useSessionStore";
import ButtonFinalizarRuta from "../../component/Button/ButtonFinalizarRuta";
import SpeedDialRoute from "../../component/Button/SpeedDialRoute";
import { Position } from "../../utils/getCurrentLocation";
import DialogCreateAttended from "../../component/Dialog/DialogCreateAttended";
import DialogCreateRisk from "../../component/Dialog/DialogCreateRisk";
import DialogResumeRoute from "../../component/Dialog/DialogResumeRoute";
import { LocationMethod } from "../../api/interfaces/Enums";
import { RiskAdapter } from "../../api/adapters/RiskAdapter";
import { THelpPoint } from "../../api/services/HelpPointService";
import { HelpPointAdapter } from "../../api/adapters/HelpPointAdapter";
import { TRisk } from "../../api/services/RiskService";
import MapEvents from "../../component/Map/MapEvents";
import Mapa from "../../component/Map/Mapa";
import ButtonCurrentLocation from "../../component/Map/ButtonCurrentLocation";
import LocationHandler from "../../component/Map/LocationHandler";
import SpeedDialCreateRoute from "../../component/Button/SpeedDialCreateRoute";
import DialogJoinRoute from "../../component/Dialog/DialogJoinRoute";
import { useAuth } from "../../context/AuthContext";




export default function Home() {

    const { role, loading } = useAuth()
    const { accessToken } = useSessionStore()
    const { routeStatus, routeId } = useSessionStore()
    const [ openDialRoute, setOpenDialRoute ] = useState(false)
    const [ onSelectLocationMap, setOnSelectLocationMap ] = useState(false)

    const [ openDialogRoute, setOpenDialogRoute ] = useState(false)
    const [ openDialogResumeRoute, setOpenDialogResumeRoute ] = useState(false)
    const [ openDialogAttended, setOpenDialogAttended] = useState(false) 
    const [ openDialogRisk, setOpenDialogRisk ] = useState(false)


    const stateDescriptionRisk = useState('')
    const [ locationMethod, setLocationMethod ] = useState<LocationMethod>(LocationMethod.None)

    const [ risks, setRisks ] = useState<TRisk[]>([])
    const [ helpPoints, setHelpPoints ] = useState<THelpPoint[]>([])

    const riskQuery = RiskAdapter.useGetRisks( accessToken )
    const helpPointQuery = HelpPointAdapter.useGetHelpPoints( accessToken )


    const [ location, setLocation ] = useState<Position>({latitude : 0, longitude : 0})
    const [ currentLocation, setCurrentLocation ] = useState<Position>({latitude : 0, longitude : 0})
    const [ showLocation, setShowLocation ] = useState(false)

    const [ errorGeolocation, setErrorGeolocation ] = useState<GeolocationPositionError | undefined>()


    const [ openSpeedCreateRoute, setOpenSpeedCreateRoute ] = useState(false)
    const stateOpenCreateRoute = useState(false)
    const stateOpenJoinRoute = useState(false)

    useEffect(() => {
        if(riskQuery.data) {
            setRisks(riskQuery.data)
        }
        if(helpPointQuery.data) {
            setHelpPoints(helpPointQuery.data)
        }
    }, [riskQuery.data, helpPointQuery.data])

    useEffect(() => {
        console.log("ROL DEL USUARIO: ", role)
    }, [loading])

    return (
        <div className="flex flex-grow">
            { !onSelectLocationMap ?
                <div className="flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.25)] z-10">
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
                    stateCurrentLocation={[currentLocation, setCurrentLocation]}
                    helpPoints={helpPoints}
                    risks={risks}
                >
                    <MapEvents 
                        setLocation={setLocation}
                        stateOnSelectLocationMap={[onSelectLocationMap, setOnSelectLocationMap]}
                        stateDialogAttended={[openDialogAttended, setOpenDialogAttended]}
                        stateDialogRisk={[openDialogRisk, setOpenDialogRisk]}
                    />
                    <LocationHandler 
                        stateErrorGeolocation={[errorGeolocation, setErrorGeolocation]}
                        stateShowLocation={[showLocation, setShowLocation]}
                        stateCurrentLocation={[currentLocation, setCurrentLocation]}                        
                    />
                </Mapa>
                <ButtonCurrentLocation stateShowLocation={[ showLocation, setShowLocation ]} stateErrorGeolocation={[errorGeolocation, setErrorGeolocation]}/>

                { !onSelectLocationMap ?
                    <>
                        <Backdrop open={openDialRoute} className="z-10"/>
                        <Backdrop open={openSpeedCreateRoute} className="z-10"/>
                        { routeStatus ? <ButtonFinalizarRuta /> : <MensajesFijados />}
                        <div className="absolute bottom-16 right-16 scale-120 z-20">
                            {!routeStatus ? 
                                <SpeedDialCreateRoute
                                    stateOpen={[openSpeedCreateRoute, setOpenSpeedCreateRoute]}
                                    stateOpenCreateRoute={stateOpenCreateRoute}
                                    stateOpenJoinRoute={stateOpenJoinRoute}
                                >
                                    <DialogCreateRoute stateOpen={stateOpenCreateRoute} />
                                    <DialogJoinRoute stateOpen={stateOpenJoinRoute} />
                                </SpeedDialCreateRoute>
                                /*  
                                <Fab color="secondary" onClick={() => {setOpenDialogRoute(true)}}>
                                    <NavigationIcon />
                                </Fab>  */
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
                                        stateLocationMethod={[locationMethod, setLocationMethod]}
                                        location={location}
                                    />
                                    <DialogCreateRisk 
                                        stateOpen={[openDialogRisk, setOpenDialogRisk]} 
                                        stateOnSelectLocationMap={[ onSelectLocationMap, setOnSelectLocationMap]}
                                        stateLocationMethod={[ locationMethod, setLocationMethod ]}
                                        location={location}
                                        stateDescription={stateDescriptionRisk}
                                    />
                                    <DialogResumeRoute 
                                        stateOpen={[ openDialogResumeRoute, setOpenDialogResumeRoute ]} 
                                    />
                                </SpeedDialRoute>
                            }
                            
                        </div>
                    </>
                    :
                    <Card
                        sx={{
                            position: "absolute", top: "10%", left: "50%", transform: "translate(-50%, -50%)",
                            bgcolor: "rgba(46, 46, 46, 0.9)", px: 3, py: 2, borderRadius: 2, boxShadow: 3,
                            zIndex: 1000, display: "flex", alignItems: "center", gap: 1,
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