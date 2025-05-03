import { useMutation, useQuery } from "@tanstack/react-query";
import { TProfileRequest, TRegisterRequest, UserService } from "../services/UserService";
import { IUser } from "../interfaces/IUser";
import useSessionStore from "../../stores/useSessionStore";
import Profile from "../../pages/profile";


const setToken = useSessionStore.getState().setAccessToken


export class UserAdapter {

    static useLoginMutation(email: string, password: string) {
        return useMutation({
            mutationFn: () => (UserService.Login(email, password)),
            onSuccess(data) {
                setToken((data.token as string))
            },
        })
    }

    static useRegisterMutation(user: IUser) {
        return useMutation({
            mutationFn: () => (UserService.Register(user))
        })
    }

    static useGetProfile(accessToken ?: string ) {
        return useQuery({
            queryKey : ['profile'],
            queryFn : () => (UserService.GetProfile(accessToken as string)),
            enabled : accessToken ? true : false
        })
    }

    static useUpdateProfile(user : TProfileRequest, accessToken : string) {
        return useMutation({
            mutationFn: () => (UserService.UpdateProfile(user, accessToken)),
        })
    }
}
