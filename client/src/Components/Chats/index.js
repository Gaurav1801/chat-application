import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaUser, FaPaperPlane, FaSignOutAlt } from "react-icons/fa";
import { io } from "socket.io-client";
import { getAllUsers } from "../../service/users";
import ChatSection from "./ChatSection";
import { getAllMessage, sendMessage } from "../../service/chat";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const loginUserData = localStorage.getItem("loginUser");
  const loginUser = JSON.parse(loginUserData);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("loginUser"); // Remove user data
    navigate("/"); // Redirect to login page
  };

  // Fetch messages for selected user
  const getMessage = async () => {
    if (!selectedUser?._id || !loginUser?.id) return;
    try {
      const roomID = [loginUser.id, selectedUser._id].sort().join("_");
      const response = await getAllMessage({
        chatId: roomID,
        user1: loginUser.id,
        user2: selectedUser._id,
      });
      if (response?.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      getMessage();
    }
  }, [selectedUser]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success) {
          setUsers(response.data);
          setSelectedUser(response.data[0]); // Auto-select first user
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Join chat room when user is selected
  useEffect(() => {
    if (loginUser?.id && selectedUser?._id) {
      const roomID = [loginUser.id, selectedUser._id].sort().join("_");
      socket.emit("join_chat", roomID);
    }
  }, [selectedUser, loginUser]);

  // Send message function
  const handleSendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    const roomID = [loginUser.id, selectedUser._id].sort().join("_");

    const messageData = {
      user1: loginUser?.id,
      user2: selectedUser._id,
      chatId: roomID,
      message: input,
      receiver: selectedUser?.name,
      sender: loginUser.id,
      id: `${loginUser.id}-${Date.now()}`,
      type: "text",
    };

    try {
      const response = await sendMessage(messageData);
      if (response.success) {
        socket.emit("send_message", messageData);
        // setMessages((prev) => [...prev, messageData]); // Instant UI update
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  // Handle "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-5/6 h-5/6 bg-white shadow-2xl rounded-2xl flex overflow-hidden"
      >
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          {users.map((user) => (
            <div
              key={user._id}
              className={`p-3 cursor-pointer rounded-lg flex items-center gap-2 ${
                selectedUser?._id === user._id ? "bg-blue-500" : "hover:bg-gray-700"
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <FaUser /> {user.name}
            </div>
          ))}
        </div>

        {/* Chat Section */}
        <div className="flex flex-col w-3/4">
          {/* Chat Header */}
          <div className="p-4 bg-blue-600 text-white font-semibold text-lg flex justify-between items-center">
            <div>{selectedUser?.name || "Select a user"}</div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Chat Messages */}
          <ChatSection messages={messages} selectedUser={selectedUser} setMessages={setMessages} socket={socket} />

          {/* Input Box */}
          <div className="p-4 bg-white flex items-center border-t">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Sends message on Enter key press
            />
            <button
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={handleSendMessage}
            >
              <FaPaperPlane /> Send
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPage;