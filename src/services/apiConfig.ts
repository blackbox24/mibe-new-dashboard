import axios from "axios"

export const base_url = import.meta.env.VITE_BACKEND_URL;
export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
})

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("travelUserToken");
        if(token){
            config.headers.Authorization = token;
        }
        return config;
    },(error)=> Promise.reject(new Error(error)))


api.interceptors.response.use(
    (response)=> response,
    (error)=>{
        // Clear localStorage
        console.log(error)
        if(error.response.status === 401){
            localStorage.clear();
        }
        return error;
    }
)

