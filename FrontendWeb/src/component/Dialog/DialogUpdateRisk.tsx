import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Alert, CircularProgress, TextField } from '@mui/material';
import ComboBox from '../Button/ComboBox';
import { useEffect, useState } from 'react';
import { HelpPointAdapter } from '../../api/adapters/HelpPointAdapter';
import useSessionStore from '../../stores/useSessionStore';
import CloseDialogButton from '../Button/CloseDialogButton';
import { useHelpPointUpdateDialog } from '../../context/HelpPointUpdateContext';
import { useRiskUpdateDialog } from '../../context/RiskUpdateContext';
import InputDescription from '../Input/InputDescription';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogUpdateRisk() {

    const [ risk, setRisk ] = useRiskUpdateDialog() /*Context Provider */

    const { accessToken } = useSessionStore()
    

    const handleClose = () => {
        setRisk(undefined)
    }

    const handleSubmit = () => {

    }


    if(risk === undefined) {
        return null
    }

    return (
        <BootstrapDialog 
            fullWidth
            open={risk !== undefined}
            onClose={handleClose}
            aria-labelledby='risk-update-titulo'
            keepMounted
            
        >
            <DialogTitle className='m-0 p-2' id="risk-update-titulo">
                Modificar alerta
            </DialogTitle>
            <CloseDialogButton handleClose={handleClose} />

            <DialogContent>

                <div className='flex flex-col gap-4'>
                    <InputDescription 
                        maxLength={100}
                        value={risk.description} 
                        onChange={(e) => setRisk({...risk, description : e.target.value})}   
                        fullWidth
                        variant='standard'      
                        label='Descripción'      
                    />
                    <ComboBox label={'Estado'} options={['Ambiente', 'En progreso', 'Completada']}/>
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={handleSubmit}>
                    Listo 
                </Button>
                <Button variant='contained' onClick={handleClose}>
                    Cancelar
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )    
};
