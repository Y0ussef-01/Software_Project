const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

const login = async (id, password) => {
    let user = await Student.findById(id).select('+password');
    let role = 'student';

    if (!user) {
        user = await Teacher.findById(id).select('+password');
        role = 'teacher';
    }

    if (!user) {
        user = await Admin.findById(id).select('+password');
        role = 'admin';
    }

    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid Password');

    user.password = undefined;

    const token = generateToken(user._id, role);
    return { user, token, role };
};

module.exports = { login };