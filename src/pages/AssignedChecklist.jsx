// pages/AssignedChecklist.jsx
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
import { useAuth } from "../context/AuthContexts";
import { useAssignment } from "../context/AssignmentContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a4a5c" },
    background: { default: "#f9fafb", paper: "#ffffff" },
    text: { primary: "#111827", secondary: "#6b7280" },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          background: "#f8fafc",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 16px",
        },
        body: {
          fontSize: "0.85rem",
          color: "#374151",
          padding: "13px 16px",
          borderBottom: "1px solid #f0f4f8",
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500, fontSize: "0.75rem" } },
    },
  },
});

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "#d97706", bg: "#fef3c7" },
  inProgress: { label: "In Progress", color: "#2563eb", bg: "#dbeafe" },
  completed: { label: "Completed", color: "#059669", bg: "#d1fae5" },
  overdue: { label: "Overdue", color: "#dc2626", bg: "#fee2e2" },
  approved: { label: "Approved", color: "#059669", bg: "#d1fae5" },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2" },
  submitted: { label: "Submitted", color: "#7c3aed", bg: "#ede9fe" },
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

function DateCell({ date }) {
  if (!date)
    return (
      <Typography
        variant="body2"
        sx={{ fontSize: "0.82rem", color: "#9ca3af" }}
      >
        —
      </Typography>
    );
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: "#9ca3af" }} />
      <Typography
        variant="body2"
        sx={{ fontSize: "0.82rem", color: "#6b7280" }}
      >
        {new Date(date).toLocaleDateString()}
      </Typography>
    </Box>
  );
}

function StatCard({ label, value, icon: Icon, color, loading }) {
  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{ borderRadius: 2, height: "100%", width: "100%" }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <CircularProgress size={32} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ borderRadius: 2, height: "100%", width: "272px" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{ fontSize: 24, fontWeight: 700, color: "#1a4a5c" }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: `${color}10`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AssignedChecklist() {
  const navigate = useNavigate();
  const { authRequest } = useAuth();
  const { getChecklistAnalytics, loading: assignmentLoading } = useAssignment();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", "/assignments");
      if (response.success) {
        setAssignments(response.assignments || []);
        if (response.stats) {
          setStats({
            total: response.stats.total || 0,
            pending: response.stats.pending || 0,
            inProgress: response.stats.inProgress || 0,
            completed: response.stats.completed || 0,
            overdue: response.stats.overdue || 0,
          });
        }
      } else {
        setError(response.message || "Failed to fetch assignments");
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(err.message || "Failed to load assignments");
      setSnackbar({
        open: true,
        message: err.message || "Failed to load assignments",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authRequest]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
  };

  // Handle view details - Navigate to assignment details page
  const handleViewDetails = (assignment) => {
    const assignmentId = assignment._id;
    if (assignmentId) {
      navigate(`/admin/assignment-details/${assignmentId}`);
    } else {
      setSnackbar({
        open: true,
        message: "Assignment ID not found",
        severity: "error",
      });
    }
  };

  // Handle view analytics
  const handleViewAnalytics = (assignment) => {
    const checklistId = assignment.checklist?._id || assignment.checklistId;
    if (checklistId) {
      navigate(`/admin/checklist-analytics/${checklistId}`);
    } else {
      setSnackbar({
        open: true,
        message: "Checklist ID not found",
        severity: "error",
      });
    }
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
          item.primaryMember?.email?.toLowerCase().includes(searchLower) ||
          item.assetName?.toLowerCase().includes(searchLower),
      );
    }

    if (statusFilter !== "all") {
      data = data.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    return data;
  }, [assignments, search, statusFilter]);

  const paginatedAssignments = filteredAssignments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const statCards = [
    {
      label: "Total Assigned",
      value: stats.total,
      icon: AssignmentOutlinedIcon,
      color: "#1a4a5c",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: HourglassTopOutlinedIcon,
      color: "#2563eb",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircleOutlineIcon,
      color: "#059669",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: ErrorOutlineIcon,
      color: "#dc2626",
    },
  ];

  // Mobile card view for assignments
  const AssignmentCard = ({ item }) => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Typography
          sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a4a5c" }}
        >
          {item.checklist?.name || "—"}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View Details" arrow>
            <IconButton
              size="small"
              onClick={() => handleViewDetails(item)}
              sx={{ borderRadius: 1 }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 16, color: "#1a4a5c" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Analytics" arrow>
            <IconButton
              size="small"
              onClick={() => handleViewAnalytics(item)}
              sx={{ borderRadius: 1 }}
            >
              <BarChartOutlinedIcon sx={{ fontSize: 16, color: "#1a4a5c" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            Customer
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
            {item.customerName || "—"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            Assigned To
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
          >
            <Avatar
              sx={{
                width: 20,
                height: 20,
                fontSize: "0.6rem",
                bgcolor: "#1a4a5c20",
                color: "#1a4a5c",
              }}
            >
              {item.primaryMember?.email?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              {item.primaryMember?.email?.split("@")[0] || "—"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            Due Date
          </Typography>
          <DateCell date={item.dueDate} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            Priority
          </Typography>
          <Box mt={0.5}>
            <PriorityChip priority={item.priority} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            Status
          </Typography>
          <Box mt={0.5}>
            <StatusChip status={item.status} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", p: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.5rem" },
                  fontWeight: 700,
                  color: "#1a4a5c",
                }}
              >
                Assigned Checklists
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  mt: 0.5,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Track and manage all checklist assignments
              </Typography>
            </Box>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={refreshing}>
                <RefreshIcon sx={{ color: "#1a4a5c" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((card, idx) => (
            <Grid item xs={6} sm={6} md={3} key={idx}>
              <StatCard {...card} loading={loading} />
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: 2,
            borderRadius: 2,
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder={
              isMobile
                ? "Search..."
                : "Search by checklist name, customer, or team member..."
            }
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ flex: 1, minWidth: { xs: "100%", sm: 220 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 17, color: "#9ca3af" }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 140 } }}>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              displayEmpty
              startAdornment={
                <FilterListIcon
                  sx={{ fontSize: 16, color: "#9ca3af", mr: 0.5 }}
                />
              }
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Table/Card View */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#1a4a5c" }} />
          </Box>
        ) : paginatedAssignments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography sx={{ color: "#9ca3af" }}>
              {search || statusFilter !== "all"
                ? "No matching assignments found"
                : "No assignments found"}
            </Typography>
          </Paper>
        ) : isMobile ? (
          // Mobile Card View
          <Box>
            {paginatedAssignments.map((item) => (
              <AssignmentCard key={item._id} item={item} />
            ))}
          </Box>
        ) : (
          // Desktop Table View
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Checklist Name</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssignments.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            color: "#1a4a5c",
                          }}
                        >
                          {item.checklist?.name || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.85rem" }}>
                          {item.customerName || "—"}
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
                              bgcolor: "#1a4a5c20",
                              color: "#1a4a5c",
                            }}
                          >
                            {item.primaryMember?.email
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </Avatar>
                          <Typography sx={{ fontSize: "0.85rem" }}>
                            {item.primaryMember?.email?.split("@")[0] || "—"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <DateCell date={item.dueDate} />
                      </TableCell>
                      <TableCell>
                        <PriorityChip priority={item.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={item.status} />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="View Details" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(item)}
                              sx={{
                                borderRadius: 1,
                                border: "1px solid #e5e7eb",
                                "&:hover": { bgcolor: "#f3f4f6" },
                              }}
                            >
                              <VisibilityOutlinedIcon
                                sx={{ fontSize: 16, color: "#1a4a5c" }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Analytics" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewAnalytics(item)}
                              sx={{
                                borderRadius: 1,
                                border: "1px solid #e5e7eb",
                                "&:hover": { bgcolor: "#f3f4f6" },
                              }}
                            >
                              <BarChartOutlinedIcon
                                sx={{ fontSize: 16, color: "#1a4a5c" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
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
              sx={{
                "& .MuiTablePagination-toolbar": {
                  fontSize: "0.82rem",
                  flexWrap: "wrap",
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    fontSize: { xs: "0.7rem", sm: "0.82rem" },
                  },
              }}
            />
          </Paper>
        )}
      </Box>

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
    </ThemeProvider>
  );
}
