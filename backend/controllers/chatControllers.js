const { validationResult } = require("express-validator");
const Chat = require("../models/Chat");
const User = require("../models/User");
const { cleanInput } = require("../utils/SanitizeInputs");


exports.accessChat = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try {

        const { userId } = cleanInput(req.body);
        const loggedInUser = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: 'UserId is required' });
        }

        // isse self chat nhi hogi 
        if (userId === loggedInUser) {
            return res.status(400).json({ message: "You cannot chat with yourself" });
        }

        let isChat = await Chat.findOne({
                isGroupChat: false,
                users: { $all: [loggedInUser, userId] },
            })
            .populate('users', 'name email avatar')
            .populate({
                path: 'latestMessage',
                populate: {
                    path: 'sender',
                    select: 'name email avatar',
                },
            });

        if (isChat) {
            return res.status(200).json({ chat: isChat });
        }

        const newChat = new Chat({
            chatName: '',
            isGroupChat: false,
            users: [loggedInUser, userId],
        });

        const createdChat = await newChat.save();

        const fullChat = await Chat.findById(createdChat._id)
            .populate('users', 'name email avatar')
            .populate({
                path: 'latestMessage',
                populate: {
                    path: 'sender',
                    select: 'name email avatar',
                },
            });

        return res.status(200).json({ chat: fullChat });
    } catch (err) {
        console.error('Access Chat Error:', err.message);
        return res
            .status(500)
            .json({ message: 'Something went wrong', error: err.message });
    }
};






exports.fetchChats = async(req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const chats = await Chat.find({ users: { $in: [userId] } })
            .populate("users", "name email avatar")
            .populate("groupAdmin", "name email avatar")
            .populate({
                path: "latestMessage",
                populate: {
                    path: "sender",
                    select: "name email avatar"
                }
            })
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            count: chats.length,
            chats,
        });

    } catch (error) {
        console.error("Fetch Chats Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to fetch chats" });
    }
};







// =================FRONTEND-FUTURE MEIN=======================================

// future mein implement krunga iska frontend  -> groupChat

//group Chat 
exports.createGroupChat = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { users, name } = cleanInput(req.body);

        if (!users || !name) {
            return res.status(400).json({ message: "Please provide group name and users" });
        }

        let parsedUsers;
        try {
            parsedUsers = JSON.parse(users);
        } catch (e) {
            return res.status(400).json({ message: "Invalid users format. Must be a JSON array." });
        }

        if (parsedUsers.length < 2) {
            return res.status(400).json({ message: "Group must have at least 3 members (including you)" });
        }

        parsedUsers.push(req.user.id);

        const groupChat = await Chat.create({
            chatName: name,
            users: parsedUsers,
            isGroupChat: true,
            groupAdmin: req.user.id,
        });

        const fullGroupChat = await Chat.findById(groupChat._id)
            .populate("users", "name email avatar")
            .populate("groupAdmin", "name email avatar");


        console.log(fullGroupChat);
        return res.status(201).json({
            success: true,
            message: "Group created successfully",
            group: fullGroupChat,
        });

    } catch (error) {
        console.error("Create Group Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to create group", error: error.message });
    }
};






//Group Chat - rname 
exports.renameGroupChat = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { chatId, chatName } = cleanInput(req.body);

        if (!chatId || !chatName) {
            return res.status(400).json({ message: "chatId and chatName are required" });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
                chatId, { chatName }, { new: true }
            )
            .populate("users", "name email avatar")
            .populate("groupAdmin", "name email avatar");

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Group name updated successfully",
            chat: updatedChat,
        });

    } catch (error) {
        console.error("Rename Group Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to rename group", error: error.message });
    }
};








//Group Chat - userAdd 
exports.addUserToGroup = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { chatId, userId } = cleanInput(req.body);

        if (!chatId || !userId) {
            return res.status(400).json({ message: "chatId and userId are required" });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
                chatId, { $addToSet: { users: userId } }, { new: true }
            )
            .populate("users", "name email avatar")
            .populate("groupAdmin", "name email avatar");

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User added to group successfully",
            chat: updatedChat
        });

    } catch (error) {
        console.error("Add User Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to add user to group", error: error.message });
    }
};



// remove User -> grpChat
exports.removeUserFromGroup = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { chatId, userId } = cleanInput(req.body);

        if (!chatId || !userId) {
            return res.status(400).json({ message: "chatId and userId are required" });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
                chatId, { $pull: { users: userId } }, { new: true }
            )
            .populate("users", "name email avatar")
            .populate("groupAdmin", "name email avatar");

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User removed from group successfully",
            chat: updatedChat
        });

    } catch (error) {
        console.error("Remove User Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to remove user from group", error: error.message });
    }
};