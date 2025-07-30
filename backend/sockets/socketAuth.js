const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function socketAuth(socket, next) {
    try {
        const token = socket.handshake.auth.token;
        console.log("🔐 Token received:", token);

        if (!token) {
            console.log("🚫 No token provided");
            return next(new Error("Authentication token missing"));
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded:", decoded);


        const user = await User.findById(decoded.id).select("name email avatar");
        if (!user) {
            console.log(" User not found");
            return next(new Error("User not found"));
        }

        socket.user = user;
        console.log("Authenticated User:", user.name);
        next();
    } catch (error) {
        console.error("Socket Auth Error:", error.message);
        next(new Error("Authentication error"));
    }
};