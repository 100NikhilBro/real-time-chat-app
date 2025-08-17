const User = require("../models/User");
const { validationResult } = require('express-validator');
const { cleanInput } = require("../utils/SanitizeInputs.js");
const { hashedPassword, verifyPassword } = require("../utils/securePassword.js");
const { v2: cloudinary } = require("cloudinary");
const jwt = require("jsonwebtoken");




exports.registerUser = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

    try {
        const { name, email, password } = cleanInput(req.body);
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const alreadyRegister = await User.findOne({ email });
        if (alreadyRegister) {
            return res.status(409).json({ message: "User already registered" });
        }

        const hashPassword = await hashedPassword(password);
        const newUser = await User.create({ name, email, password: hashPassword });
        const safeUser = await User.findById(newUser._id).select("-password");

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: safeUser,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "User registration failed",
            error: e.message,
        });
    }
};




exports.loginUser = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

    try {
        const { email, password } = cleanInput(req.body);
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) {
            return res.status(404).json({ message: "User not registered" });
        }

        const isVerify = await verifyPassword(existingUser.password, password);
        if (!isVerify) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const safeUser = await User.findById(existingUser._id).select("-password");

        const payload = {
            id: safeUser._id,
            name: safeUser.name,
            email: safeUser.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: safeUser,
            token,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: e.message,
        });
    }
};




exports.logoutUser = async(req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: e.message,
        });
    }
};




exports.getMyProfile = async(req, res) => {
    try {
        const id = req.user.id;
        // console.log("------------>", id);
        if (!id) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findById(id).select("-password");
        return res.status(200).json({ success: true, user });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: e.message,
        });
    }
};




exports.updateProfile = async(req, res) => {

    // console.log(req.user);
    if (req.body.password === "") delete req.body.password;

    const errors = validationResult(req);
    // console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { name, email, password } = cleanInput(req.body);
        const id = req.user.id;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;

        if (password) {
            const hashPassword = await hashedPassword(password);
            user.password = hashPassword;
        }

        await user.save();

        const updatedUser = await User.findById(id).select("-password");
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Update failed",
            error: e.message,
        });
    }
};






exports.getAllUsers = async(req, res) => {
    try {
        const id = req.user.id;
        const allUsers = await User.find({ _id: { $ne: id } }).select("-password"); // sbko bhejna hai khud ko nhi 
        return res.status(200).json({ success: true, users: allUsers });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Failed to get users",
            error: e.message,
        });
    }
};




exports.deleteMyAccount = async(req, res) => {
    try {
        const id = req.user.id;
        await User.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete account",
            error: e.message,
        });
    }
};





exports.uploadProfilePic = async(req, res) => {
    try {
        const userId = req.user.id;
        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: "No file uploaded!" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found!" });


        if (user.avatar.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        user.avatar = {
            public_id: req.file.filename,
            url: req.file.path,
        };

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Avatar updated successfully!",
            avatar: user.avatar,
        });
    } catch (e) {
        return res.status(500).json({ error: "Something went wrong!" });
    }
};





exports.searchUsers = async(req, res) => {
    const keyword = req.query.search;

    try {
        const filter = keyword ? {
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
            ],
            _id: { $ne: req.user.id },
        } : { _id: { $ne: req.user.id } };

        const users = await User.find(filter).select("name email avatar");
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Server error while searching users" });
    }
};
