import React, { useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../../components/AdminComp/AdminLayout/AdminSidebar";
import AdminTopbar from "../../../components/AdminComp/AdminLayout/AdminTopbar";

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // على الموبايل: مخفي افتراضياً - على الديسك توب: ظاهر افتراضياً
  const [isCollapsed, setIsCollapsed] = useState(isMobile ? true : false);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content - بياخد كل الشاشة على الموبايل */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0, // ✅ مهم جداً - بيمنع الكونتنت من الاتمدد
          width: "100%",
        }}
      >
        {/* Topbar - بنبعتله فنكشن تفتح/تقفل الـ sidebar */}
        <AdminTopbar
          onMenuToggle={() => setIsCollapsed((prev) => !prev)}
        />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 }, // ✅ padding أصغر على الموبايل
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}