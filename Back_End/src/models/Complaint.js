const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    student: { type: String, ref: 'Student', required: true },
    type: { type: String, enum: ['Complaint', 'Suggestion'], required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);