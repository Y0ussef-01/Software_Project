import React from "react";
import {
  Box,
  TextField,
  Button,
  useTheme,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export default function TeacherSearchSection({
  searchId,
  setSearchId,
  onSearch,
  isLoading,
}) {
  const theme = useTheme();

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (/^[A-Za-z0-9\-]*$/.test(value)) {
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
        placeholder="Enter Teacher ID (e.g. T-1)..."
        value={searchId}
        onChange={handleInputChange}
        variant="outlined"
        disabled={isLoading}
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
                disabled={isLoading}
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

      <Button
        type="submit"
        variant="contained"
        disabled={isLoading || !searchId}
        sx={{
          px: { xs: 2, lg: 4 },
          py: 1.5,
          borderRadius: "14px",
          fontWeight: "bold",
          textTransform: "none",
          flexGrow: { xs: 1, md: 0 },
          whiteSpace: "nowrap",
          minWidth: "140px",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 20px rgba(0,0,0,0.5)"
              : "0 8px 20px rgba(25, 118, 210, 0.25)",
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Search Teacher"
        )}
      </Button>
    </Box>
  );
}