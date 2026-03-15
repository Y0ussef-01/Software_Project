const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
    sender: { type: String, ref: 'Student', required: true },
    receiver: { type: String, ref: 'Student', required: true },
    courseId: { type: String, ref: 'Course', required: true },
    senderGroupName: { type: String, required: true },
    receiverGroupName: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);