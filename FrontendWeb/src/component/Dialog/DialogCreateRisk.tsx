import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Alert, CircularProgress, Typography, Zoom } from '@mui/material';
import { useEffect, useState } from 'react';
import getCurrentLocation, { Position } from '../../utils/getCurrentLocation';
import InputDescription from '../Input/InputDescription';
import CloseDialogButton from '../Button/CloseDialogButton';
import { LocationMethod } from '../../api/interfaces/Enums';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import { RiskAdapter } from '../../api/adapters/RiskAdapter';
import { TRisk } from '../../api/services/RiskService';
import useSessionStore from '../../stores/useSessionStore';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export type DialogCreateRiskProps = { 
    stateOpen : [ boolean, React.Dispatch<React.SetStateAction<boolean>>]
    stateOnSelectLocationMap : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    stateLocationMethod : [ LocationMethod, React.Dispatch<React.SetStateAction<LocationMethod>> ]
    stateDescription : [ string, React.Dispatch<React.SetStateAction<string>> ]
    location : Position
}


export default function DialogCreateRisk({ stateOpen, stateOnSelectLocationMap, location, stateLocationMethod, stateDescription } : DialogCreateRiskProps) {

    const { accessToken } = useSessionStore()
    const [ open, setOpen ] = stateOpen
    const [ , setOnSelectLocationMap ] = stateOnSelectLocationMap 


    const [ description, setDescription ] = stateDescription
    const [ coords, setCoords ] = useState<number[]>([])
    const [ required, setRequired ] = useState(false)
    const [ createButtonDisable, setCreateButtonDisable ] = useState(true)
    const [ locationMethod, setLocationMethod ] = stateLocationMethod
    const [ error, setError ] = useState<string | undefined>()

    const { mutate, data, isError, isSuccess, isPending, isIdle, reset } = RiskAdapter.usePostRiskMutation( accessToken )


    const handleCurrentLocation = async () => {
        setLocationMethod(LocationMethod.Current)
        try {
            const currentPosition = await getCurrentLocation()
            setCoords([currentPosition.latitude, currentPosition.longitude])
        } catch (e) {
            setError((e as Error).message)
            alert(`error : ${(e as Error).message}`)
        }
    }
    
    const handleSelectLocationMap = () => {
        setLocationMethod(LocationMethod.Map)
        setOnSelectLocationMap(true)
        setOpen(false)
    }

    useEffect(() => {
        if(location.latitude != 0) {
            setLocationMethod(LocationMethod.Map)
            setCoords([location.latitude, location.longitude])
        }
    }, [location])

    useEffect(() => {
        if(coords.length != 0) {
            setCreateButtonDisable(false)
        }
    }, [coords])

    const handleClose = () => {
        reset()
        setOpen(false)
        setRequired(false)
        setDescription('')
        setLocationMethod(LocationMethod.None)
        setError(undefined)
        setCreateButtonDisable(true)
        setCoords([])
    }

    const handleSubmit = () => {
        if(!description) {
            setRequired(true)
            return
        }
        if(coords.length != 2) {
            return 
        }

        mutate({
            description,
            coords,
            createdAt : (new Date()).toISOString()
        })
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
            open={open} 
            onClose={handleClose}
            aria-labelledby='risk-titulo'
            keepMounted
        >
            <DialogTitle className='m-0 p-2' id="risk-titulo">
                { 
                    isIdle ? 'Crear un riesgo' :
                    isPending ? 'Cargando...' :
                    isSuccess ? 'Riesgo Creado':
                    isError ? 'Ha ocurrido un error' :
                    'Error desconocido'
                }
            </DialogTitle>
            <CloseDialogButton handleClose={handleClose} />
            
            <DialogContent>
                { isIdle ? 
                    <div className='flex flex-col gap-4'>
                        <Typography>
                            Un riesgo identifica una zona de "cuidado" en el sector, 
                            podrás explicar la razón del riesgo agregando una pequeña descripción.
                        </Typography>
                        <InputDescription 
                            maxLength={100}
                            maxRows={6}
                            required
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
                                <Button 
                                    color={locationMethod === LocationMethod.Current ? error ? 'error' : 'success' : 'primary'} 
                                    fullWidth variant='contained' 
                                    onClick={handleCurrentLocation}
                                    loadingIndicator
                                >
                                    <Zoom in style={{ transition: 'ease-in-out'}}>
                                        <div>
                                            { locationMethod === LocationMethod.Current ? 
                                                error ? <ReplayIcon />  : <TaskAltIcon />
                                            : 
                                                <span>Obtener Ubicación actual</span>
                                            }
                                        </div>
                                    </Zoom>
                                </Button>
                                <Button 
                                    fullWidth 
                                    variant='contained' 
                                    color={ locationMethod === LocationMethod.Map ? error ? 'error' : 'success' : 'secondary'}
                                    onClick={handleSelectLocationMap}
                                >
                                    <Zoom in style={{ transition: 'ease-in-out'}}>
                                        <div>
                                            { locationMethod === LocationMethod.Map ? 
                                                error ? <ReplayIcon /> : <TaskAltIcon/>
                                            : 
                                                <span>Seleccionar en el mapa</span>
                                            }
                                        </div>
                                    </Zoom>
                                </Button>
                            </div>
                            <Alert severity={error ? 'error' : coords.length != 0 ? 'success' : 'warning'}> 
                                {error ? error : coords.length != 0 ? 'Ubicación Completada' : ' Necesitas Seleccionar un opción'}
                            </Alert>
                        </div>
                    </div>
                    :
                    isPending ? 
                    <div className='flex grow items-center justify-center'>
                        <CircularProgress size={70} />
                    </div>    
                    :
                    <Alert sx={{ mt: 2, width: '100%', minHeight: '80px', display: 'flex', alignItems: 'center', fontSize: '1rem' }} variant='filled' severity={ isSuccess ? 'success' : isError ? 'error' : 'info'}>
                            {isSuccess ? 'Se Creo el riesgo exitosamente' : isError ? 'Hubo un error al intentar finalizar' : 'Error desconocido'}
                    </Alert>
                }
            </DialogContent>
            <DialogActions>
                { isSuccess ?
                    <></>
                    :
                    <>
                        <Button  variant='contained' disabled={createButtonDisable} onClick={handleSubmit}>
                            Crear Riesgo
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
