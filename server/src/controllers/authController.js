import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import createJsonWebToken from "../helpers/jsonWebToken.js";
import User from "../models/User.js";
import { successResponse } from "./responseController.js";
import emailWithNodemailer from "../helpers/nodemailer.js";
import registrationMail from "../helpers/prepareMail.js";





const isProduction = process.env.NODE_ENV === "production";

export const handleRegisterUser = async (req, res, next) => {
    try {

        const {name, email, password} = req.body;


        const existingUser = await User.findOne({email});

        if(existingUser){

            return next(createHttpError(409, "email is already exist!"));
        }

       

        const jwtPayload = {
            name: name,
            email: email,
            password: password,
        }


        const token = await createJsonWebToken(jwtPayload, process.env.JWT_ACTIVATION_KEY, {expiresIn: "30m"});

        //Prepare mail
        const mailData = registrationMail(email, name, token);
        await emailWithNodemailer(mailData);

        successResponse(res, {
            statusCode: 200,
            message: "We’ve sent a verification link to your email. Please check your inbox (and spam folder). Note: You must use a valid and accessible email to complete the registration; dummy emails will not receive the activation link.",

        })
                   
    } catch (error) {
        next(error)
        
    }


}

export const handleActivateUser = async (req, res, next) =>{
    try {
        
        const token = req.query.token;
        if(!token){
            return next(createHttpError(404, "token not found"));
        }

        const decoded = jwt.verify(token, process.env.JWT_ACTIVATION_KEY);

        if(!decoded){
            return next(createHttpError(401, "unable to verify user"));
        }

        const existingUser = await User.findOne({email: decoded.email})
        
        

        if (existingUser) {
            return next(createHttpError(409, "User account is already activated, Please sign in."));
        }
        

        const user = await User.create({
            name: decoded.name,
            email: decoded.email,
            password: decoded.password
        }) 

        

        successResponse(res, {
            statusCode: 201,
            message: "user was registered successfully",
            payload: {

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email, 
                },
    
            }

        })
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(createHttpError(401, "Token has expired"));
        } 
        else if (error.name === "JsonWebTokenError") {
            return next(createHttpError(401, "Invalid Token!"));
        }
        else{
            next(error);
        }
        
    }

}

export const handleLoginUser = async (req, res, next) =>{
    try {

        const {email, password} = req.body;
        const user = await User.findOne({email}).select("+password");
        

        if(!user){
            return next(createHttpError(401, "Invalid email or password!"))
        }

       
        const match = await bcrypt.compare(password, user.password);

        if(!match){
            return next(createHttpError(401, "Invalid email or password!"))
        }

        if(!user.isActive){
            return next(createHttpError(403, "you are inactive or banned! Please contact with authority."))
        }

        const jwtPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
            role: user.role,
            isActive: user.isActive,
        }

        const accessToken = await createJsonWebToken(jwtPayload, process.env.JWT_ACCESS_KEY, {expiresIn: "10m"});

        res.cookie("accessToken", accessToken, {
            //10 min same as jwt expiresIn.
            maxAge: 10 * 60 * 1000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        })


        const refreshToken = await createJsonWebToken(jwtPayload, process.env.JWT_REFRESH_KEY, {expiresIn: "7d"});

        res.cookie("refreshToken", refreshToken, {
            //7 days same as jwt expiresIn.
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        })


        successResponse(res, {
            statusCode: 200,
            message: "login successful",
            payload: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                },

            }

        })

        

    } catch (error) {
        
        next(error)
        
    }
}

export const handleRefreshToken = async (req, res, next) => {
    try {

        const oldRefreshToken = req.cookies.refreshToken;

        const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_KEY);

        
        /* ====================================
        in future, db check logic will be here.
        ========================================*/

        //logics are same as login handler.
        const jwtPayload = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            isActive: decoded.isActive,
        }



        const accessToken = await createJsonWebToken(jwtPayload, process.env.JWT_ACCESS_KEY, {expiresIn: "10m"});

        const newRefreshToken = await createJsonWebToken(jwtPayload, process.env.JWT_REFRESH_KEY, {expiresIn: "7d"});

        /*===========================================
        in future, delete old refresh token and store new one.
        ============================================ */

        res.cookie("accessToken", accessToken, {
            //10 min same as jwt expiresIn.
            maxAge: 10 * 60 * 1000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        })

        res.cookie("refreshToken", newRefreshToken, {
            //7 days same as jwt expiresIn.
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        })



        successResponse(res, {
            statusCode: 200,
            message: "Tokens refreshed successfully",
            payload: {
                user:jwtPayload,
            }

        })
    } catch (error) {

        if (error.name === "TokenExpiredError") {

            return next(createHttpError(401, "Refresh Token has expired. Please log in again."));
        } else if (error.name === "JsonWebTokenError") {
            return next(createHttpError(401, "Invalid Token!"));
        } else {
            next(error);
        }
        
    }

}

export const handleLogoutUser = async (req, res, next) => {

    try {

         /*=======================================
        in future, db logic will be as follow:

        
        const refreshTokenToInvalidate = req.cookies.refreshToken;

        if (refreshTokenToInvalidate) {
            //if 'refresh_tokens' are kept different table
            await pool.execute(`DELETE FROM refresh_tokens WHERE token = ?`, [refreshTokenToInvalidate]);
        }
        ========================================== */

        // Clear the cookie
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",

        });

       

        successResponse(res, {
            statusCode: 200,
            message: "logout successful",
            payload: {}

        })

    } catch (error) {
        next(error)
        
    }
    
}



