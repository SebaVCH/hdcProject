import { Button, Divider } from "@mui/material"
import CustomDrawer from "../../component/CustomDrawer"
import DrawerListProfile from "../../component/DrawerListProfile"
import TableProfile from "../../component/TableProfile"
import { UserAdapter } from "../../api/adapters/UserAdapter"
import useSessionStore from "../../stores/useSessionStore"
import { TLoginRequest, TLoginResponse, TProfileRequest, TProfileResponse } from "../../api/services/UserService"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ListIconHome from "../../component/ListIconHome"
import DrawerList from "../../component/DrawerList"


export default function Profile() {

    const navigate = useNavigate()
    const { accessToken } = useSessionStore()
    const { data, isLoading, isSuccess } = UserAdapter.useGetProfile(accessToken)
    const [ user, setUser ] = useState<TProfileResponse>()
    const { mutate, isPending } = UserAdapter.useUpdateProfile(user as TProfileRequest, accessToken as string)



    useEffect(() => {
        if(!accessToken) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        if(data) {
            setUser({...data})
        }
    }, [data])

    const onSubmitChanges = () => {
        mutate()
    }

    const onCancelChanges = () => {
        setUser(data)
    }

    
    return (
        <div className="flex flex-grow">
            <div className="flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.25)] z-30">
                <CustomDrawer DrawerList={DrawerList}/>
                <Divider variant="middle"/>
                <ListIconHome />
                <div className="flex grow justify-center items-end py-4">
                    <a href="https://www.hogardecristo.cl/" target="_blank" rel="noopener noreferrer"><img src={"https://hcstore.org/wp-content/uploads/2020/01/cropped-hc-192x192.png"} width={48} height={48}/></a>
                </div>
            </div>
            <div className="flex grow flex-col self-stretch justify-start items-start justify-items-start gap-10 border border-neutral-300 rounded-xs p-5 bg-gray-100">
                <div className="flex flex-col justify-start items-start p-5 g-5 w-full">
                    <p  className="text-2xl font-semibold">Perfil</p>
                    <Divider className="my-4 w-full" />
                    { isLoading || !isSuccess || !user ? <p>Cargando...</p>  : <TableProfile user={user as TProfileResponse} setUser = {setUser}/> }
                    <div className="flex flex-row gap-2">
                        <Button
                            onClick={onSubmitChanges}
                        >
                            Guardar
                        </Button>
                        <Button
                            onClick={onCancelChanges}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
        </div>


    )
};
