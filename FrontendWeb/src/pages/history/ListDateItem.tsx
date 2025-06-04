import { useEffect, useState } from "react"
import { ListItemButton, ListItemText, Collapse, List, Divider, ListItemButtonProps } from "@mui/material"
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
} & ListItemButtonProps

export default function ListDateItem({ date, defaultOpen = false, routes, stateHelpPoints, stateLocation, stateShowLocation, onlyUser, onClick, ...props } : ListRouteItemProps) {
    
    const [ open, setOpen ] = useState(defaultOpen)
    const [ helpPoints , setHelpPoints ] = stateHelpPoints

    const [ selectedIndex, setSelectedIndex ] = useState(0)
    const handleClickSelected = (_ : React.MouseEvent<HTMLDivElement, MouseEvent>, index : number) => {
        setSelectedIndex(index === selectedIndex ? -1 : index)
    }

    const handleClick = (e :React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if(onClick) {
            onClick(e)
        }
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
            <ListItemButton onClick={handleClick} {...props} selected={open}>
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
                            key={i}
                            

                        />
                    ))}
                </List>
            </Collapse>
        </>
    )


};
