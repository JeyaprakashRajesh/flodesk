const express = require('express');
const cors = require('cors');
const { connectDB } = require('./utilities/db');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { FetchData, CreateElement } = require('./controllers/project');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", require("./routes/auth"));

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

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

    socket.on("createElement", async ({ project_id, name, props }) => {
        try {
            console.log(`Creating element in project ${project_id}`);
            
            const req = { body: { name, props }, params: { project_id } };
            const res = {
                status: (code) => ({
                    json: (response) => {
                        console.log("Response:", response);
                        const event = response.success ? "elementCreated" : "elementError";
                        io.to(socket.id).emit(event, response);
                    },
                }),
            };

            await CreateElement(req, res);
        } catch (error) {
            console.error("Error in createElement event:", error);
            io.to(socket.id).emit("elementError", { success: false, message: "Internal server error" });
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});