const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    _id:{ type: String, required: true }, //course name-groupName-type(نظري , عملي , تدريب)
    Room: { type: String, required: true },
    type: { type: String, enum: ['نظري','عملي','تدريب'], required: true },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    capacity: { type: Number, required: true },
    appointment: [{
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }]
});

module.exports = mongoose.model('Group', groupSchema);