import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RateReviewIcon from "@mui/icons-material/RateReview";
import RestStud from "../../assets/images/restStud.jpg";
import ComplaintDialog from "./ComplaintDialog";
import MyComplaintsDialog from "./MyComplaintsDialog";
import HistoryIcon from "@mui/icons-material/History";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [openComplaint, setOpenComplaint] = useState(false);
  const [openMyComplaints, setOpenMyComplaints] = useState(false);

  // دوال الفتح والقفل لنتيجة التقويم
  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // دوال الفتح والقفل لنموذج الشكاوى
  const handleComplaintOpen = (e) => {
    e.preventDefault();
    setOpenComplaint(true);
  };
  const handleComplaintClose = () => {
    setOpenComplaint(false);
  };

  // دوال الفتح والقفل لسجل الشكاوى
  const handleMyComplaintsOpen = (e) => {
    e.preventDefault();
    setOpenMyComplaints(true);
  };
  const handleMyComplaintsClose = () => {
    setOpenMyComplaints(false);
  };

  return (
    <>
      <Box
        component="footer"
        sx={{
          backgroundColor: "#152b48",
          borderRadius: 0,
          py: 3,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" sx={{ color: "#fff", opacity: 0.8 }}>
              © 2026 Cairo University. All rights reserved.
            </Typography>

            <Stack direction="row" spacing={3}>
              <Link
                href="#"
                onClick={handleOpen}
                underline="hover"
                sx={{
                  color: "#fff",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Academic Calendar
              </Link>

              <Link
                href="#"
                onClick={handleComplaintOpen}
                underline="hover"
                sx={{
                  color: "#fff",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <RateReviewIcon fontSize="small" />
                Complaints & Suggestions
              </Link>

              <Link
                href="#"
                onClick={handleMyComplaintsOpen}
                underline="hover"
                sx={{
                  color: "#fff",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <HistoryIcon fontSize="small" />
                My Complaints
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            m: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            Academic Calendar
          </Typography>

          <IconButton
            onClick={handleClose}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "#d32f2f", backgroundColor: "#ffebee" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 1, textAlign: "center" }}>
          <Box
            component="img"
            src={RestStud}
            alt="Academic Calendar"
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </DialogContent>
      </Dialog>

      <ComplaintDialog open={openComplaint} onClose={handleComplaintClose} />
      <MyComplaintsDialog open={openMyComplaints} onClose={handleMyComplaintsClose} />
    </>
  );
}
