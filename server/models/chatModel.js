import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
      {
        message: { type: String, required: true }, // Stores both text messages & URLs
        timestamp: { type: Date, default: Date.now },
        type: { type: String, enum: ["text", "url"], required: true }, // Only "text" or "url"
        isRead: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
