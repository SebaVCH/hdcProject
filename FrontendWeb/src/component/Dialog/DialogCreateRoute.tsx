import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSessionStore from '../../stores/useSessionStore';
import CircularProgress from '@mui/material/CircularProgress';
import { RouteAdapter } from '../../api/adapters/RouteAdapter';
import { TRoute } from '../../api/services/RouteService';
import { RouteStatus } from '../../api/interfaces/Enums';
import InputDescription from '../Input/InputDescription';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogCreateRoute({ open, setOpen } : { open : boolean, setOpen: (ar : boolean) => void}) {

   
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

    const DialogContentReady = () => (
        <>
            <Typography variant='body1'>
                Listo! <br />
                A continuación el código para que otras personas puedan unirse
            </Typography>
            <Typography variant='subtitle2'>
                asd-12d
            </Typography>
        </>
    )

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
                    Crear Una Ruta
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[600],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent className='flex flex-col gap-5'>
                    {!acept ? 
                        <>
                            <Typography variant='body1'>
                                Estás a punto de crear una nueva ruta social, en la que podrás hacer: <br /> <br/>
                                - Poder registrar a las personas en situación de calle. <br />
                                - Poder registrar riesgos que existen en algunos sectores. <br /> <br/>
                                    
                                Podrás finalizar la ruta en cualquier momento
                            </Typography>
                            <InputDescription
                                variant='standard'
                                required 
                                label='Descripción de la ruta'
                                placeholder='Ingresa la descripción'
                                value={route.description}
                                maxLength={50}
                                onChange={handleDescriptionInput}
                            />
                            <TextField 
                                variant='standard'
                                label="Ingresa el Título de la Ruta"
                                defaultValue={"Ruta-Fecha"}
                            />
                        </>
                    :
                        !confirmation ? 
                        
                        <div className='flex grow items-center justify-center'>
                            <CircularProgress  />
                        </div> 
                        : 
                            <>
                                <Typography variant='body1'>
                                    Listo! <br />
                                    A continuación el código para que otras personas puedan unirse
                                </Typography>
                                <Typography variant='subtitle2'>
                                    {route.inviteCode}
                                </Typography>
                            </>
                    }
                </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={!confirmation ? handleAcept : handleClose}>
                            {!confirmation ? 'Confirmar' : 'Aceptar'}
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
