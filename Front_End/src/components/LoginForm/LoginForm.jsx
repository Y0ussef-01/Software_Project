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
        p: { xs: 4, md: 6 },
        borderRadius: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "text.secondary", mb: 1.5 }}
        >
          🇪🇬 Cairo - Egypt
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#063f6d", mb: 1 }}
        >
          Welcome to Cairo university
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to your account
        </Typography>
      </Box>

      <Stack spacing={4}>
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
            sx={{ borderRadius: "12px", height: "55px" }}
          />
        </Box>
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
            sx={{ borderRadius: "12px", height: "55px" }}
          />
        </Box>
      </Stack>

      <Box sx={{ mt: 5 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={isSubmitDisabled}
          sx={{
            py: 2,
            borderRadius: "12px",
            backgroundColor: isSubmitDisabled
              ? "action.disabledBackground"
              : "#152b48",
            color: isSubmitDisabled ? "text.disabled" : "#fff",
            fontWeight: "bold",
            fontSize: "1.1rem",
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
