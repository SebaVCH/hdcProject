import L, { svg } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import { useLeafletContext } from '@react-leaflet/core'
import { Position } from "../utils/getCurrentLocation";
import { TRisk } from "../api/services/RiskService";
import { THelpPoint } from "../api/services/HelpPointService";
import { Divider } from "@mui/material";


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
    helpPoints : THelpPoint[]
    risks : TRisk[]
    children : React.ReactNode
} 


export default function Mapa({ risks, helpPoints, children } : MapaProps) {

    return (
        <>
            <MapContainer 
                center={[-29.959003986327698, -71.34176826076656]} 
                zoom={17} 
                scrollWheelZoom={true} 
                className="h-full w-full z-0"
                zoomControl={false}
            >
                <ZoomControl position="bottomleft" />
                <TileLayer
                    attribution="Google Maps"
                    url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                />
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
                        <b>{risk.description}</b> <br /> {risk.createdAt}
                        </Popup>
                    </Marker>
                ))}

                {children}
            </MapContainer>
        </>
    )
};
