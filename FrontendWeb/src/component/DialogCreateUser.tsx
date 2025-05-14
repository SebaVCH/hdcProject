import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, TextField } from '@mui/material';
import { IUser } from '../api/interfaces/IUser';
import { useState } from 'react';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    justifyContent: 'center',
  },
  '& .MuiPaper-root': {
    width: '620px',
    height: '400px', 
    maxWidth: 'none',
  }
}));

export type UserRegister = {
    firstName : string 
    lastName : string 
    email : string 
    password : string 
    phone : string
}

export default function DialogCreateUser({ open, setOpen } : { open : boolean, setOpen: (ar : boolean) => void}) {

    const [ user, setUser ] = useState<UserRegister>({
        firstName : '',
        lastName : '',
        email : '',
        password : '',
        phone : ''
    })


    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <BootstrapDialog 
                fullWidth
                open={open} 
                onClose={handleClose}
                aria-labelledby='aviso-titulo'
            >
                <DialogTitle className='m-0 p-2' id="aviso-titulo">
                    Agrega nuevo usuario
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                    >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <div className="flex flex-col gap-6">
                        <div className='flex flex-row gap-5 justify-between px-2'>
                            <FormControl variant="standard" required className='bg-gray-0 rounded-b-sm border border-gray-600 w-1/2'>
                                <InputLabel htmlFor="nombres-input" shrink error>Nombre Completo</InputLabel>
                                <Input  id="nombres-input" placeholder="Ingresa el Nombre Completo" />
                            </FormControl>
                            <FormControl variant="standard" required className='bg-gray-0 rounded-b-sm border border-gray-600 w-1/2'>
                                <InputLabel htmlFor="ap1-input" shrink error>Apellidos</InputLabel>
                                <Input id="ap1-input" placeholder="Ingresa los Apellidos" />
                            </FormControl>
                        </div>
                        <div className='flex flex-col gap-6 px-2'>
                             <FormControl variant="standard" required className='bg-gray-0 rounded-b-sm border border-gray-600'>
                                <InputLabel htmlFor="email-input" shrink error>Correo Electrónico</InputLabel>
                                <Input id="email-input" placeholder="Ingresa el Correo Electrónico" />
                            </FormControl>

                            <FormControl variant="standard" required className='bg-gray-0 rounded-b-sm border border-gray-600'>
                                <InputLabel htmlFor="phone-input" shrink error>Teléfono</InputLabel>
                                <Input id="phone-input" placeholder="Ingresa el Número de Teléfono" />
                            </FormControl>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth size="large" onClick={handleClose} variant='contained'>
                        Agregar Usuario
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )    
};
