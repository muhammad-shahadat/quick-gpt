import express from "express"

import passport from "../passport.js";
import { handleCreateChat, handleDeleteChat, handleGetChats } from "../controllers/chatController.js";
import { handleSendMessage } from "../controllers/messageController.js";



const router = express.Router();


router.post("/create",
    passport.authenticate("jwt", {session: false}),
    handleCreateChat
)

router.get("/",
    passport.authenticate("jwt", {session: false}),
    handleGetChats
    
)

router.delete("/:chatId",
    passport.authenticate("jwt", {session: false}),
    handleDeleteChat
)

router.post("/send-message", 
    passport.authenticate("jwt", {session: false}),
    handleSendMessage
)


export default router;

