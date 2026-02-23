const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true,select: false },
    department: { type: String, required: true },
    profileImg: { type: String },
    courses: [
        {
            course: { type: String, ref: 'Course' },
            group: { type: String, ref: 'Group' }
        }
    ]
});

module.exports = mongoose.model('Teacher', teacherSchema);