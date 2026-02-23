import React from "react";
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
import logo from "../../assets/images/logo.png";
import { useHeader } from "./useHeader";

const NAV_BG = "#04365f";
const CONTENT_BG = "#f4f6f8";

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: NAV_BG,
      }}
    >
      <CssBaseline />

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: NAV_BG,
          top: 0,
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={logo}
              alt="جامعه القاهره"
              sx={{
                height: 50,
                width: "auto",
                objectFit: "contain",
                ml: "10px",
              }}
            />
          </Box>

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

            <IconButton
              sx={{
                color: "white",
                ...interactiveStyles,
              }}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: CONTENT_BG,
          borderTopLeftRadius: { xs: "50px", md: "100px" },
          marginTop: 0,
          width: "100%",
          p: { xs: 3, md: 6 },
        }}
      ></Box>
    </Box>
  );
};

export default Header;
