const Message = require("../models/Message");
const cloudinary = require("cloudinary").v2;

module.exports = function messageHandlers(io, socket) {

    socket.on("join-chat", (chatId) => {
        if (chatId) {
            socket.join(chatId);
            console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
        }
    });


    socket.on("send-message", async(data) => {
        try {
            const { chatId, content, fileUrl, fileType, public_id } = data;
            const sender = socket.user._id;

            if (!chatId || (!content && !fileUrl)) return;

            const newMessage = await Message.create({
                sender,
                content,
                chat: chatId,
                file: fileUrl ? { url: fileUrl, type: fileType, public_id } : undefined,
            });

            const fullMessage = await Message.findById(newMessage._id)
                .populate("sender", "name email avatar")
                .populate("chat");


            io.to(chatId).emit("new-message", fullMessage);
            console.log(`Message sent by ${socket.user.name} in chat ${chatId}`);

        } catch (error) {
            console.error("Send Message Error:", error.message);
            socket.emit("message-error", "Failed to send message");
        }
    });
};