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

const Students = () => {
  //دي البيانات الي جايه من الباك اند وهتظهر في الجدول
  const [rows, setRows] = useState([]);
  //عشان نعرض علامه التحميل
  const [loading, setLoading] = useState(true);
  //عشان نعرض رساله الخطا لو في خطا
  const [error, setError] = useState("");
  //دي بتشوف هل الفورم مفتوح ولا لا
  const [openDialog, setOpenDialog] = useState(false);
  //هل الفورم ده للتعديل ولا للاضافه الوضع الحالي يعني
  const [isEditing, setIsEditing] = useState(false);
  //بنخزن id الطالب الي بنعدلو
  const [currentRow, setCurrentRow] = useState(null);
  //ده النموذج الي مبروط بالفورم اي تغيير في الانبوت بيزهر هنا
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    profileImg: "",
    department: "عام",
    grade: "المستوي الاول",
    GPA: 0,
    maxHours: 19,
    AcademicRecord: "",
  });
  //بنجيب التوكين عشان نبعت الاي بي اي ريكوست
  const token = localStorage.getItem("adminToken") || "";

  //جلب الطلاب من البام اند
  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      //هنا بينادي ويحط البيانات في صف
      const response = await getStudents(token);
      setRows(response);
    } catch (err) {
      //دي لو فشل يظهر
      setError(err.message || "Failed to fetch students data");
    } finally {
      setLoading(false);
    }
  };
  //اليوز ايفيكت بتشتغل مره واحده اول  ما الصفحه  تفتح يعني اول ما ندخل صفحه الطلاب نجيب البيانات
  useEffect(() => {
    fetchStudents();
  }, []);

  //دي  بتاعة اضافه طالب
  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({
      _id: "",
      name: "",
      email: "",
      password: "",
      profileImg: "",
      department: "عام",
      grade: "المستوي الاول",
      GPA: 0,
      maxHours: 19,
      AcademicRecord: "",
    });
    setCurrentRow(null);
    setOpenDialog(true);
  };
  //دي بتاعة تعديل طالب
  const handleEditClick = (id) => {
    const rowData = rows.find((row) => row._id === id);
    setIsEditing(true);
    setCurrentRow(id);
    setFormData({
      _id: rowData._id,
      name: rowData.name,
      email: rowData.email,
      password: "",
      profileImg: rowData.profileImg || "",
      department: rowData.department || "عام",
      grade: rowData.grade || "المستوي الاول",
      GPA: rowData.GPA || 0,
      maxHours: rowData.maxHours || 19,
      AcademicRecord: rowData.AcademicRecord || "",
    });
    setOpenDialog(true);
  };
  //حذف الطالب
  const handleDeleteClick = async (id) => {
    if (window.confirm("هل تريد حذف هذا الطالب؟")) {
      try {
        await deleteStudent(id, token);
        //ده بيحدث الجدول فورا بدون ريلود
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
  //دي بتاعة الحفظ
  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      setError("Name and Email are required");
      return;
    }

    if (!isEditing && !formData.password) {
      setError("Password is required for new students");
      return;
    }

    try {
      if (isEditing) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          profileImg: formData.profileImg,
          department: formData.department,
          grade: formData.grade,
          GPA: parseFloat(formData.GPA) || 0,
          maxHours: parseInt(formData.maxHours) || 19,
          AcademicRecord: formData.AcademicRecord,
        };
        const response = await updateStudent(currentRow, updateData, token);
        setRows(
          rows.map((row) => (row._id === currentRow ? response.student : row)),
        );
      } else {
        const response = await addStudent(
          {
            _id: formData._id,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            profileImg: formData.profileImg,
            department: formData.department,
            grade: formData.grade,
            GPA: parseFloat(formData.GPA) || 0,
            maxHours: parseInt(formData.maxHours) || 19,
            AcademicRecord: formData.AcademicRecord,
          },
          token,
        );
        setRows([...rows, response.student]);
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
      field: "grade",
      headerName: "Grade",
      width: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "GPA",
      headerName: "GPA",
      width: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maxHours",
      headerName: "Hours",
      width: 100,
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
          Students
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ textTransform: "none" }}
        >
          Add New Student
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
          //الجدول الي بيعرض البيانات والاكشنز بتاعة التعديل والحذف
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
          {isEditing ? "Edit Student" : "Add New Student"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          {!isEditing && (
            <TextField
              fullWidth
              label="Student ID"
              name="_id"
              value={formData._id}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="Example: 2327443"
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
            label="Profile Image URL"
            name="profileImg"
            value={formData.profileImg}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Grade"
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="GPA"
            name="GPA"
            type="number"
            inputProps={{ step: "0.1", min: "0", max: "4" }}
            value={formData.GPA}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Max Hours"
            name="maxHours"
            type="number"
            value={formData.maxHours}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Academic Record"
            name="AcademicRecord"
            value={formData.AcademicRecord}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={3}
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

export default Students;
