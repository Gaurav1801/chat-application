const chatService = require("../services/chatService");

module.exports = {
  createChat: async (req, res) => {
    try {
      const { user1, user2 } = req.body;
      const chat = await chatService.createChat(user1, user2);
      res.status(201).json({ success: true, message: "Chat created successfully", data: chat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { user1, user2, chatId, sender, message, type } = req.body;
  
      if (!["text", "url"].includes(type)) {
        return res.status(400).json({ success: false, error: "Invalid message type" });
      }
  
      let chat;
  
      // Check if a chatId is provided
      if (chatId) {
        chat = await chatService.getChatById(chatId);
      } else {
        // If chatId is not provided, check if a chat exists between user1 and user2
        chat = await chatService.findChatByUsers(user1, user2);
  
        // If chat does not exist, create a new chat
        if (!chat) {
          chat = await chatService.createChat(user1, user2);
        }
      }
  
      // Now send the message
      const updatedChat = await chatService.sendMessage(chat._id, sender, message, type);
  
      res.status(200).json({ success: true, message: "Message sent successfully", data: updatedChat });
  
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  ,

  getChatMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      const messages = await chatService.getChatMessages(chatId);
      res.status(200).json({ success: true, message: "Messages retrieved successfully", data: messages });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  markMessagesAsRead: async (req, res) => {
    try {
      const { chatId } = req.params;
      const chat = await chatService.markMessagesAsRead(chatId);
      res.status(200).json({ success: true, message: "Messages marked as read", data: chat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
