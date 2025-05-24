import { useMapEvents } from "react-leaflet";
import { Position } from "../utils/getCurrentLocation";
import { useEffect, useState } from "react";


type MapEventsProps = {
    setLocation : (coords : Position) => void, 
    setOnSelectLocationMap : (arg : boolean) => void
    stateDialogAttended : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ],
    stateDialogRisk : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ],
}

export default function MapEvents({setLocation, setOnSelectLocationMap, stateDialogAttended, stateDialogRisk} : MapEventsProps) {
    
    const [ flag, setFlag ] = useState('')
    const [ openDialogAttended, setOpenDialogAttended ] = stateDialogAttended
    const [ openDialogRisk, setOpenDialogRisk ] = stateDialogRisk


    useEffect(() => {
        if(openDialogAttended) {
            setFlag('attended')
        } else if(openDialogRisk) {
            setFlag('risk')
        } 
    }, [openDialogAttended, openDialogRisk])
    
    useMapEvents({
        click(e) {
            setLocation({latitude: e.latlng.lat, longitude: e.latlng.lng})
            setOnSelectLocationMap(false)
            if(flag == 'risk') {
                setOpenDialogRisk(true)
            } else {
                setOpenDialogAttended(true)
            }
        },
    });
    return false
}