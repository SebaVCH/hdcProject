import useSessionStore from "../../stores/useSessionStore"


export default function Home() {


    const { accessToken } = useSessionStore()


    return (
        <>
            <p>Home</p>
            <p>{accessToken}</p>
        </>
    )
} 