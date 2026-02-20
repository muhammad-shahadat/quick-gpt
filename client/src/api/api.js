import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL  || "http://localhost:3000",
    withCredentials: true, //browser sends cookie
});


const successHandler = (response) => {
    return response;
}

const errorHandler = async (error) => {

    // network / server down / CORS issue
    if (!error.response) {
        return Promise.reject({ message: "Network Error", originalError: error });
    }

    const originalRequest = error.config;

    if (originalRequest.url.endsWith("/refresh-token")) {

        
        return Promise.reject(error);
    }

    if(error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            
            
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/users/refresh-token`, {}, {
                withCredentials: true
            });
            
            return await api(originalRequest);

        } catch (refreshError) {
            console.error("Session expired. Please login again.");
           
            return Promise.reject(refreshError);
            
        }
    }

    return Promise.reject(error);
};




api.interceptors.response.use(successHandler, errorHandler);


export default api;
