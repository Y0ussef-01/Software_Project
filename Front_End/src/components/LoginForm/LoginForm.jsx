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
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitDisabled = userId.trim() === "" || password.trim() === "";

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        // شيلنا الـ mt: 40px عشان يتساوى مع الإعلان
        p: { xs: 4, md: 6 }, // كبرنا البادينج الداخلي عشان يدي براح
        borderRadius: "16px", // كبرنا الـ radius شوية
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="subtitle1" // كبرنا الخط شوية
          sx={{ fontWeight: "bold", color: "text.secondary", mb: 1.5 }}
        >
          🇪🇬 Cairo - Egypt
        </Typography>
        <Typography
          variant="h4" // كبرنا العنوان الأساسي من h5 لـ h4
          sx={{ fontWeight: "bold", color: "#063f6d", mb: 1 }}
        >
          Welcome to Cairo university
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to your account
        </Typography>
      </Box>

      {/* Inputs Section */}
      <Stack spacing={4}>
        {" "}
        {/* كبرنا المسافة بين الـ inputs لـ 4 بدل 3 */}
        {/* User ID Field */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 1.5, color: "#333" }}
          >
            User ID
          </Typography>
          <OutlinedInput
            fullWidth
            placeholder="Enter your userID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <PersonOutlineIcon />
              </InputAdornment>
            }
            sx={{ borderRadius: "12px", height: "55px" }} // زودنا طول الـ input لـ 55px
          />
        </Box>
        {/* Password Field */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 1.5, color: "#333" }}
          >
            Password
          </Typography>
          <OutlinedInput
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            sx={{ borderRadius: "12px", height: "55px" }} // زودنا طول الـ input لـ 55px
          />
        </Box>
      </Stack>

      {/* Actions Section */}
      <Box sx={{ mt: 5 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={isSubmitDisabled}
          sx={{
            py: 2, // كبرنا حجم الزرار
            borderRadius: "12px",
            backgroundColor: isSubmitDisabled
              ? "action.disabledBackground"
              : "#152b48",
            color: isSubmitDisabled ? "text.disabled" : "#fff",
            fontWeight: "bold",
            fontSize: "1.1rem", // كبرنا خط الزرار
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0f1f35",
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Paper>
  );
}
