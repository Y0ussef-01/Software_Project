const express = require('express');
const router = express.Router();
const teacherAuth = require('../middlewares/teacherAuth');
const controller = require('../Controllers/teacher.controller');

router.get('/profile', teacherAuth, controller.getProfile);
router.put('/update-profile-img', teacherAuth, controller.updateProfileImg);
router.put('/update-password', teacherAuth, controller.updatePassword);

module.exports = router;