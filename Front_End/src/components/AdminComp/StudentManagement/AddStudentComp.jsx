import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  useTheme,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

export default function AddStudentComp() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "_id" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data to be sent to API:", {
      ...formData,
      profileImg: "default.jpg",
    });
    alert("This is just a UI Demo. Check console for payload!");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { xs: "850px", lg: "900px" },
        p: { xs: 3, sm: 4, md: 5, lg: 6 },
        borderRadius: { xs: "24px", xl: "32px" },
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
          width: { xs: "8px", lg: "10px" },
          backgroundColor: theme.palette.primary.main,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          right: "-5%",
          width: { xs: "200px", md: "350px", lg: "450px" },
          height: { xs: "200px", md: "350px", lg: "450px" },
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(144,202,249,0.05) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(25,118,210,0.05) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/adminPanel/students")}
          sx={{
            mb: { xs: 3, md: 4 },
            color: theme.palette.text.secondary,
            fontWeight: 700,
            textTransform: "none",
            fontSize: { xs: "0.8rem", sm: "0.9rem", lg: "1rem" },
            "&:hover": {
              backgroundColor: "transparent",
              color: theme.palette.primary.main,
            },
          }}
        >
          Back to Students
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
          <PersonAddAlt1Icon
            sx={{
              fontSize: { xs: 35, md: 45 },
              color: theme.palette.primary.main,
              mr: 2,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: "900",
              color: theme.palette.text.primary,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            Add New Student
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  mb: 1,
                }}
              >
                Student ID *
              </Typography>
              <TextField
                fullWidth
                name="_id"
                value={formData._id}
                onChange={handleChange}
                placeholder="e.g. 2327999"
                required
                variant="outlined"
                inputProps={{ inputMode: "numeric" }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "#f8fafc",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  mb: 1,
                }}
              >
                Full Name *
              </Typography>
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ahmed Ali"
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "#f8fafc",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  mb: 1,
                }}
              >
                Email Address *
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ahmed@sci.cu.edu.eg"
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "#f8fafc",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  mb: 1,
                }}
              >
                Password *
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "#f8fafc",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                * Note: A default profile image ('default.jpg') will be assigned
                automatically.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.8,
                  borderRadius: "14px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textTransform: "none",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 8px 20px rgba(0,0,0,0.5)"
                      : "0 8px 20px rgba(25, 118, 210, 0.25)",
                }}
              >
                Create Student Account
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}
