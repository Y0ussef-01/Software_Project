const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const userLogin = async (id, password) => {
    let user = await Student.findById(id).select('+password');
    let role = 'student';

    if (!user) {
        user = await Teacher.findById(id).select('+password');
        role = 'teacher';
    }

    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid Password');
    user.password=undefined;
    const token = generateToken(user._id, role);
    return { user, token, role };
};

const adminLogin = async (id, password) => {
    const admin = await Admin.findById(id).select('+password');

    if (!admin) throw new Error('Admin not found - Access Denied');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error('Invalid Admin Password');
    admin.password=undefined;
    const token = generateToken(admin._id, 'admin');
    return { user: admin, token, role: 'admin' };
};

module.exports = { userLogin, adminLogin };