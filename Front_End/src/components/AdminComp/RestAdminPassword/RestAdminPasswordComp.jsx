import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  useTheme,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

import useResetAdminPassword from "../../../hooks/Admin/useResetAdminPassword";

export default function RestAdminPasswordComp() {
  const theme = useTheme();

  const {
    formData,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    isLoading,
    handleChange,
    handleSubmit,
    navigate,
  } = useResetAdminPassword();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: "24px",
          backgroundColor: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 10px 40px rgba(0, 0, 0, 0.4)"
              : "0px 10px 40px rgba(21, 43, 72, 0.08)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "6px",
            backgroundColor: theme.palette.primary.main,
          }}
        />

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/adminPanel/profile")}
          sx={{
            mb: 4,
            color: theme.palette.text.secondary,
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "transparent",
              color: theme.palette.primary.main,
            },
          }}
        >
          Back to Profile
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <VpnKeyOutlinedIcon
            sx={{ fontSize: 35, color: theme.palette.primary.main, mr: 2 }}
          />
          <Typography
            variant="h4"
            sx={{ fontWeight: "900", color: theme.palette.text.primary }}
          >
            Reset Password
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Current Password"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
              value={formData.oldPassword}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      edge="end"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "#f8fafc",
                },
              }}
            />

            <TextField
              label="New Password"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "#f8fafc",
                },
              }}
            />

            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              error={
                formData.newPassword !== formData.confirmPassword &&
                formData.confirmPassword !== ""
              }
              helperText={
                formData.newPassword !== formData.confirmPassword &&
                formData.confirmPassword !== ""
                  ? "Passwords do not match"
                  : ""
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "#f8fafc",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 8px 20px rgba(0,0,0,0.5)"
                    : "0 8px 20px rgba(25, 118, 210, 0.25)",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Password"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
