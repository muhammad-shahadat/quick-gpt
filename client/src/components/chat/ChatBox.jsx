import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import { useAppContext } from '../../context/useContext';
import { assets } from '../../assets/assets';
import Message from './Message';
import { useGetMessages } from '../../hooks/useChatQueries';
import { useChatMutations } from '../../hooks/useChatMutations';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ChatBox = () => {

    const { selectedChat, theme } = useAppContext();
    const {chatId} = useParams();
    
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const isPaginationRef = useRef(false);
    const isPageLockRef = useRef(false);
    const [mode, setMode] = useState("chat");
    const [prompt, setPrompt] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    const { ref, inView } = useInView();


    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isLoading: messagesLoading,
        isError

    } = useGetMessages({
        chatId: chatId || selectedChat?._id,
    })

    console.log("message list: ", data);

    const { 
        sendMessageMutation, 
        createChatMutation, 
        isAnyLoading, 
        isAnyError, 
        error 
    } = useChatMutations();

    

    const allMessages = data?.pages?.flatMap((page) => page.messages) || [];

    const handlePromptSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isAnyLoading) return;

        const currentPrompt = prompt;
        setPrompt(""); 

        const currentChatId = chatId || selectedChat?._id

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        if(mode === "image") {

            toast.error("image api is not built yet! you can only chat");
            
            return;
        }

        if (currentChatId) {
            sendMessageMutation.mutate({ chatId: selectedChat._id, content: currentPrompt });
        } else {
            
            createChatMutation.mutate(null, {
                onSuccess: (newChat) => {
                    sendMessageMutation.mutate({ chatId: newChat._id, content: currentPrompt });
                }
            });
        }
    }
    
    useEffect(() => {

        let timeoutId;
        if(inView && hasNextPage && !isFetchingNextPage && !isPageLockRef.current) {

            isPageLockRef.current = true;
            fetchNextPage().finally(() => {
                timeoutId = setTimeout(() => {
                    isPageLockRef.current = false;

                }, 1000);
                
            });

        }

        return () => {
            if(timeoutId) clearTimeout(timeoutId);
        };
        

    }, [inView, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        if(isFetchingNextPage){
            isPaginationRef.current = true;
        }
    }, [isFetchingNextPage]);

    useEffect(() => {

        if(isPaginationRef.current) {
            isPaginationRef.current = false;
            return;
        }

        if (isFetchingNextPage) return;

        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ 
                behavior: "smooth",
                block: "end" // block end dile eita thik niche giye thambe
            });

        }, 100);

        return () => clearTimeout(timer);

    }, [allMessages.length, isAnyLoading])


    useEffect(() => {
        if (isAnyError && error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong!";
            
            toast.error(errorMessage, {
                id: 'chat-error', 
                duration: 4000,
                position: 'bottom-center',
            });
        }
    }, [isAnyError, error]);


    return (
        <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>

            {/* chat messages */}
            <div className='flex-1 mb-5 overflow-y-scroll pr-2 custom-scrollbar flex flex-col-reverse'>                     

                {/* this div controll scrolling */}
                <div ref={messagesEndRef} />

                {/* AI Typing Indicator */}
                {isAnyLoading && (
                    <div className='flex items-center gap-3 px-4 py-2 w-fit'>
                        <div className='relative flex items-center justify-center'>
                            
                            <div className='absolute inset-0 bg-purple-400 dark:bg-purple-600 blur-md opacity-40 animate-pulse rounded-full'></div>
                            
                            
                            <Sparkles 
                                size={25} 
                                className='text-purple-600 dark:text-purple-300 animate-spin [animation-duration:3s]' 
                            />
                        </div>
                        
                        
                        <span className='text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse'>
                            Thinking
                        </span>
                    </div>
                )}

                

                {
                    messagesLoading? (
                        <div className="flex flex-col justify-center items-center h-full gap-4">
                            <div className="relative">
                                
                                <div className="w-12 h-12 rounded-full border-[3px] border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader className="w-6 h-6 text-violet-500 animate-pulse" />
                                </div>
                            </div>
                            
                            
                        </div>
                    ) : (
                        allMessages.length === 0 ? (

                            <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
                                <img className='w-full max-w-56 sm:max-w-68' src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} alt="" />
                                <p className='mt-5 text-3xl sm:text-4xl text-center text-gray-400 dark:text-white'>How Can Help You Today?</p>
                            </div>
                        ) : (

                            <>
    
                                {
                                    allMessages.map((message, index) => {
                                        return <Message key={message._id || index} message={message} />
                                    })
                                }

                                {/* it will be at the top of message mapping and it triggers scrolling*/}
                                <div 
                                    ref={ref} 
                                    className="h-20 w-full flex items-center justify-center bg-transparent"
                                >
                                    {isFetchingNextPage ? (
                                        <div className='flex items-center gap-2 text-xs text-blue-400 py-4'>
                                            <Loader size={16} className='animate-spin' />
                                        </div>
                                    ) : (
                                        /*if no loader empty div will occupy the space and triggers inview*/
                                        <div className="h-1" />
                                        
                                    )}
                                </div>
                                
                            </>

                            
                        )

                    )

                }

                

            </div>

            {
                mode === "image" && (
                    <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
                        <p className='text-sm'>Post Generated Image to Community</p>
                        <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />

                    </label>
                )
            }

            {/* prompt input box */}
            
        <form onSubmit={handlePromptSubmit} className='bg-primary/20 dark:bg-[#583c79]/30 border border-primary dark:border-[#80609f]/30 rounded-3xl w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-end'> 
            
            <select onChange={(e) => setMode(e.target.value)} value={mode} className='text-base pb-2 outline-none bg-transparent'>
                <option className='dark:bg-purple-900' value="chat">Chat</option>
                <option className='dark:bg-purple-900' value="image">Image</option>
            </select>

            
            <textarea 
                ref={textareaRef}
                onChange={(e) => {
                    setPrompt(e.target.value);
                    
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }} 
                onKeyDown={(e) => {
                    
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handlePromptSubmit(e);
                    }
                }}
                value={prompt} 
                rows="1" 
                placeholder="Ask what's on your mind" 
                className='flex-1 w-full text-[15px] outline-none bg-transparent resize-none max-h-40 py-1'
                required 
            />

            <button type="submit" disabled={isAnyLoading} className='pb-1'>
                <img 
                    src={isAnyLoading ? assets.stop_icon : assets.send_icon} 
                    className='w-8 cursor-pointer' 
                    alt="" 
                />
            </button>
        </form>


        </div>
    )
}

export default ChatBox
