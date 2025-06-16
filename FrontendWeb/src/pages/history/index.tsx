import { Divider, Paper } from "@mui/material";
import CustomDrawer from "../../component/CustomDrawer";
import DrawerList from "../../component/DrawerList";
import ListIconHome from "../../component/ListIconHome";
import Mapa from "../../component/Map/Mapa";
import { Position } from "../../utils/getCurrentLocation";
import { THelpPoint } from "../../api/services/HelpPointService";
import { useEffect, useState } from "react";
import ListHistory from "./ListHistory";
import { TRoute } from "../../api/services/RouteService";
import { RouteAdapter } from "../../api/adapters/RouteAdapter";
import useSessionStore from "../../stores/useSessionStore";
import { HelpPointAdapter } from "../../api/adapters/HelpPointAdapter";
import HandlerLocationHistory from "./handlerLocationHistory";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { es } from 'date-fns/locale';
import { UserAdapter } from "../../api/adapters/UserAdapter";
import DialogUpdateAtended from "../../component/Dialog/DialogUpdateAttended";
import compareSort from "../../utils/compareDate";
import { RouteStatus } from "../../api/interfaces/Enums";


function getFormatDate(a : Date, opt : string) {
    if(opt == 'Día') {
        return format(a, "d 'de' MMMM 'de' yyyy", { locale : es})
    } else if(opt == 'Semana') {
        const start = startOfWeek(a, { weekStartsOn : 1})
        const end  = endOfWeek(a, {weekStartsOn: 1})
        return `${format(start, "d 'de' MMMM", {locale : es})} al ${format(end, "d 'de' MMMM 'de' yyyy", {locale : es})}`
    } else {
        return format(a, "MMMM 'de' yyyy", { locale : es })
    }
}

export default function RouteHistory() {

    const { accessToken } = useSessionStore()
    const [ currentLocation, setCurrentLocation ] = useState<Position>({latitude : -29.959003986327698, longitude : -71.34176826076656})
    const [ mapRoutes, setMapRoutes ] = useState<Map<string, TRoute[]>>(new Map())
    const [ helpPoints, setHelpPoints ] = useState<THelpPoint[]>([])
    const [ HPLocation, setHPLocation ] = useState<number[]>([])
    const [ showLocation, setShowLocation ] = useState(false) 
    const [ opFecha, setOPFecha ] = useState('Día')

    const [ onlyUser, setOnlyUser ] = useState(false)
    const [ routes, setRoutes ] = useState<TRoute[]>([])

    const userID = UserAdapter.useGetProfile(accessToken).data?._id
    const useQueryRouteAll = RouteAdapter.useGetRoutes(accessToken)
    const useQueryRouteByUserID = RouteAdapter.useGetRouteByUserID( userID, accessToken)
    const useQueryHP= HelpPointAdapter.useGetHelpPoints(accessToken)


    useEffect(() => {
        if(useQueryHP.isSuccess) {
            setHelpPoints(useQueryHP.data.map((hp) => {hp.disabled = true; return hp;}))
        }
    }, [useQueryHP.isSuccess])

    useEffect(() => {
        if(onlyUser && userID) {
            useQueryRouteByUserID.refetch()
        } else if(!onlyUser){
            useQueryRouteAll.refetch()
        }
    }, [onlyUser, userID])

    useEffect(() => {
        const data = onlyUser ? useQueryRouteByUserID.data : useQueryRouteAll.data
        if(data) {
            setRoutes(data.sort(compareSort))
        }        
    }, [onlyUser, useQueryRouteAll.data, useQueryRouteByUserID.data])


    useEffect(() => {

        const map = routes.reduce<Map<string, TRoute[]>>((acc : Map<string, TRoute[]>, route) => {
            if(!route.completedAt || route.status != RouteStatus.Completed) return acc 
            const format = getFormatDate(new Date(route.completedAt), opFecha)
            if(!acc.has(format)) {
                acc.set(format, [])
            }
            acc.set(format, [...(acc.get(format) as TRoute[]), route])
            return acc
        }, new Map<string, TRoute[]>())
        setMapRoutes(map)

    }, [opFecha, routes])


    return (
        <div className="flex flex-grow">
            <div className="flex flex-col z-10">
                <CustomDrawer DrawerList={DrawerList}/>
                <Divider variant="middle"/>
                <ListIconHome />
                <div className="flex grow justify-center items-end py-4">
                    <a href="https://www.hogardecristo.cl/" target="_blank" rel="noopener noreferrer"><img src={"https://hcstore.org/wp-content/uploads/2020/01/cropped-hc-192x192.png"} width={48} height={48}/></a>
                </div>
            </div>

            <div className={`relative flex grow flex-col justify-between`}>
                <Mapa
                    stateCurrentLocation={[currentLocation, setCurrentLocation]}
                    helpPoints={helpPoints}
                    risks={[]}
                    enableTraceLine
                >
                    <HandlerLocationHistory stateShowLocation={[showLocation, setShowLocation]} stateLocation={[HPLocation, setHPLocation]} />
                </Mapa>
                <Paper variant="outlined" square className="absolute w-100 h-full">
                    <ListHistory 
                        stateOnlyUser={[onlyUser, setOnlyUser]}
                        stateOPFecha={[opFecha, setOPFecha]}
                        stateLocation={[HPLocation, setHPLocation]} 
                        stateShowLocation={[showLocation, setShowLocation]} 
                        stateRoutes={[mapRoutes, setMapRoutes]} 
                        stateHelpPoints={[helpPoints, setHelpPoints]}
                    />
                </Paper>
            </div>
            <DialogUpdateAtended /> {/** Context Provider */}
        </div>
    )
};

