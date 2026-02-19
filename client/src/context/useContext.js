import { useContext } from "react"
import { AppContext } from "./createContext"


export const useAppContext = () => {
    const context = useContext(AppContext);
    if(!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }

    return context;
}