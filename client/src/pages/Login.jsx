import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Loader2, UserRoundCheck, AlertTriangle } from 'lucide-react'; // AlertTriangle অ্যাড করা হয়েছে

import { useAuthMutations } from '../hooks/useAuthMutations';


const Login = () => {

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { registerMutation, loginMutation } = useAuthMutations();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // toast loader starts
        const toastId = toast.loading("Connecting to server...");
        const timeoutId = setTimeout(() => {
            toast.loading("Server is waking up from cold start, please wait!", { id: toastId });
            
        }, 4000);

        if(state === "register") {
            registerMutation.mutate({
                name,
                email,
                password,
            }, {
                onSettled: () => {
                    clearTimeout(timeoutId);
                    toast.dismiss(toastId);
                }
            })
        }
        else {
            loginMutation.mutate({
                email,
                password
            }, {
                onSettled: () => {
                    clearTimeout(timeoutId);
                    toast.dismiss(toastId);
                }
            })
        }
    }

    const handleGuestLogin = () => {
        const guestEmail = "guest@recruiter.com";
        const guestPassword = "12345678";

        setEmail(guestEmail);
        setPassword(guestPassword);

        const toastId = toast.loading("Accessing Guest Account...");

        const timeoutId = setTimeout(() => {
            toast.loading("Establishing secure database connection & Server is waking up from cold start, please wait!", { id: toastId });
        }, 4000);

        loginMutation.mutate({
            email: guestEmail,
            password: guestPassword,
        }, {
            onSettled: () => {
                clearTimeout(timeoutId);
                toast.dismiss(toastId);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            
            <p className="text-2xl font-medium m-auto">
                <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>

            {/* --- Browser Compatibility Reviewer Notice (New Add) --- */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-md p-3 flex gap-2 items-start mt-1">
                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                    <p className="text-[11px] font-semibold text-amber-800 leading-tight">Reviewer Notice: Browser Info</p>
                    <p className="text-[10px] text-amber-700 leading-snug">
                        Auth relies on HTTP-Only cookies. Due to third-party cookie limits on free hosting, login won't set cookies on <span className="font-semibold">Safari</span> or <span class="font-semibold">Mobile browsers</span>.
                    </p>
                    <p className="text-[10px] font-medium text-amber-900 mt-0.5">
                        👉 Please evaluate using <span className="underline font-semibold">Google Chrome</span> or <span className="underline font-semibold">MS Edge</span>.
                    </p>
                </div>
            </div>

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
                <div className="bg-blue-50 border-l-4 border-blue-400 p-2 mt-2 w-full">
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