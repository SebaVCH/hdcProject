import { axiosInstance } from "./axiosInstance"


export type TRisk = {
    _id ?: string 
    coords : number[]
    createdAt : string
    description : string 
}

export class RiskService {

    private static readonly RESOURCE_NAME = 'risk'

    static async CreateRisk( body : TRisk, token ?: string ) : Promise<TRisk> {

        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}`, body, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return {
            _id : data?.message?._id,
            coords : data?.message?.coords,
            createdAt : data?.message?.date_register,
            description : data?.message?.description
        }
    }

    static async FindAll( token ?: string ) : Promise<TRisk[]> {

        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return (data?.message as any[]).map((risk, _) => ({
            _id : risk?._id,
            coords : risk?.coords,
            createdAt : risk?.date_register,
            description : risk?.description
        }))
    }

    static async UpdateRisk( body: TRisk, token ?: string) : Promise<TRisk> {

        const { data } = await axiosInstance.put(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}/${body._id}`, body, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return {
            _id : data?.message?._id,
            coords : data?.message?.coords,
            createdAt : data?.message?.date_register,
            description : data?.message?.description
        }
    }

    static async DeleteRisk( riskId : string, token ?: string) : Promise<string> {

        const { data } = await axiosInstance.delete(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}/${riskId}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return data?.message
    }
} 