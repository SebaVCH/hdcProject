import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Login from './pages/login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Profile from './pages/profile'

const queryClient = new QueryClient()


function App() {

 
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
          <Route  path='/' element={<Home/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
