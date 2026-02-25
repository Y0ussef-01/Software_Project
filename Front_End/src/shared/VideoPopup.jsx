import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function VideoPopup() {
  // State للتحكم في فتح وقفل الـ Popup
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      {/* الزرار اللي بيفتح الـ Popup (ممكن تغيره وتنقله في أي مكان في كودك) */}
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ backgroundColor: "#152b48" }}
      >
        Show Video
      </Button>

      {/* الـ Popup نفسه */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md" // بيحدد أقصى عرض للـ Modal (sm, md, lg, xl)
        fullWidth // بيخليه ياخد العرض المتاح لحد الـ maxWidth
        PaperProps={{
          sx: {
            borderRadius: "12px", // عشان ياخد نفس الانحناء الجمالي اللي في موقعك
            m: 2, // Margin عشان ميكونش لازق في حواف الشاشة في الموبايل
          },
        }}
      >
        {/* الهيدر: بيحتوي على العنوان وزرار القفل */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2.5,
            pb: 1, // تقليل المسافة تحت العنوان عشان الفيديو يبان متناسق
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            Login to the system
          </Typography>

          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "#d32f2f", backgroundColor: "#ffebee" }, // تأثير خفيف عند الـ hover
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* المحتوى: بيحتوي على الـ iframe */}
        <DialogContent sx={{ p: 2.5, pt: 1 }}>
          <Box
            sx={{
              position: "relative",
              paddingBottom: "56.25%", // دي خدعة بالـ CSS عشان نخلي الـ Box يحافظ على نسبة 16:9 للفيديو
              height: 0,
              overflow: "hidden",
              borderRadius: "8px",
              backgroundColor: "#000",
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // حط لينك الفيديو بتاعك هنا بدل ده
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
