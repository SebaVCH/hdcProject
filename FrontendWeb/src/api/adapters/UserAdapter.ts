import { useMutation, useQuery } from "@tanstack/react-query";
import { TProfileRequest, UserService } from "../services/UserService";
import { IUser } from "../interfaces/IUser";
import useSessionStore from "../../stores/useSessionStore";
import { UserRegister } from "../../component/Dialog/DialogCreateUser";


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

    static useRegisterMutation(user: UserRegister) {
        return useMutation({
            mutationFn: () => (UserService.Register({
                name: user.firstName + ' ' + user.lastName,
                email: user.email,
                phone: user.phone,
                password: Math.random().toString(36).slice(-8)
            }))
        })
    }

    static useGetProfile(accessToken ?: string ) {
        return useQuery({
            queryKey : ['profile'],
            queryFn : () => (UserService.GetProfile(accessToken as string)),
            enabled : accessToken ? true : false,
            
        })
    }

    static useFindAllUsers(accessToken ?: string) {
        return useQuery({
            queryKey : ['findAll'],
            queryFn : () => (UserService.FindAllUsers(accessToken as string)),
            enabled : accessToken ? true : false,
        })
    }

    static useUpdateProfile(accessToken : string) {
        return useMutation({
            mutationFn: (user : TProfileRequest) => (UserService.UpdateProfile(user, accessToken)),

        })
    }

    static useFindUserById( id : string, accessToken ?: string) {
        return useQuery({
            queryKey : ['findUserId'],
            queryFn : () => (UserService.FindUserById(id, accessToken)),
        })
    }
}
