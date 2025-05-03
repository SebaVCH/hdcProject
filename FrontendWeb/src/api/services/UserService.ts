
import axios, { Axios, AxiosError } from "axios"
import { axiosInstance } from "./axiosInstance"
import { IUser } from "../interfaces/IUser"


export type TLoginResponse = {
    token?: string
    errorMessage?: string 
    errorCode?: string
    error: boolean 
}
export type TLoginRequest = {
    email: string 
    password: string
}
export type TRegisterRequest = {
    name: string 
    email: string
    password: string 
    phone: string
}

export type TProfileResponse = {
    _id : string
    name : string
    email : string 
    phone : string 
    completedRoutes : string 
    listRoutes : string[]
}


export type TProfileRequest = TProfileResponse 

export type TProfileUpdateResponse = TProfileResponse

export type TRegisterResponse = TLoginResponse


export class UserService {

    static async Login(email: string, password: string) : Promise<TLoginResponse> {
        const body :TLoginRequest  = { email: email, password: password}
        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/login`, body)
        return { token: data?.token, error: false }
    }

    static async Register(user : IUser) : Promise<TRegisterResponse> {

        const body : TRegisterRequest = {
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone
        }

        try {
            const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/register`, body)
            const isTokenUn = (data?.token == undefined ? true : false)
            return { token: data?.token, error : isTokenUn, errorCode : "DATA_NOT_FOUND", errorMessage: "token is undefined"}
        } catch (err) {
            const error = err as Error | AxiosError 
            if(!axios.isAxiosError(error)) return { errorMessage: error.message, error: true }

            const axiosError = err as AxiosError
            return {
                errorMessage: (axiosError.request ? 'Cannot connect with the server' : '') + axiosError.message,
                errorCode: axiosError.code,
                error: true
            }
        }
    }

    static async GetProfile(accessToken : string) : Promise<TProfileResponse> {

        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/user/profile`, {
            headers: {
                Authorization : `Bearer ${accessToken}`
            }
        })
        return {
            _id : data?.user?._id,
            name : data?.user?.name,
            email : data?.user?.email,
            phone : data?.user?.phone,
            completedRoutes : data?.user?.completedRoutes,
            listRoutes : data?.user?.listRoutes
        }
    }

    static async UpdateProfile(user : TProfileRequest, accessToken : string) : Promise<TProfileUpdateResponse> {
        
        const { data } = await axiosInstance.put(`${import.meta.env.VITE_URL_BACKEND}/user/update`, user, {
            headers: {
                Authorization : `Bearer ${accessToken}`
            }
        })
        return {
            _id : data?.user?._id,
            name : data?.user?.name,
            email : data?.user?.email,
            phone : data?.user?.phone,
            completedRoutes : data?.user?.completedRoutes,
            listRoutes : data?.user?.listRoutes
        } 
    }

    




} 