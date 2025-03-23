const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [{
        message: { type: String, required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        timestamp: { type: Date, default: Date.now },
        type: { type: String, enum: ["text", "url"], required: true },
        isRead: { type: Boolean, default: false }
    }]
}, { timestamps: true });

// Create a compound index for faster querying of chats between two users
chatSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);