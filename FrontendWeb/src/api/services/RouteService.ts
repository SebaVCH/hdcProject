
import { sleep } from "../../utils/sleep"
import { RouteStatus } from "../interfaces/Enums"
import { axiosInstance } from "./axiosInstance"
import { UserService } from "./UserService"



export type TRoute = {
    _id : string
    description  : string 
    routeLeader : string 
    status : string 
    createdAt ?: string
    inviteCode ?: string 
    completedAt ?: string
    title ?: string
    team ?: string[]
}

export type TCreateRouteResponse = TRoute

export type TFindAllRoutes = TRoute[]




export class RouteService {

    static async CreateRoute( body : TRoute, token ?: string) : Promise<TRoute> {

        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/route`, 
            {
                ...body, 
                date_created : (new Date()).toISOString(),
                route_leader : (await UserService.GetProfile(token as string))._id
            }, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })

        return {
            _id : data?.message?._id,
            description : data?.message?.description,
            routeLeader : data?.message?.route_leader,
            status : data?.message?.status,
            createdAt : data?.message?.date_created,
            inviteCode : data?.message?.invite_code
        }
    }

    static async FindRouteByID( routeId : string, token ?: string) : Promise<TRoute> {

        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/route/${routeId}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return {
            _id : data?.message?._id,
            description : data?.message?.description,
            routeLeader : data?.message?.route_leader,
            status : data?.message?.status,
            createdAt : data?.message?.date_created,
            inviteCode : data?.message?.invite_code,
        }
    }

    static async FindAllRoute( token ?: string ) : Promise<TRoute[]> {

        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/route`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return (data?.message as any[]).map((value, _) => ({
            _id : value?._id,
            description : value?.description,
            routeLeader : value?.route_leader,
            status : value?.status,
            inviteCode : value?.invite_code,
            completedAt : (value?.date_finished),
            title : value?.title,
            team : value?.team ?? []
        }))
    } 

    static async UpdateRoute( routeId : string, routeBody ?: TRoute,  token ?: string) : Promise<TRoute> {

        await sleep(1000)

        if(routeBody) {
            routeBody.status = RouteStatus.Completed
        } else {
            console.log("body es nulo... en updateroute")
            throw Error('body es null')
        }

        const { data } = await axiosInstance.put(`${import.meta.env.VITE_URL_BACKEND}/route/${routeId}`, routeBody, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })

        return { 
            _id : data?.message?._id,
            description : data?.message?.description,
            routeLeader : data?.message?.route_leader,
            status : data?.message?.status,
            createdAt : data?.message?.date_created,
            inviteCode : data?.message?.invite_code
        }
    }

    static async GetRoutesByUserId( userId : string, token ?: string) : Promise<TRoute[]>{

        const routes = await RouteService.FindAllRoute(token)

        return routes.reduce<TRoute[]>((call : TRoute[], route) => {

            if(route.routeLeader === userId || (route.team as string[]).includes(userId) ) {
                call.push(route)
            }
            return call
        }, [])
    }

    static async JoinRoute( inviteCode : string, accessToken ?: string ) : Promise<TRoute> {

        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/route/join/${inviteCode}`, {}, {
            headers: {
                Authorization : `Bearer ${accessToken}`
            }
        })

        return {
            _id : data?.message?._id,
            description : data?.message?.description,
            routeLeader : data?.message?.route_leader,
            status : data?.message?.status,
            createdAt : data?.message?.date_created,
            inviteCode : data?.message?.invite_code,
        }
        
    }

    static async FinishRoute( routeId : string, accessToken ?: string) : Promise<string> {
        const { data } = await axiosInstance.patch(`${import.meta.env.VITE_URL_BACKEND}/route/${routeId}`, {}, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        })
        return data?.message
    }


}