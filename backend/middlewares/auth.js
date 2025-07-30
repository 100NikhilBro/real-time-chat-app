const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.isAuthenticated = async(req, res, next) => {
    try {
        let token;


        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }


        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }


        if (!token) {
            return res.status(401).json({ error: "Unauthorized. Token missing." });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        req.user = decoded;


        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }
};