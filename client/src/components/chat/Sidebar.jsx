import React, { useEffect, useState } from "react";
import { Loader2, Settings, Image, Diamond, Moon, Sun, LogOut, X, Plus, Search } from "lucide-react";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";
import moment from "moment";
import { useInView } from 'react-intersection-observer';

import { useAppContext } from "../../context/useContext";
import { assets } from "../../assets/assets";
import { useGetChats } from "../../hooks/useChatQueries";
import { useChatMutations } from "../../hooks/useChatMutations";
import { useAuthMutations } from "../../hooks/useAuthMutations";
import { useLocation } from "react-router-dom";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

    const { theme, setTheme, user, userLoading, setSelectedChat, navigate } = useAppContext();
    const location = useLocation();
    const [search, setSearch] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const currentChatId = location.pathname.startsWith("/chat/") ? location.pathname.split("/chat/")[1] : null;


    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: chatsLoading,
        isError,
        error

    } = useGetChats();

    const { deleteChatMutation } = useChatMutations();
    const { logoutMutation } = useAuthMutations();

    const { ref, inView } = useInView();



    const allChats = data?.pages?.flatMap((page) => page.chats) || [];
    const filteredChats = allChats?.filter((chat) => {
        return chat.title.toLowerCase().includes(search.toLowerCase());
    }) || [];


    const handleDeleteChat = async ({ e, chatId }) => {
        e.stopPropagation();

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
            customClass: {
                confirmButton: 'cursor-pointer',
                cancelButton: 'cursor-pointer'
            }

        })

        if (result.isConfirmed) {
            Swal.showLoading();
            deleteChatMutation.mutate(chatId, {
                onSuccess: () => {
                    if (currentChatId === chatId) {
                        navigate("/");
                    }
                    Swal.close();
                },
                onError: () => {
                    Swal.close();
                }
            });
        }


    }

    const handleCreateChat = () => {

        navigate("/");
        if (window.innerWidth < 768) setIsMenuOpen(!isMenuOpen);
        setSelectedChat(null);
    }


    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }

    }, [inView, hasNextPage, fetchNextPage]);



    // handle fetching chat error 
    useEffect(() => {
        if (isError) {
            toast.error(error?.response?.data?.message || "Error fetching chats");
        }
    }, [isError]);


    return (

        <div className={`flex flex-col h-screen min-w-72 max-w-72 p-4 dark:bg-[#111] bg-gray-50 border-r border-gray-200 dark:border-white/10 transition-all duration-300 max-md:absolute left-0 z-50 ${!isMenuOpen && "max-md:-translate-x-full"}`}>
            
            {/* Header: Logo & Close */}
            <div className="flex items-center justify-between mb-6">
                <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} className="max-w-40" alt="logo" />
                <X onClick={() => setIsMenuOpen(false)} className="md:hidden cursor-pointer w-6 h-6 dark:text-white" />
            </div>

            {/* New Chat Button */}
            <button
                onClick={handleCreateChat}
                className="flex items-center justify-center gap-2 w-full py-3 mb-4 bg-blue-500 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                New Chat
            </button>

            {/* Search Input */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    type="text"
                    placeholder="Search Chats"
                    className="w-full pl-10 pr-4 py-2 bg-gray-200/50 text-gray-800 dark:bg-white/5 dark:text-gray-300 border-none rounded-lg text-sm outline-none focus:ring-1 ring-blue-500"
                />
            </div>

            {/* RECENT CHATS: This takes up all available space */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Chats</p>
                {chatsLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
                ) : (
                    <div className="space-y-1">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => {
                                    navigate(`/chat/${chat._id}`);
                                    setSelectedChat(chat);
                                    if (window.innerWidth < 768) setIsMenuOpen(false);
                                }}
                                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                                    currentChatId === chat._id ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20" : "hover:bg-gray-200 dark:hover:bg-white/5"
                                }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate pr-2">{chat.title}</p>
                                    <p className="text-[10px] opacity-50">{moment(chat.updatedAt).fromNow()}</p>
                                </div>
                                <X 
                                    onClick={(e) => handleDeleteChat({ e, chatId: chat._id })}
                                    className="w-4 h-4 text-gray-400 hover:text-red-500 hidden group-hover:block transition-all" 
                                />
                            </div>
                        ))}
                        <div ref={ref} className="h-4 flex justify-center">
                            {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                        </div>
                    </div>
                )}
            </div>

            {/* BOTTOM SECTION: Profile and Settings */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/10 relative">
                
                {/* Settings Popover */}
                {isSettingsOpen && (
                    <div className="absolute bottom-16 left-0 w-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                        <button onClick={() => {navigate("/community"); setIsSettingsOpen(false); setIsMenuOpen(false)}} className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm cursor-pointer">
                            <Image className="w-4 h-4" /> Community Images
                        </button>
                        <button onClick={() => {navigate("/credits"); setIsSettingsOpen(false); setIsMenuOpen(false)}} className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm cursor-pointer">
                            <Diamond className="w-4 h-4 text-purple-500" /> 
                            <span>Credits: {user?.credits}</span>
                        </button>
                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex items-center justify-between w-full p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm cursor-pointer">
                            <div className="flex items-center gap-3">
                                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                Appearance
                            </div>
                            <div className="text-[10px] bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded uppercase">{theme}</div>
                        </button>
                        <div className="h-[1px] bg-gray-100 dark:bg-white/10 my-1" />
                        <button 
                            onClick={() => logoutMutation.mutate()} 
                            disabled={logoutMutation.isPending}
                            className="flex items-center justify-between w-full p-3 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-lg text-sm cursor-pointer transition-all disabled:opacity-50"
                        >
                            <div className="flex items-center gap-3">
                                {logoutMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <LogOut className="w-4 h-4" />
                                )}
                                <span>Logout</span>
                                
                            </div>
                            
                        </button>
                    </div>
                )}

                {/* Profile & Gear Button */}
                <div className="flex items-center justify-between p-2 hover:bg-gray-200 dark:hover:bg-white/5 rounded-xl transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                        {userLoading ? (
                            <div className="w-8 h-8 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            </div>
                        ) : (

                            <>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                    {user?.name?.charAt(0) || "U"}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {user ? user.name : "Login Account"}
                                    </p>
                                </div>
                            </>
                        )}
                        
                    </div>
                    <button 
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`p-2 rounded-lg cursor-pointer transition-all ${isSettingsOpen ? "bg-gray-300 dark:bg-white/10" : "hover:bg-gray-300 dark:hover:bg-white/10"}`}
                    >
                        <Settings className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isSettingsOpen && "rotate-90"}`} />
                    </button>
                </div>
            </div>
        </div>

    )

}

export default Sidebar;