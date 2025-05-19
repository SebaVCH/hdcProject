import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSessionStore from '../../stores/useSessionStore';
import { NoticeAdapter } from '../../api/adapters/NoticeAdapter';
import CircularProgress from '@mui/material/CircularProgress';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogCreateRoute({ open, setOpen } : { open : boolean, setOpen: (ar : boolean) => void}) {

   
    const handleClose = () => {
        setOpen(false)
    }
    const { routeStatus, setRouteStatus } = useSessionStore()
    const [ acept, setAcept ] = useState(false)
    const [ confirmation, setConfirmation ] = useState(false)



    useEffect(() => {
       setAcept(routeStatus)
       setConfirmation(routeStatus)
    }, [routeStatus])


    const DialogContentConfirmation = () => (
        <>
            <Typography variant='body1'>
                Estás a punto de crear una nueva ruta social, en la que podrás hacer: <br /> <br/>
                - Poder registrar a las personas en situación de calle. <br />
                - Poder registrar riesgos que existen en algunos sectores. <br /> <br/>
                    
                Podrás finalizar la ruta en cualquier momento
            </Typography>
            <TextField 
                variant='standard'
                label="Ingresa el Título de la Ruta"
                defaultValue={"Ruta-Fecha"}
            />
        </>
    )

    const DialogContentReady = () => (
        <>
            <Typography variant='body1'>
                Listo! <br />
                Le muestro el código para que las demás personas puedan unirse 
            </Typography>
            <Typography variant='subtitle2'>
                asd-12d
            </Typography>
        </>
    )

    const handleConfirmation = () => {
        setAcept(true)
        setRouteStatus(true)
        setTimeout(() => {
            setConfirmation(true)
        }, 300)
    }



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
                        <DialogContentConfirmation />
                    :
                        !confirmation ? <CircularProgress /> : <DialogContentReady />
                    }
                </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={!confirmation ? handleConfirmation : handleClose}>
                            Confirmar
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
