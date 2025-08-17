const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 20000, 
            socketTimeoutMS: 45000,
            family: 4, 
        });

        console.log("MongoDB Connected Successfully");
    } catch (e) {
        console.log("MongoDB Connection Failed:", e.message);
        console.log("Full error:", e);
        throw new Error(e);
    }
}
module.exports = dbConnect;
