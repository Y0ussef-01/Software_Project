import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomeTeacherPage from "./pages/Home/HomeTeacherPage";
import HelpPage from "./pages/HelpPage/HelpPage";
import ProfileStudnetPage from "./pages/ProfilePage/ProfileStudentPage";
import HomeStuentPage from "./pages/Home/HomeStuentPage";
import Error404 from "./pages/Error404/Error404";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetStudentPasswordPage from "./pages/RestPasswordPage/RestStudentPasswordPage";
import RestTeacherPasswordPage from "./pages/RestPasswordPage/RestTeacherPasswordPage";
import AdminLayout from "./pages/AdminPage/Dashboard/AdminLayout";
import { CustomThemeProvider } from "./context/Admin/ThemeContext";
import AdminProfilePage from "./pages/AdminPage/AdminProfilePage/AdminProfilePage";
import { AdminProfileProvider } from "./context/Admin/AdminProfileContext";

function App() {
  return (
    <AuthProvider>
      <ToastContainer style={{ zIndex: 99999 }} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* 🛡️ منطقة الطالب (Student Zone) */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/home" element={<HomeStuentPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/profile" element={<ProfileStudnetPage />} />
            <Route
              path="/reset-password"
              element={<ResetStudentPasswordPage />}
            />
          </Route>

          {/* 🛡️ منطقة الأستاذ (Teacher Zone) */}
          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/teacher" element={<HomeTeacherPage />} />
            <Route
              path="/teacher/reset-password"
              element={<RestTeacherPasswordPage />}
            />
          </Route>

          {/* 🛡️ منطقة الإدارة (Admin Zone) */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route
              path="/adminPanel"
              element={
                <CustomThemeProvider>
                  <AdminProfileProvider>
                    <AdminLayout />
                  </AdminProfileProvider>
                </CustomThemeProvider>
              }
            >
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
