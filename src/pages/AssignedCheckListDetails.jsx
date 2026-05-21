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
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { useAuth } from "../context/AuthContexts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";

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
  in_progress: { label: "In Progress", color: "#2563eb", bg: "#dbeafe" },
  completed: { label: "Completed", color: "#059669", bg: "#d1fae5" },
  submitted: { label: "Submitted", color: "#7c3aed", bg: "#ede9fe" },
  overdue: { label: "Overdue", color: "#dc2626", bg: "#fee2e2" },
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

export default function AssignmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch assignment details
      const assignmentResponse = await authRequest("GET", `/assignments/${id}`);
      if (assignmentResponse.success) {
        const assignmentData = assignmentResponse._doc || assignmentResponse;
        setAssignment(assignmentData);
      }

      // Fetch submissions for this checklist
      const checklistId =
        assignmentResponse?._doc?.checklist?._id ||
        assignmentResponse?.checklist?._id;
      if (checklistId) {
        const submissionsResponse = await authRequest(
          "GET",
          `/assignments/checklist/${checklistId}/submissions`,
        );
        if (submissionsResponse.success) {
          setSubmissions(submissionsResponse.submissions || []);
        }

        // Get unique assignees from submissions
        const uniqueAssignees = new Map();
        if (submissionsResponse.submissions) {
          submissionsResponse.submissions.forEach((sub) => {
            sub.assignedToTeamMembers?.forEach((member) => {
              if (!uniqueAssignees.has(member.userId?._id || member.userId)) {
                uniqueAssignees.set(member.userId?._id || member.userId, {
                  user: member.userId,
                  status: member.status,
                  completedAt: member.completedAt,
                });
              }
            });
          });
        }
        setAssignees(Array.from(uniqueAssignees.values()));
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

  // Delete submission handler
  const handleDeleteClick = (submission) => {
    setSubmissionToDelete(submission);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!submissionToDelete) return;
    
    setDeleting(true);
    try {
      const response = await authRequest("DELETE", `/assignments/${submissionToDelete._id}/submission`);
      
      if (response && response.success) {
        setSnackbar({
          open: true,
          message: "Submission deleted successfully",
          severity: "success",
        });
        // Refresh the data
        await fetchData();
      } else {
        setSnackbar({
          open: true,
          message: response?.message || "Failed to delete submission",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error deleting submission:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete submission",
        severity: "error",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSubmissionToDelete(null);
  };

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

    const headers = [
      "Submitted By",
      "Email",
      "Submitted Date",
      "Status",
      "Completion Rate (%)",
      "Overall Rating",
      "Inspector Notes",
      "Additional Notes",
    ];

    const rows = submissions.map((submission) => [
      submission.assignedToTeamMembers?.[0]?.name?.split("@")[0] || "N/A",
      submission.assignedToTeamMembers?.[0]?.userId?.email || "N/A",
      submission.submittedAt
        ? new Date(submission.submittedAt).toLocaleString()
        : "Not submitted",
      submission.submissionStatus || submission.status || "N/A",
      submission.completionRate || 0,
      submission.overallRating || "Not rated",
      `"${(submission.inspectorNotes || "").replace(/"/g, '""')}"`,
      `"${(submission.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `submissions_${assignment?.checklistName || "checklist"}_${new Date().toISOString().split("T")[0]}.csv`,
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

  const assignmentData = assignment;
  const checklistData = assignmentData?.checklist;

  // Calculate completion rate
  const completionRate =
    submissions.length > 0 && assignees.length > 0
      ? (submissions.filter(
          (s) =>
            s.status === "submitted" ||
            s.status === "approved" ||
            s.submissionStatus === "approved",
        ).length /
          assignees.length) *
        100
      : 0;

  const daysRemaining = assignmentData?.dueDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(assignmentData.dueDate) - new Date()) /
            (1000 * 60 * 60 * 24),
        ),
      )
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
      value: daysRemaining,
    },
  ];

  const handleViewSubmission = (submission) => {
    navigate(`/admin/assignment-submit-details/${submission._id}`);
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
                {checklistData?.name ||
                  assignmentData?.checklistName ||
                  "Assignment Details"}
              </Typography>
              <StatusChip
                status={
                  assignmentData?.submissionStatus || assignmentData?.status
                }
              />
            </Box>
            <Typography
              sx={{ color: "#666", fontSize: "0.82rem", maxWidth: 600 }}
            >
              Due Date:{" "}
              {assignmentData?.dueDate
                ? new Date(assignmentData.dueDate).toLocaleDateString()
                : "Not set"}
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
                  width: "282px",
                  borderRadius: 2,
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
          sx={{ border: "1px solid #e8e8e8", borderRadius: 2, mb: 3 }}
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
                      submissions.map((submission) => (
                        <TableRow key={submission._id} hover>
                          <TableCell>
                            <Typography
                              sx={{ fontWeight: 500, fontSize: "0.85rem" }}
                            >
                              {submission.assignedToTeamMembers?.[0]?.name?.split(
                                "@",
                              )[0] || "N/A"}
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
                            {submission.overallRating || "—"}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewSubmission(submission)}
                                  sx={{ color: TEAL }}
                                >
                                  <VisibilityOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Submission">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(submission)}
                                  sx={{ color: "#dc2626" }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
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

        {/* Assignees Tab */}
        {activeTab === 1 && (
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
                    const hasSubmitted = assignee.status === "completed";
                    return (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Paper
                          elevation={0}
                          sx={{
                            border: "1px solid #e8e8e8",
                            borderRadius: 2,
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
                            </Box>
                          </Box>
                          {hasSubmitted ? (
                            <CheckCircleIcon
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxWidth: 450,
              width: "100%",
            },
          }}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
            <WarningAmberIcon sx={{ color: "#dc2626", fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Delete Submission
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "#64748b" }}>
              Are you sure you want to delete the submission from{" "}
              <strong style={{ color: "#0d4a5c" }}>
                "{submissionToDelete?.assignedToTeamMembers?.[0]?.name?.split("@")[0] || "Unknown"}"
              </strong>?
              <br />
              <br />
              This action cannot be undone and will remove:
            </DialogContentText>
            <Box sx={{ mt: 2, ml: 2 }}>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b", mb: 1 }}>
                <CloseIcon sx={{ fontSize: 14, color: "#dc2626" }} /> All response data
              </Typography>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b", mb: 1 }}>
                <CloseIcon sx={{ fontSize: 14, color: "#dc2626" }} /> Uploaded photos and attachments
              </Typography>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                <CloseIcon sx={{ fontSize: 14, color: "#dc2626" }} /> The entire submission record
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0, gap: 1.5 }}>
            <Button
              onClick={handleDeleteCancel}
              disabled={deleting}
              sx={{
                textTransform: "none",
                color: "#64748b",
                borderColor: "#e2e8f0",
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              sx={{
                textTransform: "none",
                bgcolor: "#dc2626",
                color: "#fff",
                "&:hover": { bgcolor: "#b91c1c" },
              }}
              variant="contained"
              startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon />}
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogActions>
        </Dialog>

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