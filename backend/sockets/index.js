const socketAuth = require("./socketAuth");
const messageHandlers = require("./messagehandler");
require('dotenv').config();

module.exports = function initSocket(server) {
    const { Server } = require("socket.io");

    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });


    io.use(socketAuth);


    io.on("connection", (socket) => {
        // console.log("🔌 Socket Connected:", socket.user.name || "Unknown");

        socket.join(socket.user._id.toString());


        messageHandlers(io, socket);


        socket.on("disconnect", () => {
            // console.log("Socket Disconnected:", socket.user.name || "Unknown");
        });
    });

    return io;
};
