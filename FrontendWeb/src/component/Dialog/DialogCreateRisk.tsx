import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Typography } from '@mui/material';
import { useState } from 'react';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogCreateRisk({ open, setOpen } : { open : boolean, setOpen: (ar : boolean) => void}) {


    const [ description, setDescription ] = useState('')
    const [ required, setRequired ] = useState(false)


    const handleSubmit = () => {
        if(!description) {
            setRequired(true)
        }
    }

    const handleClose = () => {
        setOpen(false)
        setRequired(false)
        setDescription('')
    }

    return (
        <>
            <BootstrapDialog 
                fullWidth
                open={open} 
                onClose={handleClose}
                aria-labelledby='risk-titulo'
            >
                <DialogTitle className='m-0 p-2' id="risk-titulo">
                    Crear Un Riesgo
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
                <DialogContent>
                    <div className='flex flex-col gap-4'>
                        <Typography>
                        Un riesgo identifica una zona de "cuidado" en la zona, podrás explicar la razón del riesgo agregando una pequeña descripción.
                        </Typography>
                        <TextField 
                            required={required}
                            error={required}
                            variant='standard'
                            label='Descripción'
                            placeholder='ingresa la descripción del riesgo'
                            value={description}       
                            onChange={(e) => {setDescription(e.target.value); setRequired(false)}}    
                            onBlur={(_) => {if(!description) setRequired(true)}}             
                        />
                        {required ? <p className='text-red-600'> Debes de Ingresar una descripción</p> : <br />}
                        <div className='flex flex-col gap-2'>
                            <Typography>Seleccionar Ubicación</Typography>
                            <div className='flex grow justify-center items-center gap-2'>
                                <Button fullWidth variant='contained'>
                                    Utilizar Mi Ubicación Actual
                                </Button>
                                <Button fullWidth variant='contained' color='secondary'>
                                    Selecccionar en el mapa
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained'>
                        Crear Riesgo
                    </Button>
                    <Button variant='contained' color='error' onClick={handleClose}>
                        Cancelar
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )    
};
