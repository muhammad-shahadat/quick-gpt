import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

import { activateAccountQuery } from '../hooks/useAuthMutations';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';



const VerifyAccount = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    
    const {data, isLoading, isError, error} = useQuery(activateAccountQuery(token));
    
    useEffect(() => {
        if (data) {
            toast.success(data.message || "Account activated! You can now login.");
        }
    }, [data]);

    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                {isLoading && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                        <h2 className="text-2xl font-semibold text-gray-800">Verifying Account</h2>
                        <p className="text-gray-500">Please wait while we activate your professional profile...</p>
                    </div>
                )}

                {data && (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Account Activated!</h2>
                        <p className="text-gray-600">Your email has been verified. You can now access all features of QuickGPT.</p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="mt-6 flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-all transform active:scale-95"
                        >
                            Go to Login <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {isError && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-red-100 p-4 rounded-full">
                            <XCircle className="w-16 h-16 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Activation Failed</h2>
                        <p className="text-gray-600">
                            {error?.response?.data?.message || "The link might be expired or invalid. Please try registering again."}
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="mt-6 w-full bg-gray-800 hover:bg-black text-white py-3 rounded-lg font-medium transition-all"
                        >   {error?.response?.status === 409 ? "Go to Sign In" : "Back to Sign Up"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyAccount;