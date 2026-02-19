import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";


export const useGetChats = () => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    return useInfiniteQuery({
        queryKey: ["chats"],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await api.get(`/api/chats/?page=${pageParam}&limit=10`);
            return response.data.payload;
        },
        getNextPageParam: (lastPageData) => {
            const { hasNextPage, currentPage } = lastPageData.pagination;
            return hasNextPage ? currentPage + 1 : undefined;
        },
        retry: false,
        enabled: !!user,
        staleTime: 5 * 60 * 1000,

    });
};


export const useGetMessages = ({ chatId } = {}) => {
    return useInfiniteQuery({

        queryKey: ["messages", chatId],
        queryFn: async ({ pageParam = 1 }) => {

            if (!chatId) return null;
            const res = await api.get(`/api/messages/${chatId}`, {
                params: { page: pageParam, limit: 20 }
            });
            return res.data.payload;

        },
        getNextPageParam: (lastPageData) => {
            if(!lastPageData?.pagination) return undefined;
            const { hasNextPage, currentPage } = lastPageData.pagination;
            return hasNextPage ? currentPage + 1 : undefined;
        },

        retry: false,
        enabled: !!chatId, 
        staleTime: 5 * 60 * 1000,
    });
};


export const useGetUserProfile = () => {

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await api.get("/api/users/profile");
            return response.data.payload;
        },
        retry: false,
        enabled: isLoggedIn,
        staleTime: Infinity,
    });
};