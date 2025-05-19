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
<div className="flex min-h-screen flex-col justify-center items-center bg-gray-50 px-4">
  <div className="w-full max-w-sm">
    <h2 className="text-3xl font-semibold text-center mb-8">Iniciar Sesión</h2>
    <form onSubmit={onSubmitForm}>
      <Card className="flex flex-col gap-6 p-8 shadow-md rounded-2xl bg-white">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Ingresar
        </Button>
        {isError && (
          <div className="text-red-600 text-sm text-center mt-2">
            <p>Error al iniciar sesión</p>
            <p>{(error as Error).message}</p>
          </div>
        )}
      </Card>
    </form>
  </div>
</div>

    )   

}