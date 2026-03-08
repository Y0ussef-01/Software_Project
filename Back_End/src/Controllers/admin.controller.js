const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

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
    res
      .status(201)
      .json({ message: "added student successfully", student: newStudent });
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
const Course = require("../models/Course");
const Group = require("../models/Group");

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
};

