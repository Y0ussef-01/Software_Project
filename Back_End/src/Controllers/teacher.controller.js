const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');

const generateAttendanceToken = async (req, res) => {
    try {
        const { groups } = req.body;

        if (!groups || !Array.isArray(groups) || groups.length === 0) {
            return res.status(400).json({ message: "groups array is required" });
        }

        const qrToken = jwt.sign(
            { groups: groups, teacherId: req.user.id },
            process.env.JWT_SECRET,
            { expiresIn: "15s" }
        );

        res.status(200).json({ qrToken });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getGroupAttendance = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { date } = req.query;

        let queryDate = new Date();
        if (date) {
            queryDate = new Date(date);
        }
        queryDate.setHours(0, 0, 0, 0);

        const attendanceList = await Attendance.find({
            group: groupId,
            date: queryDate
        }).populate('student', '_id name');

        res.status(200).json(attendanceList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Please enter old and new password" });
        }
        const teacher = await Teacher.findById(req.user.id).select('+password');
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        teacher.password = await bcrypt.hash(newPassword, 10);
        await teacher.save();
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.user.id).populate({
            path: "courses.course", select: 'name hours '
        }).populate({
            path: "courses.group", select: 'groupName Room type appointment',
        });
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProfileImg = async (req, res) => {
    try {
        const { profileImg } = req.body;
        if (!profileImg) {
            return res.status(400).json({ message: "Please send a profile picture" });
        }
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.user.id,
            { profileImg },
            { new: true, runValidators: true }
        );
        if (!updatedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.json({ message: "Profile image updated", Teacher: updatedTeacher });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: "Invalid data", details: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};

const uploadGradesExcel = async (req, res) => {
    try {
        const { courseId } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: "File required" });
        if (!courseId) return res.status(400).json({ message: "CourseId required" });

        const teacher = await Teacher.findById(req.user.id);
        const isTeachesCourse = teacher.courses.some(c => c.course === courseId);

        if (!isTeachesCourse) return res.status(403).json({ message: "Forbidden" });

        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const gradesData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        if (!gradesData || gradesData.length === 0) {
            return res.status(400).json({ message: "Empty file" });
        }

        const idPossibleNames = ['id', 'student_id', 'studentId', 'code', 'student id', 'الكود', 'رقم الطالب'];
        const ignoreColumns = ['name', 'student name', 'student_name', 'email', 'department', 'serial', 'الاسم'];

        const bulkOperations = [];

        for (let row of gradesData) {
            let studentId = null;
            const rowKeys = Object.keys(row);

            for (let key of rowKeys) {
                if (idPossibleNames.includes(key.toLowerCase().trim())) {
                    studentId = row[key];
                    break;
                }
            }

            if (!studentId || String(studentId).trim() === "") continue;

            const assessments = [];

            for (let key of rowKeys) {
                const cleanKey = key.toLowerCase().trim();

                if (idPossibleNames.includes(cleanKey) || ignoreColumns.includes(cleanKey)) {
                    continue;
                }

                const rawValue = row[key];
                const score = parseFloat(rawValue);

                if (!isNaN(score)) {
                    assessments.push({
                        title: key.trim(),
                        score: score
                    });
                }
            }

            if (assessments.length > 0) {
                bulkOperations.push({
                    updateOne: {
                        filter: {
                            _id: String(studentId).trim(),
                            "registeredCourses.course": courseId
                        },
                        update: {
                            $set: { "registeredCourses.$.Degrees": assessments }
                        }
                    }
                });
            }
        }

        if (bulkOperations.length === 0) {
            return res.status(400).json({ message: "No valid grade data found" });
        }

        await Student.bulkWrite(bulkOperations);
        res.status(200).json({ message: "Grades uploaded successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = { generateAttendanceToken, getProfile, updateProfileImg, updatePassword, uploadGradesExcel,getGroupAttendance };