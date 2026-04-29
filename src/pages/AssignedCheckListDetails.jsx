// pages/AssignmentDetails.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  Tooltip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Rating,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip as MuiChip,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { useAuth } from "../context/AuthContexts";
import { useAssignment } from "../context/AssignmentContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

// Theme
const TEAL = "#1B4D5C";
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: TEAL },
    background: { default: "#F4F6F9", paper: "#FFFFFF" },
    text: { primary: "#1A2B3C", secondary: "#6B7A8D" },
  },
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          border: "1px solid #E8EDF2",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          color: "#6b7280",
          background: "#f8fafc",
        },
        body: {
          fontSize: "0.85rem",
        },
      },
    },
  },
});

// Status Config
const STATUS_CONFIG = {
  pending: { label: "Pending", color: "#d97706", bg: "#fef3c7" },
  inProgress: { label: "In Progress", color: "#2563eb", bg: "#dbeafe" },
  completed: { label: "Completed", color: "#059669", bg: "#d1fae5" },
  submitted: { label: "Submitted", color: "#7c3aed", bg: "#ede9fe" },
  overdue: { label: "Overdue", color: "#dc2626", bg: "#fee2e2" },
  approved: { label: "Approved", color: "#059669", bg: "#d1fae5" },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2" },
  pending_review: { label: "Pending Review", color: "#d97706", bg: "#fef3c7" },
};

const PRIORITY_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#dc2626",
};

function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        background: cfg.bg,
        color: cfg.color,
        fontWeight: 500,
        fontSize: "0.75rem",
        height: 26,
        borderRadius: "20px",
      }}
    />
  );
}

function PriorityChip({ priority }) {
  const color = PRIORITY_COLORS[priority?.toLowerCase()] || "#6b7280";
  return (
    <Chip
      label={priority?.toUpperCase() || "MEDIUM"}
      size="small"
      sx={{
        background: `${color}15`,
        color: color,
        fontWeight: 500,
        fontSize: "0.7rem",
        height: 24,
        borderRadius: "16px",
      }}
    />
  );
}

// Submission Details Dialog Component
function SubmissionDetailsDialog({ open, onClose, submission, checklist }) {
  const [submissionData, setSubmissionData] = useState(null);

  useEffect(() => {
    if (submission) {
      setSubmissionData(submission);
    }
  }, [submission]);

  if (!submissionData) return null;

  const renderFieldValue = (field, value) => {
    if (!value)
      return (
        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
          Not provided
        </Typography>
      );

    switch (field.fieldType) {
      case "checkbox":
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {field.checkboxItems?.map((item, idx) => (
              <Chip
                key={idx}
                label={item}
                size="small"
                icon={
                  value.includes(item) ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )
                }
                sx={{
                  backgroundColor: value.includes(item) ? "#d1fae5" : "#f3f4f6",
                  color: value.includes(item) ? "#059669" : "#6b7280",
                }}
              />
            ))}
          </Box>
        );
      case "rating":
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Rating value={value} readOnly precision={0.5} />
            <Typography variant="body2">{value}/5</Typography>
          </Box>
        );
      case "image_upload":
        return (
          <Button
            variant="outlined"
            size="small"
            startIcon={<ImageIcon />}
            onClick={() => window.open(value, "_blank")}
          >
            View Image
          </Button>
        );
      case "signature":
        return (
          <Button
            variant="outlined"
            size="small"
            startIcon={<ImageIcon />}
            onClick={() => window.open(value, "_blank")}
          >
            View Signature
          </Button>
        );
      default:
        return <Typography variant="body2">{value}</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Submission Details</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: "#f8fafc" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: TEAL, fontWeight: 600, mb: 1 }}
              >
                Submitted By: {submissionData.primaryMember?.email || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Submitted At:{" "}
                {new Date(submissionData.submittedAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Overall Rating: {submissionData.overallRating || "Not rated"}/5
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Inspection Notes
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "#f8fafc" }}>
              <Typography variant="body2">
                {submissionData.inspectorNotes || "No notes provided"}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Additional Notes
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "#f8fafc" }}>
              <Typography variant="body2">
                {submissionData.additionalNotes || "No additional notes"}
              </Typography>
            </Paper>
          </Grid>

          {submissionData.attachments?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
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
            </Grid>
          )}

          {submissionData.uploadedPhotos?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Photos
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
            </Grid>
          )}

          {submissionData.signaturePath && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Signature
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                onClick={() =>
                  window.open(submissionData.signaturePath, "_blank")
                }
              >
                View Signature
              </Button>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {submissionData.status === "submitted" && (
          <Button variant="contained" sx={{ bgcolor: TEAL }}>
            Review Submission
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

// Main Component
export default function AssignmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authRequest } = useAuth();
  const { getAssignmentById, getChecklistAnalytics } = useAssignment();

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch assignment details
      const assignmentResponse = await authRequest("GET", `/assignments/${id}`);
      if (assignmentResponse.success) {
        setAssignment(assignmentResponse);
      }

      // Fetch submissions for this checklist
      const checklistId =
        assignmentResponse?.checklist?._id ||
        assignmentResponse?._doc?.checklist?._id;
      if (checklistId) {
        const submissionsResponse = await authRequest(
          "GET",
          `/assignments/checklist/${checklistId}/submissions`,
        );
        if (submissionsResponse.success) {
          setSubmissions(submissionsResponse.submissions || []);
        }

        const assigneesResponse = await authRequest(
          "GET",
          `/assignments/checklist/${checklistId}/assignees`,
        );
        if (assigneesResponse.success) {
          const assigneesList = Object.values(assigneesResponse).filter(
            (item) => item.user,
          );
          setAssignees(assigneesList);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to load data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [authRequest, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Export submissions to CSV
  const exportToCSV = () => {
    if (submissions.length === 0) {
      setSnackbar({
        open: true,
        message: "No submissions to export",
        severity: "warning",
      });
      return;
    }

    // Define CSV headers
    const headers = [
      "Submitted By",
      "Email",
      "Submitted Date",
      "Status",
      "Completion Rate (%)",
      "Overall Rating",
      "Inspector Notes",
      "Additional Notes",
      "Has Attachments",
      "Has Photos",
      "Has Signature",
    ];

    // Prepare data rows
    const rows = submissions.map((submission) => [
      submission.primaryMember?.email?.split("@")[0] || "N/A",
      submission.primaryMember?.email || "N/A",
      submission.submittedAt
        ? new Date(submission.submittedAt).toLocaleString()
        : "Not submitted",
      submission.submissionStatus || submission.status || "N/A",
      submission.completionRate || 0,
      submission.overallRating || "Not rated",
      `"${(submission.inspectorNotes || "").replace(/"/g, '""')}"`,
      `"${(submission.additionalNotes || "").replace(/"/g, '""')}"`,
      submission.attachments?.length > 0 ? "Yes" : "No",
      submission.uploadedPhotos?.length > 0 ? "Yes" : "No",
      submission.signaturePath ? "Yes" : "No",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Add BOM for UTF-8 encoding
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Create download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `submissions_${checklistData?.name || "checklist"}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: `Exported ${submissions.length} submissions to CSV`,
      severity: "success",
    });
  };

  const assignmentData = assignment?._doc || assignment;
  const checklistData = assignmentData?.checklist;
  const customerData = assignmentData?.customerId;
  const assetData = assignmentData?.assetId;

  // Calculate completion rate
  const completionRate =
    submissions.length > 0
      ? (submissions.filter(
          (s) => s.status === "submitted" || s.status === "approved",
        ).length /
          assignees.length) *
        100
      : 0;

  const statCards = [
    {
      icon: <DescriptionOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />,
      iconBg: TEAL,
      label: "Total Submissions",
      value: submissions.length,
    },
    {
      icon: <PersonOutlineIcon sx={{ color: "#fff", fontSize: 22 }} />,
      iconBg: "#9c27b0",
      label: "Total Assignees",
      value: assignees.length,
    },
    {
      icon: <CheckCircleOutlineIcon sx={{ color: "#fff", fontSize: 22 }} />,
      iconBg: "#2e7d32",
      label: "Completion Rate",
      value: `${Math.round(completionRate)}%`,
    },
    {
      icon: <AccessTimeIcon sx={{ color: "#fff", fontSize: 22 }} />,
      iconBg: "#e65100",
      label: "Days Remaining",
      value: Math.max(
        0,
        Math.ceil(
          (new Date(assignmentData?.dueDate) - new Date()) /
            (1000 * 60 * 60 * 24),
        ),
      ),
    },
  ];

  const handleViewSubmission = (submission) => {
    // Navigate to submission details page instead of opening dialog
    navigate(
      `/admin/assignment-submit-details/${submission._id || submission.id}`,
    );
  };

  const handleExportSubmission = (submission) => {
    // Export single submission as CSV
    const headers = ["Field", "Value"];

    const rows = [
      ["Submitted By", submission.primaryMember?.email || "N/A"],
      [
        "Submitted Date",
        submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString()
          : "Not submitted",
      ],
      ["Status", submission.submissionStatus || submission.status || "N/A"],
      ["Completion Rate (%)", submission.completionRate || 0],
      ["Overall Rating", submission.overallRating || "Not rated"],
      ["Inspector Notes", submission.inspectorNotes || "N/A"],
      ["Additional Notes", submission.additionalNotes || "N/A"],
      ["Has Attachments", submission.attachments?.length > 0 ? "Yes" : "No"],
      ["Has Photos", submission.uploadedPhotos?.length > 0 ? "Yes" : "No"],
      ["Has Signature", submission.signaturePath ? "Yes" : "No"],
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map(
        (row) => `"${row[0]}","${String(row[1]).replace(/"/g, '""')}"`,
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `submission_${submission.primaryMember?.email?.split("@")[0] || "user"}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: "Submission exported successfully",
      severity: "success",
    });
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", p: 3 }}>
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3 } }}>
        {/* Back Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <ArrowBackIcon
            sx={{ color: TEAL, fontSize: 18, cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <Typography
            sx={{
              color: TEAL,
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
            onClick={() => navigate(-1)}
          >
            Back to Assigned Checklists
          </Typography>
        </Box>

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 0.5,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: TEAL }}>
                {checklistData?.name || "Assignment Details"}
              </Typography>
              <StatusChip status={assignmentData?.status} />
              <PriorityChip priority={assignmentData?.priority} />
            </Box>
            <Typography
              sx={{ color: "#666", fontSize: "0.82rem", maxWidth: 600 }}
            >
              {checklistData?.sections?.length || 0} sections •{" "}
              {checklistData?.totalFields || 0} fields
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<BarChartOutlinedIcon />}
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", borderColor: "#ccc", color: "#333" }}
              onClick={() =>
                navigate(`/admin/checklist-analytics/${checklistData?._id}`)
              }
            >
              Analytics
            </Button>
          </Box>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((s, i) => (
            <Grid item xs={6} sm={6} md={3} key={i}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e8e8e8",
                  borderRadius: 1,
                  width: "272px",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: "16px !important",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: s.iconBg,
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                    }}
                  >
                    {s.icon}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        color: "#888",
                        fontSize: "0.78rem",
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </Typography>
                    <Typography
                      sx={{ color: TEAL, fontWeight: 700, fontSize: "1.4rem" }}
                    >
                      {s.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Overall Progress */}
        <Card
          elevation={0}
          sx={{ border: "1px solid #e8e8e8", borderRadius: 1, mb: 3 }}
        >
          <CardContent>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography
                sx={{ fontWeight: 700, color: TEAL, fontSize: "0.95rem" }}
              >
                Overall Progress
              </Typography>
              <Typography sx={{ color: "#888", fontSize: "0.82rem" }}>
                {submissions.length} of {assignees.length} completed
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "#e0e0e0",
                "& .MuiLinearProgress-bar": { bgcolor: TEAL, borderRadius: 5 },
              }}
            />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: "1px solid #e8e8e8", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            TabIndicatorProps={{ style: { backgroundColor: TEAL } }}
          >
            <Tab label="Submissions" />
            <Tab label="Checklist Structure" />
            <Tab label="Assignees" />
          </Tabs>
        </Box>

        {/* Submissions Tab */}
        {activeTab === 0 && (
          <Card
            elevation={0}
            sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}
          >
            <CardContent sx={{ p: "0 !important" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 3,
                  py: 2,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  sx={{ fontWeight: 700, color: TEAL, fontSize: "0.95rem" }}
                >
                  Recent Submissions
                </Typography>
                <Button
                  startIcon={<FileDownloadOutlinedIcon />}
                  variant="outlined"
                  size="small"
                  onClick={exportToCSV}
                  sx={{ textTransform: "none" }}
                >
                  Export All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#fafafa" }}>
                      <TableCell>Submitted By</TableCell>
                      <TableCell>Submitted Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Completion</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography sx={{ color: "#888" }}>
                            No submissions yet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      submissions.map((submission, i) => (
                        <TableRow key={i} hover>
                          <TableCell>
                            <Typography
                              sx={{ fontWeight: 500, fontSize: "0.85rem" }}
                            >
                              {submission.primaryMember?.email?.split("@")[0] ||
                                "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.8,
                              }}
                            >
                              <CalendarTodayOutlinedIcon
                                sx={{ fontSize: 14, color: "#999" }}
                              />
                              <Typography
                                sx={{ fontSize: "0.83rem", color: "#555" }}
                              >
                                {submission.submittedAt
                                  ? new Date(
                                      submission.submittedAt,
                                    ).toLocaleString()
                                  : "Not submitted"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <StatusChip
                              status={
                                submission.submissionStatus || submission.status
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                minWidth: 160,
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={submission.completionRate || 0}
                                sx={{
                                  flex: 1,
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "#e0e0e0",
                                }}
                              />
                              <Typography
                                sx={{ fontSize: "0.82rem", color: "#555" }}
                              >
                                {submission.completionRate || 0}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Rating
                              value={submission.overallRating || 0}
                              readOnly
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                justifyContent: "center",
                              }}
                            >
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleViewSubmission(submission)
                                  }
                                  sx={{ color: TEAL }}
                                >
                                  <VisibilityOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Export">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleExportSubmission(submission)
                                  }
                                  sx={{ color: "#555" }}
                                >
                                  <FileDownloadOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Checklist Structure Tab */}
        {activeTab === 1 && (
          <Card
            elevation={0}
            sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}
          >
            <CardContent sx={{ p: 3 }}>
              {checklistData?.sections?.map((section, idx) => (
                <Accordion
                  key={idx}
                  defaultExpanded={idx === 0}
                  sx={{
                    mb: 2,
                    border: "1px solid #e8e8e8",
                    borderRadius: 2,
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: TEAL }}>
                        {section.sectionTitle}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>
                        {section.sectionDescription}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {section.fields?.map((field, fIdx) => (
                        <Paper
                          key={fIdx}
                          sx={{
                            p: 2,
                            bgcolor: "#f8fafc",
                            border: "1px solid #e8edf2",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {field.label}
                                {field.isRequired && (
                                  <span style={{ color: "#dc2626" }}> *</span>
                                )}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#888" }}
                              >
                                Type: {field.fieldType}
                              </Typography>
                            </Box>
                            <Chip
                              label={field.isRequired ? "Required" : "Optional"}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.65rem",
                                bgcolor: field.isRequired
                                  ? "#fee2e2"
                                  : "#e5e7eb",
                              }}
                            />
                          </Box>
                          {field.options?.length > 0 && (
                            <Box
                              sx={{
                                mt: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {field.options.map((opt, oIdx) => (
                                <Chip
                                  key={oIdx}
                                  label={opt}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          )}
                          {field.checkboxItems?.length > 0 && (
                            <Box
                              sx={{
                                mt: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {field.checkboxItems.map((item, cIdx) => (
                                <Chip
                                  key={cIdx}
                                  label={item}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Assignees Tab */}
        {activeTab === 2 && (
          <Card
            elevation={0}
            sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: TEAL,
                  fontSize: "0.95rem",
                  mb: 2,
                }}
              >
                Assigned Users ({assignees.length})
              </Typography>
              <Grid container spacing={2}>
                {assignees.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography
                      sx={{ color: "#888", textAlign: "center", py: 4 }}
                    >
                      No assignees found
                    </Typography>
                  </Grid>
                ) : (
                  assignees.map((assignee, idx) => {
                    const user = assignee.user;
                    const hasSubmitted = assignee.assignments?.some(
                      (a) => a.submittedAt,
                    );
                    return (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Paper
                          elevation={0}
                          sx={{
                            border: "1px solid #e8e8e8",
                            borderRadius: 1,
                            p: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{ bgcolor: TEAL, width: 40, height: 40 }}
                            >
                              {user?.email?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.85rem",
                                  color: TEAL,
                                }}
                              >
                                {user?.email?.split("@")[0]}
                              </Typography>
                              <Typography
                                sx={{ fontSize: "0.75rem", color: "#888" }}
                              >
                                {user?.email}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#888" }}
                              >
                                Role: {assignee.role || "Team Member"}
                              </Typography>
                            </Box>
                          </Box>
                          {hasSubmitted ? (
                            <CheckCircleOutlineIcon
                              sx={{ fontSize: 22, color: "#2e7d32", ml: 1 }}
                            />
                          ) : (
                            <AccessTimeIcon
                              sx={{ fontSize: 22, color: "#e65100", ml: 1 }}
                            />
                          )}
                        </Paper>
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Snackbar */}
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
