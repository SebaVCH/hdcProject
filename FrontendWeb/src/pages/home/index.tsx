import { useState } from "react"
import { useCheckLogin } from "../../api/adapters/UserAdapter"


export default function Home() {

    


    const { isLoading, error, data } = useCheckLogin("cristian@gmail.com", "123")

    if(isLoading) {
        return (
            <>
                <p>Loading...</p>
            </>
        )
    }

    if(error) {
        console.log("An error ocurred while fetching the user data ", error)
    }
    
    console.log(data)

    return (
        <>
            <p>Home</p>
            <p>{data?.token}</p>
            <p>password</p>
        </>
    )
} 