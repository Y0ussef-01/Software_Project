const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');

const sendPushNotification = require('../utils/sendPushNotification');

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword)
            return res.status(400).json({ message: 'Please enter a new and old password' });

        const teacher = await Teacher.findById(req.user.id).select('+password');
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        const isMatch = await bcrypt.compare(oldPassword, teacher.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        teacher.password = await bcrypt.hash(newPassword, 10);
        await teacher.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.user.id)
            .populate({ path: "courses.course", select: 'name hours' })
            .populate({ path: "courses.group", select: 'groupName Room type appointment' });

        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProfileImg = async (req, res) => {
    try {
        const { profileImg } = req.body;
        if (!profileImg) return res.status(400).json({ message: 'Please send a profile picture' });

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.user.id, { profileImg }, { new: true, runValidators: true }
        );
        if (!updatedTeacher) return res.status(404).json({ message: 'Teacher not found' });

        res.json({ message: 'The data was successfully updated', Teacher: updatedTeacher });
    } catch (err) {
        if (err.name === 'ValidationError')
            return res.status(400).json({ message: 'Invalid data', details: err.message });
        res.status(500).json({ message: err.message });
    }
};

// ─── UPLOAD GRADES EXCEL ──────────────────────────────────────────────────────
const uploadGradesExcel = async (req, res) => {
    try {
        const { courseId } = req.body;
        const file = req.file || (req.files && req.files[0]);

        if (!file)     return res.status(400).json({ message: 'Please upload a file' });
        if (!courseId) return res.status(400).json({ message: 'Please upload a courseID' });

        const teacher = await Teacher.findById(req.user.id);
        const isTeachesCourse = teacher.courses.some(c => c.course === courseId);
        if (!isTeachesCourse)
            return res.status(403).json({ message: 'You are not allowed to upload a course degrees' });

        const workbook   = xlsx.read(file.buffer, { type: 'buffer' });
        const sheet      = workbook.Sheets[workbook.SheetNames[0]];
        const gradesData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        if (!gradesData || gradesData.length === 0)
            return res.status(400).json({ message: 'File is empty' });

        const idPossibleNames = ['id', 'student_id', 'code', 'student id', 'كود الطالب'];
        const ignoreColumns   = ['name', 'student name', 'student_name', 'email', 'department', 'serial', 'الاسم'];

        const bulkOperations      = [];
        const processedStudentIds = [];

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
                const score    = parseFloat(rawValue);

                const parts = key.trim().split('/');
                const label = parts[0].trim();
                const outOf = parts[1] !== undefined ? parseFloat(parts[1].trim()) : undefined;

                if (!isNaN(score)) {
                    const entry = {
                        title: key.trim(),
                        label: label,
                        score: score,
                    };
                    if (outOf !== undefined && !isNaN(outOf)) {
                        entry.outOf = outOf;
                    }
                    assessments.push(entry);
                }
            }

            if (assessments.length > 0) {
                const cleanStudentId = String(studentId).trim();
                bulkOperations.push({
                    updateOne: {
                        filter: { _id: cleanStudentId, "registeredCourses.course": courseId },
                        update: { $set: { "registeredCourses.$.Degrees": assessments } }
                    }
                });
                processedStudentIds.push(cleanStudentId);
            }
        }

        if (bulkOperations.length === 0)
            return res.status(400).json({ message: 'No valid grade data found' });

        await Student.bulkWrite(bulkOperations);

        const Notification = require('../models/Notification');
        const Course       = require('../models/Course');
        await Course.findById(courseId).select('name');

        const studentsForNotif = await Student.find({
            _id: { $in: processedStudentIds },
            "registeredCourses.course": courseId,
        }).select('_id pushToken');

        const notifDocs = studentsForNotif.map(s => ({
            studentId: s._id,
            title: '🔔 New Grades Posted',
            body: `Your grades for ${courseId} have been updated. Check them now!`
        }));
        if (notifDocs.length > 0) await Notification.insertMany(notifDocs);

        const tokens = studentsForNotif.map(s => s.pushToken).filter(t => t && t !== 'null');
        if (tokens.length > 0)
            await sendPushNotification(tokens, '🔔 New Grades Posted', `Your grades for ${courseId} have been updated!`);

        res.status(200).json({ message: 'Updated Successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateStudentGrade = async (req, res) => {
    try {
        const { studentId, courseId, assessmentTitle, newScore } = req.body;
        const teacherId = req.user.id;

        const teacher = await Teacher.findById(teacherId);
        const authorizedGroups = teacher.courses.filter(c => c.course === courseId).map(c => c.group);
        if (authorizedGroups.length === 0)
            return res.status(403).json({ message: "Unauthorized: You do not teach this course" });

        const student = await Student.findOneAndUpdate(
            {
                _id: studentId,
                "registeredCourses.course": courseId,
                "registeredCourses.group": { $in: authorizedGroups },
                "registeredCourses.Degrees.title": assessmentTitle
            },
            { $set: { "registeredCourses.$[courseElem].Degrees.$[degreeElem].score": newScore } },
            {
                arrayFilters: [{ "courseElem.course": courseId }, { "degreeElem.title": assessmentTitle }],
                new: true
            }
        );

        if (!student)
            return res.status(404).json({ message: "Record not found or grade title does not exist" });

        res.status(200).json({ message: "Grade updated successfully", student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const generateAttendanceToken = async (req, res) => {
    try {
        const { groups, sessionNumber } = req.body;
        if (!groups || !Array.isArray(groups) || groups.length === 0)
            return res.status(400).json({ message: "groups array is required" });
        if (!sessionNumber)
            return res.status(400).json({ message: "sessionNumber is required" });

        const qrToken = jwt.sign(
            { groups, sessionNumber, teacherId: req.user.id },
            process.env.JWT_SECRET,
            { expiresIn: "5s" }
        );
        res.status(200).json({ qrToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getGroupAttendance = async (req, res) => {
    try {
        const { groupId }       = req.params;
        const { sessionNumber } = req.query;
        if (!sessionNumber)
            return res.status(400).json({ message: "sessionNumber is required" });

        const attendanceList = await Attendance.find({ group: groupId, sessionNumber })
            .populate('student', '_id name');
        res.status(200).json(attendanceList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const sendCourseNotification = async (req, res) => {
    try {
        const { courseId, groupIds, title, body } = req.body;
        const teacherId = req.user.id;

        const teacher = await Teacher.findById(teacherId);
        if (!teacher.courses.some(c => c.course === courseId))
            return res.status(403).json({ message: "Unauthorized: You do not teach this course" });

        const Notification  = require('../models/Notification');
        const teacherGroups = teacher.courses.filter(c => c.course === courseId).map(c => c.group);

        const studentsForNotif = await Student.find({
            'registeredCourses.course': courseId,
            'registeredCourses.group': groupIds ? { $in: groupIds } : { $in: teacherGroups }
        }).select('_id pushToken');

        await Notification.insertMany(studentsForNotif.map(s => ({ studentId: s._id, title, body })));

        const tokens = studentsForNotif.map(s => s.pushToken).filter(t => t && t !== 'null');
        if (tokens.length === 0)
            return res.status(200).json({ message: "No students with push tokens found" });

        await sendPushNotification(tokens, title, body);
        res.status(200).json({ message: "Notifications sent successfully", count: tokens.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const registerToken = async (req, res) => {
    try {
        const { pushToken } = req.body;
        await Teacher.findByIdAndUpdate(req.user.id, { expoPushToken: pushToken });
        res.status(200).json({ message: "Token saved" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── GET STUDENT GRADES ───────────────────────────────────────────────────────
const getStudentGrades = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { groupId }  = req.query;
        const teacherId    = req.user.id;

        const teacher = await Teacher.findById(teacherId);
        if (!teacher.courses.some(c => String(c.course) === String(courseId)))
            return res.status(403).json({ message: 'Unauthorized' });

        const query = { 'registeredCourses.course': courseId };
        if (groupId) query['registeredCourses.group'] = groupId;

        const students = await Student.find(query).select('_id name registeredCourses');

        const result = students.map(s => {
            const reg     = s.registeredCourses.find(r => String(r.course) === String(courseId));
            const degrees = reg?.Degrees || [];
            const scores  = degrees.map(d => d.score).filter(v => v != null && !isNaN(v));
            const total   = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) : null;

            return {
                studentId:   String(s._id),
                studentName: s.name,
                degrees: degrees.map(d => {
                    // ── استخرج الـ outOf من الـ title لو مش موجود في الـ DB ──
                    let outOf = d.outOf ?? null;
                    if (outOf === null) {
                        const parts = d.title?.split('/');
                        if (parts && parts.length === 2) {
                            const parsed = parseFloat(parts[1]);
                            if (!isNaN(parsed)) outOf = parsed;
                        }
                    }
                    return {
                        title: d.title,
                        label: d.label || d.title,
                        score: d.score ?? null,
                        outOf: outOf,
                    };
                }),
                total,
            };
        });

        res.status(200).json({ students: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── EDIT STUDENT GRADE ───────────────────────────────────────────────────────
const editStudentGrade = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const { grades }  = req.body;
        const teacherId   = req.user.id;

        if (!grades || !Array.isArray(grades) || grades.length === 0)
            return res.status(400).json({ message: 'grades array is required' });

        const teacher = await Teacher.findById(teacherId);
        if (!teacher.courses.some(c => String(c.course) === String(courseId)))
            return res.status(403).json({ message: 'Unauthorized' });

        const student = await Student.findOne({
            _id: studentId,
            'registeredCourses.course': courseId
        });
        if (!student)
            return res.status(404).json({ message: 'Student or course not found' });

        const reg = student.registeredCourses.find(
            r => String(r.course) === String(courseId)
        );
        if (!reg || !reg.Degrees || reg.Degrees.length === 0)
            return res.status(404).json({
                message: 'No grades found. Upload grades via Excel first.'
            });

        // ── Validation ────────────────────────────────────────────────────────
        for (const g of grades) {
            if (g.score === null || g.score === undefined) continue;

            const num = Number(g.score);

            if (isNaN(num))
                return res.status(400).json({
                    message: `Score for "${g.title}" must be a number.`
                });

            if (num < 0)
                return res.status(400).json({
                    message: `Score for "${g.title}" cannot be negative.`
                });

            const existing = reg.Degrees.find(d => d.title === g.title);
            if (existing) {
                // ── أولاً: جرب تاخد الـ outOf من الـ DB
                let maxAllowed = existing.outOf;

                // ── ثانياً: لو مش موجود في الـ DB، استخرجه من الـ title
                if (maxAllowed === undefined || maxAllowed === null) {
                    const parts = existing.title?.split('/');
                    if (parts && parts.length === 2) {
                        const parsed = parseFloat(parts[1]);
                        if (!isNaN(parsed)) maxAllowed = parsed;
                    }
                }

                // ── تحقق من الـ limit
                if (maxAllowed !== undefined && maxAllowed !== null && num > maxAllowed) {
                    return res.status(400).json({
                        message: `"${existing.label || g.title}" score cannot exceed ${maxAllowed}.`
                    });
                }
            }
        }

        // ── Update ────────────────────────────────────────────────────────────
        let updated = false;
        for (const g of grades) {
            const idx = reg.Degrees.findIndex(d => d.title === g.title);
            if (idx !== -1) {
                reg.Degrees[idx].score = g.score === null ? null : Number(g.score);
                updated = true;
            }
        }

        if (!updated)
            return res.status(404).json({ message: 'No matching grade titles found.' });

        await student.save();

        // ── إبعت إشعار للطالب ────────────────────────────────────────────────
        const Notification = require('../models/Notification');

        await Notification.create({
            studentId: student._id,
            title: '📊 Grade Updated',
            body: `Your grades for course ${courseId} have been updated by your teacher.`,
            read: false,
        });

        const token = student.pushToken || student.expoPushToken;
        if (token && token !== 'null') {
            await sendPushNotification(
                [token],
                '📊 Grade Updated',
                `Your grades for course ${courseId} have been updated by your teacher.`
            );
        }

        res.status(200).json({ message: 'Grade updated successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getProfile,
    updateProfileImg,
    updatePassword,
    uploadGradesExcel,
    updateStudentGrade,
    getGroupAttendance,
    generateAttendanceToken,
    sendCourseNotification,
    registerToken,
    getStudentGrades,
    editStudentGrade,
};