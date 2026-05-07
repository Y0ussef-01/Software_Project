import React from "react";
import {
  Box,
  IconButton,
  InputBase,
  useTheme,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useColorMode } from "../../../context/Admin/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

export default function AdminTopbar({ onMenuToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { toggleColorMode, resetColorMode } = useColorMode();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.info("You are logged out 👋. See you soon!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    });
    setTimeout(() => {
      logout();
      resetColorMode();
      navigate("/");
    }, 2000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 1.5, sm: 2 },
        height: "64px",
        backgroundColor: theme.palette.mode === "light" ? "#1976d2" : "#1e1e1e",
        color: "#fff",
        // ✅ مهم: منع الـ topbar من يتمدد
        flexShrink: 0,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left Side */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* ✅ زر الـ menu على الموبايل */}
        {isMobile && (
          <IconButton
            onClick={onMenuToggle}
            sx={{ color: "#fff" }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: "4px",
            px: { xs: 1, sm: 2 },
            py: 0.5,
            alignItems: "center",
            width: { xs: "140px", sm: "200px", md: "300px" },
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.25)" },
          }}
        >
          <SearchIcon sx={{ color: "#fff", mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search..."
            sx={{
              ml: 1,
              flex: 1,
              color: "#fff",
              fontSize: { xs: "0.8rem", sm: "1rem" },
              "& input::placeholder": { color: "#e0e0e0", opacity: 1 },
            }}
          />
        </Box>
      </Box>

      {/* Right Side Icons */}
      <Box sx={{ display: "flex", gap: { xs: 0, sm: 1 } }}>
        <Tooltip title="Toggle Theme">
          <IconButton sx={{ color: "#fff" }} onClick={toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Admin Profile">
          <Link to="/adminPanel/profile">
            <IconButton sx={{ color: "#fff" }}>
              <PersonOutlinedIcon />
            </IconButton>
          </Link>
        </Tooltip>

        <Tooltip title="Logout">
          <IconButton
            onClick={handleLogout}
            sx={{
              color: "#fff",
              "&:hover": {
                color: "#ff8a80",
                backgroundColor: "rgba(255, 138, 128, 0.08)",
              },
            }}
          >
            <LogoutOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}