import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import QRCode from "react-qr-code";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useGenerateQR } from "../../hooks/Teacher/useGenerateQR";

export default function GenerateQRComp() {
  const {
    teacherGroups,
    isLoadingGroups,
    groups,
    setGroups,
    sessionNumber,
    setSessionNumber,
    qrToken,
    isGenerating,
    timeLeft,
    startGenerating,
    stopGenerating,
  } = useGenerateQR();

  const handleGroupChange = (event) => {
    const {
      target: { value },
    } = event;
    setGroups(typeof value === "string" ? value.split(",") : value);
  };

  const getGroupNameById = (id) => {
    const group = teacherGroups.find((g) => g.id === id);
    return group ? group.name : id;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
      }}
    >
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#152b48" }}>
          QR Code Settings
        </Typography>

        <FormControl fullWidth disabled={isGenerating || isLoadingGroups}>
          <InputLabel id="groups-label">
            {isLoadingGroups ? "Loading lectures..." : "Select Lectures"}
          </InputLabel>
          <Select
            labelId="groups-label"
            multiple
            value={groups}
            onChange={handleGroupChange}
            input={
              <OutlinedInput
                label={
                  isLoadingGroups ? "Loading lectures..." : "Select Lectures"
                }
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={getGroupNameById(value)}
                    sx={{ backgroundColor: "#eef2f6", fontWeight: 600 }}
                  />
                ))}
              </Box>
            )}
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
                No lectures assigned to you
              </MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          label="Session Number"
          type="number"
          value={sessionNumber}
          onChange={(e) => setSessionNumber(e.target.value)}
          disabled={isGenerating}
          fullWidth
          InputProps={{ inputProps: { min: 1 } }}
        />

        {!isGenerating ? (
          <Button
            variant="contained"
            size="large"
            startIcon={<QrCodeScannerIcon />}
            onClick={startGenerating}
            disabled={isLoadingGroups || teacherGroups.length === 0}
            sx={{
              backgroundColor: "#152b48",
              py: 1.5,
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#3b6ba5" },
            }}
          >
            Start Generating QR
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            size="large"
            startIcon={<StopCircleIcon />}
            onClick={stopGenerating}
            sx={{ py: 1.5, borderRadius: "12px", borderWidth: "2px" }}
          >
            Stop Generation
          </Button>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          border: "2px dashed #eef2f6",
          borderRadius: "24px",
          backgroundColor: "#fcfcfd",
        }}
      >
        {isGenerating && qrToken ? (
          <>
            <Box
              sx={{
                p: 2,
                backgroundColor: "#fff",
                borderRadius: "16px",
                boxShadow: "0px 8px 24px rgba(21, 43, 72, 0.1)",
              }}
            >
              <QRCode value={qrToken} size={250} level="H" />
            </Box>
            <Typography
              variant="h6"
              sx={{ mt: 3, fontWeight: "bold", color: "#152b48" }}
            >
              Scan to Register Attendance
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <CircularProgress
                variant="determinate"
                value={(timeLeft / 5) * 100}
                size={20}
                sx={{ color: "#3b6ba5" }}
              />
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontWeight: 600 }}
              >
                Refreshes in {timeLeft} seconds...
              </Typography>
            </Box>
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{ color: "#64748b", textAlign: "center" }}
          >
            Configure settings and click "Start" to display the live QR code.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
