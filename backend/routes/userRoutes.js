const express = require('express');
const { body } = require('express-validator');
const {
    loginUser,
    registerUser,
    logoutUser,
    getMyProfile,
    getAllUsers,
    deleteMyAccount,
    updateProfile,
    uploadProfilePic,
    searchUsers
} = require('../controllers/userControllers');
const { isAuthenticated } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

const router = express.Router();

router.post(
    "/register", [
        body("name", "Name is required").notEmpty(),
        body("email", "Valid email is required").isEmail(),
        body("password", "Password must be 6+ characters").isLength({ min: 6 })
    ],
    registerUser
);

router.post(
    "/login", [
        body("email", "Valid email is required").isEmail(),
        body("password", "Password is required").notEmpty()
    ],
    loginUser
);


router.post("/logout", isAuthenticated, logoutUser);


router.get("/myprofile", isAuthenticated, getMyProfile);


router.get("/allusers", isAuthenticated, getAllUsers);


router.delete("/deletemyaccount", isAuthenticated, deleteMyAccount);



router.put(
    "/updateprofile",
    isAuthenticated, [
        body("name").optional().isLength({ min: 3 }).withMessage("Name too short"),
        body("email").optional().isEmail().withMessage("Invalid email"),
        body("password")
        .optional()
        .custom((value) => {
            if (value === "") return true;
            if (value.length >= 6) return true;
            throw new Error("Weak password");
        }),
    ],
    updateProfile
);




router.post(
    "/uploadprofilepic",
    isAuthenticated,
    upload.single("avatar"),
    uploadProfilePic
);

router.get("/search", isAuthenticated, searchUsers);



module.exports = router;