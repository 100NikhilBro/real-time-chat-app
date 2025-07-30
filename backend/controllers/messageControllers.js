const { validationResult } = require("express-validator");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");
const { cleanInput } = require("../utils/SanitizeInputs");






exports.sendMessage = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const sender = req.user.id;
        const { content, chatId } = cleanInput(req.body);

        if (!chatId || (!content && !req.file)) {
            return res.status(400).json({ message: "Message content or file is required" });
        }

        const newMessageData = { sender, chat: chatId };


        if (content) newMessageData.content = content;

        // Optional file (handled by multer if active)
        if (req.file) {
            newMessageData.file = {
                url: req.file.path,
                format: req.file.mimetype.split("/")[1],
                size: req.file.size || 0,
                public_id: req.file.filename,
            };
        }

        let message = await Message.create(newMessageData);


        message = await message.populate("sender", "name email avatar");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email avatar",
        });



        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

        // real time mein msg jaye
        req.app.get("io").to(chatId).emit("new-message", message);

        return res.status(201).json({
            success: true,
            message: "Message sent",
            data: message,
        });

    } catch (err) {
        console.error("Send Message Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: err.message,
        });
    }
};





exports.getAllMessages = async(req, res) => {
    try {
        const chatId = req.params.chatId;

        if (!chatId) {
            return res.status(400).json({ message: "Chat ID is required" });
        }

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name email avatar")
            .populate("chat")
            .sort({ createdAt: 1 }); // ⬆️ oldest to newest

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages,
        });

    } catch (error) {
        console.error("Get All Messages Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message,
        });
    }
};