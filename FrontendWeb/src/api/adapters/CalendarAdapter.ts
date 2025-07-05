import { useMutation, useQuery } from "@tanstack/react-query"
import { CalendarService, TCalendarEvent } from "../services/CalendarService"



export class CalendarAdapter {

    static useGetEventCalendar( token ?: string) {
        return useQuery({
            queryKey : ['events'],
            queryFn : () => (CalendarService.GetEvents(token))
        })
    }

    static useAddEventCalendarMutation( token ?: string ) {
        return useMutation({
            mutationFn : ( event : Omit<TCalendarEvent, '_id' | 'authorId'>) => CalendarService.AddEvent(event, token),
            onError(error, variables, context) {
                console.log(error)
                console.log(context)
            },
        })
    }
    
}