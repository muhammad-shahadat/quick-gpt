import express from "express"

import passport from "../passport.js";
import { handleGetMessages } from "../controllers/messageController.js";



const router = express.Router();




router.get("/:chatId",
    passport.authenticate("jwt", {session: false}),
    handleGetMessages
    
);



export default router;

