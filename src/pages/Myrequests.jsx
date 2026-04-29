// pages/MyRequests.jsx (Team View - No Details View)
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Grid,
  Avatar,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  TablePagination,
  Button,
} from "@mui/material";
import {
  Search,
  Refresh,
  Assignment,
  Schedule,
  Warning,
  CheckCircle,
  Cancel,
  Add,
  LocationOn,
  CalendarToday,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAssetRequest } from "../context/AssetRequestContext";
import { useNavigate } from "react-router-dom";

// Design Tokens
const C = {
  navy: "#0d4f6b",
  ink: "#1a2332",
  muted: "#64748b",
  ghost: "#9aa5b1",
  border: "#eef0f4",
  white: "#ffffff",
  bg: "#f7f8fc",
  green: "#2e7d32",
  red: "#c62828",
  amber: "#ed6c02",
};

const StyledCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  width:"360px",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}));

const StatusChip = ({ status }) => {
  const config = {
    pending: {
      bg: "#fef3c7",
      color: "#d97706",
      label: "Pending",
      icon: <Schedule sx={{ fontSize: 14 }} />,
    },
    approved: {
      bg: "#dcfce7",
      color: "#16a34a",
      label: "Approved",
      icon: <CheckCircle sx={{ fontSize: 14 }} />,
    },
    rejected: {
      bg: "#fee2e2",
      color: "#dc2626",
      label: "Rejected",
      icon: <Cancel sx={{ fontSize: 14 }} />,
    },
  };
  const cfg = config[status] || config.pending;
  return (
    <Chip
      icon={cfg.icon}
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 600,
        fontSize: 11,
        height: 24,
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

const StatCard = ({ title, value, color, icon: Icon }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      width:"272px",
      borderRadius: 3,
      border: `1px solid ${C.border}`,
      bgcolor: C.white,
    }}
  >
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={1}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          bgcolor: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ fontSize: 18, color }} />
      </Box>
    </Box>
    <Typography variant="h4" fontWeight={700} color={C.ink}>
      {value}
    </Typography>
  </Paper>
);

export default function MyRequests() {
  const navigate = useNavigate();
  const { getMyRequests, requests, loading, pagination } = useAssetRequest();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20); // Changed to match API default limit
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadMyRequests = useCallback(async () => {
    try {
      const result = await getMyRequests({ page: page + 1, limit: rowsPerPage });
      if (result && result.requests) {
        console.log("Requests loaded:", result.requests.length);
      }
    } catch (error) {
      console.error("Load requests error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to load requests",
        severity: "error",
      });
    }
  }, [getMyRequests, page, rowsPerPage]);

  useEffect(() => {
    loadMyRequests();
  }, [loadMyRequests]);

  const handleCreateRequest = () => {
    navigate("/team/asset-requests/create");
  };

  const filteredRequests = requests
    .filter((req) => {
      if (tabValue === 1 && req.status !== "pending") return false;
      if (tabValue === 2 && req.status !== "approved") return false;
      if (tabValue === 3 && req.status !== "rejected") return false;
      return true;
    })
    .filter((req) => {
      if (!searchQuery) return true;
      return (
        req.assetName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .filter((req) => {
      if (statusFilter === "all") return true;
      return req.status === statusFilter;
    });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  // Debug log to see what data we have
  console.log("Requests data:", requests);
  console.log("Filtered requests:", filteredRequests);
  console.log("Stats:", stats);

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{ borderRadius: 3, p: 3, mb: 3, border: `1px solid ${C.border}` }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              color={C.ink}
              gutterBottom
            >
              My Asset Requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track and manage your asset addition requests
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={loadMyRequests}
                sx={{ bgcolor: C.bg, borderRadius: 2 }}
              >
                <Refresh sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateRequest}
              sx={{ bgcolor: C.navy, textTransform: "none", borderRadius: 2 }}
            >
              Add Asset Request
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ borderBottom: `1px solid ${C.border}`, mt: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: 13,
                minHeight: 48,
              },
              "& .Mui-selected": { color: C.navy },
              "& .MuiTabs-indicator": { bgcolor: C.navy },
            }}
          >
            <Tab label={`All (${stats.total})`} />
            <Tab label={`Pending (${stats.pending})`} />
            <Tab label={`Approved (${stats.approved})`} />
            <Tab label={`Rejected (${stats.rejected})`} />
          </Tabs>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 2 }}
        >
          <TextField
            size="small"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: C.ghost }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: C.bg },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              sx={{ borderRadius: 2, bgcolor: C.bg }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Total Requests"
            value={stats.total}
            color={C.navy}
            icon={Assignment}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            color={C.amber}
            icon={Schedule}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Approved"
            value={stats.approved}
            color={C.green}
            icon={CheckCircle}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Rejected"
            value={stats.rejected}
            color={C.red}
            icon={Warning}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredRequests.length === 0 ? (
            <Paper
              elevation={0}
              sx={{ p: 6, textAlign: "center", borderRadius: 3 }}
            >
              <Assignment sx={{ fontSize: 48, color: C.ghost, mb: 2 }} />
              <Typography color="text.secondary" gutterBottom>
                No requests found
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 2 }}
              >
                Create your first asset request to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateRequest}
                sx={{ mt: 1, bgcolor: C.navy, textTransform: "none" }}
              >
                Create Your First Request
              </Button>
            </Paper>
          ) : (
            filteredRequests.map((req) => (
              <StyledCard
                key={req._id}
                elevation={0}
                sx={{ border: `1px solid ${C.border}` }}
              >
                <Box sx={{ p: 2.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1.5}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: C.navy,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(
                          req.requestedByName || req.requestedBy?.email,
                        )}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color={C.ink}
                        >
                          {req.requestedByName ||
                            req.requestedBy?.email?.split("@")[0] ||
                            "You"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {req.requestedByRole || "Team Member"}
                        </Typography>
                      </Box>
                    </Stack>
                    <StatusChip status={req.status} />
                  </Stack>

                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color={C.ink}
                    mb={0.5}
                  >
                    {req.assetName}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={1.5}
                  >
                    <Chip
                      label={
                        req.requestType === "parent"
                          ? "Parent Asset"
                          : "Child Asset"
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          req.requestType === "parent" ? C.navy : C.amber,
                        color: C.white,
                        fontWeight: 600,
                        fontSize: 10,
                      }}
                    />
                    <Chip
                      label={req.category}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 10 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      ID: {req._id?.slice(-6)}
                    </Typography>
                  </Stack>

                  <Stack spacing={1} mb={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocationOn sx={{ fontSize: 14, color: C.ghost }} />
                      <Typography variant="caption" color="text.secondary">
                        {req.location || "N/A"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CalendarToday sx={{ fontSize: 14, color: C.ghost }} />
                      <Typography variant="caption" color="text.secondary">
                        Requested: {formatDate(req.requestedAt)}
                      </Typography>
                    </Stack>
                    {req.requiredByDate && (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Warning sx={{ fontSize: 14, color: C.ghost }} />
                        <Typography variant="caption" color="text.secondary">
                          Required by: {formatDate(req.requiredByDate)}
                        </Typography>
                      </Stack>
                    )}
                    {req.priority && (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          label={`Priority: ${req.priority}`}
                          size="small"
                          sx={{
                            bgcolor:
                              req.priority === "high"
                                ? "#fee2e2"
                                : req.priority === "medium"
                                  ? "#fef3c7"
                                  : "#dcfce7",
                            color:
                              req.priority === "high"
                                ? "#dc2626"
                                : req.priority === "medium"
                                  ? "#d97706"
                                  : "#16a34a",
                            fontWeight: 600,
                            fontSize: 10,
                          }}
                        />
                      </Stack>
                    )}
                  </Stack>

                  {req.status === "rejected" && req.rejectionReason && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1.5,
                        bgcolor: "#fee2e2",
                        borderRadius: 2,
                        border: `1px solid #fecaca`,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color={C.red}
                      >
                        Rejection Reason:
                      </Typography>
                      <Typography
                        variant="caption"
                        color={C.red}
                        display="block"
                      >
                        {req.rejectionReason}
                      </Typography>
                    </Box>
                  )}

                  {req.status === "approved" && req.approvedAt && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1.5,
                        bgcolor: "#dcfce7",
                        borderRadius: 2,
                        border: `1px solid #bbf7d0`,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color={C.green}
                      >
                        Approved on: {formatDate(req.approvedAt)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </StyledCard>
            ))
          )}

          {/* Pagination - Fixed comment issue */}
          {pagination.total > rowsPerPage && (
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
              rowsPerPageOptions={[5, 10, 20, 50]}
              sx={{ mt: 2 }}
            />
          )}
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
    </Box>
  );
}