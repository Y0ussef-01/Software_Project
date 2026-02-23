const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const unifiedLogin = async (id, password) => {
    let user = null;
    let role = '';

    user = await Student.findById(id).select('+password');
    if (user) role = 'student';

    if (!user) {
        user = await Teacher.findById(id).select('+password');
        if (user) role = 'teacher';
    }

    if (!user) {
        user = await Admin.findById(id).select('+password');
        if (user) role = 'admin';
    }

    if (!user) throw new Error('Invalid ID');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid Password');

    const token = generateToken(user._id, role);
    user.password = undefined;

    return { user, token, role };
};

module.exports = { unifiedLogin };