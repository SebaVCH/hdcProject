import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import { Button, Divider } from "@mui/material";
import { format } from 'date-fns';
import { Position } from "../../utils/getCurrentLocation";
import { useEffect, useState } from "react";
import ZoomHandler from "./ZoomHandler";
import { useRiskUpdateDialog } from "../../context/RiskUpdateContext";
import { HelpPoint } from "../../api/models/HelpPoint";
import { Risk } from "../../api/models/Risk";
import { es } from "date-fns/locale";
import { RiskStatus } from "../../Enums/RiskStatus";

var greenIcon = new L.Icon({
    iconUrl: 'marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var redIcon = new L.Icon({
    iconUrl: 'marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


var alertIcon = new L.Icon({
    iconUrl: 'warning-alert-green.svg',
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})


const iconsMap = {
    [RiskStatus.Severe]: new L.Icon({ iconUrl : 'warning-alert-severe.svg', iconSize: [30, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowAnchor: [41, 41]}),
    [RiskStatus.Warning]: new L.Icon({ iconUrl : 'warning-alert-warning.svg', iconSize: [30, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowAnchor: [41, 41]}),
    [RiskStatus.Completed]: new L.Icon({ iconUrl : 'warning-alert-completed.svg', iconSize: [41,61], iconAnchor: [12, 41], popupAnchor: [8, -34], shadowAnchor: [41, 41]}),
    [RiskStatus.Enviroment]: new L.Icon({ iconUrl : 'warning-alert-enviroment.svg', iconSize: [30, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowAnchor: [41, 41]}),
} satisfies Record<RiskStatus, L.Icon>;



type MapaProps = {
    stateCurrentLocation : [ Position, React.Dispatch<React.SetStateAction<Position>> ]
    helpPoints : HelpPoint[]
    risks : Risk[]
    children ?: React.ReactNode
    enableTraceLine ?: boolean
} 


export default function Mapa({ stateCurrentLocation, risks, helpPoints, children, enableTraceLine } : MapaProps) {

    const [ currentLocation,  ] = stateCurrentLocation
    const [ mapTracedLineRoute, setMapTracedLineRoute ] = useState<Map<string, LatLngExpression[]>>(new Map<string, LatLngExpression[]>())


    useEffect(() => {

        if(enableTraceLine) {
            const map = helpPoints.reduce<Map<string, LatLngExpression[]>>((acc : Map<string, LatLngExpression[]>, hp) => {
                if(hp.disabled) return acc 

                if(!acc.has(hp.routeID)) {
                    acc.set(hp.routeID, [])
                }
                acc.set(hp.routeID, [...(acc.get(hp.routeID) as LatLngExpression[]), [hp.coords[0], hp.coords[1]] ])
                return acc
            }, new Map<string, LatLngExpression[]>())
            setMapTracedLineRoute(map)
        } 
    }, [enableTraceLine, helpPoints])



    const [ _, setRiskUpdate] = useRiskUpdateDialog()
    
    return (
        <>
            <MapContainer 
                center={ [currentLocation.latitude || -29.959003986327698, currentLocation.longitude || -71.34176826076656] } 
                zoom={ 30 } 
                scrollWheelZoom={true} 
                className="h-full w-full z-0"
                zoomControl={false}
                preferCanvas
            >
                <ZoomControl position="bottomleft" />
                <TileLayer
                    attribution="Google Maps"
                    url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                />
                
                <ZoomHandler />

                {helpPoints.map((helpPoint, index) => (
                    helpPoint.disabled ? null : 
                    <Marker key={helpPoint.id ?? index} icon={redIcon} position={(helpPoint.coords as L.LatLngExpression)} >
                        <Popup >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <b>Edad: {helpPoint.peopleHelped.age === -1 ? 'N/A' : helpPoint.peopleHelped.age}</b>
                                <Divider className="w-full"  variant='middle'/>
                                <b>Género: {helpPoint.peopleHelped?.gender ?? 'Sin Especificar'}</b>
                                <Divider className="w-full"  variant='middle'/>
                                <b>Fecha: {format(helpPoint.dateRegister, 'dddd-MM-YYYY', {locale : es}) ?? 'error'}</b>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                { Array.from(mapTracedLineRoute.entries()).map(([routeId, coords ], index) => (
                    <Polyline 
                        key={index}
                        pathOptions={{
                            color : '#800022',
                            opacity : 0.5,
                            weight : 3,
                            dashArray: '5, 10'
                        }} 
                        positions={coords}
                    />
                ))}

                {risks.map((risk, index) => (
                    <Marker key={risk.id ?? index} icon={iconsMap[risk.status]} position={(risk.coords as L.LatLngExpression)}>
                        <Popup>
                            <div className="flex flex-col items-start justify-center gap-2">
                                <b className="text-sm">{risk.description}</b>
                                <Divider className="w-full" variant="fullWidth"/>
                                <p className="text-xs p-0 !m-0">Última modificación: {format(new Date(risk.createdAt), 'dd-MM-yyyy')}</p>
                                <Button variant="contained" sx={{
                                    alignSelf : 'left',
                                    fontSize : 12,
                                    p: 0,
                                }} onClick={() => {
                                    setRiskUpdate(risk)
                                }}>
                                    Editar
                                </Button>
                            </div>
                        </Popup>
                        
                    </Marker>
                ))}
                {children}
            </MapContainer>
        </>
    )
};
