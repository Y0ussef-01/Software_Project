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

        teacher.password = await bcrypt.hash(newPassword, 10);
        await teacher.save();

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getProfile = async (req, res) => {

    try {

        const teacher = await Teacher.findById(req.user.id).populate({
                path: "courses.course",select: 'name hours '
            }
        ).populate({
            path: "courses.group",select: 'groupName Room type appointment',
        });

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

const Student = require('../models/Student');
const xlsx = require('xlsx');

const uploadGradesExcel = async (req, res) => {
    try {
        const { courseId } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'Please upload a file' });
        if (!courseId) return res.status(400).json({ message: 'Please upload a courseID' });

        const teacher = await Teacher.findById(req.user.id);
        const isTeachesCourse = teacher.courses.some(c => c.course === courseId);
        if (!isTeachesCourse) {
            return res.status(403).json({ message: 'You are not allowed to upload a course degrees' });
        }

        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const gradesData = xlsx.utils.sheet_to_json(sheet);

        if (gradesData.length === 0) {
            return res.status(400).json({ message: 'File is empty' });
        }

        const bulkOperations = gradesData.map(row => {
            const studentId = row['id'];

            if (!studentId) return null;

            const assessments = [];
            for (const [key, value] of Object.entries(row)) {
                if (key !== 'id' && value !== undefined && value !== null && value !== '') {
                    assessments.push({
                        title: key.trim(),
                        score: Number(value)
                    });
                }
            }

            return {
                updateOne: {
                    filter: {
                        _id: String(studentId),
                        "registeredCourses.course": courseId
                    },
                    update: {
                        $set: { "registeredCourses.$.Degrees": assessments }
                    }
                }
            };
        }).filter(op => op !== null);

        if (bulkOperations.length === 0) {
            return res.status(400).json({ message: 'Not Found Correct data in file' });
        }

        await Student.bulkWrite(bulkOperations);
        res.status(200).json({ message: 'Updated Successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProfile, updateProfileImg, updatePassword, uploadGradesExcel };
