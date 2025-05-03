import { Button, Divider } from "@mui/material"
import CustomDrawer from "../../component/CustomDrawer"
import DrawerListProfile from "../../component/DrawerListProfile"
import TableProfile from "../../component/TableProfile"
import { UserAdapter } from "../../api/adapters/UserAdapter"
import useSessionStore from "../../stores/useSessionStore"
import { TLoginRequest, TLoginResponse, TProfileRequest, TProfileResponse } from "../../api/services/UserService"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Profile() {

    const navigate = useNavigate()
    const { accessToken, clearSession } = useSessionStore()
    const { isError, data, isLoading, isSuccess } = UserAdapter.useGetProfile(accessToken)
    const [ user, setUser ] = useState<TProfileResponse>()
    const { mutate, isPending } = UserAdapter.useUpdateProfile(user as TProfileRequest, accessToken as string)


    useEffect(() => {
        if(isError) {
            clearSession()
            navigate('/login')
        }
    }, [isError])

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

        <div className="flex flex-row justify-between items-start">
            <CustomDrawer DrawerList={DrawerListProfile} />
            <div className="flex grow ">
                <div className="flex flex-col grow justify-start items-start p-5 g-5 w-full">
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
