const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    hours: { type: Number, required: true },
    groups: [{ type: String, ref: 'Group' }],
    prerequisites: [{ type: String, ref: 'Course' }]
});

module.exports = mongoose.model('Course', courseSchema);