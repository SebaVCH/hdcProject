import { useMutation, useQuery } from "@tanstack/react-query"
import { MapCalendarEventToCreateRequest } from "../adapters/CalendarEvent.adapter"
import { CalendarService } from "../services/CalendarService"
import { CalendarEvent } from "../models/Calendar"





export function useCalendarEvents() {
    return useQuery({
        queryKey : ['events'],
        queryFn : () => (CalendarService.GetEvents())
    })
}

export function useCreateCalendarEvent() {
    return useMutation({
        mutationFn : ( event : Omit<CalendarEvent, 'id' | 'authorID' | 'authorName'>) => CalendarService.AddEvent(MapCalendarEventToCreateRequest(event)),
        onError(error, variables, context) {
            console.log(error)
            console.log(context)
        },
    })
}
    
