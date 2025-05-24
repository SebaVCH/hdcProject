import L, { svg } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents, ZoomControl } from "react-leaflet";
import { useLeafletContext } from '@react-leaflet/core'
import { Position } from "../utils/getCurrentLocation";


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


export function PositionLeaflet() {
    const context = useLeafletContext()
    context.map.locate({
        setView : true,
        maxZoom : 16,
        watch : true
    })
}
const MapEvents = ({setCoord, setOnSelectLocationMap, setOpenDialogAttended} : { setCoord : (coords : Position) => void, setOnSelectLocationMap : (arg : boolean) => void , setOpenDialogAttended : (arg : boolean) => void}) => {
    useMapEvents({
      click(e) {
        setCoord({latitude: e.latlng.lat, longitude: e.latlng.lng})
        setOnSelectLocationMap(false)
        setOpenDialogAttended(true)
      },
    });
    return false;
}

export default function Mapa({ setOnSelectLocationMap, setLocation, setOpenDialogAttended } :{ setOnSelectLocationMap : (arg : boolean) => void, setLocation : (arg : Position) => void, setOpenDialogAttended : (arg : boolean) => void}) {


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
                <Marker position={[-29.959003986327698, -71.34176826076656]}>
                    <Popup>
                        Sector Coquimbo Centro <br /> 06-05-2025
                    </Popup>
                </Marker>
                <Marker icon={greenIcon} position={[-29.958050315932354, -71.3378398731368]}>
                    <Popup >
                        Sector Coquimbo Mall <br /> 01-05-2025
                    </Popup>
                </Marker>
                <Marker icon={redIcon} position={[-29.959503159, -71.3408491873]}>
                    <Popup >
                        Sector Coquimbo Mall <br /> 01-05-2025
                    </Popup>
                </Marker>
                <Marker icon={alertIcon} position={[-29.952903159, -71.3408491873]}>
                    <Popup >
                       <b>No hay iluminación</b> <br /> 01-05-2025
                    </Popup>
                </Marker>
                <MapEvents setCoord={setLocation} setOnSelectLocationMap={setOnSelectLocationMap} setOpenDialogAttended={setOpenDialogAttended}/>
            </MapContainer>
        </>
    )
};
