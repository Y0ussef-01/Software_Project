import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tooltip,
  TablePagination,
  Menu,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AssessmentIcon from "@mui/icons-material/Assessment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useViewAttendance } from "../../hooks/Teacher/useViewAttendance";

export default function ViewAttendanceComp() {
  const {
    teacherGroups,
    isLoadingGroups,
    selectedGroup,
    setSelectedGroup,
    selectedDate,
    setSelectedDate,
    filterSessionNumber,
    setFilterSessionNumber,
    loading,
    handleSearchClick,
    displayedAttendance,
    paginatedAttendance,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleExportExcel,
    handleExportPDF,
    loadingSummary,
    downloadSummary,
  } = useViewAttendance();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadSelection = (type) => {
    handleMenuClose();
    downloadSummary(type);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
          width: "100%",
          alignItems: "center",
        }}
      >
        <FormControl
          disabled={isLoadingGroups}
          sx={{
            flex: { xs: "1 1 100%", md: 3 },
            width: "100%",
            transition: "all 0.3s ease",
          }}
        >
          <InputLabel id="view-group-label">
            {isLoadingGroups ? "Loading lectures..." : "Select Lecture"}
          </InputLabel>
          <Select
            labelId="view-group-label"
            value={selectedGroup}
            label={isLoadingGroups ? "Loading lectures..." : "Select Lecture"}
            onChange={(e) => setSelectedGroup(e.target.value)}
            sx={{ height: "56px" }}
          >
            {isLoadingGroups ? (
              <MenuItem disabled value="">
                Loading...
              </MenuItem>
            ) : teacherGroups.length > 0 ? (
              teacherGroups.map((groupObj) => (
                <MenuItem key={groupObj.id} value={groupObj.id}>
                  {groupObj.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                No lectures assigned
              </MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          label="Date (Optional)"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{
            flex: { xs: "1 1 100%", md: 1.5 },
            width: "100%",
            transition: "all 0.3s ease",
            "& .MuiInputBase-root": { height: "56px" },
          }}
        />

        <TextField
          label="Session Filter"
          type="number"
          placeholder="e.g. 1"
          value={filterSessionNumber}
          onChange={(e) => setFilterSessionNumber(e.target.value)}
          InputProps={{ inputProps: { min: 1 } }}
          sx={{
            flex: { xs: "1 1 100%", md: 1 },
            width: "100%",
            transition: "all 0.3s ease",
            "& .MuiInputBase-root": { height: "56px" },
          }}
        />

        <Button
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          onClick={handleSearchClick}
          disabled={loading || isLoadingGroups || teacherGroups.length === 0}
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 140px" },
            width: "100%",
            height: "56px",
            backgroundColor: "#152b48",
            borderRadius: "8px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            "&:hover": { backgroundColor: "#3b6ba5" },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "SEARCH"}
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Button
            variant="contained"
            color="warning"
            onClick={handleMenuClick}
            disabled={loadingSummary || !selectedGroup}
            startIcon={
              loadingSummary ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AssessmentIcon />
              )
            }
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ borderRadius: "8px", fontWeight: "bold", px: 3, py: 1 }}
          >
            {loadingSummary ? "Generating..." : "Get All Attendance"}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: "12px",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            <MenuItem
              onClick={() => handleDownloadSelection("pdf")}
              sx={{ fontWeight: 600, color: "error.main", gap: 1 }}
            >
              <PictureAsPdfIcon fontSize="small" /> Download as PDF
            </MenuItem>
            <MenuItem
              onClick={() => handleDownloadSelection("excel")}
              sx={{ fontWeight: 600, color: "success.main", gap: 1 }}
            >
              <DownloadIcon fontSize="small" /> Download as Excel
            </MenuItem>
          </Menu>
        </Box>

        {displayedAttendance.length > 0 && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="Export current view to Excel">
              <Button
                variant="outlined"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={handleExportExcel}
                sx={{ borderRadius: "8px", fontWeight: "bold" }}
              >
                Excel
              </Button>
            </Tooltip>
            <Tooltip title="Export current view to PDF">
              <Button
                variant="outlined"
                color="error"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportPDF}
                sx={{ borderRadius: "8px", fontWeight: "bold" }}
              >
                PDF
              </Button>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid #eef2f6",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#fcfcfd" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>
                  Student Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>
                  Student ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>
                  Session
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>
                  Time Logged
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAttendance.length > 0 ? (
                paginatedAttendance.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {row.student.name}
                    </TableCell>
                    <TableCell>{row.student._id}</TableCell>
                    <TableCell>Session {row.sessionNumber}</TableCell>
                    <TableCell>
                      {new Date(row.timestamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ py: 4, color: "#64748b" }}
                  >
                    No attendance records found. Select a lecture and click
                    Search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {displayedAttendance.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={displayedAttendance.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: "1px solid #eef2f6" }}
          />
        )}
      </Paper>

      {displayedAttendance.length > 0 && (
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "#152b48", textAlign: "right" }}
        >
          Total Attended: {displayedAttendance.length} Students
        </Typography>
      )}
    </Box>
  );
}
