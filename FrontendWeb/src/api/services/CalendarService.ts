import { MapCalendarEventFromBackend, TCalendarEventBackend, TCalendarEventCreateRequest } from "../adapters/CalendarEvent.adapter"
import { CalendarEvent } from "../models/Calendar"
import { axiosInstance } from "./axiosInstance"


export class CalendarService {

    public static readonly RESOURCE_NAME = 'calendar-event'

    static async GetEvents() : Promise<CalendarEvent[]> {
        const { data } = await axiosInstance.get(`/${this.RESOURCE_NAME}`)
        return await Promise.all((data?.message as TCalendarEventBackend[]).map(async (event, _) => (
           await MapCalendarEventFromBackend(event as TCalendarEventBackend) 
        )))
    }

    static async AddEvent( event : TCalendarEventCreateRequest) : Promise<CalendarEvent> {
        const { data } = await axiosInstance.post(`/${this.RESOURCE_NAME}`, event)
        return await MapCalendarEventFromBackend(data?.message as TCalendarEventBackend)
    }

} 