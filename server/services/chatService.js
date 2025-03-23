const Chat = require("../models/chatModel");

const getChatById = async(chatId) => {
    try {
        console.log("chatId11111111111", chatId)
        const add = await Chat.findOne({ chatId })
        console.log("add", add)
        return add
    } catch (error) {
        throw new Error("Error " + error.message);
    }
};

const findChatByUsers = async(user1, user2) => {
    return await Chat.findOne({
        $or: [{ user1, user2 }, { user1: user2, user2: user1 }]
    });
};

const createChat = async(chatId, user1, user2) => {
    try {
        let chat = await Chat.findOne({
            $or: [{ user1, user2 }, { user1: user2, user2: user1 }]
        });
        if (!chat) {
            chat = new Chat({ chatId, user1, user2, messages: [] });
            await chat.save();
        }
        return chat;
    } catch (error) {
        throw new Error("Error creating chat: " + error.message);
    }
};

const sendMessage = async(chatId, sender, receiver, message, type, user1, user2) => {
    console.log("chatId00000", chatId)
    try {
        const chat = await Chat.findOne({ chatId });
        console.log("------chat-----", chat)
        if (!chat) throw new Error("Chat not found");

        // Ensure sender and receiver are valid users in this chat
        if (!(chat.user1.equals(user1) || chat.user2.equals(user1))) {
            throw new Error("Sender is not part of this chat");
        }

        if (!(chat.user1.equals(user2) || chat.user2.equals(user2))) {
            throw new Error("Receiver is not part of this chat");
        }
        console.log("-*******", user1, user2)
        chat.messages.push({
            message,
            sender: user1,
            receiver: user2,
            type,
            isRead: false
        });

        await chat.save();
        return chat;
    } catch (error) {
        throw new Error("Error sending message: " + error.message);
    }
};

const getChatMessages = async(chatId) => {
    try {
        const chat = await Chat.findById(chatId)
            .populate("user1 user2", "name email")
            .populate("messages.sender messages.receiver", "name email");

        if (!chat) throw new Error("Chat not found");
        return chat.messages;
    } catch (error) {
        throw new Error("Error fetching messages: " + error.message);
    }
};

const markMessagesAsRead = async(chatId, userId) => {
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) throw new Error("Chat not found");

        // Only mark messages as read where the current user is the receiver
        chat.messages.forEach((msg) => {
            if (msg.receiver.equals(userId) && !msg.isRead) {
                msg.isRead = true;
            }
        });

        await chat.save();
        return chat;
    } catch (error) {
        throw new Error("Error marking messages as read: " + error.message);
    }
};

module.exports = {
    createChat,
    sendMessage,
    getChatMessages,
    markMessagesAsRead,
    findChatByUsers,
    getChatById
};