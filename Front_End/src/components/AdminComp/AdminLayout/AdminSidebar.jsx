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
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";

import AdminAvatarSection from "../../AdminComp/AdminLayout/AdminAvatarSection";

export default function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { title: "Dashboard", icon: <HomeOutlinedIcon />, path: "/adminPanel" },
    {
      title: "Students",
      icon: <SchoolOutlinedIcon />,
      path: "/adminPanel/students",
    },
    {
      title: "Teachers",
      icon: <PeopleOutlinedIcon />,
      path: "/adminPanel/teachers",
    },
    {
      title: "Enrollments",
      icon: <ReceiptOutlinedIcon />,
      path: "/adminPanel/enrollments",
    },
  ];

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
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isCollapsed ? "center" : "flex-end",
          p: 1,
        }}
      >
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{ color: theme.palette.text.primary }}
        >
          {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <AdminAvatarSection variant="sidebar" isCollapsed={isCollapsed} />

      <Divider />

      <List sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.title} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: isCollapsed ? "center" : "initial",
                  px: 2.5,
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
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
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: "center",
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
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
}
