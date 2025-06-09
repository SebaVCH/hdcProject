import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"



type TSessionState = {
    accessToken?: string 
    enableGPS : boolean
    username?: string 
    role?: string 
    routeId ?: string
    routeStatus : boolean
    setEnableGPS : (enableGPS : boolean) => void
    setUsername: (username : string) => void 
    setRouteStatus : (status : boolean) => void
    setRole: (role : string) => void
    setAccessToken: (accessToken : string) => void 
    setRouteId : (routeId ?: string) => void
    clearSession: () => void 
}


const useSessionStore = create<TSessionState>()(
    devtools(
        persist(
            (set) => ({
                enableGPS : false,
                accessToken: undefined,
                username: undefined,
                role: undefined,
                routeStatus: false,
                routeId : undefined,
                setEnableGPS : ( enableGPS : boolean) => set(() => ({ enableGPS })),
                setRouteStatus : (routeStatus : boolean) => set(() => ({ routeStatus })),
                setUsername: (username : string) => set(() => ({ username })),
                setAccessToken: (accessToken : string) => set(() => ({ accessToken })),
                setRole: (role : string) => set(() => ({ role })),
                setRouteId : (routeId ?: string) => set(() => ({ routeId })),
                clearSession: () => (
                    set(() => ({
                        accessToken: undefined,
                        role: undefined,
                        username: undefined
                    }))
                )                
            }),
            {
                name: 'sessionStore',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
)

export default useSessionStore