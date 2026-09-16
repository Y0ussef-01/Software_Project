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
const signup = async (id, name, password) => {
    const existing =
        (await Student.findById(id)) ||
        (await Teacher.findById(id)) ||
        (await Admin.findById(id));

    if (existing) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const email = `20${id}@std.sci.cu.edu.eg`;

    const newStudent = new Student({
        _id: id,
        name,
        email,
        password: hashedPassword,
    });

    await newStudent.save();

    const token = generateToken(newStudent._id, 'student');
    newStudent.password = undefined;

    return { user: newStudent, token, role: 'student' };
};
module.exports = { login, signup };