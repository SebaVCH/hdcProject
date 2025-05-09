import { useEffect, useState } from "react";
import { UserAdapter } from "../../api/adapters/UserAdapter";
import { useNavigate } from "react-router-dom";
import useSessionStore from "../../stores/useSessionStore";
import { Button, Card, Input, Paper, TextField } from "@mui/material";



export default function Login() {

    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { accessToken } = useSessionStore()
    const { isPending, mutate, error, isError, isSuccess } = UserAdapter.useLoginMutation(email, password)

    const onSubmitForm = (e :React.FormEvent) => {
        e.preventDefault()
        mutate()
    }  
    useEffect(() => {
        if(accessToken) {
            navigate('/')
        }
    }, [])

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
        <div className="flex flex-col grow justify-center items-center gap-5">
            <div>
                <h2 className="font-light text-2xl">Iniciar Sesión</h2>
            </div>
            <form  onSubmit={onSubmitForm}>
                <Card className="flex flex-col gap-16 justify-start px-10 py-10 m-1">
                    <div className="">
                        <div className="flex flex-col gap-3"> 
                            <p>Correo electronico</p>
                            <Input 
                                id="outline-number" 
                                size="small" type={"email"} 
                                onChange={(e) => setEmail(e.currentTarget.value)} 
                                placeholder="Ingresa tu correo"
                                
                            
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <p>Contraseña</p>
                            <Input  
                                size="small"
                                placeholder="Ingresa tu contraseña" 
                                type={"password"} 
                                onChange={(e) => setPassword(e.currentTarget.value)}/>
                        </div>
                    </div>
                    <div>
                        <Button onClick={onSubmitForm}>
                            Enviar
                        </Button>
                    </div>
                </Card>
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