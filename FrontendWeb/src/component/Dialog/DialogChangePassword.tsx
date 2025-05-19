import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { UserAdapter } from '../../api/adapters/UserAdapter';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogChangePassword({ open, setOpen, email} : { open : boolean, setOpen: (ar : boolean) => void, email : string}) {


    const [ oldPassword, setOldPassword ] = useState<string>('')
    const [ newPassword, setNewPassword ] = useState<string>('')
    const [ verifyNewPassword, setVerifyNewPassword ] = useState<string>('')
    const [ areCorrect, setAreCorrect ] = useState(true)
    const [ verifyOldPass, setVerifyOldPass ] = useState(true) 


    const { isError, mutate, isSuccess, data } = UserAdapter.useLoginMutation(email, oldPassword)

    const onChangeOldPassword = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault()
        setVerifyOldPass(true)
        setOldPassword(e.target.value)
    }
    const onChangeNewPassword = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault()
        setNewPassword(e.target.value)
    }
    const onChangeVerifyNewPassword = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault()
        setVerifyNewPassword(e.target.value)
    }

    const handleClose = () => {
        setOpen(false);
    }

    const onChangePassword = () => {

        mutate()
        if(!data?.token) {
            setVerifyOldPass(false)
            setAreCorrect(false)
            return 
        }
        if(newPassword != verifyNewPassword || newPassword.length != 0) {
            setAreCorrect(false)
            return 
        }
        setAreCorrect(true)
        handleClose()
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
                    Cambiar Contraseña
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
                <DialogContent dividers className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <TextField
                            className='w-3/4'  
                            label="Contraseña Antigua"
                            size="small"
                            placeholder="Escribe la contraseña antigua" 
                            type={"password"} 
                            value={oldPassword}
                            onChange={onChangeOldPassword}
                        />
                        <p className='text-red-500'>{ verifyOldPass ? '' : 'Contraseña Incorrecta'}</p>
                    </div>
                    <TextField  
                        label="Contraseña Nueva"
                        className='w-3/4' 
                        size="small"
                        placeholder="Escribe la nueva contraseña" 
                        type={"password"} 
                        value={newPassword}
                        onChange={onChangeNewPassword}
                    />
                    <TextField  
                        label="Confirmación Contraseña nueva"
                        className='w-3/4' 
                        size="small"
                        placeholder="Escribe nuevamente la nueva contraseña" 
                        type={"password"} 
                        value={verifyNewPassword}
                        onChange={onChangeVerifyNewPassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onChangePassword} >
                        Cambiar Contraseña
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )    
};
