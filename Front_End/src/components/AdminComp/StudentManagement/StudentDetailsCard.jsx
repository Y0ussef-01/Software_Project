import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  useTheme,
  Avatar,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function StudentDetailsCard({
  student,
  onDeleteClick,
  onUpdateSubmit,
}) {
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(student);

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // دالة الحفظ
  const handleSave = () => {
    onUpdateSubmit(editData);
    setIsEditing(false);
  };

  // دالة الإلغاء
  const handleCancel = () => {
    setEditData(student);
    setIsEditing(false);
  };

  const fields = [
    { key: "_id", label: "Student ID", value: editData._id, editable: false },
    { key: "name", label: "Full Name", value: editData.name, editable: true },
    {
      key: "email",
      label: "Email Address",
      value: editData.email,
      editable: true,
    },
    ...(isEditing
      ? [
          {
            key: "password",
            label: "New Password (Optional)",
            value: editData.password || "",
            editable: true,
          },
        ]
      : []),
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" },
        p: { xs: 3, sm: 4, md: 5, lg: 6 },
        borderRadius: { xs: "24px", xl: "32px" },
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 10px 40px rgba(0, 0, 0, 0.4)"
            : "0px 10px 40px rgba(21, 43, 72, 0.08)",
        overflow: "hidden",
        transition: "all 0.3s ease",
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
          top: "-20%",
          right: "-5%",
          width: { xs: "250px", md: "350px", xl: "450px" },
          height: { xs: "250px", md: "350px", xl: "450px" },
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 5,
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              src={
                student.profileImg !== "default.jpg" ? student.profileImg : ""
              }
              sx={{
                width: 90,
                height: 90,
                fontSize: "2.5rem",
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                border: `4px solid ${theme.palette.background.paper}`,
                boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
              }}
            >
              {editData.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "900",
                  color: theme.palette.text.primary,
                  mb: 0.5,
                }}
              >
                {editData.name}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary, fontWeight: 700 }}
              >
                Student Profile
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={handleSave}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Save Update
                </Button>
                <Tooltip title="Cancel">
                  <IconButton
                    onClick={handleCancel}
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "#f5f5f5",
                    }}
                  >
                    <CloseOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderWidth: "2px",
                    "&:hover": { borderWidth: "2px" },
                  }}
                >
                  Edit Info
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={onDeleteClick}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderWidth: "2px",
                    "&:hover": { borderWidth: "2px" },
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={{ xs: 1.5, sm: 2, lg: 3 }}>
          {fields.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={isEditing && item.key === "password" ? 12 : 4}
              key={index}
            >
              <Box
                sx={{
                  p: { xs: 2, lg: 3 },
                  minHeight: "100px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "#f8fafc",
                  borderRadius: "16px",
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    transform: "translateY(-3px)",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "#fff",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0px 8px 20px rgba(0,0,0,0.4)"
                        : "0px 8px 20px rgba(21,43,72,0.06)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    mb: 1,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                  }}
                >
                  {item.label}
                </Typography>

                {isEditing && item.editable ? (
                  <TextField
                    name={item.key}
                    value={item.value}
                    onChange={handleInputChange}
                    size="small"
                    fullWidth
                    variant="standard"
                    type={item.key === "password" ? "password" : "text"}
                    InputProps={{
                      disableUnderline: false,
                      sx: {
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: theme.palette.text.primary,
                      },
                    }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 900,
                      color: theme.palette.text.primary,
                      fontSize: "1.1rem",
                    }}
                  >
                    {item.value}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
