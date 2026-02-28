import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import { useTeacherResetPassword } from "../../hooks/Teacher/useTeacherResetPassword.js";

export default function TeacherResetPasswordComp() {
  const navigate = useNavigate();

  // سحب الدوال وحالة التحميل
  const { resetPassword, isLoading } = useTeacherResetPassword();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await resetPassword(oldPassword, newPassword);

    if (isSuccess) {
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        p: { xs: 4, md: 6 },
        borderRadius: "20px",
        backgroundColor: "#fff",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "8px",
          background: "linear-gradient(180deg, #152b48 0%, #3b6ba5 100%)",
        }}
      />

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        disabled={isLoading}
        sx={{
          color: "#64748b",
          mb: 3,
          textTransform: "none",
          fontWeight: 600,
          "&:hover": { backgroundColor: "transparent", color: "#152b48" },
        }}
      >
        Back to Profile
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            borderRadius: "12px",
            backgroundColor: "rgba(21, 43, 72, 0.05)",
            mr: 2,
          }}
        >
          <LockResetIcon sx={{ fontSize: 30, color: "#152b48" }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: "900", color: "#152b48" }}>
          Reset Password
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            label="Old Password"
            variant="outlined"
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "&.Mui-focused fieldset": {
                  borderColor: "#152b48",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#152b48" },
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "&.Mui-focused fieldset": {
                  borderColor: "#152b48",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#152b48" },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!oldPassword || !newPassword || isLoading}
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: "#152b48",
              color: "#fff",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0px 8px 20px rgba(21, 43, 72, 0.2)",
              "&:hover": { backgroundColor: "#0f1f35" },
              "&:disabled": { backgroundColor: "#cbd5e1", color: "#94a3b8" },
            }}
          >
            {isLoading ? (
              <CircularProgress size={26} color="inherit" />
            ) : (
              "Update Password"
            )}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
