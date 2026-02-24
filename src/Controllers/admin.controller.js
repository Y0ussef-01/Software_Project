const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcrypt');

const addStudent = async (req, res) => {
    try {
        const { _id, name, email, password, profileImg } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            _id, name, email, password: hashedPassword, profileImg
        });

        await newStudent.save();
        res.status(201).json({ message: 'added student successfully', student: newStudent });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndDelete(id);

        if (!student) return res.status(404).json({ message: 'Student not found.' });

        res.json({ message: 'Deleted student successfully', student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id).populate('registeredCourses.course');

        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // لو الأدمن بيعدل الباسورد، لازم نشفره تاني
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const student = await Student.findByIdAndUpdate(id, updateData, { new: true });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json({ message: 'updated successfully', student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const addTeacher = async (req, res) => {
    try {
        const { _id, name, email, password, department, profileImg } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = new Teacher({
            _id,
            name,
            email,
            password: hashedPassword,
            department,
            profileImg
        });

        await newTeacher.save();
        res.status(201).json({ message: 'added Teacher Successfully', teacher: newTeacher });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findByIdAndDelete(id);

        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        res.json({ message: 'Deleted Teacher Successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findById(id).populate('courses.course');

        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const teacher = await Teacher.findByIdAndUpdate(id, updateData, { new: true });
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        res.json({ message: 'Data updated Successfully', teacher });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addAdmin = async (req, res) => {
    try {
        const { _id, name, email, password, permissions } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            _id, name, email, password: hashedPassword, permissions
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin added successfully', admin: newAdmin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const id = req.params.id || req.user.id;
        const updateData = req.body;

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });

        res.json({ message: 'Admin data updated successfully', admin: updatedAdmin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    addStudent, deleteStudent, getStudent, updateStudent,
    addTeacher, deleteTeacher, getTeacher, updateTeacher,
    addAdmin, updateAdminProfile
};

