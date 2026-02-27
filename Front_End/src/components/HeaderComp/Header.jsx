import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CssBaseline,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../../assets/images/logo.png";
import { useHeader } from "./useHeader";

import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const NAV_BG = "#152b48";

const Header = () => {
  const {
    anchorEl,
    open,
    language,
    handleLanguageClick,
    handleClose,
    handleSelectLanguage,
    interactiveStyles,
  } = useHeader();

  const { token, logout, role, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  const currentRole = role || user?.role;

  const handleLogoutClick = () => {
    toast.info("You are logged out 👋. See you soon!", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "colored",
    });

    setTimeout(() => {
      logout();
      navigate("/", { replace: true });
    }, 1500);
  };

  return (
    <Box sx={{ bgcolor: NAV_BG }}>
      <CssBaseline />
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: NAV_BG,
          margin: 0,
          border: "none",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            px: { xs: 2, md: 5 },
            height: 80,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link
            to={
              token ? (currentRole === "teacher" ? "/teacher" : "/home") : "/"
            }
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src={logo}
                alt="جامعه القاهره"
                sx={{
                  height: 50,
                  width: "auto",
                  objectFit: "contain",
                  mt: "10px",
                  ml: "15px",
                }}
              />
            </Box>
          </Link>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              id="lang-button"
              aria-controls={open ? "lang-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleLanguageClick}
              startIcon={<LanguageIcon />}
              sx={{
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                ...interactiveStyles,
              }}
            >
              {language}
            </Button>

            <Menu
              id="lang-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "lang-button" }}
              PaperProps={{
                elevation: 3,
                sx: { mt: 1, minWidth: 120, borderRadius: "12px" },
              }}
            >
              <MenuItem
                onClick={() => handleSelectLanguage("En")}
                sx={{ fontWeight: 500 }}
              >
                English
              </MenuItem>
              <MenuItem
                onClick={() => handleSelectLanguage("Ar")}
                sx={{ fontWeight: 500, textAlign: "right", width: "100%" }}
              >
                العربية
              </MenuItem>
            </Menu>

            {token && !isLoginPage && (
              <>
                {currentRole !== "teacher" && (
                  <Link to="/help">
                    <IconButton sx={{ color: "white", ...interactiveStyles }}>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Link>
                )}

                <Button
                  onClick={handleLogoutClick}
                  startIcon={<LogoutIcon />}
                  sx={{
                    color: "#ff6b6b",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    ml: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 107, 107, 0.1)",
                      color: "#ff4c4c",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
