const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');


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
            path: "courses.course", select: 'name hours '
        }).populate({
            path: "courses.group", select: 'groupName Room type appointment',
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

const uploadGradesExcel = async (req, res) => {
    try {
        const { courseId } = req.body;
        const file = req.file || (req.files && req.files[0]);

        if (!file) return res.status(400).json({ message: 'Please upload a file' });
        if (!courseId) return res.status(400).json({ message: 'Please upload a courseID' });

        const teacher = await Teacher.findById(req.user.id);
        const isTeachesCourse = teacher.courses.some(c => c.course === courseId);
        if (!isTeachesCourse) {
            return res.status(403).json({ message: 'You are not allowed to upload a course degrees' });
        }

        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const gradesData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        if (!gradesData || gradesData.length === 0) {
            return res.status(400).json({ message: 'File is empty' });
        }

        const idPossibleNames = ['id', 'student_id', 'studentid', 'code', 'student id', 'الكود', 'رقم الطالب'];
        const ignoreColumns = ['name', 'student name', 'student_name', 'email', 'department', 'serial',  'الاسم'];

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
                if (idPossibleNames.includes(cleanKey) || ignoreColumns.includes(cleanKey)) continue;

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
            return res.status(400).json({ message: 'No valid grade data found' });
        }

        await Student.bulkWrite(bulkOperations);

        const Notification = require('../models/Notification');
        const sendPushNotification = require('../utils/sendPushNotification');
        const Course = require('../models/Course');

        const course = await Course.findById(courseId).select('name');
        const courseName = course ? course.name : 'Unknown Course';

        const studentsForNotif = await Student.find({
            "registeredCourses.course": courseId,
        }).select('_id pushToken');

        const notifDocs = studentsForNotif.map(s => ({
            studentId: s._id,
            title: ' New Grades Posted',
            body: `Your grades for ${courseId} have been updated. Check them now!`
        }));
        await Notification.insertMany(notifDocs);

        const tokens = studentsForNotif
            .map(s => s.pushToken)
            .filter(token => token && token !== null && token !== 'null');

        await sendPushNotification(tokens, ' New Grades Posted', `Your grades for ${courseId} have been updated!`);

        res.status(200).json({ message: 'Updated Successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const generateAttendanceToken = async (req, res) => {
    try {
        const { groups, sessionNumber } = req.body;

        if (!groups || !Array.isArray(groups) || groups.length === 0) {
            return res.status(400).json({ message: "groups array is required" });
        }
        if (!sessionNumber) {
            return res.status(400).json({ message: "sessionNumber is required" });
        }

        const qrToken = jwt.sign(
            { groups: groups, sessionNumber: sessionNumber, teacherId: req.user.id },
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


module.exports = { getProfile, updateProfileImg, updatePassword, uploadGradesExcel,getGroupAttendance,generateAttendanceToken };