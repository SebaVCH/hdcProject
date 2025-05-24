import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export type DialogResumeRiskProps = { 
    stateOpen : [ boolean, React.Dispatch<React.SetStateAction<boolean>>]
}


export default function DialogResumeRoute({ stateOpen } : DialogResumeRiskProps) {

    const [ open, setOpen ] = stateOpen
    

    const handleClose = () => {
        setOpen(false)
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
                    <Typography variant='body1'>
                        Listo! <br />
                        Le muestro el código para que las demás personas puedan unirse 
                    </Typography>
                    <Typography variant='subtitle2'>
                        asd-12d
                    </Typography>
                </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={handleClose}>
                            Confirmar
                        </Button>
                    </DialogActions>
            </BootstrapDialog>
        </>
    )    
};
