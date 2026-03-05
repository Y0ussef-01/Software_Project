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
    const student = await Student.findById(id);

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
    const teacher = await Teacher.findById(id);

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
};
