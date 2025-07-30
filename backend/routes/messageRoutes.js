const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const {
    sendMessage,
    getAllMessages
} = require("../controllers/messageControllers");

const { isAuthenticated } = require("../middlewares/auth");
const upload = require("../middlewares/multer");



router.post(
    "/chat/:chatId/message",
    isAuthenticated,
    upload.single("file"), [
        param("chatId").notEmpty().withMessage("chatId is required"),
        body("content")
        .optional()
        .isLength({ min: 1 })
        .withMessage("Message content must not be empty if provided"),
    ],
    (req, res, next) => {
        req.body.chatId = req.params.chatId;
        next();
    },
    sendMessage
);


router.get("/message/:chatId", isAuthenticated, getAllMessages);


module.exports = router;