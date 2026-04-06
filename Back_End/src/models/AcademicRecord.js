const mongoose = require('mongoose');

const academicRecordSchema = new mongoose.Schema({
    student: { type: String, ref: 'Student', required: true },
    course:  { type: String, ref: 'Course',  required: true },
    score:   { type: Number, required: true },
    grade:   { type: String, required: true },
    status:  { type: String, enum: ['Passed', 'Failed'], required: true },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AcademicRecord', academicRecordSchema);