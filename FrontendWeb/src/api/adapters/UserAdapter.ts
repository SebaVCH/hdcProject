import { useQuery } from "@tanstack/react-query";
import { UserService } from "../services/UserService";


export function useCheckLogin(email: string, password: string) {
    return useQuery({
        queryKey: ['checklogin'],
        queryFn: () => (UserService.CheckLogin(email, password))
    })
}
