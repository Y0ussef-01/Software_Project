const mongoose = require('mongoose');

const finalResultSchema = new mongoose.Schema({
    student:   { type: String, ref: 'Student', required: true },
    course:    { type: String, ref: 'Course',  required: true },
    score:     { type: Number, required: true },
    grade:     { type: String, required: true },
    status:    { type: String, enum: ['Passed', 'Failed'], required: true },
    expiresAt: { type: Date, required: true }
});

finalResultSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

finalResultSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('FinalResult', finalResultSchema);