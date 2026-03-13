import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';

import Loading from '../pages/Loading';
import api from '../api/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['verifyPayment', sessionId],
        queryFn: async () => {
            
            const res = await api.post('/api/payments/verify', { sessionId });
            return res.data;
        },
        enabled: !!sessionId,
        retry: 15, // retry 5/6 times is safe for webhook
        retryDelay: 3000, // every 3 seconds retry will apply
    });

    if (isLoading) return <Loading />;

    // For successful payment 
    if (data?.success) {
        toast.success("Payment Successful!");
        setTimeout(() => navigate('/'), 2000);
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#ededed] dark:bg-[#1a1a1a]">
                <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold text-green-500 mb-2">Success!</h2>
                    <p className="text-gray-600 dark:text-gray-400">Redirecting to Dashboard...</p>
                </div>
            </div>
        );
    }

    //Failed verification  (isError)
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#ededed] dark:bg-[#1a1a1a] p-4">
                <div className="flex flex-col items-center max-w-md w-full p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30 text-center">
                    <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Verification Failed
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error?.response?.data?.message || "Something went wrong while verifying your payment."}
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                        <button 
                            onClick={() => navigate('/credits')}
                            className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl transition-all font-medium"
                        >
                            <RefreshCcw className="w-4 h-4" /> Try Again
                        </button>
                        
                        <button 
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl transition-all font-medium"
                        >
                            <Home className="w-4 h-4" /> Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default PaymentSuccess;