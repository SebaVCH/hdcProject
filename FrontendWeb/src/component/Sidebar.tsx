import { IconButton, Divider, Tooltip } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DialogSendNotice from "./Dialog/DialogSendNotice";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';  
import CampaignIcon from '@mui/icons-material/Campaign';
import { Role } from "../api/interfaces/Enums";
import LogoutIcon from '@mui/icons-material/Logout';
import useSessionStore from "../stores/useSessionStore";
import DialogLogout from "./Dialog/DialogLogout";


const hoverStyles = {
  '&:hover svg': {
    color: '#5865F2', 
  }
};

export default function Sidebar() {

    const navigate = useNavigate()
    const { clearSession } = useSessionStore()
    const [ open, setOpen ] = useState(false)
    const [ openDialogLogout, setOpenLogout ] = useState(false)
    const { role, loading } = useAuth()

    const handleClickOpen = () => {
        setOpen(true)
    }

    const onClickProfile = () => {
        navigate('/profile')
    }

    const onClickHistory = () => {
        navigate('/history')
    }

    const onClickUsers = () => {
        navigate('/admin/usuarios')
    }

    const onClickSchedule = () => {
        navigate('/schedule')
    }
    const onClickHome = () => {
        navigate('/')
    }
    const onClickCerrarSesion = () => {
        setOpenLogout(true)
    }

    return (
        <div className="flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.25)]">
            <Tooltip title={"Home"}><IconButton  onClick={onClickHome} sx={{ p : 2, ...hoverStyles }}><HomeIcon htmlColor="#374151" sx={{ fontSize: 40 }} /></IconButton></Tooltip>
            <Divider variant="middle"/>
            <div className="flex flex-col py-5 gap-7 justify-start items-center">
                <Tooltip title="Perfil"><IconButton onClick={onClickProfile} sx={{ ...hoverStyles }}><AccountBoxIcon htmlColor="#374151" fontSize="large"/></IconButton></Tooltip>
                <Tooltip title="Historial"><IconButton onClick={onClickHistory} sx={{ ...hoverStyles }}><HistoryIcon htmlColor="#374151" fontSize="large" /></IconButton></Tooltip>
                <Tooltip title="Agendar ruta"><IconButton onClick={onClickSchedule} sx={{ ...hoverStyles }}><EventIcon htmlColor="#374151" fontSize="large"/></IconButton></Tooltip>
                <Tooltip title="Enviar aviso"><IconButton onClick={handleClickOpen} sx={{ ...hoverStyles }}><CampaignIcon htmlColor="#374151" fontSize="large" /></IconButton></Tooltip>
                { role === Role.admin  ?

                    <Tooltip title="Gestionar Usuarios">
                        <IconButton onClick={onClickUsers}>
                            <PeopleAltIcon htmlColor='#374151' fontSize='large' sx={{ ...hoverStyles }}/>
                        </IconButton>
                    </Tooltip>
                    :
                    <>
                    </>
                }
            </div>
            <div className="flex flex-col grow justify-end items-center py-4 gap-3">
                <Tooltip title="Cerrar sesión"><IconButton onClick={onClickCerrarSesion}><LogoutIcon color="error" fontSize="large" /></IconButton></Tooltip>
                <Divider variant='middle' className="w-4/5" />
                <a href="https://www.hogardecristo.cl/" target="_blank" rel="noopener noreferrer"><img src={"https://hcstore.org/wp-content/uploads/2020/01/cropped-hc-192x192.png"} loading="lazy" width={45} height={45}/></a>
            </div>
            <DialogSendNotice open={open} setOpen={setOpen} />
            <DialogLogout stateOpen={[openDialogLogout, setOpenLogout]} />
        </div>
    )
};



{/* 
<div className="flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.25)] z-10">
                        <Tooltip title={"Home"}>
                            <IconButton onClick={onClickHome} sx={{ p : 2}}>
                                <HomeIcon htmlColor="#374151" sx={{ fontSize: 40 }} />
                            </IconButton>
                        </Tooltip>
                        <Divider variant="middle"/>
                        <ListIconHome />
                        <div className="flex grow justify-center items-end py-4">
                            <a href="https://www.hogardecristo.cl/" target="_blank" rel="noopener noreferrer"><img src={"https://hcstore.org/wp-content/uploads/2020/01/cropped-hc-192x192.png"} loading="lazy" width={48} height={48}/></a>
                        </div>
                    </div>    
    */}