import createHttpError from "http-errors";

import { successResponse } from "./responseController.js";
import Plan from "../models/Plan.js";
import Payment from "../models/Payment.js";
import stripe from "../configs/stripe.js"



export const handleCreateCheckoutSession = async (req, res, next) => {
    try {
        const { planId } = req.body;
        const userId = req.user.id;

        
        const plan = await Plan.findById(planId);
        if (!plan) {
            return next(createHttpError(404, "Plan not found"));
        }

        //create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${plan.name} Plan`,
                            description: `Purchase ${plan.credits} credits`,
                        },
                        unit_amount: plan.price * 100, //convert to cent
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/credits`,
            customer_email: req.user.email,
            metadata: {
                userId: userId.toString(),
                planId: plan.id.toString(),
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        });

        //record payment data as 'pending' status
        await Payment.create({
            user: userId,
            plan: plan._id,
            amount: plan.price,
            credits: plan.credits,
            stripeSessionId: session.id,
            status: "pending",
        });

        
        return successResponse(res, {
            statusCode: 200,
            message: "Checkout session created",
            payload: { url: session.url }
        });

    } catch (error) {
        console.error("Stripe Session Error:", error);
        next(error);
    }
};

export const handleVerifyPayment = async (req, res, next) => {

    try {

        const { sessionId } = req.body;

        if (!sessionId) {
            return next(createHttpError(400, "Session ID is required"));
        }

        
        const payment = await Payment.findOne({ stripeSessionId: sessionId });

        if (!payment) {
            return next(createHttpError(404, "Payment record not found"));
        }

        
        if (payment.status === 'pending') {
            //sending 400 error so that, TanStack Query can 'retry'
            return next(createHttpError(400, "Payment is still processing. Please wait!"));
        }

        
        if (payment.status === 'paid') {
            return successResponse(res, {
                statusCode: 200,
                message: "Payment verified successfully",
                payload: { 
                    status: payment.status,
                    credits: payment.credits 
                }
            });
        }

        return next(createHttpError(400, `Payment status: ${payment.status}`));

    } catch (error) {
        console.error("Verify Payment Error:", error);
        next(error);
        
    }

};