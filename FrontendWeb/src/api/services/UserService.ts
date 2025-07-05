import { axiosInstance } from "./axiosInstance"
import { IUser } from "../interfaces/IUser"
import { sleep } from "../../utils/sleep"


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
    role ?: string
}


export type TProfileRequest = TProfileResponse | TUpdatePassword

export type TUpdatePassword = {
    newPassword ?: string
    confirmNewPassword ?: string
    currentPassword ?: string
}

export type TProfileUpdateResponse = TProfileResponse

export type TRegisterResponse = TLoginResponse


export type TFindAllUsers = IUser[]  


export class UserService {

    static async Login(email: string, password: string) : Promise<TLoginResponse> {
        const body :TLoginRequest  = { email: email, password: password}
        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/login`, body)
        console.log(data)
        return { token: data?.token, error: false }
    }

    static async Register(user : IUser) : Promise<TRegisterResponse> {

        const body : TRegisterRequest = {
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone
        }
        const { data } = await axiosInstance.post(`${import.meta.env.VITE_URL_BACKEND}/register`, body)
        const isTokenUn = (data?.token == undefined ? true : false)
        return { token: data?.token, error : isTokenUn, errorCode : "DATA_NOT_FOUND", errorMessage: "token is undefined"}

    }

    static async GetProfile(accessToken : string) : Promise<TProfileResponse> {
        try {
            const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/user/profile`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            return {
                _id: data?.message?._id,
                name: data?.message?.name,
                email: data?.message?.email,
                phone: data?.message?.phone,
                completedRoutes: data?.message?.completedRoutes,
                listRoutes: data?.message?.listRoutes,
                role : data?.message?.role
            };
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || 'Error al obtener el perfil');
        }
    }

    static async UpdateProfile(user : TProfileRequest, accessToken : string) : Promise<TProfileUpdateResponse> {
        
        const { data } = await axiosInstance.put(`${import.meta.env.VITE_URL_BACKEND}/user/update`, user, {
            headers: {
                Authorization : `Bearer ${accessToken}`
            }
        })
        return {
            _id : data?.message?._id,
            name : data?.message?.name,
            email : data?.message?.email,
            phone : data?.message?.phone,
            completedRoutes : data?.message?.completedRoutes,
            listRoutes : data?.message?.listRoutes
        } 
    }

    static async FindAllUsers(accessToken : string) : Promise<IUser[]> {
        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/user/`, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        })
        return (data?.message as any[]).map((value, _) => ({
            name : value?.name,
            email : value?.email,
            phone : value?.phone,
            password : value?.password
        }))
    }

    static async FindUserById(id : string, accessToken ?: string) : Promise<IUser> {
        const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_BACKEND}/user/${id}`, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        })
        return {
            name : data?.message?.name,
            email : data?.message?.email,
            phone : data?.message?.phone,
            password : ''
        }
    }
} 