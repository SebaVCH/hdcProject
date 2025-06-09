import { Button, Divider, IconButton, InputBase, Paper, Tooltip, Typography } from "@mui/material";
import { IUser } from "../../../api/interfaces/IUser";
import CustomDrawer from "../../../component/CustomDrawer";
import TableUser from "../../../component/TableUser";
import SearchIcon from '@mui/icons-material/Search';
import DrawerList from "../../../component/DrawerList";
import ListIconHome from "../../../component/ListIconHome";
import { useEffect, useState } from "react";
import { UserAdapter } from "../../../api/adapters/UserAdapter";
import useSessionStore from "../../../stores/useSessionStore";
import DialogCreateUser from "../../../component/Dialog/DialogCreateUser";
import FileDownloadIcon from '@mui/icons-material/FileDownload';


export default function Usuarios() {


    const [ users, setUsers ] = useState<IUser[]>([])
    const { accessToken } = useSessionStore()
    const {isError, isSuccess, data} = UserAdapter.useFindAllUsers(accessToken)





    useEffect(() => {
        console.log(data)
        if(data) {
            setUsers(data)
        }
    }, [data])


    const [ prefix, setPrefix ] = useState<string>('')   
    const [ open, setOpen ] = useState(false) 

    const handleExport = async () => {
        fetch(`${import.meta.env.VITE_URL_BACKEND}/export-data/people-helped`, {
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            }
        })
        .then((response) => response.blob())
        .then((blob) => {
            var _url = window.URL.createObjectURL(blob)
            const a = document.createElement('a');
            a.href = _url;
            a.download = 'personas_ayudadas.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(_url);
        }).catch((err) => {
            console.log(err)
        })
    }


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

                        <Tooltip title={'exportar datos'}>
                            <Button color='info' variant="contained" onClick={handleExport}>
                                <FileDownloadIcon fontSize="large" />
                            </Button>    
                        </Tooltip>
  
                        <DialogCreateUser open={open} setOpen={setOpen} />
                    </div>
                    { isSuccess ? <TableUser users={users} setUsers={setUsers} prefixSearch={prefix}/> : <p>Cargando...</p>}
                </div>
            </div>
        </div>
    )
};
