import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"



export default function DrawerListProfile() {
    const navigate = useNavigate()


    const onClickProfile = () => {
        console.log("enviado")
        navigate('/')
    }


    
    return (
        <div className="py-5 w-54 flex grow flex-col flex-wrap justify-items-between">
            <div className="w-full">
                <Button fullWidth onClick={onClickProfile}>
                    Home
                </Button>
            </div>
            <div className="w-full">
                <Button fullWidth>
                    Agendar
                </Button>
            </div>
            <div className="w-full">
                <Button fullWidth>
                    Historial
                </Button>
            </div>
            <div className="flex grow items-end w-full">
                <Button fullWidth>
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    )
};
