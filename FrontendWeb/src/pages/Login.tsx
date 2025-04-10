import { useState } from "react";



export default function Login() {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')


    const onClickLogin = function() {
        console.log("enviando...")
        console.log(email)
        console.log(password)
    }  

    return (
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
                <button style={{marginTop:"40px"}} onClick={onClickLogin}>
                    enviar
                </button>
            </div>
        </div>

    )   

}