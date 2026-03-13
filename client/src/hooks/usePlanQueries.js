import { useQuery } from "@tanstack/react-query"
import api from "../api/api"



export const useGetPlans = () => {

    return useQuery({
        queryKey: ["plan"],
        queryFn: async () => {
            const res = await api.get("/api/plans/");
            return res.data.payload;
        },
        retry: false,
        staleTime: Infinity,
    });
}