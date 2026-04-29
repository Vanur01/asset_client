// pages/ClientManagement.jsx - Fully Responsive for All Devices
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  Modal,
  Fade,
  Backdrop,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  useTheme,
  useMediaQuery,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Skeleton,
  Zoom,
  InputAdornment,
  TablePagination,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Circle as CircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ErrorOutline as ErrorOutlineIcon,
  Inbox as InboxIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useClient } from "../context/ClientContext";

// ─── Color palette ──────────────────────────────────────────────────────────
const C = {
  primary: "#0d4a5c",
  primaryLight: "#e6f0f3",
  success: "#2e7d32",
  successLight: "#e8f5e9",
  warning: "#ed6c02",
  warningLight: "#fff4e5",
  error: "#d32f2f",
  errorLight: "#ffebea",
  surface: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  text: { primary: "#1e293b", secondary: "#475569", disabled: "#94a3b8" },
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

const getMembershipStyle = (plan = "") => {
  const map = {
    premium: { bg: "#fff4e5", color: "#ed6c02", label: "Premium" },
    standard: { bg: "#e6f0f3", color: "#0d4a5c", label: "Standard" },
    free: { bg: "#f0f3f5", color: "#5f6b7a", label: "Free" },
    enterprise: { bg: "#ede7f6", color: "#5e35b1", label: "Enterprise" },
  };
  return map[plan.toLowerCase()] || { bg: C.border, color: C.text.secondary, label: plan };
};

// ─── Loading Skeleton ────────────────────────────────────────────────────────
const ClientCardSkeleton = () => (
  <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, border: `1px solid ${C.border}` }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" height={16} />
      </Box>
      <Skeleton variant="circular" width={32} height={32} />
    </Box>
    <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
    <Skeleton variant="rounded" height={5} sx={{ borderRadius: 3, mb: 1.5 }} />
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Skeleton variant="rounded" width={70} height={32} />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
    </Box>
  </Paper>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ title, description, action }) => (
  <Box sx={{ textAlign: "center", py: { xs: 6, sm: 8, md: 10 }, px: 2 }}>
    <InboxIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: C.text.disabled, mb: 2 }} />
    <Typography variant="h6" sx={{ fontWeight: 600, color: C.text.primary, mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: C.text.secondary, mb: 3, maxWidth: 400, mx: "auto", fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
      {description}
    </Typography>
    {action && action}
  </Box>
);

// ─── Error State ─────────────────────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <Box sx={{ textAlign: "center", py: { xs: 6, sm: 8 }, px: 2 }}>
    <ErrorOutlineIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: C.error, mb: 2 }} />
    <Typography variant="h6" sx={{ fontWeight: 600, color: C.error, mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
      Failed to Load Clients
    </Typography>
    <Typography variant="body2" sx={{ color: C.text.secondary, mb: 3, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
      {message || "An error occurred while fetching clients."}
    </Typography>
    <Button variant="contained" onClick={onRetry} startIcon={<RefreshIcon />} sx={{ bgcolor: C.primary }}>
      Retry
    </Button>
  </Box>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, title, value, subtitle, color, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, bgcolor: C.card, border: `1px solid ${C.border}` }}>
        <Skeleton variant="circular" width={32} height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={28} sx={{ mt: 1 }} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: { xs: 2, sm: 3 },
        bgcolor: C.card,
        border: "1px solid",
        borderColor: C.border,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width:"270px",
        gap: 1,
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(13,74,92,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="caption" sx={{ color: C.text.secondary, fontWeight: 500, fontSize: { xs: "0.65rem", sm: "0.7rem" } }}>
          {title}
        </Typography>
        <Box sx={{ p: { xs: 0.5, sm: 0.75 }, borderRadius: 1.5, bgcolor: color ? `${color}18` : C.primaryLight }}>
          <Icon sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, color: color || C.primary }} />
        </Box>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: C.text.primary, fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" }, lineHeight: 1 }}>
        {value ?? 0}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: C.text.disabled, fontSize: { xs: "0.6rem", sm: "0.65rem" } }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

// ─── Client Card ─────────────────────────────────────────────────────────────
const ClientCard = ({ client, onEdit, onDelete, onViewDetails }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const plan = client.membershipPlan || "free";
  const daysLeft = client.daysRemaining ?? 0;
  const isActive = client.status === "active";
  const mStyle = getMembershipStyle(plan);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const usersUsed = client.usersUsed || 0;
  const licenseLimit = client.licenseLimit || 0;
  const usagePercentage = licenseLimit > 0 ? Math.min(100, Math.round((usersUsed / licenseLimit) * 100)) : 0;
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 7;

  return (
    <Zoom in style={{ transitionDelay: "50ms" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: { xs: 2, sm: 3 },
          border: "1px solid",
          borderColor: C.border,
          bgcolor: C.card,
          width:"350px",
          position: "relative",
          opacity: isActive ? 1 : 0.75,
          transition: "all 0.2s",
          "&:hover": {
            borderColor: C.primary,
            boxShadow: "0 4px 20px rgba(13,74,92,0.1)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {!isActive && (
          <Chip
            label="Inactive"
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              height: 20,
              fontSize: { xs: "0.55rem", sm: "0.6rem" },
              fontWeight: 700,
              bgcolor: C.errorLight,
              color: C.error,
            }}
          />
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, mb: 2 }}>
          <Avatar
            sx={{
              width: { xs: 40, sm: 44 },
              height: { xs: 40, sm: 44 },
              bgcolor: isActive ? C.primary : C.text.disabled,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            {getInitials(client.customerName)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: C.text.primary,
                  fontSize: { xs: "0.8rem", sm: "0.88rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {client.customerName}
              </Typography>
              <CircleIcon sx={{ color: isActive ? C.success : C.text.disabled, fontSize: "0.45rem", flexShrink: 0 }} />
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: C.text.secondary,
                fontSize: { xs: "0.62rem", sm: "0.67rem" },
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {client.email}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: C.text.disabled, p: 0.5 }} onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreVertIcon sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: C.text.disabled, fontSize: { xs: "0.55rem", sm: "0.6rem" }, display: "block", mb: 0.5 }}>
              Membership
            </Typography>
            <Chip
              label={mStyle.label}
              size="small"
              sx={{
                bgcolor: mStyle.bg,
                color: mStyle.color,
                fontSize: { xs: "0.58rem", sm: "0.62rem" },
                fontWeight: 700,
                height: { xs: 20, sm: 22 },
                borderRadius: 1,
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: C.text.disabled, fontSize: { xs: "0.55rem", sm: "0.6rem" }, display: "block", mb: 0.5 }}>
              Duration
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", sm: "0.75rem" }, color: isExpiringSoon ? C.error : C.text.primary }}
            >
              {daysLeft} days left {isExpiringSoon && "⚠"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: C.text.disabled, fontSize: { xs: "0.55rem", sm: "0.6rem" } }}>
              License Usage
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, fontSize: { xs: "0.62rem", sm: "0.67rem" }, color: usagePercentage > 85 ? C.error : C.text.primary }}
            >
              {usersUsed} / {licenseLimit} ({usagePercentage}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={usagePercentage}
            sx={{
              height: { xs: 4, sm: 5 },
              borderRadius: 3,
              bgcolor: C.border,
              "& .MuiLinearProgress-bar": {
                bgcolor: usagePercentage > 85 ? C.error : C.primary,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        <Divider sx={{ borderColor: C.border, mb: { xs: 1, sm: 1.5 } }} />

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityIcon sx={{ fontSize: { xs: "0.8rem", sm: "0.85rem" } }} />}
            onClick={() => onViewDetails(client._id)}
            sx={{
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              fontWeight: 600,
              textTransform: "none",
              borderColor: C.border,
              color: C.text.secondary,
              py: 0.5,
              px: { xs: 1, sm: 1.5 },
              borderRadius: 1.5,
              "&:hover": { borderColor: C.primary, color: C.primary, bgcolor: C.primaryLight },
            }}
          >
            View
          </Button>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(client)}
              sx={{ color: C.text.secondary, p: { xs: 0.5, sm: 0.75 }, "&:hover": { color: C.primary, bgcolor: C.primaryLight } }}
            >
              <EditIcon sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(client)}
              sx={{ color: C.text.secondary, p: { xs: 0.5, sm: 0.75 }, "&:hover": { color: C.error, bgcolor: C.errorLight } }}
            >
              <DeleteIcon sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }} />
            </IconButton>
          </Box>
        </Box>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          PaperProps={{ sx: { mt: 0.5, borderRadius: 2, minWidth: 150, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" } }}
        >
          <MenuItem onClick={() => { onEdit(client); setMenuAnchor(null); }} sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, py: 0.75 }}>
            <ListItemIcon><EditIcon sx={{ fontSize: "1rem", color: C.text.secondary }} /></ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem onClick={() => { onDelete(client); setMenuAnchor(null); }} sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, py: 0.75, color: C.error }}>
            <ListItemIcon><DeleteIcon sx={{ fontSize: "1rem", color: C.error }} /></ListItemIcon>
            <ListItemText primary={isActive ? "Deactivate" : "Activate"} />
          </MenuItem>
        </Menu>
      </Paper>
    </Zoom>
  );
};

const EMPTY_FORM = {
  customerName: "",
  email: "",
  password: "",
  membershipPlan: "standard",
  duration: "30",
  licenseLimit: "10",
  phone: "",
  website: "",
  notes: "",
};

export default function ClientManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();

  const {
    clients,
    stats,
    pagination,
    filters,
    loading,
    initialLoading,
    error,
    actionLoading,
    fetchClients,
    addClient,
    editClient,
    changeClientStatus,
    updateFilters,
    changePage,
    resetFilters,
  } = useClient();

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [membershipAnchorEl, setMembershipAnchorEl] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const searchTimeoutRef = useRef(null);

  const showToast = useCallback((msg, sev = "success") => setToast({ open: true, message: msg, severity: sev }), []);
  const closeToast = useCallback(() => setToast((p) => ({ ...p, open: false })), []);

  useEffect(() => {
    fetchClients();
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      updateFilters({ search: searchTerm });
      fetchClients({ search: searchTerm, page: 1 });
    }, 500);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchTerm]);

  const handleStatusFilterChange = (status) => {
    updateFilters({ status });
    setFilterAnchorEl(null);
    fetchClients({ status, page: 1 });
  };

  const handleMembershipFilterChange = (membershipPlan) => {
    updateFilters({ membershipPlan });
    setMembershipAnchorEl(null);
    fetchClients({ membershipPlan, page: 1 });
  };

  const handleClearFilters = () => {
    resetFilters();
    setSearchTerm("");
  };

  const handlePageChange = (newPage) => {
    changePage(newPage);
    fetchClients({ page: newPage });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setFormErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = "Customer name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";
    if (modalMode === "add" && (!formData.duration || parseInt(formData.duration) < 1)) errs.duration = "Duration must be ≥ 1";
    if (!formData.licenseLimit || parseInt(formData.licenseLimit) < 1) errs.licenseLimit = "License limit must be ≥ 1";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (modalMode === "add") {
        await addClient({
          customerName: formData.customerName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password || undefined,
          membershipPlan: formData.membershipPlan,
          duration: parseInt(formData.duration),
          licenseLimit: parseInt(formData.licenseLimit),
          phone: formData.phone,
          website: formData.website,
          notes: formData.notes,
        });
        showToast("Client created successfully!");
      } else {
        await editClient(selectedClient._id, {
          customerName: formData.customerName.trim(),
          membershipPlan: formData.membershipPlan,
          extendDays: parseInt(formData.extendDays) || 0,
          licenseLimit: parseInt(formData.licenseLimit),
          phone: formData.phone,
          website: formData.website,
          notes: formData.notes,
        });
        showToast("Client updated successfully");
      }
      setOpenModal(false);
      setFormData(EMPTY_FORM);
    } catch (error) {
      showToast(error.message || "An error occurred", "error");
    }
  };

  const handleToggleStatus = async (client) => {
    const newStatus = client.status === "active" ? "inactive" : "active";
    try {
      await changeClientStatus(client._id, newStatus);
      showToast(`Client ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      showToast(error.message || "Failed to change status", "error");
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setOpenModal(true);
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setFormData({
      customerName: client.customerName || "",
      email: client.email || "",
      password: "",
      membershipPlan: client.membershipPlan || "standard",
      extendDays: "0",
      licenseLimit: String(client.licenseLimit || 10),
      phone: client.phone || "",
      website: client.website || "",
      notes: client.notes || "",
    });
    setFormErrors({});
    setModalMode("edit");
    setOpenModal(true);
  };

  const statCards = useMemo(() => [
    { icon: GroupIcon, title: "Total Clients", value: stats?.total || 0, subtitle: "All registered", color: C.primary },
    { icon: PersonIcon, title: "Active", value: stats?.active || 0, subtitle: "Currently active", color: C.success },
    { icon: BusinessIcon, title: "Enterprise", value: stats?.byPlan?.enterprise || 0, subtitle: "Business plans", color: "#5e35b1" },
    { icon: WarningIcon, title: "Expiring", value: stats?.expiringSoon || 0, subtitle: "Within 7 days", color: C.warning },
  ], [stats]);

  const getStatusDisplayText = () => filters.status === "all" ? "All Status" : filters.status === "active" ? "Active" : "Inactive";
  const getMembershipDisplayText = () => filters.membershipPlan === "all" ? "All Plans" : filters.membershipPlan.charAt(0).toUpperCase() + filters.membershipPlan.slice(1);
  const hasActiveFilters = filters.status !== "all" || filters.membershipPlan !== "all" || searchTerm;

  // Show error state
  if (error && !initialLoading) {
    return <ErrorState message={error} onRetry={() => fetchClients()} />;
  }

  return (
    <Box sx={{ bgcolor: C.surface, minHeight: "100%", p: { xs: 1.5, sm: 2, md: 3, lg: 3.5 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 }, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: C.text.primary, fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" }, mb: 0.25 }}>
            Client Management
          </Typography>
          <Typography variant="caption" sx={{ color: C.text.secondary, fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" } }}>
            Manage customer accounts and memberships
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }} />}
          onClick={openAddModal}
          sx={{
            bgcolor: C.primary,
            fontSize: { xs: "0.7rem", sm: "0.78rem" },
            fontWeight: 600,
            textTransform: "none",
            py: { xs: 0.75, sm: 1 },
            px: { xs: 2, sm: 2.5 },
            borderRadius: 2,
            boxShadow: "none",
            "&:hover": { bgcolor: "#0b3f4f", boxShadow: "none" },
          }}
        >
          Add Client
        </Button>
      </Box>

      {/* Loading Indicator */}
      {loading && !initialLoading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress sx={{ borderRadius: 1, height: 3 }} />
        </Box>
      )}

      {/* Search and Filters */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} sm={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                px: { xs: 1.5, sm: 2 },
                py: 0.5,
                borderRadius: 2,
                bgcolor: C.card,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <SearchIcon sx={{ color: C.text.disabled, fontSize: { xs: "1rem", sm: "1.1rem" }, flexShrink: 0 }} />
              <TextField
                placeholder="Search by name or email..."
                variant="standard"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: { xs: "0.75rem", sm: "0.82rem" }, py: { xs: 0.5, sm: 0.75 }, color: C.text.primary },
                }}
              />
              {searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm("")} sx={{ p: 0.25 }}>
                  <CloseIcon sx={{ fontSize: "0.9rem", color: C.text.disabled }} />
                </IconButton>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "flex-start", md: "flex-end" }, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                size="small"
                endIcon={<FilterIcon sx={{ fontSize: "0.9rem" }} />}
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.72rem" },
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: C.border,
                  color: filters.status !== "all" ? C.primary : C.text.secondary,
                  borderRadius: 1.5,
                  px: 1.5,
                  bgcolor: filters.status !== "all" ? C.primaryLight : C.card,
                }}
              >
                {getStatusDisplayText()}
              </Button>

              <Button
                variant="outlined"
                size="small"
                endIcon={<FilterIcon sx={{ fontSize: "0.9rem" }} />}
                onClick={(e) => setMembershipAnchorEl(e.currentTarget)}
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.72rem" },
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: C.border,
                  color: filters.membershipPlan !== "all" ? C.primary : C.text.secondary,
                  borderRadius: 1.5,
                  px: 1.5,
                  bgcolor: filters.membershipPlan !== "all" ? C.primaryLight : C.card,
                }}
              >
                {getMembershipDisplayText()}
              </Button>

              {hasActiveFilters && (
                <Button variant="text" size="small" onClick={handleClearFilters} sx={{ fontSize: "0.7rem", textTransform: "none", color: C.error, minWidth: "auto" }}>
                  Clear
                </Button>
              )}

              <Tooltip title="Refresh">
                <IconButton onClick={() => fetchClients()} sx={{ bgcolor: C.card, border: `1px solid ${C.border}`, borderRadius: 1.5, p: 0.75 }}>
                  <RefreshIcon sx={{ color: C.text.secondary, fontSize: "1.05rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        {statCards.map((s, i) => (
          <Grid item xs={6} sm={6} md={3} key={i}>
            <StatCard {...s} loading={initialLoading} />
          </Grid>
        ))}
      </Grid>

      {/* Results Count */}
      {!initialLoading && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" sx={{ color: C.text.secondary, fontSize: { xs: "0.65rem", sm: "0.7rem" } }}>
            Showing {clients.length} of {pagination.total || 0} clients
          </Typography>
        </Box>
      )}

      {/* Client Grid */}
      {initialLoading ? (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <ClientCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : clients.length === 0 ? (
        <EmptyState
          title="No clients found"
          description={searchTerm ? `No results for "${searchTerm}". Try adjusting your search.` : "No clients have been added yet."}
          action={
            !searchTerm && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal} sx={{ bgcolor: C.primary, textTransform: "none" }}>
                Add Your First Client
              </Button>
            )
          }
        />
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {clients.map((client) => (
            <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={client._id}>
              <ClientCard
                client={client}
                onEdit={openEditModal}
                onDelete={handleToggleStatus}
                onViewDetails={(id) => navigate(`/admin/clients-details/${id}`, { state: { clientId: id } })}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: { xs: 2, sm: 3 }, flexWrap: "wrap" }}>
          <Button
            size="small"
            disabled={pagination.page <= 1 || loading}
            onClick={() => handlePageChange(pagination.page - 1)}
            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
          >
            Previous
          </Button>
          <Typography variant="caption" sx={{ color: C.text.secondary, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
            Page {pagination.page} of {pagination.pages}
          </Typography>
          <Button
            size="small"
            disabled={pagination.page >= pagination.pages || loading}
            onClick={() => handlePageChange(pagination.page + 1)}
            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
          >
            Next
          </Button>
        </Box>
      )}

      {/* Filter Menus */}
      <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={() => setFilterAnchorEl(null)}>
        {["all", "active", "inactive"].map((status) => (
          <MenuItem key={status} selected={filters.status === status} onClick={() => handleStatusFilterChange(status)} sx={{ fontSize: "0.75rem" }}>
            {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={membershipAnchorEl} open={Boolean(membershipAnchorEl)} onClose={() => setMembershipAnchorEl(null)}>
        {["all", "free", "standard", "premium", "enterprise"].map((plan) => (
          <MenuItem key={plan} selected={filters.membershipPlan === plan} onClick={() => handleMembershipFilterChange(plan)} sx={{ fontSize: "0.75rem" }}>
            {plan === "all" ? "All Plans" : plan.charAt(0).toUpperCase() + plan.slice(1)}
          </MenuItem>
        ))}
      </Menu>

      {/* Add/Edit Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              width: { xs: "95%", sm: 520, md: 560 },
              maxWidth: "96vw",
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: { xs: 2.5, sm: 3, md: 4 },
              maxHeight: "90vh",
              overflowY: "auto",
              outline: "none",
              mx: "auto",
            }}
          >
            <Box sx={{ mb: 3, position: "relative", pr: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: C.text.primary, fontSize: { xs: "1rem", sm: "1.1rem" }, mb: 0.5 }}>
                {modalMode === "add" ? "Add New Client" : `Edit — ${selectedClient?.customerName}`}
              </Typography>
              <Typography variant="caption" sx={{ color: C.text.secondary, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                {modalMode === "add" ? "Create a new customer account" : "Update customer information and subscription details"}
              </Typography>
              <IconButton
                onClick={() => setOpenModal(false)}
                size="small"
                sx={{ position: "absolute", right: 0, top: 0, color: C.text.disabled }}
              >
                <CloseIcon sx={{ fontSize: "1.25rem" }} />
              </IconButton>
            </Box>

            <Stack spacing={{ xs: 2, sm: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Customer Name *" name="customerName" value={formData.customerName} onChange={handleInput} size="small" fullWidth error={!!formErrors.customerName} helperText={formErrors.customerName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email *" name="email" type="email" value={formData.email} onChange={handleInput} size="small" fullWidth disabled={modalMode === "edit"} error={!!formErrors.email} helperText={formErrors.email} />
                </Grid>
              </Grid>

              {modalMode === "add" && (
                <TextField label="Temporary Password *" name="password" type="password" value={formData.password} onChange={handleInput} size="small" fullWidth error={!!formErrors.password} helperText={formErrors.password} />
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Plan *</InputLabel>
                    <Select name="membershipPlan" value={formData.membershipPlan} onChange={handleInput} label="Plan *">
                      {["free", "standard", "premium", "enterprise"].map((p) => (
                        <MenuItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={modalMode === "add" ? "Duration (days) *" : "Extend Days"}
                    name={modalMode === "add" ? "duration" : "extendDays"}
                    type="number"
                    value={formData[modalMode === "add" ? "duration" : "extendDays"]}
                    onChange={handleInput}
                    size="small"
                    fullWidth
                    InputProps={{ inputProps: { min: 1, max: 365 } }}
                  />
                </Grid>
              </Grid>

              <TextField label="License Limit *" name="licenseLimit" type="number" value={formData.licenseLimit} onChange={handleInput} size="small" fullWidth error={!!formErrors.licenseLimit} helperText={formErrors.licenseLimit} InputProps={{ inputProps: { min: 1 } }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInput} size="small" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Website" name="website" value={formData.website} onChange={handleInput} size="small" fullWidth placeholder="https://" />
                </Grid>
              </Grid>

              <TextField label="Notes" name="notes" multiline rows={3} value={formData.notes} onChange={handleInput} size="small" fullWidth />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2, borderTop: `1px solid ${C.border}` }}>
                <Button variant="text" onClick={() => setOpenModal(false)} disabled={actionLoading} sx={{ textTransform: "none" }}>Cancel</Button>
                <Button
                  variant="contained"
                  disabled={actionLoading}
                  onClick={handleSubmit}
                  sx={{ bgcolor: C.primary, "&:hover": { bgcolor: "#0b3f4f" }, textTransform: "none", fontWeight: 500 }}
                >
                  {actionLoading ? <CircularProgress size={18} sx={{ color: "white" }} /> : modalMode === "add" ? "Create Client" : "Save Changes"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ bottom: { xs: 72, sm: 80, md: 24 } }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ fontSize: { xs: "0.7rem", sm: "0.78rem" }, borderRadius: 2 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};