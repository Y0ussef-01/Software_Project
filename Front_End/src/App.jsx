import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage/LoginPage";
import Teachers from "./pages/AdminPage/Teatchers/Teatchers";
import HelpPage from "./pages/HelpPage/HelpPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import HomePage from "./pages/Home/HomePage";
import Error404 from "./pages/Error404/Error404";
import Dashboard from "./pages/AdminPage/DashBoard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Students from "./pages/AdminPage/Students/Students";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* مسار تسجيل الدخول الموحد للجميع */}
          <Route path="/" element={<LoginPage />} />

          {/* 🛡️ منطقة الطالب (Student Zone) */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* 🛡️ منطقة الأستاذ (Teacher Zone) */}
          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/teacher" element={<Teachers />} />
          </Route>

          {/* 🛡️ منطقة الإدارة (Admin Zone - React Admin) */}
          {/* لاحظ علامة /* مهمة جداً لكي يعمل React Admin بروابطه الداخلية */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/adminPanel/*" element={<Dashboard />} />
            <Route path="/adminPanel/Student" element={<Students />} />
          </Route>

          {/* صفحة 404 في حالة إدخال رابط غير موجود */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
