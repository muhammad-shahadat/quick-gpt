import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { useGetUserProfile } from "../hooks/useChatQueries";
import { AppContext } from "./createContext";



export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const {
        data: userData,
        isLoading: userLoading,
        isError,
        error,
    } = useGetUserProfile();

    const user = userData?.user || userData || null;
    
    

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const value = {
        navigate,
        user,
        userLoading: userLoading && !user,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


