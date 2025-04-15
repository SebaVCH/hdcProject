import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/UserService";
import { IUser } from "../interfaces/IUser";
import useSessionStore from "../../stores/useSessionStore";


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




}
