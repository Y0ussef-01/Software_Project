const express = require('express');
const router = express.Router();
const studentAuth = require('../middlewares/studentAuth');
const controller = require('../Controllers/student.controller');

router.get('/Profile', studentAuth, controller.getProfile);
router.put('/updateProfileImg', studentAuth, controller.updateProfileImg);
router.put('/updatePassword', studentAuth, controller.updatePassword);

module.exports = router;