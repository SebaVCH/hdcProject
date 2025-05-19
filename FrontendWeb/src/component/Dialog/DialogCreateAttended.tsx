import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogCreateAttended({ open, setOpen } : { open : boolean, setOpen: (ar : boolean) => void}) {


    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <BootstrapDialog 
                fullWidth
                open={open} 
                onClose={handleClose}
                aria-labelledby='attended-titulo'
            >
                <DialogTitle className='m-0 p-2' id="attended-titulo">
                    Crear Un Registro
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
                    
                </DialogContent>
                <DialogActions>
                    <Button variant='contained'>
                        Crear Registro
                    </Button>
                    <Button variant='contained' color='error'>
                        Cancelar
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )    
};
