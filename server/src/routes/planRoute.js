import express from "express";

import passport from "../passport.js";
import { handleGetPlans } from "../controllers/planController.js";




const router = express.Router();



router.get("/",
    passport.authenticate("jwt", {session: false}),
    handleGetPlans
    
);






export default router;

