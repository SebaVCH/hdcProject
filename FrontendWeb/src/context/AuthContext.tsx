import React, { useEffect } from 'react';
import { createContext, useState, useContext } from 'react';
import useSessionStore from '../stores/useSessionStore';
import { useProfile } from '../api/hooks/UserHooks';


type AuthContextProps = {
    role : string 
    loading : boolean
}


export const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children } : { children : React.ReactNode}) {

    const [ role, setRole ] = useState('')
 
    const { accessToken } = useSessionStore()
    const { isLoading, data, isSuccess, isError, error,  } = useProfile()
    
    useEffect(() => {
        if(isSuccess) {
            setRole(data.role as string)

        }
        if(isError) {
            throw Error((error as any).error)
        }
    }, [isSuccess])

    return (
        <AuthContext.Provider value={{role, loading : isLoading}}>
        {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const state  = useContext(AuthContext)
    if(!state) {
        throw new Error("useAuth has to be used within AuthProvider");
    }
    return state
}
