import axios, { AxiosError, isAxiosError } from 'axios'
import { NavigateFunction } from 'react-router-dom'





export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_URL_BACKEND,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'applicacion/json',
    }
})

let isDone = false

export const interceptorResponse = (navigate : NavigateFunction,  clearSesion : () => void) => {

    if(isDone) return

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        }, (error) => {
            
            console.log(error)
            if(isAxiosError(error) && ((error as AxiosError).status == 401)) {
                clearSesion()
                navigate('/login')
            }

            if (error.response && error.response.data) {
                return Promise.reject(error.response.data);
            }
            return Promise.reject(error.message);
    });
    isDone = true   
}





