import compareSort, { compareSortNotices } from "../../utils/compareDate"
import { sleep } from "../../utils/sleep"
import { axiosInstance } from "./axiosInstance"
import { UserService } from "./UserService"


export type TNoticeResponse = {
    _id ?: string 
    description ?: string
    createdAt ?: string 
    authorId ?: string
    authorName ?: string
} 

export type TNoticeDeleteResponse = {
    message : string 
}

export type TNotice = TNoticeResponse


type TNoticeRequest = {
    description : string,
    author_id : string
}

export class NoticeService {

    private static readonly RESOURCE_NAME = 'notification'

    static async GetNotices(accessToken ?: string) : Promise<TNoticeResponse[]>{
        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/${NoticeService.RESOURCE_NAME}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }) 

        await sleep(1)

        const notices =  await Promise.all((data?.message as any[]).map(async (value, _) => {
            
            let name = 'Usuario Eliminado'

            try {
                name = (await UserService.FindUserById(value?.author_id, accessToken)).name
            } catch(e) {
                console.log(e)
            }
            
            return ({
                _id : value?._id,
                type : value?.type,
                description : value?.description,
                createdAt : value?.created_at,
                authorId : value?.author_id,
                authorName : name,
            })
        }))

        return notices.sort(compareSortNotices)

    }

    static async PostNotice( body : TNoticeRequest, accessToken ?: string ) : Promise<TNoticeResponse> {
        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/${NoticeService.RESOURCE_NAME}`, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log("En Post Notice" ,data)
        return {
            _id : data?.Aviso?._id,
            description : data?.Aviso?.description,
            createdAt : data?.Aviso?.created_at,
            authorId : data?.Aviso?.author_id,
        }
    }


    static async DeleteNotice( _id : string, accessToken ?: string ) : Promise<TNoticeDeleteResponse> {
        const { data } = await axiosInstance.delete(`${import.meta.env.VITE_URL_BACKEND}/${NoticeService.RESOURCE_NAME}/${_id}`, {
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
        const { data } = await axiosInstance.put(`${import.meta.env.VITE_URL_BACKEND}/${NoticeService.RESOURCE_NAME}/${body._id}`, body, {
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log("En update Notice: ", data)
        return {
            _id : data?.message?._id,
            description : data?.message?.description,
            createdAt : data?.message?.created_at,
            authorId : data?.message?.author_id,
        }
    } 

}