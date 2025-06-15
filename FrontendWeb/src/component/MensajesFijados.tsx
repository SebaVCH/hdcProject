import { useEffect, useState } from "react";
import { Divider, Typography, Paper, IconButton, Popover, List, ListItem, CircularProgress, ListItemText, Tooltip, Badge } from "@mui/material";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import useSessionStore from "../stores/useSessionStore";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { NoticeAdapter } from "../api/adapters/NoticeAdapter";
import React from "react";
import { format, formatRelative } from "date-fns";
import { es } from "date-fns/locale";

export default function MensajesFijados() {

    const { accessToken } = useSessionStore()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const handleClick = (event : any) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const open = Boolean(anchorEl)
    const id = open ? "notification-popover" : undefined

    const { isSuccess, isError, isPending, data } = NoticeAdapter.useGetNotices(accessToken)

    useEffect(() => {
        if(data) {
            console.log(data)
        }
    }, [data])



    return (
        <div className="absolute top-8 right-8">
            <Paper className="relative inline-block" sx={{ borderRadius : 9}}>
                <Badge badgeContent={isSuccess? data.length : 0} color="error" overlap="circular">
                    <IconButton onClick={handleClick}>
                        { open ? <NotificationsNoneOutlinedIcon sx={{color : '#000000'}} fontSize="large"/> : <NotificationsIcon sx={{ color : '#000000'}} fontSize="large"/>}
                    </IconButton>
                </Badge> 
            </Paper>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                marginThreshold={16}
                slotProps={{
                    paper: {
                        elevation : 1,
                        sx : {
                            marginTop: 1,
                            width : 600,
                            maxHeight : 500 ,
                            overflowY: 'auto'
                        }
                    },
                }}
            >
                <div className="flex flex-row justify-between items-center py-1 px-3">
                    <Typography variant='subtitle1' sx={{ fontSize : 18 }}>Notificaciones</Typography>
                    <Tooltip title={'Marcar como leídos'}>
                        <IconButton>
                            <ClearAllIcon htmlColor="black" fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </div>
                <Divider />
                {
                isPending ? 
                    <ListItem>
                        <div className="flex grow items-center justify-center">
                            <CircularProgress size={25} color='inherit' />
                        </div>
                    </ListItem>
                    :
                isSuccess ? 
                    data.map((value, index) => (
                        <>
                        <ListItem key={index}>
                            <ListItemText
                                primary={
                                    <React.Fragment >
                                        <div className="flex flex-row gap-3" >
                                            <Typography
                                                component={"span"}
                                                variant='body2'
                                                sx={{ color : 'text.primary'}}
                                            >
                                                {value.authorName}
                                            </Typography>
                                            <Typography
                                                lineHeight={1.7}
                                                component={"span"}
                                                variant="caption"
                                                sx={{ color : 'text.secondary', textAlign : 'end', my : 0.05}}
                                            >
                                                {formatRelative(new Date(value.createdAt as string), new Date(), { locale : es })}
                                            </Typography>
                                        </div>
                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <div className="p-4 pb-0 text-justify">
                                            <Typography
                                                component={"span"}
                                                variant='body1'
                                                sx={{ color : 'text.primary', display : 'inline'}}
                                            >
                                                {value.description}
                                            </Typography>     
                                        </div>      
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider />
                        </>
                    )) 
                    :
                    <ListItem>
                        <Typography>error</Typography>
                    </ListItem>

                    
                }
            </Popover>
        </div>
    )
};


/*
        <div className="absolute top-8 right-8">
            <Paper sx={{
                borderRadius : 9,
            }}>
                <IconButton>
                    <NotificationsIcon sx={{ color : '#000000'}} fontSize="large"/>
                </IconButton>
            </Paper>
        </div>



<div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/5 items-start gap-2 rounded bg-white">
    <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >  
                    <Typography variant="subtitle1">Avisos</Typography>                    
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <List className="max-h-[210px] overflow-y-auto">
                        {isSuccess ? list.map((value, index) => (
                            <Mensaje key={index} index={index} list={list} setList={setList} author={value.authorName ?? 'placeholder'} message={value.description ?? ' placeholder'}  />
                        )) : <p>Cargando...</p>}
                    </List>
            </AccordionDetails>
    </Accordion>
</div>

        */
