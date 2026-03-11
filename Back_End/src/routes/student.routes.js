const express = require('express');
const router = express.Router();
const studentAuth = require('../middlewares/studentAuth');
const controller = require('../Controllers/student.controller');
const { getAllCourses } = require("../Controllers/course.controller");

router.post('/attend', studentAuth, controller.registerAttendance);
router.get('/Profile', studentAuth, controller.getProfile);
router.put('/updateProfileImg', studentAuth, controller.updateProfileImg);
router.put('/updatePassword', studentAuth, controller.updatePassword);
router.post('/register-course', studentAuth, controller.registerCourse);
router.delete('/drop-course', studentAuth, controller.dropCourse);
router.get('/getAllCourses', studentAuth, getAllCourses);
router.get('/grades', studentAuth, controller.getMyGrades);

module.exports = router;