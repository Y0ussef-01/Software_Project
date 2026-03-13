const express = require('express');
const router = express.Router();
const multer = require('multer');
const teacherAuth = require('../middlewares/teacherAuth');
const controller = require('../Controllers/teacher.controller');

const fileFilter = (req, file, cb) => {
    cb(null, true);
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter
});

router.get('/profile', teacherAuth, controller.getProfile);
router.put('/update-profile-img', teacherAuth, controller.updateProfileImg);
router.put('/update-password', teacherAuth, controller.updatePassword);
router.post('/upload-grades-excel', teacherAuth, upload.any(), controller.uploadGradesExcel);

module.exports = router;