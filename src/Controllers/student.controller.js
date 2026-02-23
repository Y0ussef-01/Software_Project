const Student = require('../models/Student');
const bcrypt = require('bcrypt');

const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProfileImg = async (req, res) => {
    try {
        const { profileImg } = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            req.user.id,
            { profileImg },
            { new: true, runValidators: true }
        );

        res.json({ message: 'The data was successfully updated', student: updatedStudent });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Please enter old and new password' });
        }

        const student = await Student.findById(req.user.id).select('+password');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        student.password = hashed;
        await student.save();

        res.json({ message: 'The password updated successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProfile, updateProfileImg, updatePassword };

