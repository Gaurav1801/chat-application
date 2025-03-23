import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getAllMessage } from "../../service/chat";

function ChatSection({ messages, selectedUser, setMessages, socket }) {
  const loginUserData = localStorage.getItem("loginUser");
  const loginUser = JSON.parse(loginUserData);
  const hasJoinedRoom = useRef(false);
  const chatEndRef = useRef(null); 
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
      console.log("message recived",data)
      if (data.chatId === getRoomID()) {
        setMessages((prev) => [...prev, data]); // Append the message to existing list
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
  return (
    <div  ref={chatEndRef} className="flex-1 p-4 overflow-y-auto bg-gray-300">
      {messages?.map((msg, index) => (
        <motion.div
          key={msg.id || index}
          initial={{ opacity: 0, x: msg.sender === loginUser.id ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-3 my-2 rounded-lg max-w-xs w-fit ${
            msg.sender === loginUser.id ? "bg-blue-500 text-white ml-auto" : "bg-blue-500 text-white "
          }`}
        >
          {msg.message}
        </motion.div>
      ))}
       <div ref={chatEndRef} />
    </div>
  );
}

export default ChatSection;

