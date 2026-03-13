const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    studentId: { type: String, ref: 'Student', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);