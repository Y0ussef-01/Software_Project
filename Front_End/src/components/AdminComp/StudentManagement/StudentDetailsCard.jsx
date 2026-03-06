import React, { useState, useEffect, useRef } from "react";
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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

export default function StudentDetailsCard({
  student,
  onDeleteClick,
  onUpdateSubmit,
}) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(student);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setEditData(student);
    setImagePreview(
      student.profileImg && student.profileImg !== "default.jpg"
        ? student.profileImg
        : "",
    );
  }, [student]);

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setEditData({ ...editData, profileImg: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview("");
    setEditData({ ...editData, profileImg: "default.jpg" });
  };

  const handleSave = async () => {
    const isSuccess = await onUpdateSubmit(editData);
    if (isSuccess) setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(student);
    setImagePreview(
      student.profileImg && student.profileImg !== "default.jpg"
        ? student.profileImg
        : "",
    );
    setIsEditing(false);
  };

  const fields = [
    { key: "_id", label: "Student ID", value: editData._id, editable: false },
    { key: "name", label: "Full Name", value: editData.name, editable: false },
    {
      key: "email",
      label: "Email Address",
      value: editData.email,
      editable: false,
    },
    {
      key: "department",
      label: "Department",
      value: editData.department || "",
      editable: true,
    },
    {
      key: "grade",
      label: "Level",
      value: editData.grade || "",
      editable: true,
    },
    { key: "GPA", label: "GPA", value: editData.GPA || "", editable: true },
    {
      key: "maxHours",
      label: "Max Hours",
      value: editData.maxHours || "",
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
        transition: "all 0.3s ease",
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
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  cursor: isEditing ? "pointer" : "default",
                  borderRadius: "50%",
                  overflow: "hidden",
                  "&:hover .overlay": { opacity: isEditing ? 1 : 0 },
                }}
                onClick={handleImageClick}
              >
                <Avatar
                  src={imagePreview}
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
                  {editData.name ? editData.name.charAt(0).toUpperCase() : ""}
                </Avatar>
                {isEditing && (
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(21, 43, 72, 0.4)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <PhotoCameraIcon sx={{ color: "#fff", fontSize: 35 }} />
                  </Box>
                )}
              </Box>

              
              {isEditing && imagePreview && (
                <Tooltip title="Remove Image">
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: theme.palette.background.paper, 
                      color: "error.main", 
                      width: 30,
                      height: 30,
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.2)", 
                      "&:hover": {
                        bgcolor: "error.main",
                        color: "white",
                      },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </Box>
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
                  borderRadius: "16px",
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "#f8fafc",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    transform: "translateY(-3px)",
                    boxShadow: "0px 8px 20px rgba(21,43,72,0.06)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 800,
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
                    type={
                      item.key === "password"
                        ? "password"
                        : item.key === "GPA"
                          ? "number"
                          : "text"
                    }
                    inputProps={
                      item.key === "GPA" ? { min: 0, max: 5, step: 0.1 } : {}
                    }
                    error={
                      item.key === "GPA" && (item.value > 5 || item.value < 0)
                    }
                    helperText={
                      item.key === "GPA" && (item.value > 5 || item.value < 0)
                        ? "Max 5.0"
                        : ""
                    }
                    InputProps={{ sx: { fontWeight: 700, fontSize: "1rem" } }}
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
                    {item.value || "N/A"}
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
