import React from 'react';
import { 
  Paper, Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Chip 
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useLanguage } from "../../context/LanguageContext";
import { REGISTRATION_TRANS } from "../../utils/studentTranslations";

export default function SwapRequestsSection({
    pendingSwapRequests,
    sentSwapRequests,
    handleSwapRespond,
    handleCancelSwapRequest,
    isActionLoading
}) {
  const { language } = useLanguage();
  const t = REGISTRATION_TRANS[language] || REGISTRATION_TRANS["en"];

  return (
      <>
        {/* INCOMING PENDING SWAPS UI */}
        <Paper
            elevation={0}
            sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)", overflow: "hidden" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
            <SwapHorizIcon sx={{ color: "#152b48", fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#152b48" }}>
              {t.incomingSwaps} ({pendingSwapRequests?.length || 0})
            </Typography>
          </Box>

          {pendingSwapRequests?.length === 0 || !pendingSwapRequests ? (
              <Box sx={{ textAlign: "center", py: 5, bgcolor: "#f8fafc", borderRadius: "16px" }}>
                <Typography variant="subtitle1" color="text.secondary">{t.noIncomingSwaps}</Typography>
              </Box>
          ) : (
              <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>{t.reqBy}</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>{t.course}</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>{t.fromGroup}</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>{t.targetGroup}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold", color: "#152b48", pr: 4 }}>{t.actions}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Array.isArray(pendingSwapRequests) ? pendingSwapRequests : []).map((req) => (
                        <TableRow key={req._id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <img src={req.sender?.profileImg || "/default.jpg"} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{req.sender?.name || "Unknown"}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{req.courseId?.name || "Unknown"} ({req.courseId?._id})</TableCell>
                          <TableCell><Chip label={req.senderGroupName} size="small" /></TableCell>
                          <TableCell><Chip label={req.receiverGroupName || req.targetGroupName} size="small" color="primary" /></TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                              <Button
                                  variant="outlined" color="error" size="small" disabled={isActionLoading}
                                  onClick={() => handleSwapRespond(req._id, 'Rejected')}
                                  startIcon={<CancelOutlinedIcon />}
                                  sx={{ textTransform: "none", borderRadius: "8px", fontWeight: "bold" }}
                              >
                                {t.reject}
                              </Button>
                              <Button
                                  variant="contained" color="success" size="small" disabled={isActionLoading}
                                  onClick={() => handleSwapRespond(req._id, 'Accepted')}
                                  startIcon={<CheckCircleOutlineIcon />}
                                  sx={{ textTransform: "none", borderRadius: "8px", fontWeight: "bold" }}
                              >
                                {t.acceptSwap}
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          )}
        </Paper>

        {/* SENT SWAP REQUESTS UI */}
        <Paper
            elevation={0}
            sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)", overflow: "hidden", mt: 4 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
            <SwapHorizIcon sx={{ color: "#152b48", fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#152b48" }}>
              {t.sentSwapReqs} ({sentSwapRequests?.length || 0})
            </Typography>
          </Box>

          {sentSwapRequests?.length === 0 || !sentSwapRequests ? (
              <Box sx={{ textAlign: "center", py: 5, bgcolor: "#f8fafc", borderRadius: "16px" }}>
                <Typography variant="subtitle1" color="text.secondary">{t.noSentSwaps}</Typography>
              </Box>
          ) : (
              <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>{t.course}</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>{t.fromGroup}</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>{t.targetGroup}</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>{t.status}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold", color: "#152b48", pr: 4 }}>{t.actions}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Array.isArray(sentSwapRequests) ? sentSwapRequests : []).map((req) => (
                        <TableRow key={req._id}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {req.courseId?.name || "Unknown"} ({req.courseId?._id || req.courseId || "Unknown"})
                            </Typography>
                          </TableCell>
                          <TableCell><Chip label={req.senderGroupName} size="small" /></TableCell>
                          <TableCell><Chip label={req.receiverGroupName || req.targetGroupName} size="small" color="primary" /></TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color={req.status === 'Pending' ? "warning.main" : req.status === 'Accepted' ? "success.main" : "error.main"}>
                              {req.status}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {req.status === 'Pending' && (
                                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                  <Button
                                      variant="outlined" color="error" size="small" disabled={isActionLoading}
                                      onClick={() => handleCancelSwapRequest(req.relatedIds)}
                                      startIcon={<DeleteOutlineIcon />}
                                      sx={{ textTransform: "none", borderRadius: "8px", fontWeight: "bold" }}
                                  >
                                    {t.cancelReq}
                                  </Button>
                                </Box>
                            )}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          )}
        </Paper>
      </>
  );
}
