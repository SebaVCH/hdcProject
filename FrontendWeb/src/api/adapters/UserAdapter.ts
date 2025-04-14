import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/UserService";
import { IUser } from "../interfaces/IUser";



export class UserAdapter {

    static useLoginMutation(email: string, password: string) {
        return useMutation({
            mutationFn: () => (UserService.Login(email, password))
        })
    }

    static useRegisterMutation(user: IUser) {
        return useMutation({
            mutationFn: () => (UserService.Register(user))
        })
    }




}
