import { Backdrop, Fab, SpeedDial, SpeedDialAction } from "@mui/material";
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import ReportIcon from '@mui/icons-material/Report';
import NavigationIcon from '@mui/icons-material/Navigation';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useEffect, useState } from "react";
import DialogCreateAttended from "../Dialog/DialogCreateAttended";
import DialogCreateRisk from "../Dialog/DialogCreateRisk";
import DialogCreateRoute from "../Dialog/DialogCreateRoute";



const icons = [
    {icon : <PersonPinCircleIcon /> , name : 'Registar Persona'},
    {icon : <ReportIcon />, name: 'Reportar Riesgo'},
    {icon : <NavigationIcon />, name: 'Resumen Ruta'} 
]

export default function SpeedDialRoute({ open, setOpen } : { open : boolean, setOpen: (ar : boolean) => void}) {

    
    const handleOpen = () =>  setOpen(true) 
    const handleClose = () => setOpen(false) 

    const [ openDialogAttended, setOpenDialogAttended ] = useState(false)
    const [ openDialogRisk, setOpenDialogRisk ] = useState(false)
    const [ openDialogRoute, setOpenDialogRoute ] = useState(false) 

    const list = [{ 
        open : openDialogAttended, 
        setOpen : setOpenDialogAttended}, {
        open : openDialogRisk, 
        setOpen : setOpenDialogRisk,}, {
        open  : openDialogRoute,
        setOpen : setOpenDialogRoute 
    }]

    
    return (
        <>
            <SpeedDial 
                
                ariaLabel={"funcionalidades-ruta"} 
                icon={<SpeedDialIcon />}
                open={open}
                onOpen={(_, reason) => {
                    if(reason == 'toggle') handleOpen()
                }}
                onClose={(_, reason) => {
                    if(reason == 'toggle') handleClose()
                }}
            >
                {icons.map((obj, i) => (
                    <SpeedDialAction 
                        key={obj.name}
                        icon={obj.icon}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose()
                            list[i].setOpen(true)
                        }}
                        slotProps={{
                            tooltip : {
                                title : obj.name,  
                                arrow : true,
                                open : true,
                            },
                            staticTooltip : {
                                title : obj.name,
                                sx : {
                                    fontSize : '3xl'
                                }
                            },
                            staticTooltipLabel : {
                                sx : {
                                    width : '9rem',
                                    backgroundColor : 'rgb(46, 46, 46, 0.9)',
                                    color : 'white',
                                    fontSize : '12px',
                                    textAlign : 'center',
                                },
                               
                            }
                        }} 
                        
                    />
                ))}
            </SpeedDial>
            <DialogCreateAttended open={list[0].open} setOpen={list[0].setOpen} />
            <DialogCreateRisk open={list[1].open} setOpen={list[1].setOpen} />
            <DialogCreateRoute open={list[2].open} setOpen={list[2].setOpen} />
        </>
    )
};

