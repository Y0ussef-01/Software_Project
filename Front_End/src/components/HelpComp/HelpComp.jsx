import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useHelp } from "./useHelp";

// ✨ الدالة دي بتاخد أي لينك يوتيوب عادي وتطلعلك لينك الـ Embed المظبوط
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  // كود بيستخرج الـ ID بتاع الفيديو من أي صيغة للينك يوتيوب
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url; // لو اللينك مش يوتيوب، هيرجعه زي ما هو
};

const HelpComp = () => {
  const { helpData } = useHelp();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpen = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 149px)",
        padding: "20px",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "900px" }}>
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: "#333" }}
        >
          Help
        </Typography>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          <List sx={{ p: 0 }}>
            {helpData.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  sx={{
                    px: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    "&:hover": { bgcolor: "#eef0f2" },
                  }}
                >
                  <ListItemText
                    primary={item.title}
                    slotProps={{
                      primary: {
                        sx: {
                          color: "#04365f",
                          fontWeight: 500,
                          fontSize: "1.1rem",
                          p: "13px 0px",
                        },
                      },
                    }}
                  />

                  <Button
                    variant="outlined"
                    onClick={() => handleOpen(item)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      borderColor: "#ccc",
                      color: "#555",
                      px: 3,
                      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Show Video
                  </Button>
                </ListItem>

                {index < helpData.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* الـ Popup (Modal) */}
      <Dialog
        open={Boolean(selectedItem)}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
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
            {selectedItem?.title || "Video Tutorial"}
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

        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Box
            sx={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              borderRadius: "12px",
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
              /* ✨ هنا استخدمنا الدالة عشان تحول اللينك تلقائي للـ Embed */
              src={getYouTubeEmbedUrl(selectedItem?.videoUrl)}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HelpComp;
