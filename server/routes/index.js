const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// ------auth------------

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);



///-------------users-------------

router.get("/get-users", userController.getAllUsers);


//----------------chats-------------

const chatController = require("../controllers/chatController");

router.post("/createChat", chatController.createChat); // Create a chat
router.post("/sendMessage", chatController.sendMessage); // Send a message
router.get("/:chatId", chatController.getChatMessages); // Get chat messages
router.put("/:chatId/read", chatController.markMessagesAsRead); // Mark messages as read



module.exports = router;
