const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const initSocket = require("./sockets/index");
const io = initSocket(server);

// real-time ke liye yeh important hai 
app.set("io", io);


require('dotenv').config();

const PORT = process.env.PORT || 4562;

const morgan = require('morgan');
app.use(morgan('dev'));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const helmet = require('helmet');
app.use(helmet());

app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
}))



const userRoutes = require("./routes/userRoutes");
app.use("/api/v1/users", userRoutes)

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/v1/users/chats", chatRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use("/api/v1/users/chats/messages", messageRoutes);


const dbConnect = require("./config/db");
dbConnect();

const cloudConnect = require("./config/cloudinary");
cloudConnect();

server.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
})