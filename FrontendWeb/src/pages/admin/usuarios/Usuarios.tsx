import { Button, Typography } from "@mui/material";
import { IUser } from "../../../api/interfaces/IUser";
import CustomDrawer from "../../../component/CustomDrawer";
import DrawerListProfile from "../../../component/DrawerListProfile";
import TableUser from "../../../component/TableUser";
import User from "../../../component/TableUser";


export default function Usuarios() {


    const users : IUser[] = 
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
    }]


    return (
        <div className="flex flex-row grow justify-stretch items-start gap-5">
            <CustomDrawer DrawerList={DrawerListProfile} />
            <div className="flex grow flex-col self-stretch justify-start items-start justify-items-start gap-10 my-5 border border-neutral-300 rounded-xs p-5">
                <div>
                    <Typography variant="h5">Usuarios</Typography>
                </div>
                <div>
                    <Button>
                        Agregar Usuario
                    </Button>
                </div>
                <div className="flex min-w-11/12">
                    <TableUser users={users}/>
                </div>
            </div>
        </div>
    )
};
