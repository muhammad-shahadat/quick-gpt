import createHttpError from "http-errors";

import { successResponse } from "./responseController.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import imageKit from "../configs/imageKit.js";



export const handleGenerateImage = async (req, res, next) => {
    try {
        const { chatId, content, isPublished } = req.body;
        const userId = req.user.id;

        if (!content) {
            return next(createHttpError(400, "Content is required"));
        }

        const chatDetail = await Chat.findById(chatId).populate("user");

        if (!chatDetail) {
            return next(createHttpError(404, "Chat session not found"));
        }


        //security check
        if (chatDetail.user._id.toString() !== userId.toString()) {
            return next(createHttpError(403, "Unauthorized: This is not your chat"));
        }

        // credits check
        if (chatDetail.user.credits < 5) {
            return next(createHttpError(403, "Insufficient credits. Need at least 5 credits."));
        }

        //save user message into message model database
        const userMessage = await Message.create({
            chat: chatId,
            role: "user",
            content: content,
            isImage: false

        });

        const encodedPrompt = encodeURIComponent(content);

        
        // Pollinations AI সম্পূর্ণ ফ্রি এবং আনলিমিটেড
        const aiImageUrl = `https://image.pollinations.ai/p/${encodedPrompt}?width=800&height=800&seed=${Date.now()}`;
        console.log("Fetching AI image from: ", aiImageUrl);

        // ১. ফ্রি এআই ইউআরএল থেকে ইমেজের র ডেটা তুলে আনা
        const aiResponse = await fetch(aiImageUrl);
        console.log("ai response: ", aiResponse);
        if (!aiResponse.ok) {
            throw createHttpError(500, "AI Server failed to respond");
        }

        // ২. ইমেজ ডেটাকে নোডের বিল্ট-ইন Buffer-এ কনভার্ট করা
        const arrayBuffer = await aiResponse.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer); // কোনো ইম্পোর্ট ছাড়াই ডিরেক্ট কাজ করবে

        console.log("Uploading valid image buffer to ImageKit...");
        const uploadResponse = await imageKit.files.upload({
            file: imageBuffer,
            fileName: `ai-image-${Date.now()}.png`,
            folder: "quickgpt"
        });

        //save ai message into database
        const aiMessage = await Message.create({
            chat: chatId,
            role: "assistant",
            content: uploadResponse.url,
            isImage: true,
            isPublished: isPublished
        });

        const updatedUser = await User.findByIdAndUpdate(
            chatDetail.user._id, 
            { $inc: { credits: -5 } },
            { new: true }
        );

        return successResponse(res, {
            statusCode: 201,
            message: "Image generated and saved successfully",
            payload: {
                userMessage,
                aiMessage,
                remainingCredits: updatedUser.credits,
            }
        });

    } catch (error) {
        console.error("ImageKit Generation Error:", error);
        next(error)
        
    }


}


export const handleGetPublishedImages = async (req, res, next) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Message -> Chat -> User (Nested Populate)
        const publishedImages = await Message.find({
            isImage: true,
            isPublished: true
        })
        .populate({
            path: 'chat',
            select: 'user',
            populate: {
                path: 'user',
                select: 'name'
            }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

        
        const totalImages = await Message.countDocuments({ 
            isImage: true, 
            isPublished: true 
        });

        
        
        return successResponse(res, {
            statusCode: 200,
            message: "Community gallery images fetched successfully",
            payload: {
                images: publishedImages,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalImages / limit),
                    totalImages: totalImages,
                    hasNextPage: page * limit < totalImages,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Gallery Fetch Error:", error);
        next(error);
    }
};