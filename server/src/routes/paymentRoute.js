import express from "express";

import passport from "../passport.js";
import { handleCreateCheckoutSession, handleVerifyPayment } from "../controllers/paymentController.js";





const router = express.Router();



router.post("/checkout-session",
    passport.authenticate("jwt", {session: false}),
    handleCreateCheckoutSession,
);

router.post("/verify",
    passport.authenticate("jwt", {session: false}),
    handleVerifyPayment,
);






export default router;

