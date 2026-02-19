import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";


import api from "../api/api";



export const useAuthMutations = () => {
    
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    

    // registration mutaiton
    const registerMutation = useMutation({
        mutationFn: async (userData) => {
            const res = await api.post('/api/auth/users/register', userData);
            return res.data;
        },
        onSuccess: (data) => {
            Swal.fire({
                title: 'Verify Your Email',
                text: data.message || "Please check your inbox to activate your account.",
                icon: 'info',
                confirmButtonColor: '#6366f1'
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Registration failed!");
        }
    });

    

    // login mutation
    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const res = await api.post('/api/auth/users/login', credentials);
            return res.data.payload;
        },
        onSuccess: (data) => {
            
            // set name and email form login payload (Instant UI)
            queryClient.setQueryData(["user"], data); 

            // full profile fetch from backend
            queryClient.invalidateQueries({ queryKey: ["user"] });
            
            localStorage.setItem("isLoggedIn", "true");

            toast.success("Login successful!");
            navigate("/");
        },

        onError: (error) => {
            toast.error(error?.response?.data?.message || "Invalid email or password!");
        }
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/api/auth/users/logout');
            return res.data;
        },

        onSuccess: (data) => {

            localStorage.removeItem("isLoggedIn");
            // if exist local storage caceh
            localStorage.removeItem('user'); 

            // clear all react query cache
            queryClient.clear();
            

            // Navigation and  feedback
            toast.success(data?.message || "Logged out successfully");
            navigate("/login");
        },

        onError: (error) => {
            localStorage.removeItem("isLoggedIn");
            // if exist local storage caceh
            localStorage.removeItem('user'); 
            //although failded, clear cache.
            queryClient.clear();
            toast.error(error?.response?.data?.message || "Logout issue, but session cleared.");
            navigate("/login");
        }
    });

    return {
        registerMutation,
        loginMutation,
        logoutMutation,
    };
};

export const activateAccountQuery = (token) => {

    return {
        queryKey: ["activate", token],
        queryFn: async () => {
            const res = await api.get(`/api/auth/users/activate?token=${token}`);
            return res.data;
        },
        enabled: !!token,
        retry: false,
        staleTime: Infinity,
    }

}