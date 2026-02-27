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
  Alert, // ✨ تمت الإضافة لعرض الأخطاء
  CircularProgress, // ✨ تمت الإضافة لعرض حالة التحميل
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// 1. استدعاء العقل المدبر (الـ Hook)
// 💡 تأكد من أن المسار صحيح بناءً على هيكلة ملفاتك
import { useLoginForm } from "../../hooks/useLoginForm.js";

export default function LoginForm() {
  // 2. سحب البيانات والدوال من الـ Hook
  const {
    userId,
    setUserId,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useLoginForm();

  // 3. حالة إظهار وإخفاء كلمة المرور تبقى هنا لأنها تخص الـ UI فقط
  const [showPassword, setShowPassword] = useState(false);

  // 4. الزر سيتم إيقافه إذا كانت الحقول فارغة أو إذا كان هناك تحميل جاري
  const isSubmitDisabled =
    userId.trim() === "" || password.trim() === "" || loading;

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Paper
      elevation={3}
      component="form" // ✨ تحويل المكون إلى نموذج (Form)
      onSubmit={handleLogin} // ✨ ربط دالة الإرسال بالنموذج
      sx={{
        p: { xs: 3, sm: 4, md: 5 },
        borderRadius: "16px",
        height: { xs: "auto", xl: "100%" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            color: "text.secondary",
            mb: 1.5,
            fontSize: { xs: "0.875rem", md: "1rem" },
          }}
        >
          🇪🇬 Cairo - Egypt
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
          Welcome to Cairo university
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Sign in to your account
        </Typography>
      </Box>

      {/* ✨ عرض رسالة الخطأ إن وجدت (مربوطة بالـ Hook) */}
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
            User ID
          </Typography>
          <OutlinedInput
            fullWidth
            placeholder="Enter your userID"
            value={userId} // ✨ مربوط بالـ Hook
            onChange={(e) => setUserId(e.target.value)} // ✨ مربوط بالـ Hook
            disabled={loading} // ✨ إيقاف الإدخال أثناء التحميل
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
            Password
          </Typography>
          <OutlinedInput
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password} // ✨ مربوط بالـ Hook
            onChange={(e) => setPassword(e.target.value)} // ✨ مربوط بالـ Hook
            disabled={loading} // ✨ إيقاف الإدخال أثناء التحميل
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
          type="submit" // ✨ نوع الزر submit لكي يطلق حدث onSubmit للـ Form
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
          {/* ✨ التبديل بين كلمة Login ودائرة التحميل */}
          {loading ? <CircularProgress size={26} color="inherit" /> : "Login"}
        </Button>
      </Box>
    </Paper>
  );
}
