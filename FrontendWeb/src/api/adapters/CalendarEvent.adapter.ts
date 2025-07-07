import { CalendarEvent } from "../models/Calendar"
import { UserService } from "../services/UserService"

export type TCalendarEventBackend = {
    _id: string
    title: string
    description: string
    date_start: string
    author_id: string
    time_start: string
    time_end: string
}

export type TCalendarEventCreateRequest = Omit<
    TCalendarEventBackend,
    '_id' | 'author_id'
>

export type TCalendarEventUpdateRequest = TCalendarEventBackend

export async function MapCalendarEventFromBackend(
    data: Partial<TCalendarEventBackend>
): Promise<CalendarEvent> {
    const event: Partial<CalendarEvent> = {
        id: data._id,
        title: data.title,
        description: data.description,
        DateStart: data.date_start ? new Date(data.date_start) : undefined,
        authorID: data.author_id,
        authorName: (await UserService.FindUserById(data.author_id as string)).name,
        timeStart: data.time_start,
        timeEnd: data.time_end,
    }
    Object.entries(event).forEach(([key, value]) => {
        if (value === undefined) {
            throw new Error(`Missing required field in CalendarEvent: ${key}`);
        }
    })
    return event as CalendarEvent
}

export function MapCalendarEventToCreateRequest(
    data: Omit<CalendarEvent, 'id' | 'authorID' | 'authorName'>
): TCalendarEventCreateRequest {
    return {
        title: data.title,
        description: data.description,
        date_start: data.DateStart.toISOString(),
        time_start: data.timeStart,
        time_end: data.timeEnd,
    }
}

export function MapCalendarEventToUpdateRequest(
    data: CalendarEvent
): TCalendarEventUpdateRequest {
    return {
        _id: data.id,
        title: data.title,
        description: data.description,
        date_start: data.DateStart.toISOString(),
        author_id: data.authorID,
        time_start: data.timeStart,
        time_end: data.timeEnd,
    }
}
