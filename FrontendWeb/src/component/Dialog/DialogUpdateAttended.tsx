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
import { ThelpedPerson } from '../../api/services/HelpPointService';
import { useHelpPointUpdateDialog } from '../../context/HelpPointUpdateContext';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));




export default function DialogUpdateAtended() {

    const [ helpPoint, setHelpPoint ] = useHelpPointUpdateDialog() 
    const [ helpedPerson, setHelpedPerson ] = useState<ThelpedPerson>(helpPoint?.helpedPerson ?? {
        name : 'Sin Especificar',
        age : 0,
        gender : 'Sin Especificar',
        city : 'Sin Especificar',
        nationality : 'Sin Especificar'
    }) 
    const { accessToken } = useSessionStore()
    const [ createButtonDisable, setCreateButtonDisable ] = useState(true)
    const [ error, setError ] = useState<string | undefined>()
    const { mutate, data, isError, isSuccess, isPending, isIdle, reset } = HelpPointAdapter.useUpdateHelpPointMutation( accessToken )


    useEffect(() => {
        if(helpPoint){
            setHelpedPerson(helpPoint.helpedPerson ?? {
                name : 'Sin Especificar',
                age : 0,
                gender : 'Sin Especificar',
                city : 'Sin Especificar',
                nationality : 'Sin Especificar'
            })
            console.log(helpPoint)
        }
    }, [helpPoint])

    useEffect(() => {
        console.log(helpedPerson)
    }, [helpedPerson])


    const clearStates = () => {
        reset()
        setHelpedPerson({        
            name : 'Sin Especificar',
            age : 0,
            gender : 'Sin Especificar',
            city : 'Sin Especificar',
            nationality : 'Sin Especificar'
        })
    }

    const handleClose = () => {
        clearStates()
        setHelpPoint(undefined)
    }


    const handleSubmit = () => {
        if(!helpPoint) return

        mutate({...helpPoint, helpedPerson : helpedPerson})
    }

    useEffect(() => {
        if(isSuccess) {
            setTimeout(() => {
                handleClose()
            }, 2000)
        }
    }, [isSuccess])


    return (
        <BootstrapDialog 
            fullWidth
            open={helpPoint !== undefined}
            onClose={handleClose}
            aria-labelledby='attended-titulo'
            keepMounted
            
        >
            <DialogTitle className='m-0 p-2' id="attended-titulo">
                {
                    isIdle ? 'Modificar el Registro' : 
                    isPending ? 'Cargando...' :
                    isSuccess ? 'Registro Cambiado' :
                    isError ? 'Ha ocurrido un error' :
                    'Error desconocido'
                }
            </DialogTitle>
            <CloseDialogButton handleClose={handleClose} />

            <DialogContent>
                { isIdle ?
                    <form className='flex flex-col gap-10 p-2'>
                        <div className='flex grow flex-row gap-5'>
                            <TextField
                                fullWidth
                                id="name" 
                                variant='standard'
                                value={helpedPerson?.name ?? null}
                                label='Nombre '
                                slotProps={{
                                    inputLabel: {
                                    shrink: true,
                                    },
                                }}  
                                onChange={(e) => {
                                    if(!helpedPerson) return
                                    setHelpedPerson({
                                        ...helpedPerson,
                                        name : e.target.value
                                    })
                                }}  
                                onFocus={(event) => {
                                    event.target.select();
                                }}
                            />
                            <TextField
                                id="edad"
                                variant='standard'
                                label='edad'
                                type='number'
                                value={helpedPerson?.age ?? null}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    }
                                }}
                                onChange={(e) => {
                                    setHelpedPerson({
                                        ...helpedPerson,
                                        age : Number(e.target.value)
                                    })
                                }}
                            />
                        </div>
                        <div className='flex grow'>
                            <ComboBox 
                                className='grow'
                                label={'Género'} 
                                onChange={(e, value) => {
                                    setHelpedPerson({
                                        ...helpedPerson,
                                        gender : value as string
                                    })
                                }}
                                options={['Hombre', 'Mujer', 'Sin Especificar']}   
                                value={helpedPerson?.gender ?? null}                      
                            />  
                        </div>
                        <div className='flex grow'>
                            <ComboBox 
                                className='grow'
                                label={'Ciudad de Origen'} 
                                options={['Santiago', 'La Serena', 'Coquimbo']}             
                                onChange={(e, value) => {
                                    setHelpedPerson({
                                        ...helpedPerson,
                                        city : value as string
                                    })
                                }}     
                                value={helpedPerson?.city ?? null}       
                            />
                        </div>
                        <div className='flex grow'>
                            <ComboBox
                                className='grow'
                                label='Nacionalidad'
                                options={['Chile', 'Perú']}
                                onChange={(e, value) => {
                                    setHelpedPerson({
                                        ...helpedPerson,
                                        nationality : value as string
                                    })
                                }}
                                value={helpedPerson?.nationality ?? null}
                                
                            />
                        </div>
                    </form>
                    :
                    isPending ? 
                    <div className='flex grow items-center justify-center'>
                        <CircularProgress size={70} />
                    </div>
                    :
                    <Alert sx={{ mt: 2, width: '100%', minHeight: '80px', display: 'flex', alignItems: 'center', fontSize: '1rem' }} variant='filled' severity={ isSuccess ? 'success' : isError ? 'error' : 'info'}>
                            {isSuccess ? 'Se Cambio el registro exitosamente' : isError ? 'Hubo un error al intentar finalizar' : 'Error desconocido'}
                    </Alert>
                }
                
            </DialogContent>
            <DialogActions>
                { isSuccess ?
                    <>
                    </>
                    :
                    <>
                        <Button variant='contained' disabled={createButtonDisable} onClick={handleSubmit}>
                            Modificar Registro
                        </Button>
                        <Button variant='contained' color='error' onClick={handleClose}>
                            Cancelar
                        </Button>
                    </>
                }
            </DialogActions>
        </BootstrapDialog>
    )    
};
