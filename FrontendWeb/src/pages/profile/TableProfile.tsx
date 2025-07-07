import { Button, Divider, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import DialogChangePassword from "../../component/Dialog/DialogChangePassword";
import { TResumenActividad } from ".";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import RouteIcon from '@mui/icons-material/Route';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ResumeItem from "./ResumeItem";
import { useAuth } from "../../context/AuthContext";
import { IUser } from "../../api/models/User";

type TableProfileProps = {
     stateResumenActividad : [ TResumenActividad, React.Dispatch<React.SetStateAction<TResumenActividad>> ]
     stateUser : [IUser , React.Dispatch<React.SetStateAction<IUser | undefined>> ]
     stateHasChanges : [ boolean, React.Dispatch<React.SetStateAction<boolean>>]
} 

export default function TableProfile({ stateUser, stateHasChanges, stateResumenActividad } : TableProfileProps ) {

     const { role, loading } = useAuth()
     const [ open, setOpen ] = useState(false)
     const [ user, setUser ] = stateUser
     const [ resumen, setResumen ] = stateResumenActividad
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
                    <Paper elevation={2} className="flex items-center justify-center p-2 sm:p-2 md:p-3 lg:p-5 flex-col gap-3 border border-neutral-300">
                         <TextField 
                              variant="standard"
                              margin="dense"
                              fullWidth
                              label="Nombre"
                              id="name-input"
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
                              id="phone-input"
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
                              id="email-input"
                              value={user.email}
                              disabled
                              size="small"
                         />
                         <TextField
                              fullWidth
                              margin="dense"
                              variant="standard"
                              label='Rol'
                              id="role-input"
                              value={role}
                              disabled
                              size="small"
                         />
                         <div className="flex flex-col w-full justify-start items-start gap-1">
                              <TextField
                                   fullWidth
                                   margin="dense"
                                   variant="standard"
                                   label="Contraseña"
                                   id="password-input"
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
                    <Paper elevation={2} className="flex items-start justify-start py-4 flex-col gap-4 border border-neutral-300">
                         <ResumeItem 
                              icon={<EventAvailableIcon color="action" />} 
                              activityDescription={<Typography variant="button" color="textSecondary"> última Ruta realizada</Typography>}
                              activityValue={<Typography variant="button" color="info">{resumen.lastRouteDate}</Typography>}
                         />
                         <Divider className="w-full" />
                         <ResumeItem
                              icon={<RouteIcon color='secondary' />}
                              activityDescription={<Typography variant='button' color='textSecondary'>Cantidad de Rutas Completadas</Typography>}
                              activityValue={<Typography variant="body1" color='info'>{resumen.amountCompletedRoutes}</Typography>}
                         />
                         <Divider  className="w-full" /> 
                         <ResumeItem
                              icon={<QuestionAnswerIcon color="info" />}
                              activityDescription={<Typography variant='button' color='textSecondary'>Cantidad de Registros Completados</Typography>}
                              activityValue={<Typography variant="body1" color='info'>2</Typography>}
                         />  
                         <Divider className="w-full" />   
                         <ResumeItem
                              icon={<HowToRegIcon color="success" />}
                              activityDescription={<Typography variant='button' color='textSecondary'>Fecha Creación de la cuenta</Typography>}
                              activityValue={<Typography variant="body1" color='info'>20-03-2025</Typography>}
                         />                                              
                    </Paper>
               </div>
          </div>
    )
};
