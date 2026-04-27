import React from "react";
import {
  Box,
  TextField,
  Button,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";

export default function StudentSearchSection({
  searchId,
  setSearchId,
  onSearch,
}) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSearchId(value);
    }
  };

  const handleClear = () => {
    setSearchId("");
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      sx={{
        display: "flex",
        // ✅ على الموبايل: كل حاجة تحت بعض
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" },
        p: { xs: 2, sm: 2.5, md: 3 },
        mb: 4,
        borderRadius: "24px",
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 10px 40px rgba(0, 0, 0, 0.4)"
            : "0px 10px 40px rgba(21, 43, 72, 0.05)",
      }}
    >
      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Enter Student ID (e.g. 2327999)..."
        value={searchId}
        onChange={handleInputChange}
        variant="outlined"
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            </InputAdornment>
          ),
          endAdornment: searchId ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                edge="end"
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  "&:hover": { color: theme.palette.error.main },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "#f8fafc",
            paddingRight: "14px",
          },
        }}
      />

      {/* ✅ الأزرار في صف واحد - بتـ wrap لو مفيش مساحة */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // ✅ مهم - بيخلي الأزرار تنزل تحت بعض لو مفيش مساحة
          gap: 1.5,
        }}
      >
        {/* Get Student */}
        <Button
          type="submit"
          variant="contained"
          startIcon={<ManageSearchIcon />}
          sx={{
            flex: "1 1 auto", // ✅ بياخد المساحة المتاحة
            minWidth: { xs: "100px", sm: "130px" },
            py: 1.5,
            borderRadius: "14px",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 20px rgba(0,0,0,0.5)"
                : "0 8px 20px rgba(25, 118, 210, 0.25)",
          }}
        >
          Get Student
        </Button>

        {/* Add Student */}
        <Button
          variant="outlined"
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => navigate("/adminPanel/add-student")}
          sx={{
            flex: "1 1 auto",
            minWidth: { xs: "100px", sm: "130px" },
            py: 1.5,
            borderRadius: "14px",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            borderWidth: "2px",
            "&:hover": { borderWidth: "2px" },
          }}
        >
          Add Student
        </Button>

        {/* Bulk Upload */}
        <Button
          variant="outlined"
          color="success"
          startIcon={<UploadFileIcon />}
          onClick={() => navigate("/adminPanel/bulk-upload-students")}
          sx={{
            flex: "1 1 auto",
            minWidth: { xs: "100px", sm: "130px" },
            py: 1.5,
            borderRadius: "14px",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            borderWidth: "2px",
            "&:hover": { borderWidth: "2px" },
          }}
        >
          Bulk Upload
        </Button>
      </Box>
    </Box>
  );
}