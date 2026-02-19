import createHttpError from "http-errors";

import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { successResponse } from "./responseController.js";


export const handleCreateChat = async (req, res, next) => {
    try {
        
        const userId = req.user.id;
        
        const chatData = {
            user: userId,
            title: req.body && req.body.title ? req.body.title : "New Chat",
        };

        const newChat = await Chat.create(chatData);

        if (!newChat) {
            return next(createHttpError(400, "Failed to start a new chat session"));
        }

        return successResponse(res, {
            statusCode: 201,
            message: "Chat created and stored in DB successfully",
            payload: newChat
        });

    } catch (error) {
        next(error);
    }
};


export const handleGetChats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        
        const chats = await Chat.find({ user: userId, isArchived: false })
            .sort({ updatedAt: -1 }) 
            .skip(skip) 
            .limit(limit)
            .select("title createdAt updatedAt")
            .lean();

        
        const chatsWithLastMessage = await Promise.all(
            chats.map(async (chat) => {
                const lastMessage = await Message.findOne({ chat: chat._id })
                    .sort({ createdAt: -1 })
                    .select("content role")
                    .lean();
                
                return {
                    ...chat,
                    lastMessage: lastMessage ? lastMessage.content.substring(0, 40) + "..." : "No messages yet"
                };
            })
        );

        const totalChats = await Chat.countDocuments({ user: userId, isArchived: false });

        return successResponse(res, {
            statusCode: 200,
            message: "Paginated chat list fetched successfully",
            payload: {
                chats: chatsWithLastMessage,
                pagination: {
                    totalChats,
                    currentPage: page,
                    totalPages: Math.ceil(totalChats / limit),
                    hasNextPage: page * limit < totalChats
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const handleDeleteChat = async (req, res, next) => {
    try {

        const { chatId } = req.params;
        const userId = req.user.id;

        
        const chat = await Chat.findOne({ _id: chatId, user: userId });

        if (!chat) {
            return next(createHttpError(404, "Chat not found or you don't have permission to delete it"));
        }

       
        const deletedMessages = await Message.deleteMany({ chat: chatId });

        
        await Chat.findByIdAndDelete(chatId);

        return successResponse(res, {
            statusCode: 200,
            message: "Chat and its history deleted successfully",
            payload: {
                deletedChatId: chatId,
                messagesDeletedCount: deletedMessages.deletedCount
            }
        });

    } catch (error) {
        next(error);
    }
};