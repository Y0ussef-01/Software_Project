import React from "react";
import {
  Box,
  TextField,
  Button,
  useTheme,
  InputAdornment,
  IconButton, // ✨ إضافة IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CloseIcon from "@mui/icons-material/Close"; // ✨ استدعاء أيقونة المسح
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

  // ✨ دالة لتفريغ الحقل
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
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        alignItems: "center",
        width: "100%",
        maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" },
        p: { xs: 2.5, md: 3 },
        mb: 4,
        borderRadius: "24px",
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 10px 40px rgba(0, 0, 0, 0.4)"
            : "0px 10px 40px rgba(21, 43, 72, 0.05)",
      }}
    >
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
          // ✨ إضافة زر المسح (يظهر فقط إذا كان هناك نص في الحقل)
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
            // ✨ تعديل بسيط للـ padding عشان الأيقونة الجديدة تظهر بشكل مريح
            paddingRight: "14px",
          },
        }}
      />

      <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", md: "auto" } }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<ManageSearchIcon />}
          sx={{
            px: { xs: 2, lg: 4 },
            py: 1.5,
            borderRadius: "14px",
            fontWeight: "bold",
            textTransform: "none",
            flexGrow: { xs: 1, md: 0 },
            whiteSpace: "nowrap",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 20px rgba(0,0,0,0.5)"
                : "0 8px 20px rgba(25, 118, 210, 0.25)",
          }}
        >
          Get Student
        </Button>

        <Button
          variant="outlined"
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => navigate("/adminPanel/add-student")}
          sx={{
            px: { xs: 2, lg: 3 },
            py: 1.5,
            borderRadius: "14px",
            fontWeight: "bold",
            textTransform: "none",
            flexGrow: { xs: 1, md: 0 },
            whiteSpace: "nowrap",
            borderWidth: "2px",
            "&:hover": { borderWidth: "2px" },
          }}
        >
          Add Student
        </Button>
      </Box>
    </Box>
  );
}
