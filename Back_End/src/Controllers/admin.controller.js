const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");
const Course = require("../models/Course");
const Group = require("../models/Group");
const AcademicRecord = require('../models/AcademicRecord');
const FinalResult = require('../models/FinalResult');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const { getLetterGrade, getCourseGPA } = require("../utils/gradeCalculator");const sendPushNotification = require('../utils/sendPushNotification');
const bcrypt = require("bcrypt");
const xlsx = require('xlsx');

const addStudent = async (req, res) => {
  try {
    const { _id, name, password } = req.body;
    const Email = `20${_id}@std.sci.cu.edu.eg`;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      _id,
      name,
      email: Email,
      password: hashedPassword,
    });

    await newStudent.save();

    const emailSubject = "Welcome to Cairo University Portal";
    const emailHtml = `
      <div style="direction: ltr; font-family: Arial, sans-serif;">
        <h2>Welcome ${name}!</h2>
        <p>Your university account has been created successfully.</p>
        <p><b>Your User ID:</b> ${_id}</p>
        <p><b>Your Password:</b> ${password}</p>
        <br/>
        <p><i>Please make sure to change your password after your first login for security reasons.</i></p>
      </div>
    `;

    sendEmail(Email, emailSubject, "", emailHtml).catch(err => console.log("Email failed to send", err));

    res.status(201).json({ message: "added student successfully", student: newStudent });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student)
      return res.status(404).json({ message: "Student not found." });

    res.json({ message: "Deleted student successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).populate({
          path: "registeredCourses.course",select: 'name hours '
        }
    ).populate({
      path: "registeredCourses.group",select: 'groupName Room type appointment',
    });

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedUpdates = [
      "password",
      "profileImg",
      "department",
      "grade",
      "GPA",
      "maxHours",
    ];
    const updateData = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    if (updateData.password && String(updateData.password).trim() !== "") {
      updateData.password = await bcrypt.hash(String(updateData.password), 10);
    } else {
      delete updateData.password;
    }

    const student = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "updated successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addTeacher = async (req, res) => {
  try {
    const { _id, name, email, password, department } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      _id,
      name,
      email,
      password: hashedPassword,
      department,
    });

    await newTeacher.save();
    res
        .status(201)
        .json({ message: "added Teacher Successfully", teacher: newTeacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json({ message: "Deleted Teacher Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).populate({
          path: "courses.course",select: 'name hours '
        }
    ).populate({
      path: "courses.group",select: 'groupName Room type appointment',
    });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedUpdates = ["password", "profileImg"];
    const updateData = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    if (updateData.password && String(updateData.password).trim() !== "") {
      updateData.password = await bcrypt.hash(String(updateData.password), 10);
    } else {
      delete updateData.password;
    }

    const teacher = await Teacher.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json({ message: "Data updated Successfully", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addAdmin = async (req, res) => {
  try {
    const { _id, name, email, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      _id,
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res
        .status(201)
        .json({ message: "Admin added successfully", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
          .status(400)
          .json({ message: "Please enter old and new password" });
    }

    const admin = await Admin.findById(req.user.id).select("+password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: "The password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfileImg = async (req, res) => {
  try {
    const { profileImg } = req.body;

    const admin = await Admin.findByIdAndUpdate(
        req.user.id,
        { profileImg },
        { new: true, runValidators: true },
    );
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "The data was successfully updated", admin: admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const assignStudentCourse = async (req, res) => {
  try {
    const { studentId, courseId, groupName } = req.body;
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or Course not found" });
    }

    const alreadyRegistered = student.registeredCourses.some(rc => rc.course === courseId);
    if (alreadyRegistered) {
      return res.status(400).json({ message: "Student already registered in this course" });
    }

    const groupsToRegister = await Group.find({ course: courseId, groupName: groupName });
    if (groupsToRegister.length === 0) {
      return res.status(404).json({ message: "Group not found for this course" });
    }

    student.hours += course.hours;

    for (let group of groupsToRegister) {
      student.registeredCourses.push({ course: courseId, group: group._id });
      if (!group.enrolledStudents.includes(studentId)) {
        group.enrolledStudents.push(studentId);
        await group.save();
      }
    }

    await student.save();
    res.status(200).json({ message: "Course assigned to student successfully by Admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const dropStudentCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or Course not found" });
    }

    const groupsToDrop = student.registeredCourses.filter(rc => rc.course === courseId).map(rc => rc.group);

    for (let groupId of groupsToDrop) {
      await Group.findByIdAndUpdate(groupId, {
        $pull: { enrolledStudents: studentId }
      });
    }

    student.registeredCourses = student.registeredCourses.filter(rc => rc.course !== courseId);
    student.hours -= course.hours;

    await student.save();
    res.status(200).json({ message: "Course dropped from student successfully by Admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const assignTeacherCourse = async (req, res) => {
  try {
    const { teacherId, courseId, groupName } = req.body;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const groupsToAssign = await Group.find({ course: courseId, groupName: groupName });
    if (groupsToAssign.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    for (let group of groupsToAssign) {
      const alreadyAssigned = teacher.courses.some(c => c.group === group._id);
      if (!alreadyAssigned) {
        teacher.courses.push({ course: courseId, group: group._id });
      }
    }

    await teacher.save();
    res.status(200).json({ message: "Course and Group assigned to teacher successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeTeacherCourse = async (req, res) => {
  try {
    const { teacherId, courseId, groupName } = req.body;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const groupsToRemove = await Group.find({ course: courseId, groupName: groupName });
    const groupIdsToRemove = groupsToRemove.map(g => g._id);

    teacher.courses = teacher.courses.filter(c => !groupIdsToRemove.includes(c.group));

    await teacher.save();
    res.status(200).json({ message: "Course removed from teacher successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalCourses, gpaResult, studentsPerCourse] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Course.countDocuments(),

      Student.aggregate([
        { $group: { _id: null, averageGPA: { $avg: "$GPA" } } }
      ]),

      Student.aggregate([
        { $unwind: "$registeredCourses" },
        { $group: { _id: { studentId: "$_id", courseId: "$registeredCourses.course" } } },
        { $group: { _id: "$_id.courseId", count: { $sum: 1 } } },
        { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "courseDetails" } },
        { $unwind: "$courseDetails" },
        { $project: {
            courseId: "$_id",
            courseName: "$courseDetails.name",
            enrolledStudentsCount: "$count",
            _id: 0
          }},
        { $sort: { enrolledStudentsCount: -1 } }
      ])
    ]);

    const averageGPA = gpaResult.length > 0 ? parseFloat(gpaResult[0].averageGPA.toFixed(2)) : 0;

    res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        averageGPA,
        studentsPerCourse
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadFinalGrades = async (req, res) => {
  try {
    const { courseId } = req.body;
    const file = req.file || (req.files && req.files[0]);

    if (!file)     return res.status(400).json({ message: 'Please upload a file' });
    if (!courseId) return res.status(400).json({ message: 'courseId is required' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet    = workbook.Sheets[workbook.SheetNames[0]];
    const rows     = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows || rows.length === 0)
      return res.status(400).json({ message: 'File is empty' });

    const idPossibleNames = ['id', 'student_id', 'code', 'student id','كود الطالب'];
    const scoreColumns    = ['final', 'final_grade', 'total', 'score', 'final score', 'final grade'];

    const ONE_WEEK  = 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + ONE_WEEK);

    const results       = [];
    const notifStudents = [];

    for (let row of rows) {
      const rowKeys = Object.keys(row);

      let studentId = null;
      for (let key of rowKeys) {
        if (idPossibleNames.includes(key.toLowerCase().trim())) {
          studentId = String(row[key]).trim();
          break;
        }
      }
      if (!studentId || studentId === "") continue;

      let score = null;
      for (let key of rowKeys) {
        if (scoreColumns.includes(key.toLowerCase().trim())) {
          const parsed = parseFloat(row[key]);
          if (!isNaN(parsed)) { score = parsed; break; }
        }
      }
      if (score === null) {
        for (let key of rowKeys) {
          if (idPossibleNames.includes(key.toLowerCase().trim())) continue;
          const parsed = parseFloat(row[key]);
          if (!isNaN(parsed)) { score = parsed; break; }
        }
      }
      if (score === null) continue;

      const grade  = getLetterGrade(score);
      const status = grade === 'Fail' ? 'Failed' : 'Passed';

      const student = await Student.findById(studentId);
      if (!student) continue;

      const previousFail = await AcademicRecord.findOne({
        student: studentId,
        course:  courseId,
        status:  'Failed'
      });

      const alreadyPassedInRecord = await AcademicRecord.findOne({
        student: studentId,
        course:  courseId,
        status:  'Passed'
      });

      if (!alreadyPassedInRecord) {
        await AcademicRecord.create({
          student: studentId,
          course: courseId,
          score,
          grade,
          status,
          uploadedAt: new Date()
        });
      }

      await FinalResult.findOneAndUpdate(
          { student: studentId, course: courseId },
          { score, grade, status, expiresAt },
          { upsert: true, new: true }
      );

      const courseGPA = getCourseGPA(score);
      const currentCoursePoints = courseGPA * course.hours;

      const oldTotalPoints = (student.GPA || 0) * (student.gpaHours || 0);

      if (status === 'Passed') {
        const alreadyPassed = student.passedCourses.some(pc => pc.course === courseId);
        if (!alreadyPassed) {
          let newGpaHours = student.gpaHours || 0;

          if (previousFail) {
            student.passedHours = (student.passedHours || 0) + course.hours;
          } else {
            newGpaHours += course.hours;
            student.passedHours = (student.passedHours || 0) + course.hours;
          }

          const newTotalPoints = oldTotalPoints + currentCoursePoints;
          student.GPA = parseFloat((newTotalPoints / newGpaHours).toFixed(2));
          student.gpaHours = newGpaHours;

          student.passedCourses.push({ course: courseId, degree: grade });
        }
      } else if (status === 'Failed') {
        if (!previousFail) {
          const newGpaHours = (student.gpaHours || 0) + course.hours;
          const newTotalPoints = oldTotalPoints;

          student.GPA = parseFloat((newTotalPoints / newGpaHours).toFixed(2));
          student.gpaHours = newGpaHours;
        }
      }

      const wasRegistered = student.registeredCourses.some(rc => rc.course === courseId);
      if (wasRegistered) {
        const groupsToDrop = student.registeredCourses
            .filter(rc => rc.course === courseId)
            .map(rc => rc.group);

        await Group.updateMany(
            { _id: { $in: groupsToDrop } },
            { $pull: { enrolledStudents: studentId } }
        );

        student.registeredCourses = student.registeredCourses.filter(rc => rc.course !== courseId);
        student.hours -= course.hours;
      }

      await student.save();

      notifStudents.push({ id: studentId, pushToken: student.pushToken });
      results.push({ studentId, score, grade, status });
    }

    if (notifStudents.length > 0) {
      const notifDocs = notifStudents.map(s => ({
        studentId: s.id,
        title: '🔔 Final Results Published',
        body:  `Your final result for ${course.name} has been posted. Check your results now!`
      }));
      await Notification.insertMany(notifDocs);

      const tokens = notifStudents
          .map(s => s.pushToken)
          .filter(t => t && t !== 'null');

      if (tokens.length > 0) {
        await sendPushNotification(
            tokens,
            '🔔 Final Results Published',
            `Your final result for ${course.name} has been posted!`
        );
      }
    }

    res.status(200).json({
      message:   'Final grades uploaded successfully',
      processed: results.length,
      results
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const uploadStudentsExcel = async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) return res.status(400).json({ message: 'Please upload an Excel file' });

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: 'File is empty' });
    }

    const idPossibleNames = ['id', 'student_id', 'code', 'student id', 'كود الطالب'];
    const namePossibleNames = ['name', 'student_name', 'الاسم', 'اسم الطالب'];
    const passPossibleNames = ['password', 'pass', 'كلمة السر', 'الباسورد'];

    const bulkOps = [];
    const emailsToSend = [];

    for (let row of rows) {
      const rowKeys = Object.keys(row);

      let studentId = null;
      let name = "Unknown Student";
      let password = null;

      for (let key of rowKeys) {
        if (idPossibleNames.includes(key.toLowerCase().trim())) {
          studentId = String(row[key]).trim();
          break;
        }
      }
      if (!studentId || studentId === "") continue;

      for (let key of rowKeys) {
        if (namePossibleNames.includes(key.toLowerCase().trim())) {
          name = String(row[key]).trim();
          break;
        }
      }

      for (let key of rowKeys) {
        if (passPossibleNames.includes(key.toLowerCase().trim())) {
          password = String(row[key]).trim();
          break;
        }
      }

      if (!password || password === "") {
        password = studentId;
      }

      const email = `20${studentId}@std.sci.cu.edu.eg`;
      const hashedPassword = await bcrypt.hash(password, 10);

      const emailSubject = "Welcome to Cairo University Portal";
      const emailHtml = `
        <div style="direction: ltr; font-family: Arial, sans-serif;">
          <h2>Welcome ${name}!</h2>
          <p>Your university account has been created successfully.</p>
          <p><b>Your User ID:</b> ${studentId}</p>
          <p><b>Your Email:</b> ${email}</p>
          <p><b>Your Password:</b> ${password}</p>
          <br/>
          <p><i>Please make sure to change your password after your first login for security reasons.</i></p>
        </div>
      `;

      emailsToSend.push({
        to: email,
        subject: emailSubject,
        html: emailHtml
      });

      bulkOps.push({
        updateOne: {
          filter: { _id: studentId },
          update: {
            $setOnInsert: {
              _id: studentId,
              name: name,
              email: email,
              password: hashedPassword,
            }
          },
          upsert: true
        }
      });
    }

    if (bulkOps.length === 0) {
      return res.status(400).json({ message: 'No valid student data found in the file' });
    }

    await Student.bulkWrite(bulkOps);

    Promise.allSettled(
        emailsToSend.map(mail => sendEmail(mail.to, mail.subject, "", mail.html))
    ).then(() => console.log("All bulk emails processed."));

    res.status(200).json({
      message: 'Students uploaded successfully and emails are being sent',
      processedCount: bulkOps.length
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStudentsInGroup = async (req, res) => {
  try {
    const { courseId, groupName } = req.query;

    if (!courseId || !groupName) {
      return res.status(400).json({ message: "Course ID and Group Name are required" });
    }

    let students = [];

    if (groupName.toLowerCase() === 'all') {
      students = await Student.find({ "registeredCourses.course": courseId })
          .select('_id name profileImg');

    } else {
      const group = await Group.findOne({ course: courseId, groupName: groupName })
          .populate('enrolledStudents', '_id name profileImg');

      if (!group) {
        return res.status(404).json({ message: "Group not found for this course" });
      }

      students = group.enrolledStudents;
    }

    res.status(200).json({
      message: "Students retrieved successfully",
      count: students.length,
      students: students
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addStudent,
  deleteStudent,
  getStudent,
  updateStudent,
  addTeacher,
  deleteTeacher,
  getTeacher,
  updateTeacher,
  addAdmin,
  updatePassword,
  getAdmin,
  updateProfileImg,
  assignStudentCourse,
  dropStudentCourse,
  assignTeacherCourse,
  removeTeacherCourse,
  getDashboardStats,
  uploadFinalGrades,
  uploadStudentsExcel,
  getStudentsInGroup
};