import React from "react";
import { Paper, Box } from "@mui/material";
import image from "../../assets/images/imagePen.jpeg";

export default function Advertisments() {
  return (
    <Paper
      elevation={3}
      sx={{
        // شيلنا الـ mt: 40px عشان الإعلان يبدأ من نفس مستوى الفورم بالظبط
        height: "100%",
        borderRadius: "16px",
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="img"
        src={image}
        alt="Student Portal"
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "450px", // كبرنا الـ minHeight عشان الصورة تفرد بشكل أحسن
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />
    </Paper>
  );
}
