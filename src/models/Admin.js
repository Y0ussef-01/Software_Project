const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    _id:{type:String,required:true},
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    permissions: {
        type: [String],
        enum: ['manage_courses', 'manage_students', 'manage_teachers', 'super_admin'],
        default: ['super_admin']
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);