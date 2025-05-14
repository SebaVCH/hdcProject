import { axiosInstance } from "./axiosInstance"


export type TNoticeResponse = {
    _id ?: string 
    type : string 
    description : string
    createdAt ?: string 
    author ?: string
} 

export type TNoticeDeleteResponse = {
    message : string 
}

export type TNotice = TNoticeResponse

export class NoticeService {

    static async GetNotices(accessToken ?: string) : Promise<TNoticeResponse[]>{
        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/alert`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }) 
        console.log("Get notices: ", data)
        return (data?.alerts as any[]).map((value, _) => ({
            _id : value?._id,
            type : value?.type,
            description : value?.description,
            createdAt : value?.created_at
        }))
    }

    static async PostNotice( body : TNotice, accessToken ?: string ) : Promise<TNoticeResponse> {
        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/alert`, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log("En Post Notice" ,data)
        return {
            _id : data?.alert?._id,
            type : data?.alert?.type,
            description : data?.alert?.description,
            createdAt : data?.alert?.created_at
        }
    }


    static async DeleteNotice( _id : string, accessToken ?: string ) : Promise<TNoticeDeleteResponse> {
        const { data } = await axiosInstance.delete(`${import.meta.env.VITE_URL_BACKEND}/alert/${_id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log("En delete Notice: ", data)
        return {
            message : data?.message
        }
    }

    static async UpdateNotice( body : TNotice, accessToken ?: string ) : Promise<TNoticeResponse> {
        const { data } = await axiosInstance.put(`${import.meta.env.VITE_URL_BACKEND}/alert/${body._id}`, body, {
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log("En update Notice: ", data)
        return {
            _id : data?.alert?._id,
            type : data?.alert?.type,
            description : data?.alert?.description,
            createdAt : data?.alert?.created_at
        }
    } 

}