import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Login from './pages/login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Profile from './pages/profile'
import Usuarios from './pages/admin/usuarios/Usuarios'

const queryClient = new QueryClient()


function App() {

 
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
          <Route  path='/' element={<Home/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/admin/usuarios' element={<Usuarios />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
