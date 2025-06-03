import { useEffect, useState } from "react"
import { ListItemButton, ListItemText, Collapse, List, Divider } from "@mui/material"
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TRoute } from "../../api/services/RouteService";
import ListRouteItem from "./ListRouteItem";
import { THelpPoint } from "../../api/services/HelpPointService";


type ListRouteItemProps = {
    date : string
    children ?: React.ReactNode
    defaultOpen ?: boolean
    routes : TRoute[]
    stateHelpPoints : [ THelpPoint[], React.Dispatch<React.SetStateAction<THelpPoint[]>> ]
    stateShowLocation : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    stateLocation : [ number[], React.Dispatch<React.SetStateAction<number[]>> ] 
    onlyUser : boolean
}

export default function ListDateItem({ date, defaultOpen = false, routes, stateHelpPoints, stateLocation, stateShowLocation, onlyUser } : ListRouteItemProps) {
    
    const [ open, setOpen ] = useState(defaultOpen)
    const [ , setHelpPoints ] = stateHelpPoints

    const handleClick = () => {
        setOpen(prev => !prev)
    }

    useEffect(() => {
        setHelpPoints(prev => prev.map((hp) => {
            if(routes.findIndex((r) => r._id === hp.routeId) !== -1) {
                hp.disabled = !open
            }
            return hp
        }))
    }, [])

    return ( 
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemText primary={date} />
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List subheader={<Divider />} dense>
                    {routes.map((route, i) => (
                        <ListRouteItem 
                            openRoot={open}
                            stateLocation={stateLocation} 
                            stateShowLocation={stateShowLocation} 
                            stateHelpPoints={stateHelpPoints} 
                            route={route} 
                            key={i}/>
                    ))}
                </List>
            </Collapse>
        </>
    )


};
