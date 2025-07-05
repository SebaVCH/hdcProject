import { Button, CircularProgress, ClickAwayListener, Divider, Fade, Skeleton, useMediaQuery, useTheme } from "@mui/material"
import CustomDrawer from "../../component/CustomDrawer"
import { UserAdapter } from "../../api/adapters/UserAdapter"
import useSessionStore from "../../stores/useSessionStore"
import { TProfileRequest, TProfileResponse } from "../../api/services/UserService"
import { useEffect, useState } from "react"
import ListIconHome from "../../component/ListIconHome"
import DrawerList from "../../component/DrawerList"
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import TableProfile from "./TableProfile"
import { RouteAdapter } from "../../api/adapters/RouteAdapter"
import compareSort from "../../utils/compareDate"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Sidebar from "../../component/Sidebar"


export type TResumenActividad = {
    lastRouteDate ?: string 
    amountCompletedRoutes ?: number 
    amountCompletedRegister ?: number 
    amountRiskDone ?: number 
    registerDate ?: string  
}

export default function Profile() {

    const { accessToken } = useSessionStore()
    const [ user, setUser ] = useState<TProfileResponse>()
    const [ hasChange, setHasChange ] = useState(false)
    const [ resumenActividad, setResumenActividad ] = useState<TResumenActividad>({})
    
    const { data, isLoading, isSuccess, refetch } = UserAdapter.useGetProfile(accessToken, true)
    const useQueryRoutesByUser = RouteAdapter.useGetRouteByUserID(user?._id, accessToken, true)
    const mutation = UserAdapter.useUpdateProfile( accessToken as string)

    const clearStates = () => {
        setUser(undefined)
        setHasChange(false)
        setResumenActividad({})
    }


    useEffect(() => {
        refetch()
        return () => {
            clearStates()
        }
    }, [])



    useEffect(() => { // Calcular total rutas completadas & última fecha ruta
        if(useQueryRoutesByUser.data && user?._id) {
            const routes = useQueryRoutesByUser.data.sort((a, b) => compareSort(a, b))
            setResumenActividad({...resumenActividad, 
                amountCompletedRoutes : routes.length, 
                lastRouteDate : routes.length != 0 ? format(new Date(routes[0].completedAt as string), "d 'de' MMMM 'de' yyyy ", { locale: es}) : 'Sin realizar aún'
            })
        } 

    }, [useQueryRoutesByUser.data, user?._id])

    useEffect(() => {
        console.log("aca en cambio de dato")
        if(data) {
            setUser({...data})
        }
    }, [data])

    const onSubmitChanges = () => {
        if(mutation.isSuccess)
            return 
        mutation.mutate(user as TProfileRequest)
    }

    const handleClickAway = (e : MouseEvent | TouchEvent) => {
        if(hasChange && mutation.isIdle) {
            const save = confirm("Tienes cambios por hacer, ¿Deseas Guardar los cambios?")
            if(save) {
                onSubmitChanges()
            }
        }
    }

    const theme = useTheme();
    const computerDevice = useMediaQuery(theme.breakpoints.up('sm'));
    
    return (
        <div className={'flex grow ' + (computerDevice ? '' : 'flex-col')}>
            {computerDevice ? 
                <div className="flex z-20">
                    <Sidebar />
                </div>
                :
                <div className="flex flex-row bg-gray-100">
                    <CustomDrawer DrawerList={DrawerList} />
                    <p className="flex text-2xl text-center font-semibold p-3 items-center">Perfil</p>
                </div>
            }
            <ClickAwayListener onClickAway={(e) => {handleClickAway(e)}}>
                <div className="flex grow flex-col self-stretch justify-start items-start justify-items-start gap-10 border border-neutral-300 rounded-xs px-5 bg-gray-100">
                    <div className="flex flex-col justify-start items-start p-1 sm:p-2 md:p-4 lg:p-5 g-5 w-full h-full">
                        <div className="flex flex-row w-full justify-between items-center">
                            <div className="flex flex-col justify-start items-start">
                                <p  className="text-2xl font-semibold">{computerDevice ? 'Perfil' : ' '}</p>
                                <p className="">{computerDevice ? 'Administra tus datos personales y revisa tu actividad' : ' '}</p>
                            </div>
                            { hasChange ? 
                                <Fade in={hasChange} timeout={500}>
                                    <Button variant="outlined" color='success' onClick={onSubmitChanges}>
                                    {
                                    mutation.isIdle ? 
                                        "Guardar Cambios" : 
                                    mutation.isPending ? 
                                        <Fade in={true}><CircularProgress size={25} color="success"/></Fade> :
                                    mutation.isSuccess ? 
                                        <Fade in={true}><DoneIcon /></Fade> :
                                    mutation.isError ?
                                        <Fade in={true}><ErrorIcon /></Fade> :
                                        "Error desconocido"    
                                    }
                                    </Button>
                                </Fade>
                                :
                                <></>
                            }
                        </div>
                        { computerDevice ? <Divider className="my-4 w-full" /> : <></>}
                        { isLoading || !isSuccess || !user ? 
                            <div className="flex flex-col grow w-full h-full items-center justify-center gap-2">
                                <CircularProgress size={90} color="inherit" thickness={2}/>
                            </div>
                            : 
                            <TableProfile 
                                stateResumenActividad={[resumenActividad, setResumenActividad]} 
                                stateHasChanges={[hasChange, setHasChange]} 
                                stateUser={[user, setUser]}
                            /> 
                        }
                        </div>
                </div>
            </ClickAwayListener>
        </div>


    )
};
