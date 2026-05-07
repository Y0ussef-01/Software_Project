# 🎓 Smart University Management System (CU Portal)

## 📌 Problem Statement
During the course registration period, students waste a massive amount of time manually drafting, comparing, and adjusting their schedules. If a single group reaches maximum capacity, their entire planned schedule collapses, forcing them to start from scratch and causing severe registration delays. Furthermore, once groups are full, manually finding and executing a group swap with another student is an incredibly tedious and nearly impossible process.

## 🎯 Target Users
* **Students:** To easily register courses, auto-generate schedules, swap groups, track attendance, and view AI-driven academic performance analysis.
* **Teachers:** To manage course grades, generate dynamic QR codes for secure attendance, and send instant announcements to specific groups.
* **Admins:** To manage users, oversee course enrollments, upload bulk data via Excel, and monitor overall university statistics.

## 🚀 Goals
* **Primary Goal:** To drastically simplify the registration process and lift the heavy stress and pressure off students' shoulders during the enrollment period.
* Automate the attendance process using dynamic, time-sensitive QR codes to save lecture time.
* Streamline course management and minimize administrative bottlenecks.
* Provide students with AI-powered, personalized academic analytics to help them improve their GPA.

## 💡 How to Solve the Problem (The Solution)
To tackle these specific bottlenecks, we built a comprehensive platform (Web & Mobile) integrating smart features:
1. **Auto-Schedule Generator:** A smart feature where the system instantly computes and generates ready-made, conflict-free schedule combinations based on the student's selected subjects, saving them hours of manual planning.
2. **Peer-to-Peer 'Switch' System:** A seamless swapping feature allowing students to broadcast swap requests and easily exchange full groups with one another without administrative hurdles.
3. **Full-Stack Ecosystem:** A powerful Web Dashboard for Admins and a React Native Mobile App for Students/Teachers, ensuring real-time syncing and smooth university operations.

## 🔄 Usage Patterns (Key Use Cases)
* **Smart Registration:** Student selects desired courses ➔ System generates valid schedule combinations ➔ Student picks the best one with one click.
* **Course Swap Flow:** Student A broadcasts a swap request for a specific group ➔ Student B accepts ➔ The system automatically checks for time conflicts and seamlessly swaps their enrollments.
* **Smart Attendance:** Teacher generates a 5-second valid QR token via the app ➔ Students scan the QR code ➔ Backend verifies the device ID and logs attendance.

## 🛠️ Tech Stack
* **Frontend (Web):** React.js, Material-UI (MUI)
* **Frontend (Mobile):** React Native (Expo)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB & Mongoose
* **Integrations:** OpenRouter API (AI Analysis), Expo Push Notifications, XLSX (File parsing), Nodemailer (Emails).

## 👥 Contributors
* Youssef Ashraf Mahmoud
* Abdulrahman Eliwa
* Abdulrahman Mohammed
* Youssef Ahmed
* Mahmoud Massad
* Ahmed Hesham