import express from "express";

import passport from "../passport.js";
import { handleGetPublishedImages } from "../controllers/imageController.js";




const router = express.Router();



router.get("/published-images",
    passport.authenticate("jwt", {session: false}),
    handleGetPublishedImages
    
);






export default router;

