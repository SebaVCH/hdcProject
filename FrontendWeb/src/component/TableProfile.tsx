import { Button, TextField } from "@mui/material";
import { TProfileResponse } from "../api/services/UserService";
import { useState } from "react";
import DialogChangePassword from "./Dialog/DialogChangePassword";



export default function TableProfile({ user, setUser } : { user : TProfileResponse, setUser : (arg0: TProfileResponse) => void }) {

     const [ open, setOpen ] = useState(false)

     const onChangeName = (name : string) => {
          setUser({ ...user, name }) 
     }

     const onChangePhone = (phone : string) => {
          setUser({ ...user, phone })
     }

     return (
          <div className="flex grow w-full">
               <div className="flex w-full px-2 flex-col py-5 my-8 gap-8 border border-neutral-300">
                    <TextField 
                         label="Nombre"
                         id="outlined-required"
                         value={user.name}
                         size="small"
                         onChange={(event) => {onChangeName(event.target.value)}}
                    />
                    <TextField 
                         label="Teléfono"
                         id="outlined-required"
                         value={user.phone ? user.phone : "" }
                         size="small"
                         onChange={((event) => (onChangePhone(event.target.value)))}
                    />
                    <TextField 
                         label="Email"
                         id="outlined-required"
                         value={user.email}
                         disabled
                         size="small"
                    />
                    <Button onClick={() => {setOpen(true)}}>
                         Cambiar Contraseña
                    </Button>
                    <DialogChangePassword open={open} setOpen={setOpen} email={user.email} />
               </div>
               <div className="flex flex-col px-2 my-8 gap-5 w-full">
                    <p>General: Mostrar el porcentaje de usuarios que ha registrado con respecto al total</p>
                    <p>General: Mostrar el porcentaje de participaciones que ha tenido en rutas con respecto al total</p>
                    <p>General: Mostrar la cantidad de alertas que ha hecho a la comunidad</p>
                    <p>General: Última ruta hecha por el Usuario</p>
                    <p>General: Fecha de Creación de la Cuenta</p>
               </div>
          </div>
    )
};
