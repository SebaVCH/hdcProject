
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
}

export type TCreateRouteResponse = TRoute

export type TFindAllRoutes = TRoute[]

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



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
            inviteCode : data?.message?.invite_code
        }
    }

    static async FindAllRoute( token ?: string ) : Promise<TRoute[]> {

        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/route`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })

        return (data?.routes as any[]).map((value, _) => ({
            _id : value?._id,
            description : value?.description,
            routeLeader : value?.route_leader,
            status : value?.status,
            inviteCode : data?.message?.invite_code
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


}