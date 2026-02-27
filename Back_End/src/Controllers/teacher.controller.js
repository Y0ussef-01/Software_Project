const Teacher = require('../models/Teacher');
const bcrypt = require('bcrypt');


const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Please enter a new and old password' });
        }

        const teacher = await Teacher.findById(req.user.id).select('+password');

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        teacher.password = hashed;
        await teacher.save();

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getProfile = async (req, res) => {

    try {

        const teacher = await Teacher.findById(req.user.id);

        if (!teacher)
            return res.status(404).json({ message: 'Teacher not found' });

        res.json(teacher);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const updateProfileImg = async (req, res) => {
    try {
        const { profileImg } = req.body;

        if (!profileImg) {
            return res.status(400).json({ message: 'Please send a profile picture' });
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.user.id,
            { profileImg },
            { new: true, runValidators: true }
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.json({ message: 'The data was successfully updated', Teacher: updatedTeacher });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data', details: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProfile, updateProfileImg, updatePassword };