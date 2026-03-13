import { useMutation } from "@tanstack/react-query"

import api from "../api/api"
import toast from "react-hot-toast";



export const usePaymentMutations = () => {

    return useMutation({
        mutationFn: async (planId) => {
            const res = await api.post("/api/payments/checkout-session", {planId});
            return res.data.payload;
        },

        onSuccess: (data) => {

            if(data?.url) {
                window.location.href = data.url;
            }

        },

        onError: (err) => {
            toast.error(err?.response?.data?.message || "Payment initiation failed");

        }


    });

}