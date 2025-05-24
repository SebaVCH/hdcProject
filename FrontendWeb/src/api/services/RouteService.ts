import { IRoute } from "../interfaces/IRoute"
import { axiosInstance } from "./axiosInstance"



export type TRoute = {
    _id : string
    description  : string 
    routeLeader : string 
    status : string 
}

export type TCreateRouteResponse = TRoute

export type TFindAllRoutes = TRoute[]


export class RouteService {

    static async CreateRoute( body : TRoute, token ?: string) : Promise<TRoute> {

        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/route`, body, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })

        return {
            _id : data?._id,
            description : data?.description,
            routeLeader : data?.routeLeader,
            status : data?.status
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
            routeLeader : value?.routeLeader,
            status : value?.status
        }))
    } 


}