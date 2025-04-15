import { useEffect, useState } from "react";
import { UserAdapter } from "../api/adapters/UserAdapter";
import { useNavigate } from "react-router-dom";



export default function Login() {

    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { isPending, mutate, error, isError, isSuccess } = UserAdapter.useLoginMutation(email, password)

    const onSubmitForm = (e :React.FormEvent) => {
        e.preventDefault()
        mutate()
    }  
    useEffect(() => {
        if(isSuccess) {
            navigate('/')
        }
    }, [isSuccess, navigate])


    if(isPending) {
        return (
            <>
                Loading...
            </>
        )
    } 

    return (
        <div>
            <form  onSubmit={onSubmitForm}>
                <div style={{border: "solid", borderWidth: "1px", padding:"40px"}}>
                    <div>
                        <h3>Iniciar Sesión</h3>
                    </div>
                    <div>
                        <div> 
                            <p>Correo electronico</p>
                            <input type={"email"} onChange={(e) => setEmail(e.currentTarget.value)} />
                        </div>
                    </div>
                    <div>
                        <div>
                            <p>Contraseña</p>
                            <input type={"password"} onChange={(e) => setPassword(e.currentTarget.value)}/>
                        </div>
                    </div>
                    <div>
                        <button style={{marginTop:"40px"}}>
                            enviar
                        </button>
                    </div>
                </div>
            </form>
            {isError ? 
                <div>
                    <p>Error al iniciar sesión</p>
                    <p>{(error as Error).message}</p>
                </div> : 
                <></>
            }
        </div>
    )   

}