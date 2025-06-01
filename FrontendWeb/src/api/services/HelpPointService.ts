import { sleep } from "../../utils/sleep"
import { axiosInstance } from "./axiosInstance"


export type ThelpedPerson = {
    age ?: number 
    name ?: string 
    gender ?: string 
    city ?: string
    nationality ?: string
}


export type THelpPoint = {
    _id ?: string 
    routeId : string 
    createdAt ?: string 
    coords : number[]
    helpedPerson ?: ThelpedPerson
}


export class HelpPointService {

    private static readonly RESOURCE_NAME = 'helping-point'


    static async CreateHelpPoint( helpPoint : THelpPoint, token ?: string ) : Promise<THelpPoint> {

        const body : any = {
            route_id : helpPoint._id,
            coords : helpPoint.coords,
            people_helped : {
                name : helpPoint.helpedPerson?.name,
                age : helpPoint.helpedPerson?.age,
                gender : helpPoint.helpedPerson?.gender,
                nationality : helpPoint.helpedPerson?.nationality,
                city : helpPoint.helpedPerson?.city
            }
        }
        await sleep(1000) // test

        const { data } =  await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}`,
            {...body, route_id : body.routeId}, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }) 
        return {
            _id : data?.message?._id,
            routeId : data?.message?.route_id,
            createdAt : data?.message?.date_register,
            coords : data?.message?.coords,
            helpedPerson : data?.message?.people_helped
        }
    }

    static async FindAllHelpPoint( token ?: string ) : Promise<THelpPoint[]> {

        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return (data?.message as any[]).map((value, _) => ({
            _id : value?._id,
            routeId : value?.routeId,
            createdAt : value?.date_register,
            coords : value?.coords,
            helpedPerson : value?.people_helped
        }))
    }

    static async UpdateHelpPoint( helpPoint : THelpPoint, token ?: string ) : Promise<THelpPoint> {

        const { data } = await axiosInstance.put(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}/${helpPoint._id}`, helpPoint, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return {
             _id : data?.message?._id,
            routeId : data?.message?.routeId,
            createdAt : data?.message?.date_register,
            coords : data?.message?.coords,
            helpedPerson : data?.message?.people_helped
        }
    }

    static async DeleteHelpPoint( helpPointiID : string, token ?: string) : Promise<string> {

        const { data } = await axiosInstance.delete(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}/${helpPointiID}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return data?.message
    }
}