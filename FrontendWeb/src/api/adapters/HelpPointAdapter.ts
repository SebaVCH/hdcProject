import { useMutation, useQuery } from "@tanstack/react-query"
import { HelpPointService, THelpPoint } from "../services/HelpPointService"

export class HelpPointAdapter {


    static usePostHeplPointMutation(accessToken ?: string) {
        return useMutation({
            mutationFn : (body : THelpPoint) => (HelpPointService.CreateHelpPoint(body, accessToken))
        })
    }

    static useGetHelpPoints( accessToken ?: string )  {
        return useQuery({
            queryKey: ['help-points'],
            queryFn: () => (HelpPointService.FindAllHelpPoint( accessToken ))
        })
    }

    static useUpdateHelpPointMutation( accessToken ?: string ) {
        return useMutation({
            mutationFn : (body : THelpPoint) => (HelpPointService.UpdateHelpPoint(body, accessToken))
        })
    }

    static useDeleteHelpPointMutation( accessToken ?: string ) {
        return useMutation({
            mutationFn : (helpPointID : string) => (HelpPointService.DeleteHelpPoint(helpPointID, accessToken))
        })
    }
}