import express from "express";

import { handleActivateUser, handleLoginUser, handleLogoutUser, handleRefreshToken, handleRegisterUser } from "../controllers/authController.js";








const router = express.Router();



//user auth
router.post("/register", handleRegisterUser);
router.get("/activate", handleActivateUser);
router.post("/login", handleLoginUser)
router.post("/logout", handleLogoutUser)
router.post("/refresh-token", handleRefreshToken)








export default router;
