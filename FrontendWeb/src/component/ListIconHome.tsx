import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';  
import CampaignIcon from '@mui/icons-material/Campaign';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DialogSendAviso from './DialogSendAviso';


export default function ListIconHome() {

    const navigate = useNavigate()
    const [ open, setOpen ] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const onClickProfile = () => {
        navigate('/profile')
    }

    const onClickHistory = () => {
        navigate('/history')
    }

    return(
        <div className="flex flex-col py-5 gap-7 justify-start items-center">
            <Tooltip title="Perfil"><IconButton onClick={onClickProfile}><AccountBoxIcon htmlColor="gray" fontSize="large"/></IconButton></Tooltip>
            <Tooltip title="Historial"><IconButton><HistoryIcon htmlColor="gray" fontSize="large" /></IconButton></Tooltip>
            <Tooltip title="Agendar ruta"><IconButton><EventIcon htmlColor="gray" fontSize="large"/></IconButton></Tooltip>
            <Tooltip title="Enviar aviso"><IconButton onClick={handleClickOpen}><CampaignIcon htmlColor="gray" fontSize="large" /></IconButton></Tooltip>
            
            <DialogSendAviso open={open} setOpen={setOpen} />
        </div>
    )    
};
