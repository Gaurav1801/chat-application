const chatService = require("../services/chatService");

module.exports = {
    createChat: async(req, res) => {
        try {
            const { chatId, user1, user2 } = req.body;
            const chat = await chatService.createChat(chatId, user1, user2);
            res.status(201).json({
                success: true,
                message: "Chat created successfully",
                data: chat
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    sendMessage: async(req, res) => {
        try {
            let { user1, user2, chatId, sender, receiver, message, type } = req.body;
            console.log("req.body ", req.body)
            if (!["text", "url"].includes(type)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid message type"
                });
            }

            // Check if receiver is provided
            if (!receiver) {
                return res.status(400).json({
                    success: false,
                    error: "Receiver is required"
                });
            }
            console.log("lool")
            let chat;
            // Check if a chatId is provided
            if (chatId) {
                console.log("chatId123", chatId)
                chat = await chatService.getChatById(chatId);
                console.log("chat", chat)
            } else {
                // If chatId is not provided, check if a chat exists between user1 and user2
                chat = await chatService.findChatByUsers(user1, user2);

            }
            // If chat does not exist, create a new chat
            if (!chat) {
                console.log("lool11212122121")

                chat = await chatService.createChat(chatId, user1, user2);
            }

            // Determine receiver if not explicitly provided
            let actualReceiver = user2;
            console.log("actualReceiver", actualReceiver)
            if (!actualReceiver) {
                actualReceiver = chat.user1.equals(user1) ? chat.user2 : chat.user1;
            }

            // Now send the message
            const updatedChat = await chatService.sendMessage(
                chatId,
                sender,
                receiver = actualReceiver,
                message,
                type, user1, user2,
            );

            res.status(200).json({
                success: true,
                message: "Message sent successfully",
                data: updatedChat
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getChatMessages: async(req, res) => {
        try {
            const { chatId } = req.params;
            const messages = await chatService.getChatMessages(chatId);
            res.status(200).json({
                success: true,
                message: "Messages retrieved successfully",
                data: messages
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    markMessagesAsRead: async(req, res) => {
        try {
            const { chatId } = req.params;
            const { userId } = req.body; // Add userId to only mark messages received by this user

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: "User ID is required to mark messages as read"
                });
            }

            const chat = await chatService.markMessagesAsRead(chatId, userId);
            res.status(200).json({
                success: true,
                message: "Messages marked as read",
                data: chat
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getUserChats: async(req, res) => {
        try {
            const { userId } = req.params;

            // Find all chats where the user is either user1 or user2
            const chats = await Chat.find({
                $or: [{ user1: userId }, { user2: userId }]
            }).populate("user1 user2", "name email");

            res.status(200).json({
                success: true,
                message: "User chats retrieved successfully",
                data: chats
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};