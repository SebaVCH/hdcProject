import L, { svg } from "leaflet";
import { Circle, CircleMarker, LayerGroup, MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import { Divider, radioClasses, Zoom } from "@mui/material";
import { format } from 'date-fns';
import { THelpPoint } from "../../api/services/HelpPointService";
import { TRisk } from "../../api/services/RiskService";
import { Position } from "../../utils/getCurrentLocation";
import { useEffect } from "react";
import ZoomHandler from "./ZoomHandler";

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
    iconUrl: 'warning-alert.svg',
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})


type MapaProps = {
    stateCurrentLocation : [ Position, React.Dispatch<React.SetStateAction<Position>> ]
    helpPoints : THelpPoint[]
    risks : TRisk[]
    children : React.ReactNode
} 


export default function Mapa({ stateCurrentLocation, risks, helpPoints, children } : MapaProps) {

    const [ currentLocation,  ] = stateCurrentLocation
    
    return (
        <>
            <MapContainer 
                center={ [currentLocation.latitude, currentLocation.longitude] } 
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
                    <Marker key={helpPoint._id ?? index} icon={redIcon} position={(helpPoint.coords as L.LatLngExpression)}>
                        <Popup>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <b>Edad: {helpPoint.helpedPerson?.age === -1 ? 'N/A' : helpPoint.helpedPerson?.age}</b>
                                <Divider className="w-full"  variant='middle'/>
                                <b>Género: {helpPoint.helpedPerson?.gender ?? 'Sin Especificar'}</b>
                                <Divider className="w-full"  variant='middle'/>
                                <b>Fecha: {helpPoint.createdAt ?? 'error'}</b>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {risks.map((risk, index) => (
                    <Marker key={risk._id ?? index} icon={alertIcon} position={(risk.coords as L.LatLngExpression)}>
                        <Popup >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <b>{risk.description}</b>
                                <Divider className="w-full" variant="middle"/>
                                <b>Fecha: {format(new Date(risk.createdAt), 'dd-MM-yyyy')}</b>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {children}
            </MapContainer>
        </>
    )
};
