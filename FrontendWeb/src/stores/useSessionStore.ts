import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"



type TSessionState = {
    accessToken?: string 
    username?: string 
    role?: string 
    setUsername: (username : string) => void 
    setRole: (role : string) => void
    setAccessToken: (accessToken : string) => void 
    clearSession: () => void 
}


const useSessionStore = create<TSessionState>()(
    devtools(
        persist(
            (set) => ({
                accessToken: undefined,
                username: undefined,
                role: undefined,
                setUsername: (username : string) => set(() => ({ username })),
                setAccessToken: (accessToken : string) => set(() => ({ accessToken })),
                setRole: (role : string) => set(() => ({ role })),
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