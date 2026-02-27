const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Student = require('./models/Student');
const teacherRoutes = require('./routes/teacher.routes');
const studentRoutes = require('./routes/student.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

module.exports = app;