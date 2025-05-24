import { useMutation, useQuery } from "@tanstack/react-query"
import { RouteService, TRoute } from "../services/RouteService"


export class RouteAdapter {


    static usePostRouteMutation(body : TRoute, accessToken ?: string) {
        return useMutation({
            mutationFn : () => (RouteService.CreateRoute(body, accessToken))
        })
    }

    static useGetRoutes( accessToken ?: string )  {
        return useQuery({
            queryKey: ['routes'],
            queryFn: () => (RouteService.FindAllRoute( accessToken ))
        })
    }
}