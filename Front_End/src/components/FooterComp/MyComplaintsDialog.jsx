import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMyComplaints } from '../../hooks/Student/useMyComplaints';

export default function MyComplaintsDialog({ open, onClose }) {
  const { complaints, loading, refetch } = useMyComplaints(open);

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Reviewed':
        return 'info';
      case 'Resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">My Complaints & Suggestions</Typography>
        <IconButton onClick={onClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#f9fafb' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : complaints.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Typography variant="body1" color="text.secondary">
              You haven't submitted any complaints or suggestions yet.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {complaints.map((item) => (
              <Card key={item._id} variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e0e0e0', backgroundColor: '#ffffff' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {item.type}
                    </Typography>
                    <Chip label={item.status} color={getStatusColor(item.status)} size="small" sx={{ fontWeight: 'bold' }} />
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#424242', mb: 2 }}>
                    {item.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Submitted on: {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
