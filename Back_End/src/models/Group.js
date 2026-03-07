const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    _id:{ type: String, required: true },
    course: { type: String, ref: 'Course', required: true },
    groupName: { type: String, required: true },
    Room: { type: String, required: true },
    type: { type: String, enum: ['Lecture','Lab','Tutorial'], required: true },
    enrolledStudents: [{ type: String, ref: "Student" }],
    capacity: { type: Number, required: true },
    appointment: {
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }
});

module.exports = mongoose.model('Group', groupSchema);