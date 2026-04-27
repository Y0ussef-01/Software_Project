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
  
  // State for the "View More" Modal
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
    { field: "code", headerName: "Student Code", flex: 0.8 },
    { field: "studentName", headerName: "Student Name", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value?.toLowerCase() === "complaint" ? "error" : "primary"} 
          size="small" 
          variant="outlined" 
        />
      ),
    },
    { 
      field: "message", 
      headerName: "Message", 
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Typography noWrap sx={{ maxWidth: '70%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {params.value}
          </Typography>
          <Button size="small" variant="text" onClick={() => handleOpenModal(params.value)}>
            View
          </Button>
        </Box>
      )
    },
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
          color={params.value?.toLowerCase() === "reviewed" ? "success" : "warning"}
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
          disabled={params.row.status?.toLowerCase() === "reviewed"}
          onClick={() => updateComplaintStatus(params.row.id)}
        >
          {params.row.status?.toLowerCase() === "reviewed" ? "Reviewed" : "Mark Reviewed"}
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

      {/* View More Modal */}
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
