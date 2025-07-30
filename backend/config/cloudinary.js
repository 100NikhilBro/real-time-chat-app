const cloudinary = require('cloudinary').v2;

require('dotenv').config();

const cloudConnect = async() => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_KEY,
            api_secret: process.env.CLOUD_SECRET,
        })

        console.log("Connected to cloudinary");

    } catch (e) {
        console.log("Failed to connect the Cloudinary", e);
        throw new Error(e);
    }
}

module.exports = cloudConnect;