import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Alert,
  CircularProgress, 
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useLoginForm } from "../../hooks/useLoginForm.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

const TRANSLATIONS = {
  en: {
    location: "🇪🇬 Cairo - Egypt",
    welcome: "Welcome to Cairo university",
    subtitle: "Sign in to your account",
    userIdLabel: "User ID",
    userIdPlaceholder: "Enter your userID",
    passwordLabel: "Password",
    passwordPlaceholder: "Password",
    loginBtn: "Login",
  },
  ar: {
    location: "مصر - القاهرة 🇪🇬",
    welcome: "مرحباً بكم في جامعة القاهرة",
    subtitle: "سجل الدخول إلى حسابك",
    userIdLabel: "رقم المستخدم",
    userIdPlaceholder: "أدخل رقم المستخدم الخاص بك",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "كلمة المرور",
    loginBtn: "تسجيل الدخول",
  }
};

export default function LoginForm() {
  const {
    userId,
    setUserId,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useLoginForm();

  const [showPassword, setShowPassword] = useState(false);
  const { language } = useLanguage();

  const t = TRANSLATIONS[language] || TRANSLATIONS["en"];

  const isSubmitDisabled =
    userId.trim() === "" || password.trim() === "" || loading;

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Paper
      elevation={3}
      component="form" 
      onSubmit={handleLogin} 
      dir={language === "ar" ? "rtl" : "ltr"}
      sx={{
        p: { xs: 3, sm: 4, md: 5 },
        borderRadius: "16px",
        height: { xs: "auto", xl: "100%" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 }, mt: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            color: "text.secondary",
            mb: 1.5,
            fontSize: { xs: "0.875rem", md: "1rem" },
          }}
        >
          {t.location}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#063f6d",
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.125rem" },
          }}
        >
          {t.welcome}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          {t.subtitle}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      <Stack spacing={{ xs: 3, md: 4 }}>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: "#333",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            {t.userIdLabel}
          </Typography>
          <OutlinedInput
            fullWidth
            placeholder={t.userIdPlaceholder}
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            disabled={loading} 
            startAdornment={
              <InputAdornment position="start">
                <PersonOutlineIcon />
              </InputAdornment>
            }
            sx={{ borderRadius: "12px", height: { xs: "48px", md: "55px" } }}
          />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: "#333",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            {t.passwordLabel}
          </Typography>
          <OutlinedInput
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder={t.passwordPlaceholder}
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={loading}      
            startAdornment={
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            sx={{ borderRadius: "12px", height: { xs: "48px", md: "55px" } }}
          />
        </Box>
      </Stack>

      <Box sx={{ mt: { xs: 4, md: 5 } }}>
        <Button
          fullWidth
          type="submit"       
          variant="contained"
          disabled={isSubmitDisabled}
          sx={{
            py: { xs: 1.5, md: 2 },
            borderRadius: "12px",
            backgroundColor: isSubmitDisabled
              ? "action.disabledBackground"
              : "#152b48",
            color: isSubmitDisabled ? "text.disabled" : "#fff",
            fontWeight: "bold",
            fontSize: { xs: "1rem", md: "1.1rem" },
            textTransform: "none",
            "&:hover": { backgroundColor: "#0f1f35" },
          }}
        >
          {loading ? <CircularProgress size={26} color="inherit" /> : t.loginBtn}
        </Button>
      </Box>
    </Paper>
  );
}
