import mongoose from "mongoose";



const MessageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true
    },

    role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true
    },

    content: {
        type: String,
        required: true
    },

    isImage: {
        type: Boolean,
        default: false
    },

    isPublished: {
        type: Boolean,
        default: false
    },

    tokenUsage: {
        type: Number,
        default: 0
    }

}, {timestamps: true})

MessageSchema.index({ content: "text" });

const Message = mongoose.model("Message", MessageSchema);
export default Message;