const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect = async() => {
    try {
        mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            UseUnifiedTopology: true,
        })

        console.log("Connected Successfully");

    } catch (e) {
        console.log("Connection Failed");
        throw new Error(e);
    }
}

module.exports = dbConnect;