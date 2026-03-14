const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    group: { type: String, ref: "Group", required: true },
    student: { type: String, ref: "Student", required: true },
    deviceId: { type: String, required: true },
    sessionNumber: { type: Number, required: true },
    date: {
        type: Date,
        default: () => new Date().setHours(0, 0, 0, 0),
    },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attendance", attendanceSchema);