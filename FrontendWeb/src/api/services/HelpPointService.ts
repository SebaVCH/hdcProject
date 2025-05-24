import { axiosInstance } from "./axiosInstance"


export type THelpPoint = {
    _id : string 
    routeId : string 
    description : string 
    createdAt : string 
    coords : number[]
}


export class HelpPointService {


    static async CreateHelpPoint( body : THelpPoint, token ?: string ) : Promise<THelpPoint> {

        const { data } =  await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/helping-point`, body, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }) 
        return {
            _id : data?._id,
            routeId : data?.routeId,
            description : data?.description,
            createdAt : data?.createdAt,
            coords : data?.coords
        }
    }

    static async FindAllHelpPoint( token ?: string ) : Promise<THelpPoint[]> {

        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/helping-point`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return (data as any[]).map((value, _) => ({
            _id : value?._id,
            routeId : value?.routeId,
            description : value?.description,
            createdAt : value?.createdAt,
            coords : data?.coords
        }))
    }
}