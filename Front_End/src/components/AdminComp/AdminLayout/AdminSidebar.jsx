import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";

import AdminAvatarSection from "../../AdminComp/AdminLayout/AdminAvatarSection";

export default function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // ✅ detect mobile (xs, sm)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { title: "Dashboard", icon: <HomeOutlinedIcon />, path: "/adminPanel" },
    { title: "Students", icon: <SchoolOutlinedIcon />, path: "/adminPanel/students" },
    { title: "Teachers", icon: <PeopleOutlinedIcon />, path: "/adminPanel/teachers" },
    { title: "Courses", icon: <ClassOutlinedIcon />, path: "/adminPanel/classes" },
    { title: "Enrollments", icon: <ReceiptOutlinedIcon />, path: "/adminPanel/enrollments" },
    { title: "Teacher Assignments", icon: <AssignmentOutlinedIcon />, path: "/adminPanel/teacher-assignments" },
    { title: "Final Grades", icon: <GradingOutlinedIcon />, path: "/adminPanel/final-grades" },
    { title: "Complaints", icon: <FeedbackOutlinedIcon />, path: "/adminPanel/complaints" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    // ✅ على الموبايل: أقفل الـ drawer بعد الضغط
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const SidebarContent = (
    <Box
      sx={{
        width: isMobile ? "260px" : isCollapsed ? "80px" : "260px",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "flex-end" : isCollapsed ? "center" : "flex-end",
          p: 1,
        }}
      >
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{ color: theme.palette.text.primary }}
        >
          {isMobile ? <ChevronLeftIcon /> : isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Avatar */}
      <AdminAvatarSection variant="sidebar" isCollapsed={isMobile ? false : isCollapsed} />

      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.title} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: (!isMobile && isCollapsed) ? "center" : "initial",
                  px: 2.5,
                  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  backgroundColor: isActive
                    ? theme.palette.mode === "dark"
                      ? "rgba(144, 202, 249, 0.16)"
                      : "rgba(25, 118, 210, 0.08)"
                    : "transparent",
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: (!isMobile && isCollapsed) ? 0 : 2,
                    justifyContent: "center",
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {/* ✅ على الموبايل دايما اعرض النص، على الديسك توب شوف الـ isCollapsed */}
                {(isMobile || !isCollapsed) && (
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  // ✅ على الموبايل: استخدم Drawer (يطلع من الجانب)
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={!isCollapsed}
        onClose={() => setIsCollapsed(true)}
        PaperProps={{
          sx: {
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }

  // ✅ على الديسك توب: الـ sidebar العادي
  return (
    <Box
      sx={{
        width: isCollapsed ? "80px" : "260px",
        height: "100vh",
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        flexShrink: 0,
      }}
    >
      {SidebarContent}
    </Box>
  );
}