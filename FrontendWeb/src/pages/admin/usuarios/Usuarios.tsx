import { Button, Divider, IconButton, InputBase, Paper, Typography } from "@mui/material";
import { IUser } from "../../../api/interfaces/IUser";
import CustomDrawer from "../../../component/CustomDrawer";
import DrawerListProfile from "../../../component/DrawerListProfile";
import TableUser from "../../../component/TableUser";
import SearchIcon from '@mui/icons-material/Search';
import DrawerList from "../../../component/DrawerList";
import ListIconHome from "../../../component/ListIconHome";
import { useState } from "react";
import DialogCreateUser from "../../../component/DialogCreateUser";


export default function Usuarios() {


    const [ users, setUsers ] = useState<IUser[]>(
    [{
        name: "Cristian",
        password: "123",
        phone: "+56 80123123",
        email: "cristian@gmail.com"
    }, 
    {
        name: "pepe",
        password: "123",
        phone: "+56 123123123",
        email: "pepe@gmail.com"
    },
    {
        name: "Antonio",
        password: "123",
        phone: "+56 80123123",
        email: "antonio@gmail.com"
    }])

    const [ prefix, setPrefix ] = useState<string>('')   
    const [ open, setOpen ] = useState(false) 

    return (
        <div className="flex flex-row grow">
            <div className="flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.25)] z-30">
                <CustomDrawer DrawerList={DrawerList}/>
                <Divider variant="middle"/>
                <ListIconHome />
                <div className="flex grow justify-center items-end py-4">
                    <a href="https://www.hogardecristo.cl/" target="_blank" rel="noopener noreferrer"><img src={"https://hcstore.org/wp-content/uploads/2020/01/cropped-hc-192x192.png"} width={48} height={48}/></a>
                </div>
            </div>
            <div className="flex grow flex-col self-stretch justify-start items-start justify-items-start gap-10 border border-neutral-300 rounded-xs p-5 bg-gray-100">
                <div>
                    <Typography variant="h5">Gestión de Usuarios</Typography>
                </div>
                <div className="flex flex-col gap-5 min-w-11/12">
                    <div className="flex flex-row gap-5">
                        <Paper
                            component="form"
                            className="px-0.5 py-1 flex items-center w-1/4"
                        >
                            <InputBase
                                fullWidth
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Busca un usuario por nombre"
                                inputProps={{ 'aria-label': 'Busca un usuario' }}
                                onChange={(e)=> {setPrefix(e.target.value)}}
                            />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" disabled>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                        <Button variant="contained" onClick={()=>{setOpen(true)}}>
                            Agregar Usuario
                        </Button>
                        <DialogCreateUser open={open} setOpen={setOpen} />
                    </div>
                    <TableUser users={users} setUsers={setUsers} prefixSearch={prefix}/>
                </div>
            </div>
        </div>
    )
};
