require('dotenv').config();
const express = require('express');
const app = require('./src/app')
const connectDB = require('./src/config/db');
const startServer = async () => {
    try {
        await connectDB()
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`);
        })
    }
    catch(err) {
        console.error(err);
    }

}
startServer();
//=====================================================
