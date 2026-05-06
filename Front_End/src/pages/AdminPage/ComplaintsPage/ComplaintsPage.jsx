import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { useAdminComplaints } from "../../../hooks/Admin/useAdminComplaints";

export default function ComplaintsPage() {
  const theme = useTheme();
  const { complaints, loading, updateComplaintStatus } = useAdminComplaints();

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (message) => {
    setSelectedMessage(message);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMessage(null);
  };

  const columns = [
    {
      field: "code",
      headerName: "Student Code",
      flex: 0.8,
      // التعديل هنا: استخدام (value, row) بدل params
      valueGetter: (value, row) => row?.student?._id || "N/A"
    },
    {
      field: "studentName",
      headerName: "Student Name",
      flex: 1,
      // التعديل هنا أيضاً
      valueGetter: (value, row) => row?.student?.name || "Unknown"
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value?.toLowerCase() === "complaint" ? "error" : "primary"}
        />
      )
    },
    {
      field: "message",
      headerName: "Message",
      flex: 2
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params) => {
        const statusColors = {
          Pending: "warning",
          Reviewed: "info",
          Resolved: "success",
        };
        return (
          <Chip
            label={params.value}
            color={statusColors[params.value] || "default"}
            variant="outlined"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleOpenModal(params.row.message)}
          >
            View
          </Button>
          {params.row.status === "Pending" && (
            <Button
              size="small"
              variant="contained"
              color="info"
              onClick={() => updateComplaintStatus(params.row.id, "Reviewed")}
            >
              Mark Reviewed
            </Button>
          )}
          {params.row.status !== "Resolved" && (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => updateComplaintStatus(params.row.id, "Resolved")}
            >
              Resolve
            </Button>
          )}
        </Box>
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

      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Full Message</Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}