import { useInfiniteQuery } from "@tanstack/react-query"
import api from "../api/api";


export const useGetCommunityImages = () => {
    return useInfiniteQuery({
        queryKey: ["community-images"],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await api.get(`/api/images/published-images?page=${pageParam}&limit=8`);
            return res.data.payload;
        },
        getNextPageParam: (lastPage) => {
            const {currentPage, hasNextPage} = lastPage.pagination;
            return hasNextPage ? currentPage + 1 : undefined;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,

    });
}