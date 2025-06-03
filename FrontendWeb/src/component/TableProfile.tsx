import { Button, Divider, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { TProfileResponse } from "../api/services/UserService";
import { useState } from "react";
import DialogChangePassword from "./Dialog/DialogChangePassword";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


type TableProfileProps = {
     stateUser : [TProfileResponse , React.Dispatch<React.SetStateAction<TProfileResponse | undefined>> ]
     stateHasChanges : [ boolean, React.Dispatch<React.SetStateAction<boolean>>]
} 

export default function TableProfile({ stateUser, stateHasChanges } : TableProfileProps ) {

     const [ open, setOpen ] = useState(false)
     const [ user, setUser ] = stateUser
     const [ , setHasChange ] = stateHasChanges

     const onChangeName = (name : string) => {
          setHasChange(true)
          setUser({ ...user, name }) 
     }

     const onChangePhone = (phone : string) => {
          setHasChange(true)
          setUser({ ...user, phone })
     }


     return (
          <div className="flex flex-col grow w-full items-center justify-center">
               <div className="flex flex-col w-full md:w-3/4 lg:w-1/2 grow my-6 gap-1">
                    <Typography variant="h6">
                         Acerca de ti
                    </Typography>
                    <Paper elevation={2} className="flex items-center justify-center p-1 sm:p-2 md:p-3 lg:p-5 flex-col gap-8 border border-neutral-300">
                         <TextField 
                              variant="standard"
                              margin="dense"
                              fullWidth
                              label="Nombre"
                              id="outlined-required"
                              placeholder="Ingresa tu Nombre"
                              color={user.name == '' ? 'warning' : 'primary'}
                              value={user.name}
                              size="small"
                              onChange={(event) => {onChangeName(event.target.value)}}
                              onFocus={(e) => {e.target.select()}}
                              focused={user.name == ''}
                         />
                         <TextField 
                              fullWidth
                              margin="dense"
                              variant="standard"
                              label="Teléfono"
                              id="outlined-required"
                              placeholder="Ingresa tu Número de Teléfono"
                              color={user.phone == '' ? 'warning' : 'primary'}
                              value={user.phone}
                              size="small"
                              onChange={((event) => (onChangePhone(event.target.value)))}
                              onFocus={(e) => (e.target.select())}
                              focused={user.phone == ''}
                         />
                         <TextField 
                              fullWidth
                              margin="dense"
                              variant="standard"
                              label="Email"
                              id="outlined-required"
                              value={user.email}
                              disabled
                              size="small"
                         />
                         <div className="flex flex-col w-full justify-start items-start gap-1">
                              <TextField
                                   fullWidth
                                   margin="dense"
                                   variant="standard"
                                   label="Contraseña"
                                   id="outlined-required"
                                   value={'------'}
                                   type="password"
                                   disabled
                                   size="small"
                              />
                              <Button size='small' variant="text" onClick={() => {setOpen(true)}}>
                                   Cambiar Contraseña
                              </Button>
                         </div>
                         <DialogChangePassword open={open} setOpen={setOpen} email={user.email} />
                    </Paper>
               </div>
               <div className="flex flex-col w-full md:w-3/4 lg:w-1/2 grow my-1 gap-1">
                    <Typography variant="h6">
                         Resumen de tu Actividad
                    </Typography>
                    <Paper elevation={2} className="flex items-start justify-start px-3 py-4 flex-col gap-4 border border-neutral-300">
                         <div className="flex grow w-full flex-row gap-1 px-5 justify-between items-center">
                              <Typography variant='button' color='textSecondary'>
                                   Última ruta realizada
                              </Typography>
                              <Typography variant="body1" color='info'>
                                   20-05-2025
                              </Typography>
                         </div>
                         <Divider  className="w-full" /> 
                         <div className="flex grow w-full flex-row gap-3 px-5 justify-between items-center">
                              <Typography variant='button' color='textSecondary'>
                                   Cantidad de Rutas Completadas
                              </Typography>
                              <Typography variant="body1" color='info'>
                                   20
                              </Typography>
                         </div>
                         <Divider className="w-full" />    
                         <div className="flex grow w-full flex-row gap-3 px-5 justify-between items-center">
                              <Typography variant='button' color='textSecondary'>
                                   Cantidad de Registros Completados
                              </Typography>
                              <Typography variant="body1" color='info'>
                                   2
                              </Typography>
                         </div>
                         <Divider className="w-full" />  
                         <div className="flex grow w-full flex-row gap-3 px-5 justify-between items-center">
                              <Typography variant='button' color='textSecondary'>
                                   Cantidad de Riesgos Completados
                              </Typography>
                              <Typography variant="body1" color='info'>
                                   10
                              </Typography>
                         </div> 
                         <Divider className="w-full" />  
                         <div className="flex grow w-full flex-row gap-3 px-5 justify-between items-center">
                              <Typography variant='button' color='textSecondary'>
                                   Fecha Creación de la cuenta
                              </Typography>
                              <Typography variant="body1" color='info'>
                                   20-03-2025
                              </Typography>
                         </div>                                                    
                    </Paper>
                    
               </div>
          </div>
    )
};
