const express = require('express');
const cors = require('cors');
const { connectDB } = require('./utilities/db');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { FetchData } = require('./controllers/project');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/user", require("./routes/auth"));
app.use("/api/project", require("./routes/project"));

// Start Express API Server
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// ---------- SOCKET.IO SETUP ----------
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("fetchProject", (project_id) => {
        console.log(`Fetching project with ID: ${project_id}`);
        FetchData(socket, project_id); 
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
