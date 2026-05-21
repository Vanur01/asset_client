// pages/AssignedChecklist.jsx - Complete Fixed Version with Delete

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
  FormControl,
  TablePagination,
  Tooltip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  useMediaQuery,
  useTheme as useMuiTheme,
  Stack,
  Button,
  LinearProgress,
  alpha,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useAuth } from "../context/AuthContexts";
import { useAssignment } from "../context/AssignmentContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0d4a5c" },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#1e293b", secondary: "#64748b" },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: "0.7rem",
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 16px",
        },
        body: {
          fontSize: "0.85rem",
          color: "#334155",
          padding: "14px 16px",
          borderBottom: "1px solid #f1f5f9",
        },
      },
    },
  },
});

// ==================== STATUS CONFIGURATION ====================
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "#d97706",
    bg: "#fef3c7",
    icon: PendingActionsIcon,
  },
  in_progress: {
    label: "In Progress",
    color: "#2563eb",
    bg: "#dbeafe",
    icon: HourglassTopOutlinedIcon,
  },
  submitted: {
    label: "Submitted",
    color: "#7c3aed",
    bg: "#ede9fe",
    icon: RateReviewIcon,
  },
  completed: {
    label: "Completed",
    color: "#059669",
    bg: "#d1fae5",
    icon: CheckCircleOutlineIcon,
  },
  approved: {
    label: "Approved",
    color: "#059669",
    bg: "#d1fae5",
    icon: CheckCircleOutlineIcon,
  },
  rejected: {
    label: "Rejected",
    color: "#dc2626",
    bg: "#fee2e2",
    icon: CloseIcon,
  },
  overdue: {
    label: "Overdue",
    color: "#dc2626",
    bg: "#fee2e2",
    icon: ErrorOutlineIcon,
  },
};

const PRIORITY_CONFIG = {
  low: { label: "LOW", color: "#10b981", bg: "#d1fae5" },
  medium: { label: "MEDIUM", color: "#f59e0b", bg: "#fef3c7" },
  high: { label: "HIGH", color: "#ef4444", bg: "#fee2e2" },
  critical: { label: "CRITICAL", color: "#dc2626", bg: "#fef2f2" },
};

// ==================== COMPONENTS ====================
function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <Chip
      label={cfg.label}
      size="small"
      icon={<Icon sx={{ fontSize: 12 }} />}
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 600,
        fontSize: "0.7rem",
        height: 26,
        borderRadius: "20px",
        "& .MuiChip-icon": { fontSize: 12, color: cfg.color },
      }}
    />
  );
}

function PriorityChip({ priority }) {
  const cfg =
    PRIORITY_CONFIG[priority?.toLowerCase()] || PRIORITY_CONFIG.medium;
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 700,
        fontSize: "0.65rem",
        height: 22,
        borderRadius: "6px",
      }}
    />
  );
}

function DateCell({ date }) {
  if (!date)
    return (
      <Typography sx={{ fontSize: "0.8rem", color: "#94a3b8" }}>—</Typography>
    );

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const isOverdue =
    new Date(date) < new Date() &&
    new Date(date).toDateString() !== new Date().toDateString();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
      <CalendarTodayOutlinedIcon
        sx={{ fontSize: 13, color: isOverdue ? "#dc2626" : "#94a3b8" }}
      />
      <Typography
        sx={{
          fontSize: "0.8rem",
          color: isOverdue ? "#dc2626" : "#64748b",
          fontWeight: isOverdue ? 600 : 400,
        }}
      >
        {formattedDate}
      </Typography>
      {isOverdue && (
        <Chip
          label="Overdue"
          size="small"
          sx={{
            height: 18,
            fontSize: "0.6rem",
            bgcolor: "#fee2e2",
            color: "#dc2626",
            fontWeight: 600,
          }}
        />
      )}
    </Box>
  );
}

function CompletionProgress({ rate }) {
  return (
    <Box sx={{ minWidth: 80 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LinearProgress
          variant="determinate"
          value={rate || 0}
          sx={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            bgcolor: "#e2e8f0",
            "& .MuiLinearProgress-bar": {
              bgcolor:
                rate >= 80 ? "#10b981" : rate >= 50 ? "#f59e0b" : "#ef4444",
              borderRadius: 2,
            },
          }}
        />
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "#64748b",
            minWidth: 35,
          }}
        >
          {rate || 0}%
        </Typography>
      </Box>
    </Box>
  );
}

function StatCard({ label, value, icon: Icon, color, loading }) {
  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{ borderRadius: 3, height: "100%", bgcolor: "#ffffff" }}
      >
        <CardContent
          sx={{
            p: 2,
            "&:last-child": { pb: 2 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 100,
          }}
        >
          <CircularProgress size={24} sx={{ color: "#0d4a5c" }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        height: "100%",
        width: "226px",
        bgcolor: "#ffffff",
        border: "1px solid #f0f2f5",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          borderColor: "transparent",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 600,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                mb: 0.75,
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              {value?.toLocaleString() || 0}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              bgcolor: alpha(color, 0.08),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color,
              flexShrink: 0,
              ml: 1,
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AssignedChecklist() {
  const navigate = useNavigate();
  const { authRequest } = useAuth();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", "/assignments");

      if (response && response.success) {
        setAssignments(response.assignments || []);
        setStats(
          response.stats || {
            total: 0,
            pending: 0,
            in_progress: 0,
            submitted: 0,
            completed: 0,
            approved: 0,
            rejected: 0,
            overdue: 0,
          },
        );
      } else {
        setError(response?.message || "Failed to fetch assignments");
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(err.message || "Failed to load assignments");
      showToast(err.message || "Failed to load assignments", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authRequest]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
  };

  const handleViewDetails = (assignment) => {
    navigate(`/admin/assignment-details/${assignment._id}`);
  };

  const handleViewAnalytics = (assignment) => {
    const checklistId = assignment.checklist?._id;
    if (checklistId) {
      navigate(`/admin/checklist-analytics/${checklistId}`);
    } else {
      showToast("Checklist ID not found", "error");
    }
  };

  // Delete assignment handler
  const handleDeleteClick = (assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;

    setDeleting(true);
    try {
      const response = await authRequest(
        "DELETE",
        `/assignments/${assignmentToDelete._id}`,
      );

      if (response && response.success) {
        showToast("Assignment deleted successfully", "success");
        // Refresh the list
        await fetchAssignments();
      } else {
        showToast(response?.message || "Failed to delete assignment", "error");
      }
    } catch (err) {
      console.error("Error deleting assignment:", err);
      showToast(err.message || "Failed to delete assignment", "error");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAssignmentToDelete(null);
  };

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    let data = [...assignments];

    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.checklist?.name?.toLowerCase().includes(searchLower) ||
          item.customerName?.toLowerCase().includes(searchLower) ||
          item.checklistName?.toLowerCase().includes(searchLower) ||
          item.assignedToAdminName?.toLowerCase().includes(searchLower),
      );
    }

    if (statusFilter !== "all") {
      data = data.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    if (priorityFilter !== "all") {
      data = data.filter(
        (item) => item.priority?.toLowerCase() === priorityFilter.toLowerCase(),
      );
    }

    return data;
  }, [assignments, search, statusFilter, priorityFilter]);

  const paginatedAssignments = filteredAssignments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Stat cards data
  const statCards = [
    {
      label: "Total Assigned",
      value: stats?.total || 0,
      icon: AssignmentOutlinedIcon,
      color: "#0d4a5c",
    },
    {
      label: "Pending",
      value: stats?.pending || 0,
      icon: PendingActionsIcon,
      color: "#d97706",
    },
    {
      label: "Submitted",
      value: stats?.submitted || 0,
      icon: RateReviewIcon,
      color: "#7c3aed",
    },
    {
      label: "Completed",
      value: (stats?.completed || 0) + (stats?.approved || 0),
      icon: CheckCircleOutlineIcon,
      color: "#059669",
    },
    {
      label: "Overdue",
      value: stats?.overdue || 0,
      icon: ErrorOutlineIcon,
      color: "#dc2626",
    },
  ];

  // Mobile card view
  const AssignmentCard = ({ item }) => (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1.5,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#0d4a5c",
              mb: 0.5,
            }}
          >
            {item.checklist?.name || item.checklistName || "—"}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8" }}>
            ID: {item._id?.slice(-8)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View Details" arrow>
            <IconButton
              size="small"
              onClick={() => handleViewDetails(item)}
              sx={{ borderRadius: 1 }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 18, color: "#0d4a5c" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Analytics" arrow>
            <IconButton
              size="small"
              onClick={() => handleViewAnalytics(item)}
              sx={{ borderRadius: 1 }}
            >
              <BarChartOutlinedIcon sx={{ fontSize: 18, color: "#0d4a5c" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Assignment" arrow>
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(item)}
              sx={{ borderRadius: 1, color: "#dc2626" }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.65rem" }}
          >
            CUSTOMER
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            {item.customerName || item.assignedToAdminName || "—"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.65rem" }}
          >
            ASSIGNED BY
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
            {item.assignedBy?.name || "—"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.65rem" }}
          >
            DUE DATE
          </Typography>
          <DateCell date={item.dueDate} />
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.65rem" }}
          >
            PRIORITY
          </Typography>
          <Box mt={0.5}>
            <PriorityChip priority={item.priority} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.65rem" }}
          >
            STATUS
          </Typography>
          <Box mt={0.5}>
            <StatusChip status={item.status} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.65rem" }}
          >
            COMPLETION
          </Typography>
          <Box mt={0.5}>
            <CompletionProgress rate={item.completionRate} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", p: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={3}
          spacing={2}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                color: "#0d4a5c",
              }}
            >
              Assigned Checklists
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                mt: 0.5,
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
              }}
            >
              Track and manage all checklist assignments
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ bgcolor: alpha("#0d4a5c", 0.05) }}
            >
              <RefreshIcon sx={{ color: "#0d4a5c" }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Stats Cards */}
        <Box sx={{ mb: 3, overflowX: "auto", pb: 1 }}>
          <Stack direction="row" spacing={1.5} sx={{ minWidth: "max-content" }}>
            {statCards.map((card, idx) => (
              <Box key={idx} sx={{ minWidth: { xs: 140, sm: 160 } }}>
                <StatCard {...card} loading={loading} />
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2.5, borderRadius: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              placeholder="Search by checklist name, customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              size="small"
              sx={{ flex: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 140 } }}
            >
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                displayEmpty
              >
                <MenuItem value="all">All Status</MenuItem>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <MenuItem key={key} value={key}>
                    {cfg.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 120 } }}
            >
              <Select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setPage(0);
                }}
                displayEmpty
              >
                <MenuItem value="all">All Priority</MenuItem>
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <MenuItem key={key} value={key}>
                    {cfg.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {(statusFilter !== "all" || priorityFilter !== "all" || search) && (
              <Button
                size="small"
                onClick={() => {
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setSearch("");
                  setPage(0);
                }}
                sx={{ color: "#dc2626" }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#0d4a5c" }} />
          </Box>
        ) : paginatedAssignments.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
            <AssignmentOutlinedIcon
              sx={{ fontSize: 48, color: "#cbd5e1", mb: 2 }}
            />
            <Typography sx={{ color: "#94a3b8" }}>
              {search || statusFilter !== "all" || priorityFilter !== "all"
                ? "No matching assignments found"
                : "No assignments found"}
            </Typography>
          </Paper>
        ) : isMobile ? (
          <Box>
            {paginatedAssignments.map((item) => (
              <AssignmentCard key={item._id} item={item} />
            ))}
          </Box>
        ) : (
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Checklist Name</TableCell>
                    <TableCell>Customer / Admin</TableCell>
                    <TableCell>Assigned By</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Completion</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssignments.map((item) => (
                    <TableRow
                      key={item._id}
                      hover
                      sx={{ "&:hover": { bgcolor: alpha("#0d4a5c", 0.02) } }}
                    >
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            color: "#0d4a5c",
                          }}
                        >
                          {item.checklist?.name || item.checklistName || "—"}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.65rem", color: "#94a3b8" }}
                        >
                          {item.checklist?.category || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: "0.7rem",
                              bgcolor: alpha("#0d4a5c", 0.1),
                              color: "#0d4a5c",
                            }}
                          >
                            {item.customerName?.charAt(0).toUpperCase() ||
                              item.assignedToAdminName
                                ?.charAt(0)
                                .toUpperCase() ||
                              "A"}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                            >
                              {item.customerName ||
                                item.assignedToAdminName ||
                                "—"}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "0.65rem", color: "#94a3b8" }}
                            >
                              {item.customerEmail || "—"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.8rem" }}>
                          {item.assignedBy?.name || "—"}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.65rem", color: "#94a3b8" }}
                        >
                          {item.assignedByRole || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <DateCell date={item.dueDate} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={item.status} />
                      </TableCell>
                      <TableCell>
                        <CompletionProgress rate={item.completionRate} />
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Tooltip title="View Details" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(item)}
                              sx={{
                                borderRadius: 1,
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <VisibilityOutlinedIcon
                                sx={{ fontSize: 16, color: "#0d4a5c" }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Analytics" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewAnalytics(item)}
                              sx={{
                                borderRadius: 1,
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <BarChartOutlinedIcon
                                sx={{ fontSize: 16, color: "#0d4a5c" }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Assignment" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(item)}
                              sx={{
                                borderRadius: 1,
                                border: "1px solid #fee2e2",
                                color: "#dc2626",
                              }}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <TablePagination
              component="div"
              count={filteredAssignments.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </Paper>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 450,
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}
        >
          <WarningAmberIcon sx={{ color: "#dc2626", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Delete Assignment
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="delete-dialog-description"
            sx={{ color: "#64748b" }}
          >
            Are you sure you want to delete the assignment{" "}
            <strong style={{ color: "#0d4a5c" }}>
              "
              {assignmentToDelete?.checklist?.name ||
                assignmentToDelete?.checklistName}
              "
            </strong>
            ?
            <br />
            <br />
            This action cannot be undone and will remove all associated data
            including:
          </DialogContentText>
          <Box sx={{ mt: 2, ml: 2 }}>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#64748b",
                mb: 1,
              }}
            >
              <CloseIcon sx={{ fontSize: 14, color: "#dc2626" }} /> All
              submission responses
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#64748b",
                mb: 1,
              }}
            >
              <CloseIcon sx={{ fontSize: 14, color: "#dc2626" }} /> Uploaded
              photos and attachments
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#64748b",
              }}
            >
              <CloseIcon sx={{ fontSize: 14, color: "#dc2626" }} /> Inspection
              history records
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
              "&:hover": { borderColor: "#94a3b8" },
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
            startIcon={
              deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteOutlineIcon />
              )
            }
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
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
