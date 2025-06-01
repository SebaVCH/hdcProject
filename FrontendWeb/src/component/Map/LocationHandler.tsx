import { useEffect, useState } from "react"
import { Circle, CircleMarker, LayerGroup, Marker, useMap } from "react-leaflet"
import { Position } from "../../utils/getCurrentLocation"
import { useZoom } from "../../context/ZoomContext"



type LocationHandlerProps = {
    stateShowLocation : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    stateCurrentLocation : [ Position, React.Dispatch<React.SetStateAction<Position>> ]
}

export default function LocationHandler({ stateShowLocation, stateCurrentLocation } : LocationHandlerProps)  {

    const map = useMap()
    const [ showLocation, setShowLocation ] = stateShowLocation
    const [ currentLocation, setCurrentLocation ] = stateCurrentLocation
    const [ isZooming, ] = useZoom()

    useEffect(() => {

        const handleSuccess = ( position : GeolocationPosition) => {
            setCurrentLocation({latitude : position.coords.latitude, longitude : position.coords.longitude})
        }
        const handleError = ( error : GeolocationPositionError) => {
            alert(error.message)
        }
        const id = navigator.geolocation.watchPosition( handleSuccess, handleError, {
            enableHighAccuracy : true,
            timeout : 10000
        })

        return () => {
            navigator.geolocation.clearWatch(id)
        }
    }, [])


    useEffect(() => {
        if(showLocation) {
            map.flyTo([currentLocation.latitude, currentLocation.longitude], 17, {
                duration: 1,
            })
            setShowLocation(false)
        }
    }, [showLocation])


    return (
        <LayerGroup >
            <Marker position={[currentLocation.latitude, currentLocation.longitude]} zIndexOffset={100} />
            { isZooming ? <></> : <Circle center={[currentLocation.latitude, currentLocation.longitude]} radius={30} /> }
        </LayerGroup>
    )
};
