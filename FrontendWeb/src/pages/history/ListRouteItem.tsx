import { useEffect, useState } from "react"
import { TRoute } from "../../api/services/RouteService"
import { ListItemButton, ListItemText, Collapse, List, ListItemButtonProps, ListItem, IconButton, Fade } from "@mui/material"
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { THelpPoint } from "../../api/services/HelpPointService";
import EditIcon from '@mui/icons-material/Edit';
import { useHelpPointUpdateDialog } from "../../context/HelpPointUpdateContext";

type ListRouteItemProps = {
    route : TRoute
    stateHelpPoints : [ THelpPoint[], React.Dispatch<React.SetStateAction<THelpPoint[]>> ]
    stateShowLocation : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    stateLocation : [ number[], React.Dispatch<React.SetStateAction<number[]>> ] 
    openRoot : boolean
} & ListItemButtonProps

export default function ListRouteItem({ route, stateHelpPoints, stateShowLocation, stateLocation, openRoot, onClick, ...props} : ListRouteItemProps) {
    
    const [ open, setOpen ] = useState(openRoot)
    const [ helpPoints, setHelpPoints ] = stateHelpPoints
    const [ hpRoutes, setHPRoutes ] = useState<THelpPoint[]>([])

    const [ _, setHelpPointUpdate ] = useHelpPointUpdateDialog()


    const [ , setLocation ] = stateLocation
    const [ , setShowLocation ] = stateShowLocation


    const [ selectedIndex, setSelectedIndex ] = useState(-1)
    const handleClickSelected = (_ : React.MouseEvent<HTMLDivElement, MouseEvent>, index : number) => {
        setSelectedIndex(index === selectedIndex ? -1 : index)
    }
    

    const handleClick = (e : React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if(onClick) {
            onClick(e)
        }
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
        return () => {
            setHelpPoints(prev => prev.map((hp) => {
                if(route._id === hp.routeId) {
                    hp.disabled = true
                }
                return hp
            }))
        }
    }, [open, openRoot])


    return ( 
        <>
            <ListItemButton {...props} onClick={handleClick} sx={{ pl: 4 }} selected={open}>
                <ListItemText primary={route.title} />
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                    { open ? 
                        hpRoutes.map((hp, index) => (
                            <ListItem 
                                key={index} 
                                sx={{ padding : 0}}
                                secondaryAction={
                                    <Fade in={selectedIndex === index}>
                                        <IconButton edge="end" aria-label="Editar Punto Ayuda" onClick={() => {
                                            if(selectedIndex === index) {
                                                setHelpPointUpdate(hp)
                                            }
                                        }}>
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                    </Fade>
                                }
                            >
                                <ListItemButton
                                    
                                    selected={selectedIndex === index}
                                    sx={{ pl: 8 }} 
                                    onClick={(e) => {
                                        if(selectedIndex !== index) {
                                            setLocation(hp.coords)
                                            setShowLocation(true)
                                        }
                                        handleClickSelected(e, index)
                                    }}
                                    >
                                    <ListItemText primary={`Punto de Ayuda N°${index+1}`} />
                                </ListItemButton>
                            </ListItem> 
                        ))
                        : 
                            null
                    }
                </List>
            </Collapse>
        </>
    )


};
