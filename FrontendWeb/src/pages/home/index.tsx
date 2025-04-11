import { useFetchUser } from "../../api/services/UserService"


export default function Home() {

    const { isLoading, error, data } = useFetchUser()

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

    return (
        <>
            <p>Home</p>
            <p>{data?.email}</p>
            <p>{data?.password}</p>
        </>
    )
} 