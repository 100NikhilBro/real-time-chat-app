const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,  
            ssl: true,                
            tlsAllowInvalidCertificates: true,
        });

        console.log("Connected Successfully");

    } catch (e) {
        console.log("Connection Failed:", e.message);
        throw new Error(e);
    }
}

module.exports = dbConnect;
