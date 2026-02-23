import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import { useHelp } from "./useHelp";

const HelpComp = () => {
  const { helpData } = useHelp();

  return (
    // الحاوية الخارجية عشان التوسيط ومنع السكرول
    <Box
      sx={{
        backgroundColor: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // التوسيط العمودي
        alignItems: "center", // التوسيط الأفقي
        // الارتفاع الكلي ناقص الهيدر والفوتر (تقدر تعدل الـ 130px لو لسه في سكرول صغير)
        minHeight: "calc(100vh - 149px)",
        padding: "20px",
      }}
    >
      {/* حاوية المحتوى الفعلي */}
      <Box sx={{ width: "100%", maxWidth: "900px" }}>
        {/* العنوان (تم تكبيره لـ h4) */}
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: "#333" }}
        >
          Help
        </Typography>

        {/* الحاوية البيضاء (الجدول) */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden", // لمنع خروج العناصر عن الحواف
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
            // تم إزالة التمدد والارتفاع الثابت عشان تاخد حجم العناصر بس
          }}
        >
          <List sx={{ p: 0 }}>
            {helpData.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  sx={{
                    py: 2.5, // كبرنا الـ padding شوية عشان تدي براح للعناصر
                    px: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    "&:hover": { bgcolor: "#eef0f2" },
                  }}
                >
                  {/* النص على الشمال */}
                  <ListItemText
                    primary={item.title}
                    slotProps={{
                      primary: {
                        sx: {
                          color: "#04365f",
                          fontWeight: 500,
                          fontSize: "1.1rem",
                        },
                      },
                    }}
                  />

                  {/* الزرار على اليمين */}
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      borderColor: "#ccc",
                      color: "#555",
                      px: 3, // عرض الزرار
                      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Show Video
                  </Button>
                </ListItem>

                {/* الخط الفاصل */}
                {index < helpData.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default HelpComp;
