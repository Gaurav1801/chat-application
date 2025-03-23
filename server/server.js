require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // Import http module
const { Server } = require("socket.io"); // Import Socket.IO
const connectDB = require("./config/db");

const userRoutes = require("./routes");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (change this for security in production)
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`User joined room: ${chatId}`);
    });

    socket.on("send_message", (data) => {
        console.log("message recives", data)
        io.to(data.chatId).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});