import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useSessionStore from "../stores/useSessionStore";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';  
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

export default function DrawerList() {

    const navigate = useNavigate()
    const { clearSession } = useSessionStore()

    const onClickProfile = () => {
        console.log("enviado")
        navigate('/profile')
    }

    const onClickUsuarios = () => {
        navigate('admin/usuarios')
    }

    const onClickCerrarSesion = () => {
        clearSession()
        navigate('/login')
    }

    const onClickHome = () => {
        navigate('/')
    }


    
    return (
        <div className="py-5 gap-5 w-50 flex grow flex-col flex-wrap justify-items-between">
            <Button fullWidth onClick={onClickHome}>
                <div className="flex w-full justify-start px-5 gap-10 items-center">
                    <AccountBoxIcon />
                     <Typography>Home</Typography>
                 </div>
            </Button>
            <Button fullWidth onClick={onClickProfile}>
                <div className="flex w-full justify-start px-5 gap-10 items-center">
                    <AccountBoxIcon />
                    <Typography>Perfil</Typography>
                </div>
            </Button>
            <Button fullWidth>
                <div className="flex w-full justify-start px-5 gap-10 items-center">
                    <EventIcon />
                    <Typography>Agendar</Typography>
                </div>
            </Button>
            <Button fullWidth>
                <div className="flex w-full justify-start px-5 gap-10 items-center">
                    <HistoryIcon />
                    <Typography>Historial</Typography>
                </div>
            </Button>
            <Button fullWidth>
                <div className="flex w-full justify-start px-5 gap-10 items-center">
                    <GroupIcon />
                    <Typography>Usuarios</Typography>
                </div>
            </Button>
            <div className="flex grow items-end w-full">
                <Button fullWidth color="warning" >
                    <div className="flex w-full justify-start px-5 gap-1 items-center">
                        <LogoutIcon fontSize="small" />
                        <Typography>Cerrar Sesión</Typography>
                    </div>
                </Button>
            </div>
        </div>
    )
};
