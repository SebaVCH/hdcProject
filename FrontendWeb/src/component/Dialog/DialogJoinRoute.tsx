import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSessionStore from '../../stores/useSessionStore';
import { RouteAdapter } from '../../api/adapters/RouteAdapter';
import { TRoute } from '../../api/services/RouteService';
import { RouteStatus } from '../../api/interfaces/Enums';
import CloseDialogButton from '../Button/CloseDialogButton';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


type DialogJoinRouteProps = {
    stateOpen : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
}

export default function DialogJoinRoute({ stateOpen } : DialogJoinRouteProps) {

    const [ open, setOpen ] = stateOpen
    const { accessToken, routeStatus, setRouteStatus, routeId, setRouteId } = useSessionStore()
    const [ acept, setAcept ] = useState(false)
    const [ confirmation, setConfirmation ] = useState(false)
    const [ route, setRoute ] = useState<TRoute>({
        _id : '',
        description : '',
        routeLeader : '',
        status : RouteStatus.Active
    })

    const { data, mutate } = RouteAdapter.usePostRouteMutation(route, accessToken)

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
       setAcept(routeStatus)
       setConfirmation(routeStatus)
    }, [routeStatus])

    const handleDescriptionInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        setRoute({...route, description : e.target.value})
    }

    const handleAcept = () => {
        setAcept(true)
        setTimeout(() => {
            mutate()
        }, 300)
    }

    useEffect(() => {
        if(data) {
            setRoute(data)
            setRouteStatus(true)
            setRouteId(data._id)
        }
    }, [data])


    return (
        <>
            <BootstrapDialog 
                fullWidth
                open={open} 
                onClose={handleClose}
                aria-labelledby='ruta-titulo'
            >
                <DialogTitle className='m-0 p-2' id="ruta-titulo">
                    Unirse a una ruta
                </DialogTitle>
                <CloseDialogButton 
                    handleClose={handleClose}
                />
                <DialogContent className='flex flex-col gap-5'>
                    <Typography variant='body1'>
                        Unete a una ruta activa con el código de invitación
                    </Typography>
                    <TextField
                        variant='standard'
                        required 
                        label='Código de invitación'
                        placeholder='Ingresa el código'
                        value={route.description}
                        onChange={handleDescriptionInput}
                    />
                </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={!confirmation ? handleAcept : handleClose}>
                            {!confirmation ? 'Unirse' : 'Aceptar'}
                        </Button>
                        { !confirmation ? 
                            <>
                                <Button variant='contained' onClick={handleClose}>
                                    cancelar
                                </Button>
                            </>
                            :
                            <>
                            </>
                        }
                    </DialogActions>
            </BootstrapDialog>
        </>
    )    
};
