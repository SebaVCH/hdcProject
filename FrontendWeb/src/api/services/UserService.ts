import { useQuery } from "@tanstack/react-query"



export type TUser = {
    email: string
    password: string 
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


export async function fetchUser() {
    
    await sleep(2000)

    const data : TUser = {
        email: "Cristian",
        password: "123"
    }
    return data
}


export function useFetchUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: fetchUser
    })
}