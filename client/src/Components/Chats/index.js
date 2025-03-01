import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaPaperPlane } from "react-icons/fa";
import { getAllUsers } from "../../service/users";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log("response", response);
        if (response.success) {
          setUsers(response.data);
          setSelectedUser(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSendMessage = () => {
    if (!input.trim() || !selectedUser) return;
    setMessages((prev) => ({
      ...prev,
      [selectedUser._id]: [...(prev[selectedUser._id] || []), { text: input, sender: "me" }],
    }));
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="w-3/4 h-4/5 bg-white shadow-2xl rounded-2xl flex overflow-hidden"
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
            {selectedUser?.name || "Select a user"}
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            {(messages[selectedUser?._id] || []).map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.sender === "me" ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 my-2 rounded-lg max-w-xs w-fit ${
                  msg.sender === "me" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white flex items-center border-t">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
