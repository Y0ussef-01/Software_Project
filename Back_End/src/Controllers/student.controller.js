const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const Course = require('../models/Course');
const Group = require('../models/Group');
const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).populate({
                path: "registeredCourses.course",select: 'name hours '
            }
        ).populate({
            path: "registeredCourses.group",select: 'groupName Room type appointment',
        });
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
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });

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

        student.password = await bcrypt.hash(newPassword, 10);
        await student.save();

        res.json({ message: 'The password updated successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};

const isTimeConflict = (app1, app2) => {
    if (app1.day !== app2.day) return false;

    const start1 = timeToMinutes(app1.startTime);
    const end1 = timeToMinutes(app1.endTime);
    const start2 = timeToMinutes(app2.startTime);
    const end2 = timeToMinutes(app2.endTime);

    return start1 < end2 && end1 > start2;
};

const registerCourse = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { courseId, groupName } = req.body;

        if (!courseId || !groupName) {
            return res.status(400).json({ message: 'Please enter Course Id and GroupName' });
        }

        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!course) return res.status(404).json({ message: 'Course not found' });

        const alreadyPassed = student.passedCourses.some(pc => pc.course === courseId);
        if (alreadyPassed) return res.status(400).json({ message: 'You already passed this course' });

        const alreadyRegistered = student.registeredCourses.some(rc => rc.course === courseId);
        if (alreadyRegistered) return res.status(400).json({ message: 'You already registered this course' });

        if (course.prerequisites && course.prerequisites.length > 0) {
            const passedCourseIds = student.passedCourses.map(pc => pc.course);
            const hasAllPrereqs = course.prerequisites.every(prereq => passedCourseIds.includes(prereq));

            if (!hasAllPrereqs) {
                return res.status(400).json({ message: 'You have not passed all prerequisites' });
            }
        }

        if (student.hours + course.hours > student.maxHours) {
            return res.status(400).json({ message: `Cannot register. This course will exceed your maximum limit of ${student.maxHours} hours.` });
        }

        const groupsToRegister = await Group.find({
            course: courseId,
            groupName: groupName
        });

        if (groupsToRegister.length === 0) {
            return res.status(404).json({ message: 'Group not found for this course' });
        }

        for (let group of groupsToRegister) {
            if (group.enrolledStudents.length >= group.capacity) {
                return res.status(400).json({ message: `Group ${group.groupName} is full for ${group.type}.` });
            }
        }

        const existingGroupIds = student.registeredCourses.map(rc => rc.group);
        const existingGroups = await Group.find({ _id: { $in: existingGroupIds } });

        for (let newGroup of groupsToRegister) {
            for (let oldGroup of existingGroups) {
                if (isTimeConflict(newGroup.appointment, oldGroup.appointment)) {
                    return res.status(400).json({
                        message: `Time conflict detected! ${newGroup.groupName} (${newGroup.type}) overlaps with your registered group ${oldGroup.groupName} (${oldGroup.type}) on ${newGroup.appointment.day}.`
                    });
                }
            }
        }

        student.hours += course.hours;

        for (let group of groupsToRegister) {
            student.registeredCourses.push({
                course: courseId,
                group: group._id
            });
            group.enrolledStudents.push(studentId);
            await group.save();
        }

        await student.save();

        res.status(200).json({ message: `Course registered successfully in group ${groupName}`, hours: student.hours });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const dropCourse = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: 'Please provide a course ID to drop' });
        }

        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const isRegistered = student.registeredCourses.some(rc => rc.course === courseId);
        if (!isRegistered) {
            return res.status(400).json({ message: 'You are not registered in this course' });
        }

        const groupsToDrop = student.registeredCourses.filter(rc => rc.course === courseId).map(rc => rc.group);

        for (let groupId of groupsToDrop) {
            await Group.findByIdAndUpdate(groupId, {
                $pull: { enrolledStudents: studentId }
            });
        }

        student.registeredCourses = student.registeredCourses.filter(rc => rc.course !== courseId);
        student.hours -= course.hours;

        await student.save();

        res.status(200).json({ message: 'Course dropped successfully', hours: student.hours });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ضيف الفانكشن دي
const getMyGrades = async (req, res) => {
    try {
        const studentId = req.user.id;
        const student = await Student.findById(studentId)
            .select('registeredCourses')
            .populate({
                path: 'registeredCourses.course',
                select: 'name'
            });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const gradesDetails = student.registeredCourses.map(rc => {
            return {
                courseId: rc.course ? rc.course._id : null,
                courseName: rc.course ? rc.course.name : "Undefined Course",
                Degrees: rc.Degrees || []
            };
        });

        res.status(200).json({
            message: "Degrees of Student",
            grades: gradesDetails
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getProfile,
    updateProfileImg,
    updatePassword,
    registerCourse,
    dropCourse,
    getMyGrades
};
