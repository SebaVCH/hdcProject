import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Login from './pages/Login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()


function App() {

 
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
          <Route  path='/' element={<Home/>} />
          <Route path='/login' element={<Login />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
