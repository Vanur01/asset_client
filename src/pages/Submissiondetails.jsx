// pages/Submissiondetails.jsx
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
  Tooltip,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
  const [checklist, setChecklist] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchSubmissionDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authRequest("GET", `/assignments/${id}/details`);
      if (response.success) {
        setSubmission(response);
        setChecklist(response.checklist);
        // Extract comments from reviewComments if available
        if (response.reviewComments) {
          setComments([
            {
              author: response.reviewedBy?.email?.split("@")[0] || "Admin",
              date: response.reviewedAt,
              text: response.reviewComments,
            },
          ]);
        }
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

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const response = await authRequest("PATCH", `/assignments/${id}`, {
        reviewComments: comment,
      });
      if (response.success) {
        setComments([
          ...comments,
          {
            author: "Current User",
            date: new Date().toISOString(),
            text: comment,
          },
        ]);
        setComment("");
        setSnackbar({
          open: true,
          message: "Comment added",
          severity: "success",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to add comment",
        severity: "error",
      });
    }
  };

  const handleExportPDF = () => {
    setSnackbar({
      open: true,
      message: "PDF export coming soon",
      severity: "info",
    });
  };

  const submissionData = submission?._doc || submission;
  const responses =
    checklist?.sections?.flatMap((section) =>
      section.fields.map((field) => ({
        label: field.label,
        required: field.isRequired,
        type: field.fieldType,
        value:
          submissionData?.responses?.find((r) => r.fieldId === field._id)
            ?.value || "Not provided",
        options: field.options,
        checkboxItems: field.checkboxItems,
      })),
    ) || [];

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: "100vh", p: 3 }}>
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        </Box>
      </ThemeProvider>
    );
  }

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
              {checklist?.name || "Checklist Submission"}
            </Typography>
          </Box>
          <Button
            startIcon={<FileDownloadOutlinedIcon />}
            variant="outlined"
            size="small"
            onClick={handleExportPDF}
            sx={{
              textTransform: "none",
              borderColor: "#ccc",
              color: "#333",
              fontWeight: 600,
              fontSize: "0.82rem",
              borderRadius: 2,
            }}
          >
            Export PDF
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
                  {submissionData?.primaryMember?.email?.split("@")[0] || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
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
                    mb: 0.5,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 15, color: "#888" }} />
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

        {/* Submission Responses */}
        <Card
          elevation={0}
          sx={{ border: "1px solid #e8e8e8", borderRadius: 2, mb: 2.5 }}
        >
          <CardContent sx={{ p: "0 !important" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                py: 2.5,
              }}
            >
              <Typography
                sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111" }}
              >
                Submission Responses
              </Typography>
              <Chip
                label={`${responses.length} Questions`}
                size="small"
                sx={{
                  bgcolor: "#f5f5f5",
                  color: "#555",
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 26,
                  borderRadius: "6px",
                }}
              />
            </Box>
            {responses.map((r, i) => (
              <Box key={i}>
                <Divider />
                <Box sx={{ px: 3, py: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        color: "#222",
                      }}
                    >
                      {r.label}
                    </Typography>
                    {r.required && (
                      <Chip
                        label="Required"
                        size="small"
                        sx={{
                          bgcolor: "#fff0f0",
                          color: "#e53935",
                          border: "1px solid #ffcdd2",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 22,
                          borderRadius: "5px",
                        }}
                      />
                    )}
                  </Box>
                  {r.type === "text_input" || r.type === "text_area" ? (
                    <Box sx={{ borderLeft: "3px solid #90caf9", pl: 1.5 }}>
                      <Typography sx={{ fontSize: "0.88rem", color: "#333" }}>
                        {r.value}
                      </Typography>
                    </Box>
                  ) : r.type === "date_picker" ? (
                    <Box sx={{ borderLeft: "3px solid #90caf9", pl: 1.5 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.8 }}
                      >
                        <CalendarTodayOutlinedIcon
                          sx={{ fontSize: 14, color: "#555" }}
                        />
                        <Typography sx={{ fontSize: "0.88rem", color: "#333" }}>
                          {new Date(r.value).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : r.type === "checkbox" ? (
                    <Box
                      sx={{
                        borderLeft: "3px solid #90caf9",
                        pl: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.8,
                      }}
                    >
                      {r.checkboxItems?.map((item, j) => (
                        <Box
                          key={j}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                          }}
                        >
                          <CheckCircleIcon
                            sx={{
                              fontSize: 18,
                              color: r.value?.includes(item)
                                ? "#2e7d32"
                                : "#ccc",
                            }}
                          />
                          <Typography
                            sx={{ fontSize: "0.88rem", color: "#333" }}
                          >
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : r.type === "rating" ? (
                    <Box sx={{ borderLeft: "3px solid #90caf9", pl: 1.5 }}>
                      <Rating value={r.value || 0} readOnly />
                    </Box>
                  ) : r.type === "image_upload" || r.type === "signature" ? (
                    r.value && r.value !== "Not provided" ? (
                      <Box sx={{ borderLeft: "3px solid #90caf9", pl: 1.5 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ImageIcon />}
                          onClick={() => window.open(r.value, "_blank")}
                        >
                          View File
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ borderLeft: "3px solid #90caf9", pl: 1.5 }}>
                        <Typography sx={{ fontSize: "0.88rem", color: "#999" }}>
                          No file uploaded
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box sx={{ borderLeft: "3px solid #90caf9", pl: 1.5 }}>
                      <Typography sx={{ fontSize: "0.88rem", color: "#333" }}>
                        {r.value}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
            {/* Attachments */}
            {submissionData?.attachments?.length > 0 && (
              <>
                <Divider />
                <Box sx={{ px: 3, py: 2.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      color: "#222",
                      mb: 1.2,
                    }}
                  >
                    Attachments
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
              </>
            )}
            {/* Additional Notes */}
            {submissionData?.additionalNotes && (
              <>
                <Divider />
                <Box sx={{ px: 3, py: 2.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      color: "#222",
                      mb: 1.2,
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
                      {submissionData.additionalNotes}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {/* Inspector Notes */}
            {submissionData?.inspectorNotes && (
              <>
                <Divider />
                <Box sx={{ px: 3, py: 2.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      color: "#222",
                      mb: 1.2,
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
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        {/* Comments & Notes */}
        <Card
          elevation={0}
          sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}
        >
          <CardContent sx={{ p: "24px !important" }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: "#333" }} />
              <Typography
                sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111" }}
              >
                Comments & Notes
              </Typography>
            </Box>
            {comments.map((c, i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: "#f9f9f9",
                  border: "1px solid #efefef",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#222" }}
                >
                  {c.author}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#999", mb: 1 }}>
                  {new Date(c.date).toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#444" }}>
                  {c.text}
                </Typography>
              </Box>
            ))}
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: "0.85rem",
                  bgcolor: "#fff",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              sx={{ mt: 2, textTransform: "none", bgcolor: TEAL }}
            >
              Post Comment
            </Button>
          </CardContent>
        </Card>

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
