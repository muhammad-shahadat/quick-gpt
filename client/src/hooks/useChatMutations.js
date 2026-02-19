import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "../api/api";
import { useAppContext } from "../context/useContext";
import { useNavigate } from "react-router-dom";


export const useChatMutations = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { setSelectedChat } = useAppContext();


    const sendMessageMutation = useMutation({
        mutationFn: async ({ chatId, content }) => {
            const res = await api.post('/api/chats/send-message', { chatId, content });
            return res.data.payload;
        },

        onMutate: async (newMessage) => {
            await queryClient.cancelQueries({ queryKey: ['messages', newMessage.chatId] });

            const previousMessages = queryClient.getQueryData(['messages', newMessage.chatId]);

            queryClient.setQueryData(['messages', newMessage.chatId], (old) => {
                
                const defaultMessageData = {
                    pageParams: [undefined],
                    pages: [{
                        messages: [],
                        
                    }],
                    
                }
                const currentMessageData = old || defaultMessageData;

                const newPages = [...currentMessageData.pages];



                newPages[0] = {
                    ...newPages[0],
                    messages: [

                        {
                            _id: "temp-" + Date.now(),
                            content: newMessage.content,
                            role: "user",
                            isImage: false,
                            createdAt: new Date().toISOString(),
                            optimistic: true,
                        },
                        ...newPages[0].messages,

                    ],
                };

                return { ...currentMessageData, pages: newPages };
            });

            return { previousMessages };
        },


        onError: (err, newMessage, context) => {
            if (context?.previousMessages) {
                queryClient.setQueryData(['messages', newMessage.chatId], context.previousMessages);
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });


    const createChatMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/api/chats/create', { title: "New Chat" });
            return res.data.payload;
        },
        onSuccess: (newChat) => {
            navigate(`/chat/${newChat._id}`);
            setSelectedChat(newChat);
            queryClient.invalidateQueries(['chats']);
            sendMessageMutation.reset();
        }
    });


    const deleteChatMutation = useMutation({
        mutationFn: async (chatId) => {

            const res = await api.delete(`/api/chats/${chatId}`);
            return res.data;
        },

        onSuccess: async (deletedChat) => {

            queryClient.invalidateQueries({ queryKey: ['chats'] });
            sendMessageMutation.reset();
            setSelectedChat(null);
            toast.success(deletedChat?.message || "successfully chat deleted");
        },

        onError: async (error) => {
            toast.error(error?.response?.data.message || error.message || "something went wrong!");

        }
    })

    return {
        sendMessageMutation,
        createChatMutation,
        deleteChatMutation,
        isAnyLoading: sendMessageMutation.isPending || createChatMutation.isPending,
        isAnyError: sendMessageMutation.isError || createChatMutation.isError,
        error: sendMessageMutation.error || createChatMutation.error
    };
};

