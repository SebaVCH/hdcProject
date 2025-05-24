import { useMutation, useQuery } from "@tanstack/react-query"
import { HelpPointService, THelpPoint } from "../services/HelpPointService"

export class HelpPointAdapter {


    static usePostHeplPointMutation(body : THelpPoint, accessToken ?: string) {
        return useMutation({
            mutationFn : () => (HelpPointService.CreateHelpPoint(body, accessToken))
        })
    }

    static useGetHelpPoints( accessToken ?: string )  {
        return useQuery({
            queryKey: ['help-points'],
            queryFn: () => (HelpPointService.FindAllHelpPoint( accessToken ))
        })
    }
}