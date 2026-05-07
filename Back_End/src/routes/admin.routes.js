const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const adminAuth        = require('../middlewares/adminAuth');
const adminController  = require('../Controllers/admin.controller');
const courseController = require('../Controllers/course.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post  ('/add-student',        adminAuth, adminController.addStudent);
router.post('/upload-students', adminAuth, upload.any(), adminController.uploadStudentsExcel);
router.get   ('/student/:id',        adminAuth, adminController.getStudent);
router.put   ('/update-student/:id', adminAuth, adminController.updateStudent);
router.delete('/delete-student/:id', adminAuth, adminController.deleteStudent);

router.post  ('/add-teacher',        adminAuth, adminController.addTeacher);
router.get   ('/teacher/:id',        adminAuth, adminController.getTeacher);
router.put   ('/update-teacher/:id', adminAuth, adminController.updateTeacher);
router.delete('/delete-teacher/:id', adminAuth, adminController.deleteTeacher);

router.post('/add-admin',       adminAuth, adminController.addAdmin);
router.put ('/updateProfileImg',adminAuth, adminController.updateProfileImg);
router.put ('/updatePassword',  adminAuth, adminController.updatePassword);
router.get ('/getAdmin',        adminAuth, adminController.getAdmin);

router.post  ('/add-course',      adminAuth, courseController.addCourse);
router.delete('/delete-course/:id',adminAuth, courseController.deleteCourse);
router.post  ('/add-group',       adminAuth, courseController.addGroup);
router.delete('/delete-group/:id', adminAuth, courseController.deleteGroup);
router.get   ('/courses',         adminAuth, courseController.getAllCourses);
router.get   ('/course/:id',      adminAuth, courseController.getCourseById);

router.post  ('/assign-student-course', adminAuth, adminController.assignStudentCourse);
router.delete('/drop-student-course',   adminAuth, adminController.dropStudentCourse);
router.post  ('/assign-teacher-course', adminAuth, adminController.assignTeacherCourse);
router.delete('/remove-teacher-course', adminAuth, adminController.removeTeacherCourse);

router.get('/dashboard-stats', adminAuth, adminController.getDashboardStats);

router.post('/upload-final-grades', adminAuth, upload.any(), adminController.uploadFinalGrades);

router.get('/group-students', adminAuth, adminController.getStudentsInGroup);
router.get('/course-teachers', adminAuth, adminController.getTeachersInCourse);

router.get('/complaints', adminAuth, adminController.getAllComplaints);
router.put('/complaint/:id/status', adminAuth, adminController.updateComplaintStatus);
module.exports = router;