import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Rating,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../context/AuthContexts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as XLSX from "xlsx";

const TEAL = "#1B4D5C";
const theme = createTheme({
  palette: { primary: { main: TEAL }, background: { default: "#f4f6f8" } },
  typography: { fontFamily: "'DM Sans', sans-serif" },
  shape: { borderRadius: 12 },
});

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "#d97706", bg: "#fef3c7" },
  submitted: { label: "Submitted", color: "#7c3aed", bg: "#ede9fe" },
  approved: { label: "Approved", color: "#059669", bg: "#d1fae5" },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2" },
  pending_review: { label: "Pending Review", color: "#d97706", bg: "#fef3c7" },
};

function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 600,
        fontSize: "0.75rem",
        height: 26,
        borderRadius: "6px",
      }}
    />
  );
}

export default function SubmissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchSubmissionDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authRequest(
        "GET",
        `/assignments/submissions/${id}`,
      );
      if (response.success) {
        setSubmission(response);
      } else {
        setSnackbar({
          open: true,
          message: response.message || "Failed to load submission",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to load submission",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [authRequest, id]);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [fetchSubmissionDetails]);

  const handleExportToExcel = () => {
    if (!submission) return;

    const exportData = [
      ["Field", "Value"],
      ["Checklist Name", submission.checklistName || "N/A"],
      ["Submitted By", submission.assignedToTeamMembers?.[0]?.name || "N/A"],
      [
        "Submitted Email",
        submission.assignedToTeamMembers?.[0]?.userId?.email || "N/A",
      ],
      [
        "Submitted Date",
        submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString()
          : "N/A",
      ],
      ["Status", submission.submissionStatus || submission.status || "N/A"],
      ["Completion Rate", `${submission.completionRate || 0}%`],
      ["Overall Rating", submission.overallRating || "Not rated"],
      ["Inspector Notes", submission.inspectorNotes || "No notes"],
      ["Additional Notes", submission.notes || "No notes"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submission Details");
    XLSX.writeFile(workbook, `submission_${submission._id}.xlsx`);

    setSnackbar({
      open: true,
      message: "Excel file exported successfully",
      severity: "success",
    });
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: "100vh", p: 3 }}>
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        </Box>
      </ThemeProvider>
    );
  }

  const submissionData = submission;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3 } }}>
        {/* Back */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <ArrowBackIcon
            sx={{ color: TEAL, fontSize: 18, cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <Typography
            sx={{
              color: TEAL,
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
            onClick={() => navigate(-1)}
          >
            Back to Assignment Details
          </Typography>
        </Box>

        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2.5,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#111" }}
            >
              Submission Details
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: "#888", mt: 0.3 }}>
              {submissionData?.checklistName || "Checklist Submission"}
            </Typography>
          </Box>
          <Button
            startIcon={<FileDownloadOutlinedIcon />}
            variant="outlined"
            size="small"
            onClick={handleExportToExcel}
            sx={{
              textTransform: "none",
              borderColor: "#ccc",
              color: "#333",
              fontWeight: 600,
              fontSize: "0.82rem",
              borderRadius: 2,
            }}
          >
            Export Excel
          </Button>
        </Box>

        {/* Meta Info Card */}
        <Card
          elevation={0}
          sx={{ border: "1px solid #e8e8e8", borderRadius: 2, mb: 2.5 }}
        >
          <CardContent sx={{ p: "24px !important" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    width:"180px",
                    mb: 0.5,
                  }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 15, color: "#888" }} />
                  <Typography sx={{ fontSize: "0.78rem", color: "#888" }}>
                    Submitted By
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "0.92rem", color: "#111" }}
                >
                  {submissionData?.assignedToTeamMembers?.[0]?.name?.split(
                    "@",
                  )[0] || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    width:"180px",
                    mb: 0.5,
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 15, color: "#888" }}
                  />
                  <Typography sx={{ fontSize: "0.78rem", color: "#888" }}>
                    Submitted Date
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "0.92rem", color: "#111" }}
                >
                  {submissionData?.submittedAt
                    ? new Date(submissionData.submittedAt).toLocaleString()
                    : "Not submitted"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    width:"180px",
                    mb: 0.5,
                  }}
                >
                  <DescriptionOutlinedIcon
                    sx={{ fontSize: 15, color: "#888" }}
                  />
                  <Typography sx={{ fontSize: "0.78rem", color: "#888" }}>
                    Status
                  </Typography>
                </Box>
                <StatusChip
                  status={
                    submissionData?.submissionStatus || submissionData?.status
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    width:"180px",
                    mb: 0.5,
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 15, color: "#888" }}
                  />
                  <Typography sx={{ fontSize: "0.78rem", color: "#888" }}>
                    Completion Rate
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mt: 0.5,
                    width:"180px",
                  }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={submissionData?.completionRate || 0}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#bdbdbd",
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography
                    sx={{ fontSize: "0.82rem", color: "#555", minWidth: 36 }}
                  >
                    {submissionData?.completionRate || 0}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2.5 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    width:"180px",
                    mb: 0.5,
                  }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 15, color: "#888" }} />
                  <Typography sx={{ fontSize: "0.78rem", color: "#888" }}>
                    Reviewed By
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "0.92rem", color: "#111" }}
                >
                  {submissionData?.reviewedBy?.email?.split("@")[0] ||
                    "Not reviewed"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    width:"180px",
                    mb: 0.5,
                  }}
                >
                  <AccessTimeOutlinedIcon
                    sx={{ fontSize: 15, color: "#888" }}
                  />
                  <Typography sx={{ fontSize: "0.78rem", color: "#888" }}>
                    Reviewed Date
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "0.92rem", color: "#111" }}
                >
                  {submissionData?.reviewedAt
                    ? new Date(submissionData.reviewedAt).toLocaleString()
                    : "Not reviewed"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    width:"200px",
                    mb: 0.5,
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 15, color: "#888" }}
                  />
                  <Typography sx={{ fontSize: "0.78rem", color: "#888" }}>
                    Overall Rating
                  </Typography>
                </Box>
                <Rating
                  value={submissionData?.overallRating || 0}
                  readOnly
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Attachments */}
        {(submissionData?.attachments?.length > 0 ||
          submissionData?.uploadedPhotos?.length > 0) && (
          <Card
            elevation={0}
            sx={{ border: "1px solid #e8e8e8", borderRadius: 2, mb: 2.5  }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#111",
                  mb: 2,
                }}
              >
                Attachments & Photos
              </Typography>
              {submissionData?.attachments?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{ fontSize: "0.85rem", color: "#555", mb: 1 }}
                  >
                    Documents:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {submissionData.attachments.map((file, idx) => (
                      <Button
                        key={idx}
                        variant="outlined"
                        size="small"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        {file.name}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
              {submissionData?.uploadedPhotos?.length > 0 && (
                <Box>
                  <Typography
                    sx={{ fontSize: "0.85rem", color: "#555", mb: 1 }}
                  >
                    Photos:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {submissionData.uploadedPhotos.map((photo, idx) => (
                      <Button
                        key={idx}
                        variant="outlined"
                        size="small"
                        startIcon={<ImageIcon />}
                        onClick={() => window.open(photo, "_blank")}
                      >
                        View Photo {idx + 1}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Notes */}
        {submissionData?.notes && (
          <Card
            elevation={0}
            sx={{ border: "1px solid #e8e8e8", borderRadius: 2, mb: 2.5 }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#111",
                  mb: 1.5,
                }}
              >
                Additional Notes
              </Typography>
              <Box sx={{ borderLeft: "3px solid #90caf9", pl: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.87rem",
                    color: "#333",
                    lineHeight: 1.7,
                  }}
                >
                  {submissionData.notes}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Inspector Notes */}
        {submissionData?.inspectorNotes && (
          <Card
            elevation={0}
            sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#111",
                  mb: 1.5,
                }}
              >
                Inspector Notes
              </Typography>
              <Box sx={{ borderLeft: "3px solid #90caf9", pl: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.87rem",
                    color: "#333",
                    lineHeight: 1.7,
                  }}
                >
                  {submissionData.inspectorNotes}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
