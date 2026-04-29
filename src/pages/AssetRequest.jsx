// pages/AssetRequests.jsx (Admin View - Updated with Reject Reason and No View Details)
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Avatar,
  Tabs,
  Tab,
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
  TextareaAutosize,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { useAssetRequest } from "../context/AssetRequestContext";
import { useNavigate } from "react-router-dom";

const C = {
  navy: "#0f4c61",
  ink: "#1a2e3b",
  muted: "#64748b",
  ghost: "#94a3b8",
  border: "#e8edf2",
  white: "#ffffff",
  bg: "#f3f5f8",
  surface: "#f8fafc",
  green: "#16a34a",
  greenBg: "#dcfce7",
  red: "#ef4444",
  amber: "#f59e0b",
};

const PageWrap = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(3, 4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: C.muted,
  minHeight: 40,
  padding: "6px 18px",
  borderRadius: 8,
  "&.Mui-selected": { color: C.navy },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
    padding: "4px 12px",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    background: C.white,
    fontSize: "0.82rem",
    height: 40,
    "& fieldset": { borderColor: C.border },
    "&:hover fieldset": { borderColor: alpha(C.navy, 0.3) },
    "&.Mui-focused fieldset": { borderColor: C.navy, borderWidth: 1.5 },
  },
}));

const RequestCard = styled(Paper)(({ theme }) => ({
  borderRadius: 14,
  background: C.white,
  width: "360px",
  border: `1px solid ${C.border}`,
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: 10,
  transition: "all 0.18s ease",
  height: "100%",
  "&:hover": {
    boxShadow: "0 4px 16px rgba(15,76,97,0.1)",
    borderColor: alpha(C.navy, 0.2),
    transform: "translateY(-2px)",
  },
}));

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "#fef3c7",
    color: "#d97706",
    border: "#fde68a",
  },
  approved: {
    label: "Approved",
    bg: "#dcfce7",
    color: "#16a34a",
    border: "#bbf7d0",
  },
  rejected: {
    label: "Rejected",
    bg: "#fee2e2",
    color: "#dc2626",
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
        fontWeight: 700,
        fontSize: "0.68rem",
        height: 24,
        borderRadius: "20px",
        border: `1px solid ${s.border}`,
        "& .MuiChip-label": { px: "10px" },
      }}
    />
  );
};

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

const AssetRequests = ({ onBack }) => {
  const navigate = useNavigate();
  const {
    getParentRequests,
    getChildRequests,
    reviewRequest,
    loading,
    pagination,
  } = useAssetRequest();

  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [parentRequests, setParentRequests] = useState([]);
  const [childRequests, setChildRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [actionLoading, setActionLoading] = useState({});
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadRequests = useCallback(async () => {
    try {
      const [parents, children] = await Promise.all([
        getParentRequests({ page: page + 1, limit: rowsPerPage }),
        getChildRequests({ page: page + 1, limit: rowsPerPage }),
      ]);
      setParentRequests(parents?.requests || []);
      setChildRequests(children?.requests || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load requests",
        severity: "error",
      });
    }
  }, [getParentRequests, getChildRequests, page, rowsPerPage]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests, tab]);

  const currentList = useMemo(() => {
    const base = tab === 0 ? parentRequests : childRequests;
    return base.filter((r) => {
      const matchesSearch =
        !search ||
        r.assetName?.toLowerCase().includes(search.toLowerCase()) ||
        r.requestedByName?.toLowerCase().includes(search.toLowerCase()) ||
        r.category?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tab, parentRequests, childRequests, search, statusFilter]);

  const stats = useMemo(
    () => ({
      pending: [...parentRequests, ...childRequests].filter(
        (r) => r.status === "pending",
      ).length,
      approved: [...parentRequests, ...childRequests].filter(
        (r) => r.status === "approved",
      ).length,
      rejected: [...parentRequests, ...childRequests].filter(
        (r) => r.status === "rejected",
      ).length,
    }),
    [parentRequests, childRequests],
  );

  const handleApprove = async (req) => {
    setActionLoading((prev) => ({ ...prev, [req._id]: true }));
    try {
      await reviewRequest(req._id, "approve");
      setSnackbar({
        open: true,
        message: "Request approved successfully!",
        severity: "success",
      });
      await loadRequests();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to approve",
        severity: "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [req._id]: false }));
    }
  };

  const openRejectDialog = (req) => {
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
        message: "Request rejected successfully",
        severity: "success",
      });
      await loadRequests();
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to reject",
        severity: "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [selectedRequest._id]: false }));
    }
  };

  const handleCreateRequest = () => {
    navigate("/admin/asset-requests/create");
  };

  const RequestCardComponent = ({ req }) => (
    <RequestCard>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: C.navy,
              fontSize: "0.7rem",
              fontWeight: 700,
            }}
          >
            {getInitials(req.requestedByName || req.requestedBy?.email)}
          </Avatar>
          <Box>
            <Typography
              sx={{ fontSize: "0.75rem", fontWeight: 700, color: C.ink }}
            >
              {req.requestedByName ||
                req.requestedBy?.email?.split("@")[0] ||
                "Unknown"}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: C.muted }}>
              {req.requestedByRole || "Team"}
            </Typography>
          </Box>
        </Box>
        <StatusBadge status={req.status} />
      </Box>

      <Box>
        <Typography
          sx={{ fontSize: "0.9rem", fontWeight: 800, color: C.ink, mb: 0.5 }}
        >
          {req.assetName}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 0.8,
            flexWrap: "wrap",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Chip
            label={req.category}
            size="small"
            sx={{
              bgcolor: C.surface,
              color: C.navy,
              fontWeight: 600,
              fontSize: "0.65rem",
              height: 20,
            }}
          />
          <Typography sx={{ fontSize: "0.65rem", color: C.ghost }}>
            ID: {req._id?.slice(-6)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: "0.7rem", color: C.ghost }} />
          <Typography variant="caption" color="text.secondary">
            {req.location || "N/A"}
          </Typography>
          <Box sx={{ mx: 0.5, color: C.border }}>·</Box>
          <CalendarTodayOutlinedIcon
            sx={{ fontSize: "0.7rem", color: C.ghost }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatDate(req.requestedAt)}
          </Typography>
        </Box>
      </Box>

      {req.status === "pending" && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            pt: 1,
            borderTop: `1px solid ${C.border}`,
            mt: 1,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => openRejectDialog(req)}
            disabled={actionLoading[req._id]}
            startIcon={<CloseIcon />}
            sx={{
              textTransform: "none",
              fontSize: "0.7rem",
              borderRadius: 2,
              borderColor: C.red,
              color: C.red,
              "&:hover": {
                borderColor: C.red,
                bgcolor: alpha(C.red, 0.05),
              },
            }}
          >
            Reject
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={() => handleApprove(req)}
            disabled={actionLoading[req._id]}
            startIcon={<CheckIcon />}
            sx={{
              textTransform: "none",
              fontSize: "0.7rem",
              borderRadius: 2,
              bgcolor: C.green,
              "&:hover": { bgcolor: alpha(C.green, 0.85) },
            }}
          >
            {actionLoading[req._id] ? (
              <CircularProgress size={16} sx={{ color: C.white }} />
            ) : (
              "Approve"
            )}
          </Button>
        </Box>
      )}

      {req.status !== "pending" && (
        <Box
          sx={{
            pt: 1,
            borderTop: `1px solid ${C.border}`,
            mt: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color={C.muted}>
            {req.status === "approved" ? "✓ Approved" : "✗ Rejected"}
            {req.status === "rejected" && req.rejectionReason && (
              <Typography
                component="span"
                variant="caption"
                sx={{ display: "block", mt: 0.5, fontSize: "0.65rem" }}
              >
                Reason: {req.rejectionReason}
              </Typography>
            )}
            {req.status === "approved" && req.approvedAt && (
              <Typography
                component="span"
                variant="caption"
                sx={{ display: "block", mt: 0.5, fontSize: "0.65rem" }}
              >
                {formatDate(req.approvedAt)}
              </Typography>
            )}
          </Typography>
        </Box>
      )}
    </RequestCard>
  );

  return (
    <PageWrap>
      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.1rem", fontWeight: 700, color: C.red }}>
          Reject Asset Request
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to reject this request? Please provide a reason.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: C.border },
                "&:hover fieldset": { borderColor: C.red },
                "&.Mui-focused fieldset": { borderColor: C.red },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setRejectDialogOpen(false)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            startIcon={<CloseIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              bgcolor: C.red,
              "&:hover": { bgcolor: alpha(C.red, 0.85) },
            }}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

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
          <IconButton size="small" onClick={onBack} sx={{ color: C.muted }}>
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
            <Typography sx={{ fontSize: "0.8rem", color: C.muted }}>
              Review and manage asset addition requests from team members
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={loadRequests}
            sx={{ bgcolor: C.white, border: `1px solid ${C.border}` }}
          >
            <RefreshIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateRequest}
            sx={{
              bgcolor: C.navy,
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: alpha(C.navy, 0.85) },
            }}
          >
            Add Asset Request
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2.5, overflowX: "auto" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setPage(0);
          }}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: 40,
            background: C.white,
            borderRadius: 2.5,
            border: `1px solid ${C.border}`,
            display: "inline-flex",
            p: 0.5,
          }}
        >
          <StyledTab label="Parent Asset Requests" />
          <StyledTab label="Child Asset Requests" />
        </Tabs>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Pending" value={stats.pending} color={C.amber} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Approved" value={stats.approved} color={C.green} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Rejected" value={stats.rejected} color={C.red} />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
        <SearchField
          fullWidth
          placeholder="Search by asset name, category, or requester..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: "0.95rem", color: C.ghost }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 140 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            size="small"
            sx={{ borderRadius: 2, bgcolor: C.white }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {currentList.map((req) => (
              <Grid item xs={12} sm={6} md={4} key={req._id}>
                <RequestCardComponent req={req} />
              </Grid>
            ))}
          </Grid>

          {currentList.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8, color: C.ghost }}>
              <Typography>No requests found</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleCreateRequest}
                sx={{ mt: 2 }}
              >
                Create New Request
              </Button>
            </Box>
          )}

          <TablePagination
            component="div"
            count={pagination.total || 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{ mt: 2 }}
          />
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageWrap>
  );
};

const StatCard = ({ title, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 2,
      width: "362px",
      border: `1px solid ${C.border}`,
      bgcolor: C.white,
    }}
  >
    <Typography variant="caption" color="text.secondary" fontWeight={600}>
      {title}
    </Typography>
    <Typography variant="h5" fontWeight={800} color={color}>
      {value}
    </Typography>
  </Paper>
);

export default AssetRequests;