import React from "react";
import { useTeacherGrades } from "../../hooks/Teacher/useTeacherGrades";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  IconButton,
  Divider,
  Tooltip
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

export default function TeacherGrades({ courseId, courseName }) {
  const {
    isLoading,
    uploadedSheets,
    selectedFile,
    handleFileChange,
    uploadGrades,
    deleteSheetRecord
  } = useTeacherGrades(courseId);
  if (!courseId) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { xs: "stretch", sm: "center" }, mb: 4 }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{
            color: "#152b48", borderColor: "#152b48", borderRadius: "8px", textTransform: "none", fontWeight: 600, justifyContent: "flex-start", flex: 1,
            "&:hover": { backgroundColor: "rgba(21, 43, 72, 0.04)", borderColor: "#152b48" },
          }}
        >
          {selectedFile ? selectedFile.name : "Choose Excel File"}
          <input id="excel-upload-input" type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
        </Button>

        <Button
          variant="contained"
          onClick={() => uploadGrades(courseName)}
          disabled={isLoading || !selectedFile}
          sx={{
            backgroundColor: "#152b48", color: "#fff", borderRadius: "8px", textTransform: "none", fontWeight: 600, boxShadow: "none", px: 4,
            "&:hover": { backgroundColor: "#0d1b2e" }, "&:disabled": { backgroundColor: "#e2e8f0", color: "#94a3b8" }
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Upload Grades"}
        </Button>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: "800", color: "#1e293b", mb: 2 }}>
        Uploaded Sheets
      </Typography>

      {Array.isArray(uploadedSheets) && uploadedSheets.length > 0 ? (
        <Paper elevation={0} sx={{ border: "1px solid #eef2f6", borderRadius: "12px", overflow: "hidden" }}>
          <List sx={{ p: 0 }}>
            {uploadedSheets.map((sheet, index) => (
              <React.Fragment key={sheet.id || index}>
                <ListItem
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, "&:hover": { backgroundColor: "#fcfcfd" } }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ backgroundColor: "rgba(21, 43, 72, 0.05)", p: 1.5, borderRadius: "8px", display: 'flex' }}>
                      <InsertDriveFileOutlinedIcon sx={{ color: "#152b48" }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        {sheet.courseName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudUploadIcon sx={{ fontSize: 16 }} /> {sheet.fileName} • {sheet.date}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit / Re-upload">
                      <IconButton
                        onClick={() => document.getElementById('excel-upload-input').click()}
                        size="small"
                        sx={{ color: "#152b48", backgroundColor: "rgba(21, 43, 72, 0.05)", "&:hover": { backgroundColor: "rgba(21, 43, 72, 0.1)" } }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Record">
                      <IconButton onClick={() => deleteSheetRecord(sheet.id)} size="small" sx={{ color: "#e11d48", backgroundColor: "#fff1f2", "&:hover": { backgroundColor: "#ffe4e6" } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
                {index < uploadedSheets.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Box sx={{ p: 4, textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
          <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
            No grades have been uploaded for this course yet.
          </Typography>
        </Box>
      )}
    </Box>
  );
}