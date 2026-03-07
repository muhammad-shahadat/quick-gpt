import createHttpError from "http-errors";

import Plan from "../models/Plan.js";
import { successResponse } from "../controllers/responseController.js";


/**
 * @desc    Get all active subscription plans
 * @route   GET /api/plans/
 * @access  Public
 */

export const handleGetPlans = async (req, res, next) => {
    try {
        
        const plans = await Plan.find({})
            .sort({ price: 1 })
            .lean(); 

        
        if (!plans || plans.length === 0) {
            return next(createHttpError(404, "No subscription plans found. Please seed the database."));
        }

        
        return successResponse(res, {
            statusCode: 200,
            message: "Subscription plans fetched successfully",
            payload: plans
        });

    } catch (error) {
        console.error("Error in handleGetPlans:", error);
        next(error);
    }
};