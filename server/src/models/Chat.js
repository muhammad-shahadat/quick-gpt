import mongoose from "mongoose";


const ChatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    title: {
        type: String,
        default: "New Chat"
    },

    isArchived: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;