import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Teachers = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    department: "",
    profileImg: "",
  });

  const token = localStorage.getItem("adminToken") || "";

  const fetchTeachers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getTeachers(token);
      setRows(response);
    } catch (err) {
      setError(err.message || "Failed to fetch teachers data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({
      _id: "",
      name: "",
      email: "",
      password: "",
      department: "",
      profileImg: "",
    });
    setCurrentRow(null);
    setOpenDialog(true);
  };

  const handleEditClick = (id) => {
    const rowData = rows.find((row) => row._id === id);
    setIsEditing(true);
    setCurrentRow(id);
    setFormData({
      _id: rowData._id,
      name: rowData.name,
      email: rowData.email,
      password: "",
      department: rowData.department || "",
      profileImg: rowData.profileImg || "",
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("هل تريد حذف هذا المعلم؟")) {
      try {
        await deleteTeacher(id, token);

        setRows(rows.filter((row) => row._id !== id));
      } catch (err) {
        setError(err.message || "فشل الحذف");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.department) {
      setError("Name, Email, and Department are required");
      return;
    }

    if (!isEditing && !formData.password) {
      setError("Password is required for new teachers");
      return;
    }

    try {
      if (isEditing) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          profileImg: formData.profileImg,
        };
        const response = await updateTeacher(currentRow, updateData, token);
        setRows(
          rows.map((row) => (row._id === currentRow ? response.teacher : row)),
        );
      } else {
        const response = await addTeacher(
          {
            _id: formData._id,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            department: formData.department,
            profileImg: formData.profileImg,
          },
          token,
        );
        setRows([...rows, response.teacher]);
      }
      setOpenDialog(false);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to save");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setError("");
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      width: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "profileImg",
      headerName: "Profile",
      width: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ textAlign: "center" }}>
          {params.value ? (
            <img
              src={params.value}
              alt="profile"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span>No Image</span>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditClick(params.row._id)}
            sx={{ textTransform: "none" }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(params.row._id)}
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Teachers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ textTransform: "none" }}
        >
          Add New Teacher
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row._id}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
          />
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Edit Teacher" : "Add New Teacher"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          {!isEditing && (
            <TextField
              fullWidth
              label="Teacher ID"
              name="_id"
              value={formData._id}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="Example: T-1"
              required
            />
          )}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
          {!isEditing && (
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              variant="outlined"
              required
            />
          )}
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Profile Image URL"
            name="profileImg"
            value={formData.profileImg}
            onChange={handleInputChange}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teachers;
