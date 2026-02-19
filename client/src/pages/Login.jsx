import React, { useState } from 'react'
import {Loader2, UserRoundCheck} from 'lucide-react';

import { useAuthMutations } from '../hooks/useAuthMutations';





const Login = () => {

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const { registerMutation, loginMutation } = useAuthMutations();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(state === "register") {
            registerMutation.mutate({
                name,
                email,
                password,
            })
        }
        else {
            loginMutation.mutate({
                email,
                password
            })
        }

    }


    const handleGuestLogin = () => {

        const guestEmail = "guest@recruiter.com";
        const guestPassword = "12345678";

        setEmail(guestEmail);
        setPassword(guestPassword);

        loginMutation.mutate({
            email: guestEmail,
            password: guestPassword,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">click here</span>
                </p>
            )}
            <button type="submit" disabled={registerMutation.isPending || loginMutation.isPending} className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {registerMutation.isPending || loginMutation.isPending ? <span className='flex justify-center items-center gap-1'>Processing<Loader2 className='animate-spin'/></span> : state === "register" ? "Create Account" : "Login"}
            </button>

            {/* --- Guest Login Button --- */}
            {state === "login" && !loginMutation.isPending && (
                <button 
                    type="button"
                    onClick={handleGuestLogin}
                    className="flex items-center justify-center gap-2 w-full border border-indigo-500 text-indigo-500 py-2 rounded-md hover:bg-indigo-50 transition-all font-medium cursor-pointer"
                >   
                    <UserRoundCheck size={18} /> Login as Guest
                </button>
            )}

            {state === "register" && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-2 mt-2">
                    <p className="text-[10px] text-blue-700 leading-tight">
                        <strong>Note:</strong> We will send an activation link to your email. 
                        Disposable or dummy emails will not work. Please use a valid email to access the app.
                    </p>
                </div>
            )}

        </form>
    );
};


export default Login