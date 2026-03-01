const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const adminController = require('../Controllers/admin.controller');

router.post('/add-student', adminAuth, adminController.addStudent);
router.get('/student/:id', adminAuth, adminController.getStudent);
router.put('/update-student/:id', adminAuth, adminController.updateStudent);
router.delete('/delete-student/:id', adminAuth, adminController.deleteStudent);

router.post('/add-teacher', adminAuth, adminController.addTeacher);
router.get('/teacher/:id', adminAuth, adminController.getTeacher);
router.put('/update-teacher/:id', adminAuth, adminController.updateTeacher);
router.delete('/delete-teacher/:id', adminAuth, adminController.deleteTeacher);

router.post('/add-admin', adminAuth, adminController.addAdmin);
router.put('/update-profile', adminAuth, adminController.updateAdminProfile);
router.put('/update-profile/:id', adminAuth, adminController.updateAdminProfile);
router.get('/getAdmin', adminAuth, adminController.getAdmin);

module.exports = router;