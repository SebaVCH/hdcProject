import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, TextField, Typography } from '@mui/material';
import ComboBox from '../Button/ComboBox';
import { useEffect, useState } from 'react';
import getCurrentLocation, { Position } from '../../utils/getCurrentLocation';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export type DialogCreateAttendedProps = { 
    stateOpen : [ boolean, React.Dispatch<React.SetStateAction<boolean>>]
    stateOnSelectLocationMap : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    location : Position
}


export default function DialogCreateAttended({ stateOpen, stateOnSelectLocationMap, location } : DialogCreateAttendedProps) {


    const [ open, setOpen ] = stateOpen
    const [ _, setOnSelectLocationMap ] = stateOnSelectLocationMap

    const [ name, setName ] = useState<string>('Sin Especificar')
    const [ age, setAge ] = useState<number>(-1)
    const [ city, setCity ] = useState<string>('Sin Especificar')
    const [ nationality, setNationality ] = useState<string>('Sin Especificar') 
    const [ coords, setCoords ] = useState<number[]>([])
    const [ createButtonDisable, setCreateButtonDisable ] = useState(true)


    const handleCurrentLocation = async () => {
        try {
            const currentPosition = await getCurrentLocation()
            console.log(currentPosition)
            setCoords([currentPosition.latitude, currentPosition.longitude])
        } catch (e) {
            alert(`error : ${(e as Error).message}`)
        }
    }


    const handleSelectLocationMap = () => {
        setOnSelectLocationMap(true)
        setOpen(false)
    }

    useEffect(() => {
        console.log(location)
        if(location.latitude != 0) {
            setCoords([location.latitude, location.longitude])
        }
    }, [location])

    useEffect(() => {
        console.log(coords)
        if(coords.length != 0) {
            setCreateButtonDisable(false)
        }
    }, [coords])




    const clearStates = () => {
        setName('Sin Especificar')
        setAge(-1)
        setCity('Sin Especificar')
        setNationality('Sin Especificar')
        setCoords([])
        setCreateButtonDisable(true)
    }

    const handleClose = () => {
        setOpen(false)
        clearStates()
    }

    const handleSubmit = () => {
        // manejar submit base de datos 
        handleClose()
    }


    return (
        <BootstrapDialog 
            fullWidth
            open={open} 
            onClose={handleClose}
            aria-labelledby='attended-titulo'
            keepMounted
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
                <form className='flex flex-col gap-10 p-2'>
                    <div className='flex flex-row gap-5'>
                        <TextField
                            fullWidth
                            id="name" 
                            variant='standard'
                            defaultValue='Sin Especificar'
                            onChange={(e) => {setName(e.target.value)}}
                            label='Nombre '
                            slotProps={{
                                inputLabel: {
                                shrink: true,
                                },
                            }}    
                            onFocus={(event) => {
                                    event.target.select();
                            }}
                        />
                        <TextField
                            id="edad"
                            variant='standard'
                            onChange={(e) => {setAge(Number(e.target.value))}}
                            label='edad'
                            type='number'
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                }
                            }}
                        />
                    </div>
                    <div className='flex grow'>
                        <ComboBox 
                            className='grow'
                            label={'Ciudad de Origen'} 
                            onChange={(e, value) => {setCity(value as string)}}
                            options={['Santiago', 'La Serena', 'Coquimbo']}  
                            defaultValue={'Coquimbo'}                          
                        
                        />
                    </div>
                    <div className='flex grow'>
                        <ComboBox
                            className='grow'
                            label='Nacionalidad'
                            onChange={(e, value) => {setNationality(value as string)}}
                            options={['Chile', 'Perú']}
                            defaultValue={'Chile'}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Typography>Seleccionar Ubicación</Typography>
                        <div className='flex grow justify-center items-center gap-2'>
                            <Button fullWidth variant='contained' onClick={handleCurrentLocation}>
                                Utilizar Mi Ubicación Actual
                            </Button>
                            <Button fullWidth variant='contained' color='secondary' onClick={handleSelectLocationMap}>
                                Selecccionar en el mapa
                            </Button>
                        </div>
                        <Alert severity={ coords.length != 0 ? 'success' : 'warning' }>{ coords.length != 0 ? 'Ubicación Completada' : 'Necesitas Seleccionar una opción' }</Alert>
                    </div>
                </form>
                
            </DialogContent>
            <DialogActions>
                <Button variant='contained' disabled={createButtonDisable} onClick={handleSubmit}>
                    Crear Registro
                </Button>
                <Button variant='contained' color='error' onClick={handleClose}>
                    Cancelar
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )    
};
