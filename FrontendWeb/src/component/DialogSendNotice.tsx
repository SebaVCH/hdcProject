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
import { NoticeAdapter } from '../api/adapters/NoticeAdapter';
import useSessionStore from '../stores/useSessionStore';
import { red } from '@mui/material/colors';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogSendAviso({ open, setOpen } : { open : boolean, setOpen: (ar : boolean) => void}) {

    const { accessToken } = useSessionStore()
    const [ message, setMessage ] = useState<string>('')
    const { isError, mutate, data } = NoticeAdapter.usePostNoticeMutation({ description : message, type: 'aviso'}, accessToken)

    const onChangeTextField = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault()
        setMessage(e.target.value)
    }

    const handleClose = () => {
        setOpen(false);
    }

    const onPostNotice = () => {
        mutate()
        handleClose()
    }

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <>
            <BootstrapDialog 
                fullWidth
                open={open} 
                onClose={handleClose}
                aria-labelledby='aviso-titulo'
            >
                <DialogTitle className='m-0 p-2' id="aviso-titulo">
                    Enviar Un Aviso
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
                <DialogContent dividers className='flex flex-col gap-5'>
                    <TextField  
                        label="Mensaje"
                        multiline
                        fullWidth
                        size="small"
                        placeholder="Escribe el mensaje" 
                        type={"text"} 
                        value={message}
                        onChange={onChangeTextField}
                    />
                    <div className='flex justify-start'>
                        <FormControlLabel label="Enviar por Email" control={<Checkbox />}/>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={onPostNotice}>
                        Enviar Aviso
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )    
};
