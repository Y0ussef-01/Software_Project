# 🎓 College Management System

A complete full-stack solution for managing college operations. This system provides dedicated portals and features for **Admins**, **Teachers**, and **Students** across three main platforms: a robust Backend API, a responsive Web App, and a Mobile Application.

---

## 🚀 System Features

### 👨‍💼 Admin Panel
- **User Management:** Full CRUD operations for Students and Teachers.
- **Course & Schedule Management:** Add/remove courses and manage groups (Lectures, Labs, Tutorials) with specific capacities and time slots.
- **Conflict Handling:** Automated checks to prevent schedule overlaps.

### 👨‍🏫 Teacher Portal
- **Profile Management:** View assigned courses and update profile credentials/images.
- **Grades Management:** Upload student grades efficiently using Excel sheets (`.xlsx`).

### 👨‍🎓 Student Portal (Web & Mobile)
- **Course Registration:** Browse available courses, register for specific groups, or drop courses.
- **Academic Tracking:** View detailed grades and track registered hours vs. maximum allowed hours.
- **Profile & Security:** Manage profile images and secure passwords.

---

## 🛠️ Technology Stack

### Backend (RESTful API)
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security:** JWT (JSON Web Tokens), bcrypt
- **File Handling:** Multer, xlsx

### Frontend (Web Application)
- **Framework:** React.js (Vite)
- **Routing:** React Router v6
- **State Management:** React Context API (`AuthContext`)
- **HTTP Client:** Axios (with interceptors)
- **UI Notifications:** React Toastify

### Mobile Application
- **Framework:** React Native (Expo)
- **Styling:** Custom responsive theme based on `PixelRatio`
- **Fonts:** Inter Font Family

---

## ⚙️ Installation & Setup

To run this project locally, you need to set up all three environments. Make sure you have **Node.js** and **MongoDB** installed.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Y0ussef-01/Software_Project.git
cd Software_Project
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` folder:
\`\`\`env
PORT=5000
MONGO_URL=mongodb://localhost:27017/college-system
JWT_SECRET=your_super_secret_key
\`\`\`
Seed the database with initial data (Optional but recommended) and start the server:
\`\`\`bash
node seed2.js
npm start
\`\`\`

### 3. Frontend (Web) Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`
Create a `.env` file in the `frontend` folder:
\`\`\`env
VITE_API_BASE_URL=http://localhost:5000
\`\`\`
Start the React development server:
\`\`\`bash
npm run dev
\`\`\`

### 4. Mobile App Setup
Open a third terminal window:
\`\`\`bash
cd mobile
npm install
npx expo start
\`\`\`
- Press `a` to run on Android emulator.
- Press `i` to run on iOS simulator.
- Or scan the QR code with the Expo Go app on your physical device.

---

## 📚 API Documentation
All backend routes are protected via role-based JWT middleware. For a complete list of endpoints, request bodies, and responses, please refer to the `API_Documentation.txt` file included in the backend directory.