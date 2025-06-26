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


    static async MarkAsReadNotices( unreadNotices: TNoticeResponse[], accessToken : string ) : Promise<boolean> {
        
        Promise.all(unreadNotices.map(async (notice , _ ) => (
            await axiosInstance.put(`${import.meta.env.VITE_URL_BACKEND}/${NoticeService.RESOURCE_NAME}/read/${notice._id}`, {}, {
                headers : {
                    Authorization : `Bearer ${accessToken}`
                }
            })
        )))
        return true
    }


    static async GetNoticesWithAuthorName( data : TNoticeResponse[], accessToken : string ) : Promise<TNoticeResponse[]> {

        const notices =  await Promise.all(data.map(async (notice, _) => {
        
            let name = 'Usuario Eliminado'
            try {
                name = (await UserService.FindUserById(notice.authorId as string, accessToken)).name
            } catch(e) {
                console.log(e)
            }
            
            return ({
                ...notice,
                authorName : name
            })
        }))
        return notices.sort(compareSortNotices)
    }


    static async GetReadNotices(accessToken ?: string) : Promise<TNoticeResponse[]> {
        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/${NoticeService.RESOURCE_NAME}/read`, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        })
        if( data?.message === null) return []

        const notices : TNoticeResponse[] = (data?.message as any[]).map((value, _) => ({
                _id : value?._id,
                type : value?.type,
                description : value?.description,
                createdAt : value?.created_at,
                authorId : value?.author_id,
        }))
        return await NoticeService.GetNoticesWithAuthorName( notices, accessToken as string)
    }

    static async GetUnReadNotices(accessToken ?: string) : Promise<TNoticeResponse[]> {
        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/${NoticeService.RESOURCE_NAME}/unread`, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        })
        if( data?.message === null) return []

        const notices : TNoticeResponse[] = (data?.message as any[]).map((value, _) => ({
                _id : value?._id,
                type : value?.type,
                description : value?.description,
                createdAt : value?.created_at,
                authorId : value?.author_id,
        }))
        return await NoticeService.GetNoticesWithAuthorName( notices, accessToken as string)
    }

    static async GetNotices(accessToken ?: string) : Promise<TNoticeResponse[]>{
        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/${NoticeService.RESOURCE_NAME}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }) 
        if( data?.message === null) return []

        const notices : TNoticeResponse[] = (data?.message as any[]).map((value, _) => ({
            _id : value?._id,
            type : value?.type,
            description : value?.description,
            createdAt : value?.created_at,
            authorId : value?.author_id,
        }))
        return await NoticeService.GetNoticesWithAuthorName( notices, accessToken as string)
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