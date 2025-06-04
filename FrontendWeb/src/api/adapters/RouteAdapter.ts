import { useMutation, useQuery } from "@tanstack/react-query"
import { RouteService, TRoute } from "../services/RouteService"


export class RouteAdapter {


    static usePostRouteMutation(body : TRoute, accessToken ?: string) {
        return useMutation({
            mutationFn : () => (RouteService.CreateRoute(body, accessToken))
        })
    }

    static useGetRoutes( accessToken ?: string, enabled ?: boolean )  {
        return useQuery({
            queryKey: ['routes'],
            queryFn: () => (RouteService.FindAllRoute( accessToken )),
            enabled : enabled
        })
    }

    static useGetRouteByID( routeId : string, accessToken ?: string, enabled ?: boolean ) {
        return useQuery({
            queryKey : ['route'],
            queryFn : () => (RouteService.FindRouteByID(routeId, accessToken)),
            enabled : enabled
        })
    }

    static useUpdateRoute( routeId : string, body ?: TRoute, accessToken ?: string ) {
        return useMutation({
            mutationFn : () => (RouteService.UpdateRoute(routeId, body, accessToken ))
        })
    } 

    static useGetRouteByUserID(userId ?: string, accessToken ?: string) {
        return useQuery({
            queryKey : ['routeByUserID', userId],
            queryFn : () => (RouteService.GetRoutesByUserId(userId as string, accessToken )),
            enabled : false
            
        })
    }

}