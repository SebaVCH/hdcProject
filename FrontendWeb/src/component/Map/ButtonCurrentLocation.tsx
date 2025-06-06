import { Paper, IconButton } from "@mui/material";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GpsOffIcon from '@mui/icons-material/GpsOff';

type CurrentLocationProps = {
    stateShowLocation : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    stateErrorGeolocation : [GeolocationPositionError | undefined, React.Dispatch<React.SetStateAction<GeolocationPositionError | undefined>>]
}

export default function ButtonCurrentLocation({ stateShowLocation, stateErrorGeolocation} : CurrentLocationProps) {

    const [ , setShowLocation ] = stateShowLocation
    const [ errorGeolocation, _] = stateErrorGeolocation


    return (
        <Paper className="absolute bottom-20 left-3">
            <IconButton size="small" onClick={() => {setShowLocation(true)}} color={errorGeolocation ? 'error' : 'primary'}>
                { errorGeolocation ? <GpsOffIcon fontSize="small" />  : <GpsFixedIcon fontSize="small"/>}
            </IconButton>
        </Paper>
    )
};
