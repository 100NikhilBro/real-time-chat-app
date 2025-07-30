const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        trim: true,
    },
    file: {
        public_id: String, // For Cloudinary
        url: String, // File URL to access
        fileType: String // Optional: image/pdf/zip etc
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);