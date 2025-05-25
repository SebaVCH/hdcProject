import { useMutation, useQuery } from "@tanstack/react-query";
import { RiskService, TRisk } from "../services/RiskService";


export class RiskAdapter {

    static usePostRiskMutation( body : TRisk, accessToken ?: string) {
        return useMutation({
            mutationFn: () => (RiskService.CreateRisk(body, accessToken))
        })
    }

    static useGetRisks( accessToken ?: string) {
        return useQuery({
            queryKey : ['risks'],
            queryFn: () => (RiskService.FindAll( accessToken ))
        })
    }

    static useUpdateRiskMutation( body : TRisk, accessToken ?: string ) {
        return useMutation({
            mutationFn : () => (RiskService.UpdateRisk(body, accessToken))
        })
    }

    static useDeleteRiskMutation( riskId : string, accessToken ?: string ) {
        return useMutation({
            mutationFn : () => (RiskService.DeleteRisk( riskId, accessToken ))
        })
    }
}