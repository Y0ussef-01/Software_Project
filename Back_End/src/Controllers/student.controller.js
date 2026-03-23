const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const Course = require('../models/Course');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');
const SwapRequest = require('../models/SwapRequest');
const sendPushNotification = require('../utils/sendPushNotification');
const {isTimeConflict} = require('../utils/Test_Conflict');

const registerAttendance = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { qrToken, deviceId } = req.body;

        if (!qrToken || !deviceId) {
            return res.status(400).json({ message: "qrToken and deviceId are required" });
        }

        let decoded;
        try {
            decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(400).json({ message: "QR Token is expired or invalid" });
        }

        const allowedGroups = decoded.groups;
        const sessionNumber = decoded.sessionNumber;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const studentRegisteredGroups = student.registeredCourses.map(rc => rc.group);
        const matchingGroup = allowedGroups.find(g => studentRegisteredGroups.includes(g));

        if (!matchingGroup) {
            return res.status(403).json({ message: "You are not registered in any of these groups" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deviceUsedBefore = await Attendance.findOne({
            group: { $in: allowedGroups },
            sessionNumber: sessionNumber,
            deviceId: deviceId
        });

        if (deviceUsedBefore && deviceUsedBefore.student !== studentId) {
            return res.status(403).json({ message: "Device already used by another student for this session" });
        }

        const studentAttended = await Attendance.findOne({
            group: { $in: allowedGroups },
            sessionNumber: sessionNumber,
            student: studentId
        });

        if (studentAttended) {
            return res.status(400).json({ message: `Attendance for session ${sessionNumber} already recorded` });
        }

        const newAttendance = new Attendance({
            group: matchingGroup,
            sessionNumber: sessionNumber,
            student: studentId,
            deviceId: deviceId,
            date: today
        });

        await newAttendance.save();

        res.status(200).json({ message: "Attendance recorded successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

const registerToken = async (req, res) => {
    try {
        const { pushToken } = req.body;
        await Student.findByIdAndUpdate(req.user.id, { pushToken });
        res.json({ message: 'Token registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ studentId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ studentId: req.user.id }, { read: true });
        res.json({ message: 'All marked as read' });
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

const switchGroup = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { courseId, newGroupName } = req.body;

        if (!courseId || !newGroupName) {
            return res.status(400).json({ message: 'Please provide courseId and newGroupName' });
        }

        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!course) return res.status(404).json({ message: 'Course not found' });

        const currentRegistrations = student.registeredCourses.filter(rc => rc.course === courseId);
        if (currentRegistrations.length === 0) {
            return res.status(400).json({ message: 'You are not registered in this course to switch groups' });
        }

        const newGroups = await Group.find({ course: courseId, groupName: newGroupName });
        if (newGroups.length === 0) {
            return res.status(404).json({ message: 'New group not found' });
        }

        for (let group of newGroups) {
            if (group.enrolledStudents.length >= group.capacity) {
                return res.status(400).json({ message: `Group ${newGroupName} (${group.type}) is full.` });
            }
        }


        const otherGroupIds = student.registeredCourses
            .filter(rc => rc.course !== courseId)
            .map(rc => rc.group);

        const otherGroups = await Group.find({ _id: { $in: otherGroupIds } });

        for (let newG of newGroups) {
            for (let otherG of otherGroups) {
                if (isTimeConflict(newG.appointment, otherG.appointment)) {
                    return res.status(400).json({
                        message: `Conflict! New ${newG.type} overlaps with ${otherG.course} on ${newG.appointment.day}.`
                    });
                }
            }
        }

        const oldGroupIds = currentRegistrations.map(rc => rc.group);
        await Group.updateMany(
            { _id: { $in: oldGroupIds } },
            { $pull: { enrolledStudents: studentId } }
        );

        for (let group of newGroups) {
            group.enrolledStudents.push(studentId);
            await group.save();
        }

        student.registeredCourses = student.registeredCourses.filter(rc => rc.course !== courseId);

        newGroups.forEach(group => {
            student.registeredCourses.push({
                course: courseId,
                group: group._id
            });
        });

        await student.save();

        res.status(200).json({
            message: `Switched successfully to group ${newGroupName}`,
            registeredCourses: student.registeredCourses
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const requestSwap = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { courseId, targetGroupName } = req.body;

        const sender = await Student.findById(senderId).populate('registeredCourses.group');
        const senderCourseGroups = sender.registeredCourses.filter(rc => rc.course === courseId);

        if (senderCourseGroups.length === 0) {
            return res.status(400).json({ message: 'You are not registered in this course' });
        }

        const senderGroupName = senderCourseGroups[0].group.groupName;

        if (senderGroupName === targetGroupName) {
            return res.status(400).json({ message: 'You are already in this group' });
        }

        const existingRequest = await SwapRequest.findOne({
            sender: senderId,
            courseId: courseId,
            status: 'Pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending swap request for this course' });
        }

        const targetGroups = await Group.find({ course: courseId, groupName: targetGroupName });
        if (targetGroups.length === 0) {
            return res.status(404).json({ message: 'Target group not found' });
        }


        let targetStudentIds = [];
        for (let group of targetGroups) {
            targetStudentIds = targetStudentIds.concat(group.enrolledStudents);
        }

        targetStudentIds = [...new Set(targetStudentIds.map(id => id.toString()))];
        targetStudentIds = targetStudentIds.filter(id => id !== senderId.toString());

        if (targetStudentIds.length === 0) {
            return res.status(400).json({ message: 'No students in the target group to swap with' });
        }

        const swapRequests = targetStudentIds.map(receiverId => ({
            sender: senderId,
            receiver: receiverId,
            courseId,
            senderGroupName,
            receiverGroupName: targetGroupName
        }));

        await SwapRequest.insertMany(swapRequests);

        res.status(201).json({ message: 'Swap requests broadcasted successfully to all students in the group' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPendingSwapRequests = async (req, res) => {
    try {
        const studentId = req.user.id;
        const requests = await SwapRequest.find({ receiver: studentId, status: 'Pending' })
            .populate('sender', 'name _id profileImg')
            .populate('courseId', 'name _id');

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const respondToSwapRequest = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { requestId, action } = req.body;

        if (!['Accepted', 'Rejected'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action. Must be Accepted or Rejected' });
        }

        const swapRequest = await SwapRequest.findById(requestId);

        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        if (swapRequest.receiver !== studentId) {
            return res.status(403).json({ message: 'You are not authorized to respond to this request' });
        }

        if (swapRequest.status !== 'Pending') {
            return res.status(400).json({ message: 'This request has already been processed' });
        }

        if (action === 'Rejected') {
            swapRequest.status = 'Rejected';
            await swapRequest.save();
            return res.status(200).json({ message: 'Swap request rejected' });
        }

        const sender = await Student.findById(swapRequest.sender);
        const receiver = await Student.findById(swapRequest.receiver);

        const senderCurrentCourseGroup = sender.registeredCourses.find(rc => rc.course === swapRequest.courseId);
        if (!senderCurrentCourseGroup) {
            return res.status(400).json({ message: 'The sender is no longer registered in this course' });
        }

        const senderCurrentGroupObj = await Group.findById(senderCurrentCourseGroup.group);
        if (senderCurrentGroupObj.groupName !== swapRequest.senderGroupName) {
            swapRequest.status = 'Rejected';
            await swapRequest.save();
            return res.status(400).json({ message: 'Too late! Another student has already accepted this swap request.' });
        }

        const senderGroupsToDrop = await Group.find({ course: swapRequest.courseId, groupName: swapRequest.senderGroupName });
        const receiverGroupsToDrop = await Group.find({ course: swapRequest.courseId, groupName: swapRequest.receiverGroupName });

        const senderOtherGroupIds = sender.registeredCourses.filter(rc => rc.course !== swapRequest.courseId).map(rc => rc.group);
        const senderOtherGroups = await Group.find({ _id: { $in: senderOtherGroupIds } });

        for (let newGroup of receiverGroupsToDrop) {
            for (let oldGroup of senderOtherGroups) {
                if (isTimeConflict(newGroup.appointment, oldGroup.appointment)) {
                    return res.status(400).json({ message: `Cannot accept. Swap causes a time conflict for the sender on ${newGroup.appointment.day}` });
                }
            }
        }

        const receiverOtherGroupIds = receiver.registeredCourses.filter(rc => rc.course !== swapRequest.courseId).map(rc => rc.group);
        const receiverOtherGroups = await Group.find({ _id: { $in: receiverOtherGroupIds } });

        for (let newGroup of senderGroupsToDrop) {
            for (let oldGroup of receiverOtherGroups) {
                if (isTimeConflict(newGroup.appointment, oldGroup.appointment)) {
                    return res.status(400).json({ message: `Cannot accept. Swap causes a time conflict for you on ${newGroup.appointment.day}` });
                }
            }
        }

        for (let g of senderGroupsToDrop) {
            g.enrolledStudents = g.enrolledStudents.filter(id => id.toString() !== sender._id.toString());
            g.enrolledStudents.push(receiver._id);
            await g.save();
        }

        for (let g of receiverGroupsToDrop) {
            g.enrolledStudents = g.enrolledStudents.filter(id => id.toString() !== receiver._id.toString());
            g.enrolledStudents.push(sender._id);
            await g.save();
        }

        sender.registeredCourses = sender.registeredCourses.filter(rc => rc.course !== swapRequest.courseId);
        receiver.registeredCourses = receiver.registeredCourses.filter(rc => rc.course !== swapRequest.courseId);

        for (let g of receiverGroupsToDrop) {
            sender.registeredCourses.push({ course: swapRequest.courseId, group: g._id });
        }
        for (let g of senderGroupsToDrop) {
            receiver.registeredCourses.push({ course: swapRequest.courseId, group: g._id });
        }

        await sender.save();
        await receiver.save();

        await SwapRequest.deleteMany({
            _id: { $ne: requestId },
            courseId: swapRequest.courseId,
            status: 'Pending',
            $or: [
                { sender: swapRequest.sender },
                { sender: swapRequest.receiver },
                { receiver: swapRequest.sender },
                { receiver: swapRequest.receiver }
            ]
        });

        swapRequest.status = 'Accepted';
        await swapRequest.save();

        const notifTitle = "Swap Request Accepted ✅";
        const notifBody = `Your swap request for course ${swapRequest.courseId} was accepted by ${receiver.name}. You are now moved to group ${swapRequest.receiverGroupName}.`;

        const newNotification = new Notification({
            studentId: sender._id,
            title: notifTitle,
            body: notifBody
        });
        await newNotification.save();

        if (sender.pushToken && sender.pushToken !== 'null') {
            await sendPushNotification([sender.pushToken], notifTitle, notifBody);
        }

        res.status(200).json({ message: 'Swap executed successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const cancelSwapRequest = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: 'Please provide a course ID' });
        }

        const result = await SwapRequest.deleteMany({
            sender: studentId,
            courseId: courseId,
            status: 'Pending'
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No pending swap requests found for this course' });
        }

        res.status(200).json({ message: 'Swap request cancelled successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = {
    respondToSwapRequest,
    getPendingSwapRequests,
    requestSwap,
    getProfile,
    registerToken,
    updateProfileImg,
    updatePassword,
    registerCourse,
    dropCourse,
    getMyGrades,
    isTimeConflict,
    switchGroup,
    getNotifications,
    markAllRead,
    registerAttendance,
    cancelSwapRequest
};
