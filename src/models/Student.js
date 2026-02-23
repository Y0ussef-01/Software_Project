const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, trim: true },
    password: { type: String, required: true,select: false },
    hours: { type: Number, default: 0 },
    profileImg: { type: String, required: true },
    department: { type: String, default: 'عام' },
    grade: { type: String, default: 'المستوي الاول' },
    AcademicRecord: { type: String },
    GPA: { type: Number, default: 0 },
    maxHours: { type: Number, default: 19 },
    registeredCourses: [
        {
            course: { type: String, ref: 'Course' },
            group: { type: String, ref: 'Group' }
        }
    ],
    passedCourses: [{
        course:{ type: String, ref: 'Course' },
        degree:{ type: String }
    }],
});

module.exports = mongoose.model('Student', StudentSchema);