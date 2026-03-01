const express = require("express");
const cors = require("cors");
const teacherRoutes = require("./routes/teacher.routes");
const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
