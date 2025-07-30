const express = require('express');
const router = express.Router();
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroupChat,
    addUserToGroup,
    removeUserFromGroup
} = require('../controllers/chatControllers');

const { isAuthenticated } = require('../middlewares/auth');
const { body } = require('express-validator');


router.post(
    '/access',
    isAuthenticated, [body('userId', 'UserId is required').notEmpty()],
    accessChat
);


router.get('/fetchChats', isAuthenticated, fetchChats);



// below all are chat routes -> future mein frontend mein implement krunga 


router.post(
    '/group',
    isAuthenticated, [
        body('users', 'Users array is required').notEmpty(),
        body('name', 'Group name is required').notEmpty()
    ],
    createGroupChat
);


router.put(
    '/rename',
    isAuthenticated, [
        body('chatId', 'Chat ID is required').notEmpty(),
        body('chatName', 'Chat Name is required').notEmpty()
    ],
    renameGroupChat
);



router.put(
    '/group/add',
    isAuthenticated, [
        body('chatId', 'Chat ID is required').notEmpty(),
        body('userId', 'User ID is required').notEmpty()
    ],
    addUserToGroup
);


router.put(
    '/group/remove',
    isAuthenticated, [
        body('chatId', 'Chat ID is required').notEmpty(),
        body('userId', 'User ID is required').notEmpty()
    ],
    removeUserFromGroup
);

module.exports = router;