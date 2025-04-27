import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getAllMessage } from "../../service/chat";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ChatSection({ messages, selectedUser, setMessages, socket }) {
  const loginUserData = localStorage.getItem("loginUser");
  const loginUser = JSON.parse(loginUserData);
  const hasJoinedRoom = useRef(false);
  const chatEndRef = useRef(null); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const getRoomID = () => [loginUser?.id, selectedUser?._id].sort().join("_");

  useEffect(() => {
    if (!loginUser?.id || !selectedUser?._id) return;

    const roomID = getRoomID();

    if (!hasJoinedRoom.current) {
      socket.emit("join_chat", roomID);
      hasJoinedRoom.current = true;
    }

    fetchMessages();
  }, [selectedUser]);

  const fetchMessages = async () => {
    if (!selectedUser?._id || !loginUser?.id) return;
    try {
      const response = await getAllMessage({
        chatId: getRoomID(),
        user1: loginUser.id,
        user2: selectedUser._id,
      });
      setMessages(response?.data?.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("message received", data);
      if (data.chatId === getRoomID()) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle dropdown toggle + close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loginUser");
    navigate("/");
  };

  return (
    <div className="flex-1 relative flex flex-col bg-gray-300">
      {/* Top Bar with Profile Dropdown */}
      {/* <div className="flex justify-between items-center px-4 py-2 bg-white shadow-md">
        <h2 className="text-lg font-semibold">Chat with {selectedUser?.name}</h2>

        <div ref={dropdownRef} className="relative inline-block text-left">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
          >
            <FaUserCircle size={24} className="text-gray-700" />
            <span className="ml-2 font-medium text-gray-800">{loginUser?.name}</span>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div> */}

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages?.map((msg, index) => (
          <motion.div
            key={msg.id || index}
            initial={{ opacity: 0, x: msg.sender === loginUser.id ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 my-2 rounded-lg max-w-xs w-fit ${
              msg.sender === loginUser.id
                ? "bg-blue-500 text-white ml-auto"
                : "bg-blue-500 text-white"
            }`}
          >
            {msg.message}
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

export default ChatSection;
