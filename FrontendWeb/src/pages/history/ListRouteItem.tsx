import { useEffect, useState } from "react"
import { TRoute } from "../../api/services/RouteService"
import { ListItemButton, ListItemText, Collapse, List } from "@mui/material"
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { THelpPoint } from "../../api/services/HelpPointService";


type ListRouteItemProps = {
    route : TRoute
    stateHelpPoints : [ THelpPoint[], React.Dispatch<React.SetStateAction<THelpPoint[]>> ]
    stateShowLocation : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    stateLocation : [ number[], React.Dispatch<React.SetStateAction<number[]>> ] 
    openRoot : boolean
}

export default function ListRouteItem({ route, stateHelpPoints, stateShowLocation, stateLocation, openRoot } : ListRouteItemProps) {
    
    const [ open, setOpen ] = useState(openRoot)
    const [ helpPoints, setHelpPoints ] = stateHelpPoints
    const [ hpRoutes, setHPRoutes ] = useState<THelpPoint[]>([])

    const [ , setLocation ] = stateLocation
    const [ , setShowLocation ] = stateShowLocation
    

    const handleClick = () => {
        setOpen(prev => !prev)
    }

    useEffect(() => {
        setHPRoutes(helpPoints.reduce<THelpPoint[]>((acc: THelpPoint[], hp) => {
            if(hp.routeId == route._id) {
                acc.push(hp)
            }
            return acc
        }, []))
    }, [])

    useEffect(() => {
        setHelpPoints(prev => prev.map((hp) => {
            if( route._id === hp.routeId) {
                hp.disabled = !open || !openRoot
            }
            return hp
        }))
    }, [open, openRoot])


    return ( 
        <>
            <ListItemButton onClick={handleClick} sx={{ pl: 4 }}>
                <ListItemText primary={route.title} />
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                    { open ? 
                        hpRoutes.map((hp, index) => (
                            <ListItemButton 
                                key={index} 
                                sx={{ pl: 8 }} 
                                onClick={() => {
                                    setLocation(hp.coords)
                                    setShowLocation(true)
                                }}
                            >
                                <ListItemText primary={`Punto de Ayuda N°${index+1}`} />
                            </ListItemButton> 
                        ))
                        : 
                            null
                    }
                </List>
            </Collapse>
        </>
    )


};
