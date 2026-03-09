const express = require('express');
const router = express.Router();
const studentAuth = require('../middlewares/studentAuth');
const controller = require('../Controllers/student.controller');
const {getAllCourses} = require("../Controllers/course.controller");

router.get('/Profile', studentAuth, controller.getProfile);
router.put('/updateProfileImg', studentAuth, controller.updateProfileImg);
router.put('/updatePassword', studentAuth, controller.updatePassword);
router.post('/register-course', studentAuth, controller.registerCourse);
router.delete('/drop-course', studentAuth, controller.dropCourse);
router.get('/getAllCourses',studentAuth,getAllCourses);
router.get('/grades', studentAuth, controller.getMyGrades);
router.put('/switch-group', studentAuth, controller.switchGroup);
module.exports = router;