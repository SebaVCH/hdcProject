import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Login from './pages/login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Profile from './pages/profile'
import Usuarios from './pages/admin/usuarios/Usuarios'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { interceptorResponse } from './api/services/axiosInstance'
import useSessionStore from './stores/useSessionStore'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import Schedule from './pages/schedule'

const queryClient = new QueryClient()


function App() {

  const { clearSession } = useSessionStore()

  const navigate = useNavigate()

  useEffect(()=> {
    interceptorResponse(navigate, clearSession)
  }, [navigate])
 
  return (
    <ThemeProvider theme={createTheme({
      typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
      }
      
    })}>
      <QueryClientProvider client={queryClient}>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/admin/usuarios' element={<Usuarios />} />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
