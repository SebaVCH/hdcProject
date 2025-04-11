
import axios, { AxiosError } from "axios"
import { axiosInstance } from "./axiosInstance"


export type TLoginResponse = {
    token?: string
    errorMessage?: string 
    errorCode?: number
    error: boolean 
}


export type TLoginRequest = {
    email: string 
    password: string
}

export class UserService {

    static async CheckLogin(email: string, password: string) : Promise<TLoginResponse> {

        const body :TLoginRequest  = {
            email: email,
            password: password
        }

        try {
            const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/login`, body)
            return { token: data?.token, error: false }

        } catch(err : any) {

            const error = err as Error | AxiosError

            if(axios.isAxiosError(error)) {
                return {
                    errorMessage: error.message,
                    errorCode: -1 ,
                    error: true

                }
            } 

            const axiosError = err as AxiosError
            console.log(axiosError)

            return {
                errorMessage: (axiosError.request ? 'Cannot connect with the server' : '') + axiosError.message,
                errorCode: Number(axiosError.code),
                error: true
            }
        }
    }




} 