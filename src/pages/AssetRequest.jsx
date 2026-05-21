// pages/AssetRequest.jsx - Table Format with Role-Based Access Control

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  DialogContentText,
  TextField,Tab,
  Select,Tabs,
  MenuItem,Grid,
  FormControl,
  InputAdornment,
  Avatar,
  IconButton,
  alpha,
  CircularProgress,
  Snackbar,
  Alert,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  LinearProgress,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ShareIcon from "@mui/icons-material/Share";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useAssetRequest } from "../context/AssetRequestContext";
import { useAuth } from "../context/AuthContexts";
import { useNavigate } from "react-router-dom";

// Color Constants
const C = {
  navy: "#0f4c61",
  ink: "#1a2e3b",
  muted: "#64748b",
  ghost: "#94a3b8",
  border: "#e8edf2",
  white: "#ffffff",
  surface: "#f8fafc",
  green: "#16a34a",
  greenBg: "#dcfce7",
  red: "#ef4444",
  redBg: "#fee2e2",
  amber: "#f59e0b",
  amberBg: "#fef3c7",
  purple: "#7c3aed",
  purpleBg: "#ede9fe",
};

// Styled Components
const PageWrap = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(3, 4),
  background: C.surface,
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
}));

const SearchField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    background: C.white,
    fontSize: "0.82rem",
    height: 40,
    "& fieldset": { borderColor: C.border },
    "&:hover fieldset": { borderColor: alpha(C.navy, 0.3) },
    "&.Mui-focused fieldset": { borderColor: C.navy, borderWidth: 1.5 },
  },
});

// Status Configuration
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: C.amberBg,
    color: C.amber,
    border: "#fde68a",
  },
  approved: {
    label: "Approved",
    bg: C.greenBg,
    color: C.green,
    border: "#bbf7d0",
  },
  rejected: {
    label: "Rejected",
    bg: C.redBg,
    color: C.red,
    border: "#fecaca",
  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 600,
        fontSize: "0.7rem",
        height: 26,
        borderRadius: "20px",
        border: `1px solid ${s.border}`,
        "& .MuiChip-label": { px: "10px" },
      }}
    />
  );
};

// Helper Functions
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatRelativeTime = (date) => {
  if (!date) return "N/A";
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return formatDate(date);
};

// Main Component
const AssetRequests = () => {
  const navigate = useNavigate();
  const {
    getParentRequests,
    getChildRequests,
    reviewRequest,
    loading,
    pagination,
  } = useAssetRequest();
  const { user } = useAuth();

  // Role-based access
  const isTeam = user?.role === "team";
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const userId = user?._id;

  // State
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [parentRequests, setParentRequests] = useState([]);
  const [childRequests, setChildRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [actionLoading, setActionLoading] = useState({});
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load requests with role-based filtering
  const loadRequests = useCallback(async () => {
    try {
      const filters = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: orderBy,
        sortOrder: order,
      };

      if (statusFilter !== "all") filters.status = statusFilter;
      if (search) filters.search = search;

      // Role-based data fetching
      let parents = [];
      let children = [];

      if (isAdmin) {
        // Admin sees all requests
        const [parentsRes, childrenRes] = await Promise.all([
          getParentRequests(filters),
          getChildRequests(filters),
        ]);
        parents = parentsRes?.requests || [];
        children = childrenRes?.requests || [];
      } else if (isTeam) {
        // Team sees only their own requests
        filters.createdBy = userId;
        const [parentsRes, childrenRes] = await Promise.all([
          getParentRequests(filters),
          getChildRequests(filters),
        ]);
        parents = parentsRes?.requests || [];
        children = childrenRes?.requests || [];
      }

      setParentRequests(parents);
      setChildRequests(children);
    } catch (error) {
      console.error("Error loading requests:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to load requests",
        severity: "error",
      });
    }
  }, [
    getParentRequests,
    getChildRequests,
    page,
    rowsPerPage,
    orderBy,
    order,
    statusFilter,
    search,
    isAdmin,
    isTeam,
    userId,
  ]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Sort and filter current list
  const currentList = useMemo(() => {
    let list = tab === 0 ? [...parentRequests] : [...childRequests];

    // Apply status filter
    if (statusFilter !== "all") {
      list = list.filter((r) => r.requestStatus === statusFilter);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.assetName?.toLowerCase().includes(searchLower) ||
          r.assetId?.toLowerCase().includes(searchLower) ||
          r.assetCategory?.toLowerCase().includes(searchLower) ||
          r.serialNumber?.toLowerCase().includes(searchLower) ||
          r.createdBy?.firstName?.toLowerCase().includes(searchLower) ||
          r.createdBy?.email?.toLowerCase().includes(searchLower),
      );
    }

    // Sort
    list.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (orderBy === "createdAt") {
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
      }

      if (orderBy === "assetName") {
        aVal = a.assetName?.toLowerCase() || "";
        bVal = b.assetName?.toLowerCase() || "";
      }

      if (orderBy === "requester") {
        aVal = (
          a.createdBy?.firstName ||
          a.createdBy?.email ||
          ""
        ).toLowerCase();
        bVal = (
          b.createdBy?.firstName ||
          b.createdBy?.email ||
          ""
        ).toLowerCase();
      }

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [
    tab,
    parentRequests,
    childRequests,
    statusFilter,
    search,
    orderBy,
    order,
  ]);

  // Paginated list
  const paginatedList = currentList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Statistics based on role
  const stats = useMemo(() => {
    const all = [...parentRequests, ...childRequests];
    return {
      pending: all.filter((r) => r.requestStatus === "pending").length,
      approved: all.filter((r) => r.requestStatus === "approved").length,
      rejected: all.filter((r) => r.requestStatus === "rejected").length,
      total: all.length,
    };
  }, [parentRequests, childRequests]);

  // Action Handlers
  const handleApprove = async (req) => {
    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: "Only administrators can approve requests",
        severity: "error",
      });
      return;
    }

    setActionLoading((prev) => ({ ...prev, [req._id]: true }));
    try {
      await reviewRequest(req._id, "approve");
      setSnackbar({
        open: true,
        message: `"${req.assetName}" approved successfully!`,
        severity: "success",
      });
      await loadRequests();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to approve request",
        severity: "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [req._id]: false }));
    }
  };

  const openRejectDialog = (req) => {
    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: "Only administrators can reject requests",
        severity: "error",
      });
      return;
    }
    setSelectedRequest(req);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      setSnackbar({
        open: true,
        message: "Please provide a rejection reason",
        severity: "error",
      });
      return;
    }
    if (!selectedRequest) return;

    setActionLoading((prev) => ({ ...prev, [selectedRequest._id]: true }));
    try {
      await reviewRequest(selectedRequest._id, "reject", rejectionReason);
      setSnackbar({
        open: true,
        message: `"${selectedRequest.assetName}" rejected`,
        severity: "success",
      });
      await loadRequests();
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to reject request",
        severity: "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [selectedRequest._id]: false }));
    }
  };

  const handleViewDetails = (req) => {
    navigate(`/admin/asset-requests/${req._id}`);
  };

  const handleCreateRequest = () => {
    if (isTeam) {
      navigate("/team/asset-requests/create");
    } else {
      navigate("/admin/asset-requests/create");
    }
  };

  const handleBack = () => {
    if (isTeam) {
      navigate("/team/assets");
    } else {
      navigate("/admin/assets");
    }
  };

  const handleRefresh = () => {
    setPage(0);
    loadRequests();
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0);
  };

  // Get requester display name
  const getRequesterName = (req) => {
    if (req.createdBy?.firstName) {
      return `${req.createdBy.firstName} ${req.createdBy.lastName || ""}`.trim();
    }
    return req.createdBy?.email?.split("@")[0] || "Unknown";
  };

  // Get health score color
  const getHealthColor = (score) => {
    if (score >= 70) return C.green;
    if (score >= 40) return C.amber;
    return C.red;
  };

  return (
    <PageWrap>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            onClick={handleBack}
            sx={{
              color: C.muted,
              bgcolor: C.white,
              border: `1px solid ${C.border}`,
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                fontWeight: 800,
                color: C.ink,
              }}
            >
              Asset Requests
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: C.muted, mt: 0.25 }}>
              {isAdmin
                ? "Review and manage all asset requests from team members"
                : "Track and manage your asset requests"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{ bgcolor: C.white, border: `1px solid ${C.border}` }}
            >
              {loading ? (
                <CircularProgress size={18} />
              ) : (
                <RefreshIcon sx={{ fontSize: "1.1rem" }} />
              )}
            </IconButton>
          </Tooltip>

          {isTeam && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateRequest}
              sx={{
                bgcolor: C.navy,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": { bgcolor: alpha(C.navy, 0.9) },
              }}
            >
              New Request
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3} sx={{width:"277px"}}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${C.border}`,
              bgcolor: C.white,
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", color: C.muted, mb: 0.5 }}>
              Total Requests
            </Typography>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: 800, color: C.ink }}
            >
              {stats.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3} sx={{width:"277px"}}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${C.amberBg}`,
              bgcolor: C.amberBg,
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", color: C.amber, mb: 0.5 }}>
              Pending
            </Typography>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: 800, color: C.amber }}
            >
              {stats.pending}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3} sx={{width:"277px"}}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${C.greenBg}`,
              bgcolor: C.greenBg,
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", color: C.green, mb: 0.5 }}>
              Approved
            </Typography>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: 800, color: C.green }}
            >
              {stats.approved}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3} sx={{width:"277px"}}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${C.redBg}`,
              bgcolor: C.redBg,
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", color: C.red, mb: 0.5 }}>
              Rejected
            </Typography>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: 800, color: C.red }}
            >
              {stats.rejected}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ mb: 2.5 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setPage(0);
          }}
          sx={{
            minHeight: 40,
            "& .MuiTabs-indicator": { bgcolor: C.navy, height: 3 },
          }}
        >
          <Tab
            icon={<AccountTreeIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={`Parent Requests (${parentRequests.length})`}
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            icon={<ShareIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={`Child Requests (${childRequests.length})`}
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
        </Tabs>
      </Box>

      {/* Search & Filter */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          p: 2,
          mb: 3,
          bgcolor: C.white,
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <SearchField
            fullWidth
            placeholder="Search by asset name, ID, category, serial number, or requester..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ flex: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "0.95rem", color: C.ghost }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 160 }}>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              displayEmpty
              size="small"
              sx={{ borderRadius: 2, bgcolor: C.surface, height: 40 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: C.white,
        }}
      >
        <TableContainer
          sx={{ maxHeight: "calc(100vh - 420px)", overflowX: "auto" }}
        >
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: C.surface }}>
                <TableCell
                  sx={{ fontWeight: 700, color: C.ink, fontSize: 0.75 }}
                >
                  <TableSortLabel
                    active={orderBy === "requester"}
                    direction={orderBy === "requester" ? order : "asc"}
                    onClick={() => handleSort("requester")}
                  >
                    Requester
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.ink, fontSize: 0.75 }}
                >
                  <TableSortLabel
                    active={orderBy === "assetName"}
                    direction={orderBy === "assetName" ? order : "asc"}
                    onClick={() => handleSort("assetName")}
                  >
                    Asset
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.ink, fontSize: 0.75 }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.ink, fontSize: 0.75 }}
                >
                  Location
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.ink, fontSize: 0.75 }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.ink, fontSize: 0.75 }}
                >
                  Health
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.ink, fontSize: 0.75 }}
                >
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleSort("createdAt")}
                  >
                    Requested
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.ink, fontSize: 0.75 }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <CircularProgress sx={{ color: C.navy }} />
                  </TableCell>
                </TableRow>
              ) : paginatedList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography color={C.muted}>
                      {search || statusFilter !== "all"
                        ? "No requests match your search criteria"
                        : isTeam
                          ? "You haven't created any asset requests yet"
                          : "No requests have been submitted yet"}
                    </Typography>
                    {isTeam && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleCreateRequest}
                        sx={{ mt: 2, borderColor: C.navy, color: C.navy }}
                      >
                        Create Your First Request
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedList.map((req) => {
                  const isPending = req.requestStatus === "pending";
                  const canAct = isAdmin && isPending;

                  return (
                    <TableRow
                      key={req._id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: alpha(C.navy, 0.02) },
                        opacity: req.requestStatus === "rejected" ? 0.7 : 1,
                      }}
                    >
                      {/* Requester */}
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: tab === 0 ? C.navy : C.purple,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            }}
                          >
                            {getInitials(getRequesterName(req))}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: C.ink,
                              }}
                            >
                              {getRequesterName(req)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Asset */}
                      <TableCell>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: C.ink,
                            }}
                          >
                            {req.assetName}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.65rem",
                              color: C.ghost,
                              fontFamily: "monospace",
                            }}
                          >
                            ID: {req.assetId || req._id?.slice(-6)}
                          </Typography>
                          {req.serialNumber && (
                            <Typography
                              sx={{ fontSize: "0.6rem", color: C.ghost }}
                            >
                              SN: {req.serialNumber}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Chip
                          label={req.assetCategory || "N/A"}
                          size="small"
                          sx={{
                            bgcolor: C.surface,
                            color: C.navy,
                            fontSize: "0.65rem",
                            height: 24,
                          }}
                        />
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <LocationOnOutlinedIcon
                            sx={{ fontSize: 14, color: C.ghost }}
                          />
                          <Typography
                            sx={{ fontSize: "0.7rem", color: C.muted }}
                          >
                            {req.currentLocation || "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={req.requestStatus} />
                        {req.requestStatus === "rejected" &&
                          req.rejectionReason && (
                            <Tooltip title={req.rejectionReason}>
                              <Chip
                                label="Reason"
                                size="small"
                                sx={{
                                  mt: 0.5,
                                  height: 18,
                                  fontSize: "0.6rem",
                                  bgcolor: C.redBg,
                                  color: C.red,
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          )}
                      </TableCell>

                      {/* Health Score */}
                      <TableCell>
                        {req.healthScore ? (
                          <Box sx={{ width: 80 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={req.healthScore}
                                sx={{
                                  flex: 1,
                                  height: 4,
                                  borderRadius: 2,
                                  bgcolor: C.border,
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor: getHealthColor(req.healthScore),
                                  },
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  color: C.ink,
                                }}
                              >
                                {req.healthScore}%
                              </Typography>
                            </Stack>
                          </Box>
                        ) : (
                          <Typography
                            sx={{ fontSize: "0.7rem", color: C.ghost }}
                          >
                            N/A
                          </Typography>
                        )}
                      </TableCell>

                      {/* Requested Date */}
                      <TableCell>
                        <Tooltip title={formatDate(req.createdAt)}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <CalendarTodayOutlinedIcon
                              sx={{ fontSize: 12, color: C.ghost }}
                            />
                            <Typography
                              sx={{ fontSize: "0.7rem", color: C.muted }}
                            >
                              {formatRelativeTime(req.createdAt)}
                            </Typography>
                          </Stack>
                        </Tooltip>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(req)}
                              sx={{ color: C.navy }}
                            >
                              <VisibilityIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>

                          {canAct && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  onClick={() => handleApprove(req)}
                                  disabled={actionLoading[req._id]}
                                  sx={{ color: C.green }}
                                >
                                  {actionLoading[req._id] ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <CheckIcon sx={{ fontSize: "1rem" }} />
                                  )}
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  onClick={() => openRejectDialog(req)}
                                  disabled={actionLoading[req._id]}
                                  sx={{ color: C.red }}
                                >
                                  <CloseIcon sx={{ fontSize: "1rem" }} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {currentList.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={currentList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              borderTop: `1px solid ${C.border}`,
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: "0.7rem",
                },
            }}
          />
        )}
      </Paper>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: C.ink }}>
          Reject Asset Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, color: C.muted }}>
            Please provide a reason for rejecting "{selectedRequest?.assetName}
            ".
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
            required
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setRejectDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageWrap>
  );
};

export default AssetRequests;
