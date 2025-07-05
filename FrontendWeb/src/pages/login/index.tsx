import { useEffect, useState } from "react";
import { UserAdapter } from "../../api/adapters/UserAdapter";
import { useNavigate } from "react-router-dom";
import useSessionStore from "../../stores/useSessionStore";
import { Box, Button, Card, Divider, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import { isValidEmail } from "../../utils/verifyInput";
import { sxInput } from "../../style/sxInput";





export default function Login() {

    const navigate = useNavigate()

    const [ email, setEmail ] = useState<string>('')
    const [ emailError, setEmailError ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const [ passwordError, setPasswordError ] = useState<string>('')

    const { accessToken } = useSessionStore()
    const { mutate, isSuccess } = UserAdapter.useLoginMutation(email, password)

    const validateInputs = () => {
      
      if(email === '' || !isValidEmail(email)) {
        setEmailError('Ingresa Ingresa un Email válido')
      } else {
        setEmailError('')
      }

      if(password === '') {
        setPasswordError('Ingresa una Contraseña')
      } else {
        setPasswordError('')
      }
      
    }
    
    const onSubmitForm = (e :React.FormEvent) => {
      e.preventDefault()
      console.log("jasnadkln")
      if(emailError !== '' || passwordError !== '') {
        return
      }
      console.log("jasnaqdkln")
      mutate()
    }
    
    useEffect(() => {
      if(accessToken) {
        navigate('/')
      }
    }, [accessToken])

    useEffect(() => {
      if(isSuccess) {
        console.log("jasnadkln")
        navigate('/')
      }
    }, [isSuccess, navigate])


    return (
      <Box className="flex w-full h-full justify-center"
          sx={[
          (_) => ({
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              zIndex: -1,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, 	hsl(184, 100%, 95%), hsl(0, 0%, 100%))',
              backgroundRepeat: 'no-repeat',
            },
          })
        ]}
      >
        <div className="flex items-center justify-center w-full xs:max-w-sm">
          <form className="max-xs:h-full" onSubmit={onSubmitForm} noValidate>
              <Card variant='elevation' elevation={1} className="flex flex-col gap-6 rounded-2xl h-full lg:h-150 w-full lg:w-250">
                <div className="flex grow flex-col lg:flex-row items-center justify-between p-16 gap-1 lg:gap-16">
                  <div className="flex flex-col items-start justify-start gap-8 w-full lg:w-90 px-0 lg:px-6">
                    <Typography variant="h3" gutterBottom fontSize={{
                      xs : '2.5rem'
                    }}>
                      Iniciar Sesión
                    </Typography>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <TextField
                        error={emailError !== ''}
                        helperText={emailError}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Ingresa tu Correo"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        sx={sxInput}
                        onChange={(e) => setEmail(e.currentTarget.value)}                        
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="password">Contraseña</FormLabel>
                      <TextField
                        error={passwordError !== ''}
                        helperText={passwordError}
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Ingresa tu Contraseña"
                        autoComplete="password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        sx={sxInput}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                      />
                    </FormControl>
                    <Button type="submit" fullWidth variant="contained"
                      onClick={validateInputs}
                      sx={{
                        color : 'white',
                        background : '#009BA5',
                      }}
                    >
                      Ingresar
                    </Button>
                    <Divider className="w-full" />

                    <Typography alignSelf={'center'}
                      component={'a'}
                      href="/change-password"
                      sx={{
                        textDecoration : 'underline',
                      }}
                      fontSize={{
                        xs : '0.75rem',
                        sm : '0.75rem',
                        md : '1rem'
                      }}
                    >
                      ¿Se te olvidó la contraseña?
                    </Typography>
                  </div>
                  <div className="flex w-1/2 md:w-1/2 flex-col items-center justify-center">
                      <img src="https://aportes.hogardecristo.cl/wp-content/uploads/2021/08/HDC_RGB_full-color-horizontal.png.webp" loading="lazy"/>
                      <Typography variant='subtitle2' textAlign={'center'} fontSize={{
                        xs : '0.4rem',
                        sm : '1rem',
                        md : '1rem',
                      }}>
                        Hecho con ❤️ por <a href="devSync"><b>DevSync</b></a>
                      </Typography>
                  </div>
                </div>
              </Card>
          </form>
        </div>
      </Box>
    )   
}
