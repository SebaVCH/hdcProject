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
import CircularProgress from '@mui/material/CircularProgress';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogFinishRoute({ open, setOpen } : { open : boolean, setOpen: (ar : boolean) => void}) {

   
    const { routeStatus, setRouteStatus } = useSessionStore()

    const handleClose = () => {
        setOpen(false)
    }


    const onFinishRoute = () => {
        setRouteStatus(false)
    }

    
    return (
        <>
            <BootstrapDialog 
                fullWidth
                open={open} 
                onClose={handleClose}
                aria-labelledby='finalizar-ruta-titulo'
            >
                <DialogTitle className='m-0 p-2' id="finalizar-ruta-titulo">
                    Finalizar Ruta
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
                    <Typography>
                        ¿Estás seguro que quieres finalizar la Ruta?
                    </Typography>
                </DialogContent>
                    <DialogActions>
                        <Button variant='contained' color='error' onClick={onFinishRoute}>
                            Finalizar
                        </Button>
                        <Button variant='contained' onClick={handleClose}>
                            Cancelar
                        </Button>
                    </DialogActions>
            </BootstrapDialog>
        </>
    )    
};
