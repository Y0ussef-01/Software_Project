const express     = require('express');
const router      = express.Router();
const studentAuth = require('../middlewares/studentAuth');
const controller  = require('../Controllers/student.controller');
const { getAllCourses } = require("../Controllers/course.controller");
const Student     = require('../models/Student');

router.get ('/Profile',          studentAuth, controller.getProfile);
router.put ('/updateProfileImg', studentAuth, controller.updateProfileImg);
router.put ('/updatePassword',   studentAuth, controller.updatePassword);
router.post('/register-course',  studentAuth, controller.registerCourse);
router.delete('/drop-course',    studentAuth, controller.dropCourse);
router.get ('/getAllCourses',     studentAuth, getAllCourses);
router.get ('/grades',           studentAuth, controller.getMyGrades);
router.put ('/switch-group',     studentAuth, controller.switchGroup);

router.put('/registerToken', studentAuth, async (req, res) => {
    try {
        const { pushToken } = req.body;
        await Student.findByIdAndUpdate(req.user.id, { pushToken });
        res.json({ message: 'Token saved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get ('/notifications',      studentAuth, controller.getNotifications);
router.put ('/notifications/read', studentAuth, controller.markAllRead);
router.post('/attend',             studentAuth, controller.registerAttendance);
router.post('/swap-request',       studentAuth, controller.requestSwap);
router.get ('/get_pending_requests',studentAuth, controller.getPendingSwapRequests);
router.post('/swap-respond',       studentAuth, controller.respondToSwapRequest);
router.delete('/swap-cancel',      studentAuth, controller.cancelSwapRequest);

router.get('/academic-record', studentAuth, controller.getAcademicRecord);
router.get('/final-results',   studentAuth, controller.getFinalResults);

module.exports = router;