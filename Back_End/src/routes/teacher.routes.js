const express = require('express');
const router = express.Router();
const multer = require('multer');
const teacherAuth = require('../middlewares/teacherAuth');
const controller = require('../Controllers/teacher.controller');
const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml")) {
        cb(null, true);
    } else {
        cb(new Error("allowed only excel sheets"), false);
    }
};
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter
});


router.get('/profile', teacherAuth, controller.getProfile);
router.put('/update-profile-img', teacherAuth, controller.updateProfileImg);
router.put('/update-password', teacherAuth, controller.updatePassword);

router.post('/upload-grades-excel', teacherAuth, upload.single('excelFile'), controller.uploadGradesExcel);

module.exports = router;