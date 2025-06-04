import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, Input, InputLabel, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { UserAdapter } from '../../api/adapters/UserAdapter';
import { isValidEmail } from '../../utils/verifyInput';


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


    const [ loading, setLoading ] = useState(false)
    const [ generalInfo, setGeneralInfo ] = useState('')


    const [ inputError, setInputError ] = useState({
        firstName : false,
        lastName : false,
        email : false,
        phone : false
    })


    const { isError, isSuccess, mutate, error, data, reset } = UserAdapter.useRegisterMutation(user)

    const handleInputChange = (input: keyof Omit<UserRegister, "password">) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setGeneralInfo('');
        setUser({ ...user, [input]: e.target.value });
        setInputError({ ...inputError, [input]: e.target.value.trim() === '' });
    };


    useEffect(() => {
        console.log(data)
        if(data || isSuccess) {
            setGeneralInfo('Se agrego correctamente')
            setTimeout(() => {
                setOpen(false)
            }, 1000)
        }
    }, [data, isSuccess])

    const handleUserRegister = () => {

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 600)

        if(!user.firstName) {
            setGeneralInfo('Debe tener algún Nombre')
            return
        }
        if(!user.lastName) {
            setGeneralInfo('Debe tener algún Apellido')
            return 
        }
        if(!user.email) {
            setGeneralInfo('Email es Requerido')
            return 
        }
        if(!isValidEmail(user.email)) {
            setGeneralInfo("Debe ser un email Válido")
            setInputError({...inputError, email : true})
            return 
        }
        if(!user.phone) {
            setGeneralInfo('Télefono campo obligatorio')
            return 
        }
        mutate()
    }

    const handleOnClose = () => {
        setInputError({firstName : false, lastName : false, email : false, phone : false })
        setGeneralInfo('')
        reset()
        setOpen(false)
    }

    return (
        <>
            <BootstrapDialog 
                fullWidth
                open={open} 
                onClose={handleOnClose}
                aria-labelledby='aviso-titulo'
            >
                <DialogTitle className='m-0 p-2' id="aviso-titulo">
                    Agrega nuevo usuario
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleOnClose}
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
                            <FormControl variant="standard" required error={inputError.firstName} className='rounded-b-sm border border-gray-600 w-1/2'>
                                <InputLabel htmlFor="nombres-input" shrink>Nombre Completo</InputLabel>
                                <Input onBlur={handleInputChange('firstName')} onChange={handleInputChange('firstName')} id="nombres-input" placeholder="Ingresa el Nombre Completo" />
                            </FormControl>
                            <FormControl  variant="standard" required error={inputError.lastName} className='rounded-b-sm border border-gray-600 w-1/2'>
                                <InputLabel htmlFor="ap1-input" shrink>Apellidos</InputLabel>
                                <Input onBlur={handleInputChange('lastName')}  onChange={handleInputChange('lastName')} id="ap1-input" placeholder="Ingresa los Apellidos" />
                            </FormControl>
                        </div>
                        <div className='flex flex-col gap-6 px-2'>
                             <FormControl variant="standard" required error={inputError.email} className='rounded-b-sm border border-gray-600'>
                                <InputLabel htmlFor="email-input" shrink>Correo Electrónico</InputLabel>
                                <Input onBlur={handleInputChange('email')} onChange={handleInputChange('email')} id="email-input" placeholder="Ingresa el Correo Electrónico" />
                            </FormControl>

                            <FormControl variant="standard" required error={inputError.phone} className='rounded-b-sm border border-gray-600'>
                                <InputLabel htmlFor="phone-input" shrink>Teléfono</InputLabel>
                                <Input onBlur={handleInputChange('phone')} onChange={handleInputChange('phone')} id="phone-input" placeholder="Ingresa el Número de Teléfono" />
                            </FormControl>
                        </div>
                        <div className='px-2'>
                            {<Typography className={isSuccess ? 'text-blue-600' : 'text-red-700'}>{generalInfo ? generalInfo : (error ? (error as any).error : '')}</Typography>}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth size="large" onClick={handleUserRegister} variant='contained' loading={loading}>
                        Agregar Usuario
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )    
};
