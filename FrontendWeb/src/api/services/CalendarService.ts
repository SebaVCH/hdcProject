import { axiosInstance } from "./axiosInstance"


export type TCalendarEvent = {
    _id : string
    authorId: string
    title : string 
    description : string 
    dateStart : string 
    timeStart ?: string
    timeEnd ?: string     
}

export class CalendarService {

    public static readonly RESOURCE_NAME = 'calendar-event'


    static async GetEvents( token ?: string) : Promise<TCalendarEvent[]> {

        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })

        return (data as any[]).map((value, _) => ({
            _id : value?._id,
            authorId : value?.author_id,
            title : value?.title,
            description : value?.description,
            dateStart : value?.date_start,
            timeStart : value?.time_start,
            timeEnd : value?.time_end
        }))
    }

    static async AddEvent( event : Omit<TCalendarEvent, '_id' | 'authorId'>, token ?: string) : Promise<TCalendarEvent> {


        const body = {
            ...event,
            date_start : new Date(event.dateStart)
        }

        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/${this.RESOURCE_NAME}`, body, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return {
            ...event, 
            _id : data?.message?._id,
            authorId : data?.message?.author_id
        }
    }

    


} 