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
import RestStud from "../../assets/images/restStud.jpg";

// ✨ هنا هتعمل استدعاء (import) لصورة النتيجة بتاعتك
// import calendarImage from "../../assets/images/calendar.jpg";

export default function Footer() {
  // State للتحكم في فتح وقفل الـ Popup
  const [open, setOpen] = useState(false);

  // دوال الفتح والقفل
  const handleOpen = (e) => {
    e.preventDefault(); // عشان نمنع اللينك إنه يعمل ريفريش أو يطلع لأول الصفحة
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
              {/* ✨ حولنا اللينك لزرار بيفتح الـ Popup لما ندوس عليه */}
              <Link
                href="#"
                onClick={handleOpen}
                underline="hover"
                sx={{
                  color: "#fff",
                  fontSize: "0.875rem",
                  cursor: "pointer", // عشان يظهر شكل الإيد لما نقف عليه
                }}
              >
                Academic Calendar
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ✨ الـ Popup (Modal) الخاص بصورة النتيجة */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md" // مقاس مناسب عشان الصورة تكون واضحة ومقروءة
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
          {/* Box لعرض الصورة بشكل متجاوب */}
          <Box
            component="img"
            /* حط مسار الصورة هنا (calendarImage) بدل الرابط المؤقت */
            src={RestStud}
            alt="Academic Calendar"
            sx={{
              width: "100%", // عشان تملى عرض الـ Popup
              height: "auto", // عشان تحافظ على نسبة الطول والعرض ومتمطش
              borderRadius: "8px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // ظل خفيف بيدي شكل جمالي
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
