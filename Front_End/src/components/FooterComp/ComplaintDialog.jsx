import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSubmitComplaint } from '../../hooks/Student/useSubmitComplaint';

export default function ComplaintDialog({ open, onClose }) {
  const [type, setType] = useState('Complaint');
  const [message, setMessage] = useState('');
  const { submitComplaint, loading } = useSubmitComplaint();

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    const success = await submitComplaint({ type, message });
    if (success) {
      setMessage('');
      setType('Complaint');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Submit a Complaint / Suggestion</Typography>
        <IconButton onClick={onClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="Complaint">Complaint</MenuItem>
            <MenuItem value="Suggestion">Suggestion</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Message"
          multiline
          rows={4}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          placeholder="Please describe your complaint or suggestion..."
          required
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !message.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
