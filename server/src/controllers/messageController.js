import { GoogleGenerativeAI } from "@google/generative-ai";
import createHttpError from "http-errors";

import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { successResponse } from "./responseController.js";




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview" 
});




const generateChatTitle = async (firstPrompt) => {
    try {
        const prompt = `Summarize this user prompt into a short, catchy chat title (max 30 characters). 
        Do not use quotes or special characters. 
        Prompt: "${firstPrompt}"`;
        
        const result = await model.generateContent(prompt);
        return result.response.text().trim();

    } catch (error) {
        console.error("Auto-titling error:", error);
        return firstPrompt.substring(0, 20) + "...";
    }
};




export const handleSendMessage = async (req, res, next) => {
    try {

        const { chatId, content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return next(createHttpError(400, "Content is required"));
        }

        
        const chatDetail = await Chat.findById(chatId).populate("user");

        if (!chatDetail) {
            return next(createHttpError(404, "Chat session not found"))
        }

        // security check
        if (chatDetail.user._id.toString() !== userId.toString()) {
            return next(createHttpError(403, "Unauthorized: This is not your chat"));
        }

        // credits check
        if (chatDetail.user.credits <= 0) {
            return next(createHttpError(403, "Insufficient credits. Please recharge."));
        }

        // 4. fetch latest 6 message from database
        const messageHistory = await Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .limit(6);
        
        // 5. formatted according to Gemini
        const formattedMessageHistory = messageHistory.reverse().map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        // 6. save user message into database
        const userMessage = await Message.create({
            chat: chatId,
            role: "user",
            content: content
        });

        // 7. Gemini chat session start with message history
        const chatSession = model.startChat({
            history: formattedMessageHistory,
        });

        // 8. generate response from ai
        const result = await chatSession.sendMessage(content);
        const aiResponseText = result.response.text();

        // 9. save ai message into database
        const aiMessage = await Message.create({
            chat: chatId,
            role: "assistant",
            content: aiResponseText,
            tokenUsage: result.response.usageMetadata?.totalTokenCount || 0
        });


        if (messageHistory.length === 0 && chatDetail.title === "New Chat") {
            const newTitle = await generateChatTitle(content);
            await Chat.findByIdAndUpdate(chatId, { title: newTitle });
            console.log("Chat title updated to:", newTitle);
        }


        // 10. reduce credits of users
        await User.findByIdAndUpdate(chatDetail.user._id, { 
            $inc: { credits: -1 } 
        });

        return successResponse(res, {
            statusCode: 201,
            message: "Message exchanged successfully",
            payload: {
                //newMessages: [userMessage, aiMessage],
                userMessage,
                aiMessage
            }
        });

        
    } catch (error) {
        console.error("Gemini Error:", error);
        next(error);
    }
} 

export const handleGetMessages = async (req, res, next) => {

    try {
        const { chatId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        

        const [messages, totalMessages] = await Promise.all([
            Message.find({ chat: chatId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(), 
            Message.countDocuments({ chat: chatId })
        ]);

        const totalPages = Math.ceil(totalMessages / limit);

        return successResponse(res, {
            statusCode: 200,
            message: "Successfully fetched messages",
            payload: {
                messages,
                pagination: {
                    totalMessages,
                    totalPages,
                    currentPage: page,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                    nextPage: page < totalPages ? page + 1 : null
                }
            }
        });
    } catch (error) { 
        next(error); 
    }
};