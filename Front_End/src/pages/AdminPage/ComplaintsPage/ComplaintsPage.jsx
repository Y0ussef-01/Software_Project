import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axiosInstance";

export default function ComplaintsPage() {
  const theme = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/admin/complaints");
      let data = response.data?.complaints || response.data || [];
      // Map _id to id for DataGrid
      data = data.map((item) => ({ ...item, id: item._id || item.id }));
      setComplaints(data);
    } catch (error) {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleReview = async (id) => {
    try {
      await axiosInstance.patch(`/api/admin/complaint/${id}`);
      toast.success("Complaint status updated to Reviewed");
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Reviewed" } : c))
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const columns = [
    { field: "code", headerName: "Student Code", flex: 0.8 },
    { field: "studentName", headerName: "Student Name", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === "Complaint" ? "error" : "primary"} 
          size="small" 
          variant="outlined" 
        />
      ),
    },
    { field: "message", headerName: "Message", flex: 2 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Reviewed" ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          disabled={params.row.status === "Reviewed"}
          onClick={() => handleReview(params.row.id)}
        >
          {params.row.status === "Reviewed" ? "Reviewed" : "Mark Reviewed"}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        Complaints & Suggestions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage and review student submissions.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          height: 600,
          width: "100%",
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "12px",
        }}
      >
        <DataGrid
          rows={complaints}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}
