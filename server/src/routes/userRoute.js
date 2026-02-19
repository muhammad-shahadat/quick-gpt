import express from "express";

import passport from "../passport.js";
import authRole from "../middlewares/authRole.js";
import { handleGetUserProfile } from "../controllers/userController.js";


const router = express.Router();


//user profile
router.get("/profile", 
    passport.authenticate("jwt", {session: false}),  
    authRole("admin", "user"),
    handleGetUserProfile
)






export default router;