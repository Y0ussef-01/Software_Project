import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage/LoginPage";
import HelpPage from "./pages/HelpPage/HelpPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import HomePage from "./pages/Home/HomePage";
import Error404 from "./pages/Error404/Error404";
import Students from "./pages/AdminPage/Students/Students";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add" element={<Students />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
