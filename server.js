require('dotenv').config();
const express = require('express');
const app = require('./src/app')
const connectDB = require('./src/config/db');
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        })
    }
    catch(err) {
        console.error(err);
    }

}
startServer();
//=====================================================
