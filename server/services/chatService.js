const Chat = require("../models/chatModel");



const getChatById = async (chatId) => {
    return await Chat.findById(chatId);
  };
  
  const findChatByUsers = async (user1, user2) => {
    return await Chat.findOne({
      $or: [{ user1, user2 }, { user1: user2, user2: user1 }]
    });
  };

const createChat = async (user1, user2) => {
  try {
    let chat = await Chat.findOne({ 
      $or: [{ user1, user2 }, { user1: user2, user2: user1 }]
    });

    if (!chat) {
      chat = new Chat({ user1, user2, messages: [] });
      await chat.save();
    }
    return chat;
  } catch (error) {
    throw new Error("Error creating chat: " + error.message);
  }
};

const sendMessage = async (chatId, sender, message, type) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    chat.messages.push({ message, type, isRead: false });
    await chat.save();
    return chat;
  } catch (error) {
    throw new Error("Error sending message: " + error.message);
  }
};

const getChatMessages = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId).populate("user1 user2", "name email");
    if (!chat) throw new Error("Chat not found");

    return chat.messages;
  } catch (error) {
    throw new Error("Error fetching messages: " + error.message);
  }
};

const markMessagesAsRead = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    chat.messages.forEach((msg) => (msg.isRead = true));
    await chat.save();
    return chat;
  } catch (error) {
    throw new Error("Error marking messages as read: " + error.message);
  }
};

module.exports = { createChat, sendMessage, getChatMessages, markMessagesAsRead ,findChatByUsers,getChatById};
