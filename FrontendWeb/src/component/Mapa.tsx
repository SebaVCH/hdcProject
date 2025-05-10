import L, { svg } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";


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


export default function Mapa() {
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
            </MapContainer>
        </>
    )
};
