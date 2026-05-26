// pages/admin/TeamManagement.js - Redesigned: Clean Enterprise UI
// Fixed: Removed duplicate TableCell imports, improved responsive layout

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Divider,
  alpha,
  Grid,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  BarChart as BarChartIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Sort as SortIcon,
  PersonAddOutlined,
  MoreVert,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  HomeWork as WorkIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

// ─── Google Fonts injection ───────────────────────────────────────────────────
const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href =
  "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap";
if (!document.head.querySelector('[href*="Inter"]')) {
  document.head.appendChild(FONT_LINK);
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  primary: "#0d4a5c",
  primaryDark: "#0a3a49",
  primaryLight: "#eff6ff",
  primaryBg: alpha("#0a3a49", 0.08),
  success: "#10b981",
  successBg: "#ecfdf5",
  warning: "#f59e0b",
  warningBg: "#fffbeb",
  error: "#ef4444",
  errorBg: "#fef2f2",
  info: "#8b5cf6",
  infoBg: "#f5f3ff",
  surface: "#ffffff",
  bg: "#f9fafb",
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  text: {
    primary: "#111827",
    secondary: "#6b7280",
    muted: "#9ca3af",
    disabled: "#d1d5db",
  },
};

// ─── Role options ──────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  "Inspector",
  "Senior Inspector",
  "Supervisor",
  "Manager",
  "Admin",
];
const STATUS_OPTIONS = ["active", "inactive", "onLeave"];

// ─── Status helpers ──────────────────────────────────────────────────────────
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return {
        bg: C.successBg,
        color: C.success,
        label: "Active",
        icon: CheckCircleIcon,
      };
    case "inactive":
      return {
        bg: C.border,
        color: C.text.muted,
        label: "Inactive",
        icon: CloseIcon,
      };
    case "onleave":
    case "on leave":
      return { bg: C.infoBg, color: C.info, label: "On Leave", icon: WorkIcon };
    default:
      return {
        bg: C.border,
        color: C.text.muted,
        label: status || "—",
        icon: null,
      };
  }
};

const getPerformanceColor = (score) => {
  if (score >= 80) return C.success;
  if (score >= 60) return C.primary;
  if (score >= 40) return C.warning;
  return C.error;
};

// ─── Stat Card Component ─────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, color, trend, trendValue }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "14px",
        width:"282px",
        border: `1px solid ${C.border}`,
        transition: "all 0.2s",
        "&:hover": {
          borderColor: color,
          boxShadow: `0 4px 12px ${alpha(color, 0.1)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: C.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              bgcolor: alpha(color, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ fontSize: 16, color }} />
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: C.text.primary,
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {value?.toLocaleString() ?? 0}
        </Typography>
        {trend && (
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: trend > 0 ? C.success : C.error,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Filter Bar Component ───────────────────────────────────────────────────
function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setLocalFilters(filters);
  };

  const handleClose = () => setAnchorEl(null);

  const handleApply = () => {
    onFilterChange(localFilters);
    handleClose();
  };

  const handleReset = () => {
    const resetFilters = {
      role: "",
      status: "",
      performanceMin: "",
      performanceMax: "",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    handleClose();
  };

  return (
    <>
      <Button
        variant={activeFilterCount > 0 ? "contained" : "outlined"}
        startIcon={
          <Badge
            badgeContent={activeFilterCount}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.6rem",
                height: 16,
                minWidth: 16,
              },
            }}
          >
            <FilterIcon sx={{ fontSize: 18 }} />
          </Badge>
        }
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          fontSize: "0.85rem",
          fontWeight: 500,
          borderRadius: "10px",
          borderColor: C.border,
          color: activeFilterCount > 0 ? "#fff" : C.text.primary,
          bgcolor: activeFilterCount > 0 ? C.primary : "transparent",
          "&:hover": {
            bgcolor:
              activeFilterCount > 0 ? C.primaryDark : alpha(C.primary, 0.05),
            borderColor: C.primary,
          },
          px: 2,
          py: 0.75,
        }}
      >
        Filters
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            width: 280,
            p: 2.5,
            borderRadius: "14px",
            mt: 1,
            border: `1px solid ${C.border}`,
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.9rem",
            mb: 2,
            color: C.text.primary,
          }}
        >
          Filter Team Members
        </Typography>

        <FormControl size="small" fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ fontSize: "0.8rem" }}>Role</InputLabel>
          <Select
            value={localFilters.role}
            label="Role"
            onChange={(e) =>
              setLocalFilters({ ...localFilters, role: e.target.value })
            }
            sx={{ fontSize: "0.85rem", borderRadius: "8px" }}
          >
            <MenuItem value="" sx={{ fontSize: "0.85rem" }}>
              All Roles
            </MenuItem>
            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role} value={role} sx={{ fontSize: "0.85rem" }}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ fontSize: "0.8rem" }}>Status</InputLabel>
          <Select
            value={localFilters.status}
            label="Status"
            onChange={(e) =>
              setLocalFilters({ ...localFilters, status: e.target.value })
            }
            sx={{ fontSize: "0.85rem", borderRadius: "8px" }}
          >
            <MenuItem value="" sx={{ fontSize: "0.85rem" }}>
              All Statuses
            </MenuItem>
            {STATUS_OPTIONS.map((status) => (
              <MenuItem
                key={status}
                value={status}
                sx={{ fontSize: "0.85rem" }}
              >
                {status === "active"
                  ? "Active"
                  : status === "inactive"
                    ? "Inactive"
                    : "On Leave"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          fullWidth
          type="number"
          label="Min Performance (%)"
          value={localFilters.performanceMin}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, performanceMin: e.target.value })
          }
          sx={{
            mb: 2,
            "& input": { fontSize: "0.85rem" },
            "& label": { fontSize: "0.8rem" },
          }}
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />

        <TextField
          size="small"
          fullWidth
          type="number"
          label="Max Performance (%)"
          value={localFilters.performanceMax}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, performanceMax: e.target.value })
          }
          sx={{
            mb: 2,
            "& input": { fontSize: "0.85rem" },
            "& label": { fontSize: "0.8rem" },
          }}
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />

        <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            fullWidth
            startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              fontSize: "0.8rem",
              borderRadius: "8px",
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            fullWidth
            sx={{
              textTransform: "none",
              fontSize: "0.8rem",
              borderRadius: "8px",
              bgcolor: C.primary,
            }}
          >
            Apply
          </Button>
        </Stack>
      </Popover>
    </>
  );
}

// ─── Member Row Component ─────────────────────────────────────────────────────
function MemberRow({ member, onView, onEdit, onDelete }) {
  const statusStyle = getStatusStyle(member.status);
  const perfColor = getPerformanceColor(member.performanceScore);
  const StatusIcon = statusStyle.icon;

  return (
    <TableRow
      hover
      sx={{
        "&:hover": { bgcolor: alpha(C.primary, 0.02) },
        transition: "background 0.15s",
      }}
    >
      {/* Member Info */}
      <TableCell sx={{ py: 1.8, pl: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: C.primaryBg,
              color: C.primary,
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {member.initials || member.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: C.text.primary,
              }}
            >
              {member.name}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: C.text.secondary }}>
              {member.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Role */}
      <TableCell>
        <Chip
          label={member.role}
          size="small"
          sx={{
            bgcolor: alpha(C.primary, 0.08),
            color: C.primary,
            fontWeight: 500,
            fontSize: "0.75rem",
            height: 24,
            borderRadius: "6px",
          }}
        />
      </TableCell>

      {/* Assigned */}
      <TableCell>
        <Typography
          sx={{ fontSize: "0.85rem", fontWeight: 500, color: C.text.primary }}
        >
          {member.assigned ?? "—"}
        </Typography>
      </TableCell>

      {/* Completed */}
      <TableCell>
        <Typography
          sx={{ fontSize: "0.85rem", fontWeight: 500, color: C.text.primary }}
        >
          {member.completed ?? "—"}
        </Typography>
      </TableCell>

      {/* Performance */}
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 110,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={member.performanceScore ?? 0}
            sx={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              bgcolor: C.border,
              "& .MuiLinearProgress-bar": {
                bgcolor: perfColor,
                borderRadius: 3,
              },
            }}
          />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.8rem",
              color: perfColor,
              minWidth: 35,
            }}
          >
            {member.performanceScore ?? 0}%
          </Typography>
        </Box>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Chip
          label={statusStyle.label}
          size="small"
          icon={StatusIcon ? <StatusIcon sx={{ fontSize: 12 }} /> : undefined}
          sx={{
            bgcolor: statusStyle.bg,
            color: statusStyle.color,
            fontWeight: 500,
            fontSize: "0.7rem",
            height: 26,
            borderRadius: "6px",
            "& .MuiChip-icon": { fontSize: 12, color: statusStyle.color },
          }}
        />
      </TableCell>

      {/* Actions */}
      <TableCell align="center" sx={{ pr: 2.5 }}>
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="View Details" arrow>
            <IconButton
              size="small"
              onClick={() => onView(member)}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                color: C.text.secondary,
                "&:hover": {
                  bgcolor: alpha(C.primary, 0.08),
                  color: C.primary,
                },
              }}
            >
              <VisibilityIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Member" arrow>
            <IconButton
              size="small"
              onClick={() => onEdit(member)}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                color: C.text.secondary,
                "&:hover": {
                  bgcolor: alpha(C.primary, 0.08),
                  color: C.primary,
                },
              }}
            >
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Member" arrow>
            <IconButton
              size="small"
              onClick={() => onDelete(member)}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                color: C.text.secondary,
                "&:hover": { bgcolor: alpha(C.error, 0.08), color: C.error },
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

// ─── Mobile Card Component ────────────────────────────────────────────────────
function MobileMemberCard({ member, onView, onEdit, onDelete }) {
  const statusStyle = getStatusStyle(member.status);
  const perfColor = getPerformanceColor(member.performanceScore);
  const StatusIcon = statusStyle.icon;

  return (
    <Paper
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: "14px",
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${perfColor}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: C.primaryBg,
              color: C.primary,
              fontWeight: 600,
            }}
          >
            {member.initials || member.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.95rem",
                color: C.text.primary,
              }}
            >
              {member.name}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: C.text.secondary }}>
              {member.email}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => onView(member)}
            sx={{ color: C.text.secondary }}
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onEdit(member)}
            sx={{ color: C.text.secondary }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(member)}
            sx={{ color: C.error }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: C.text.muted,
              textTransform: "uppercase",
              mb: 0.3,
            }}
          >
            Role
          </Typography>
          <Chip
            label={member.role}
            size="small"
            sx={{
              bgcolor: alpha(C.primary, 0.08),
              color: C.primary,
              fontSize: "0.7rem",
            }}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: C.text.muted,
              textTransform: "uppercase",
              mb: 0.3,
            }}
          >
            Status
          </Typography>
          <Chip
            label={statusStyle.label}
            size="small"
            icon={StatusIcon ? <StatusIcon sx={{ fontSize: 12 }} /> : undefined}
            sx={{ bgcolor: statusStyle.bg, color: statusStyle.color }}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: C.text.muted,
              textTransform: "uppercase",
              mb: 0.3,
            }}
          >
            Assigned
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
            {member.assigned ?? "—"}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: C.text.muted,
              textTransform: "uppercase",
              mb: 0.3,
            }}
          >
            Completed
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
            {member.completed ?? "—"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ mt: 1 }}>
        <Typography
          sx={{
            fontSize: "0.6rem",
            fontWeight: 600,
            color: C.text.muted,
            textTransform: "uppercase",
            mb: 0.8,
          }}
        >
          Performance
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <LinearProgress
            variant="determinate"
            value={member.performanceScore ?? 0}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              bgcolor: C.border,
              "& .MuiLinearProgress-bar": { bgcolor: perfColor },
            }}
          />
          <Typography
            sx={{ fontWeight: 600, fontSize: "0.8rem", color: perfColor }}
          >
            {member.performanceScore ?? 0}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeamManagement() {
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const {
    teamMembers,
    teamStats,
    loading,
    actionLoading,
    error,
    pagination,
    fetchTeamMembers,
    fetchTeamStats,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    updateFilters,
    clearError,
  } = useTeam();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    performanceMin: "",
    performanceMax: "",
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const showToast = (msg, sev = "success") =>
    setToast({ open: true, message: msg, severity: sev });
  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  // Fetch on mount
  useEffect(() => {
    fetchTeamMembers();
    fetchTeamStats();
  }, []);

  // Apply filters and search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const combinedFilters = {
        search: searchTerm,
        role: filters.role,
        status: filters.status,
        performanceMin: filters.performanceMin,
        performanceMax: filters.performanceMax,
        page: currentPage + 1,
        limit: rowsPerPage,
      };
      updateFilters(combinedFilters);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filters, currentPage, rowsPerPage, updateFilters]);

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "" && v !== null && v !== undefined,
  ).length;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      role: "",
      status: "",
      performanceMin: "",
      performanceMax: "",
    });
    setCurrentPage(0);
  };

  const handleChangePage = (event, newPage) => setCurrentPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleAddMember = async (formData) => {
    const result = await addTeamMember(formData);
    if (result.success) {
      showToast(result.message);
      setAddModalOpen(false);
    } else showToast(result.error, "error");
    return result;
  };

  const handleEditMember = async (memberId, updateData) => {
    const result = await updateTeamMember(memberId, updateData);
    if (result.success) {
      showToast(result.message);
      setEditModalOpen(false);
      setSelectedMember(null);
    } else showToast(result.error, "error");
    return result;
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    const result = await deleteTeamMember(selectedMember.id, true);
    if (result.success) {
      showToast(result.message);
      setDeleteModalOpen(false);
      setSelectedMember(null);
    } else showToast(result.error, "error");
    return result;
  };

  const handleViewMember = (member) =>
    navigate(`/admin/team-details/${member.id}`);
  const handleEditClick = (member) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };
  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  // Stats cards data
  const statCards = [
    {
      title: "Total Members",
      value: teamStats?.total || teamMembers.length,
      icon: PersonAddOutlined,
      color: C.primary,
    },
    {
      title: "Active Members",
      value:
        teamStats?.active ||
        teamMembers.filter((m) => m.status === "active").length,
      icon: CheckCircleIcon,
      color: C.success,
    },
    {
      title: "On Leave",
      value:
        teamStats?.onLeave ||
        teamMembers.filter((m) => m.status === "onLeave").length,
      icon: WorkIcon,
      color: C.warning,
    },
    {
      title: "Avg Performance",
      value: teamStats?.avgPerformance || "—",
      icon: BarChartIcon,
      color: C.info,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: C.bg,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3.5 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                color: C.text.primary,
                letterSpacing: "-0.02em",
                mb: 0.5,
              }}
            >
              Team Management
            </Typography>
            <Typography sx={{ color: C.text.secondary, fontSize: "0.85rem" }}>
              Manage your inspection team and track performance
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
            sx={{
              bgcolor: C.primary,
              "&:hover": { bgcolor: C.primaryDark },
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              px: 2.5,
              py: 0.8,
            }}
          >
            Add Team Member
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((card, idx) => (
            <Grid item xs={6} sm={3} key={idx}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Search and Filter Bar */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "14px",
            border: `1px solid ${C.border}`,
            mb: 2.5,
            p: 1.5,
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            sx={{ gap: { xs: 1, sm: 1.5 } }}
          >
            <TextField
              fullWidth
              placeholder="Search by name, email, or role..."
              variant="standard"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: C.text.muted, fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  fontSize: "0.9rem",
                  color: C.text.primary,
                  py: 0.8,
                  px: 1,
                },
              }}
              sx={{ flex: 2, minWidth: 200 }}
            />
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              activeFilterCount={activeFilterCount}
            />
            {(searchTerm || activeFilterCount > 0) && (
              <Button
                variant="text"
                startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
                onClick={() => {
                  setSearchTerm("");
                  handleClearFilters();
                }}
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  color: C.text.secondary,
                  whiteSpace: "nowrap",
                  "&:hover": { color: C.error },
                }}
              >
                Clear All
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={clearError}
            sx={{ mb: 2, borderRadius: "10px", fontSize: "0.8rem" }}
          >
            {error}
          </Alert>
        )}

        {/* Content */}
        {loading && !teamMembers.length ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: C.primary }} />
          </Box>
        ) : teamMembers.length === 0 ? (
          <Paper
            sx={{
              textAlign: "center",
              py: 8,
              borderRadius: "14px",
              border: `1px solid ${C.border}`,
            }}
          >
            <PersonAddOutlined
              sx={{ fontSize: 48, color: C.text.muted, mb: 1.5 }}
            />
            <Typography sx={{ color: C.text.secondary, fontSize: "0.9rem" }}>
              No team members found
            </Typography>
            <Button
              onClick={() => setAddModalOpen(true)}
              sx={{ mt: 2, fontSize: "0.8rem" }}
            >
              Add your first team member
            </Button>
          </Paper>
        ) : isMobile ? (
          /* Mobile View */
          <Box>
            {teamMembers.map((member) => (
              <MobileMemberCard
                key={member.id}
                member={member}
                onView={handleViewMember}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
            {/* Pagination for mobile */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <TablePagination
                component="div"
                count={pagination.total || teamMembers.length}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
                sx={{ border: "none" }}
              />
            </Box>
          </Box>
        ) : (
          /* Desktop Table View */
          <Paper
            elevation={0}
            sx={{
              borderRadius: "14px",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: C.bg }}>
                    {[
                      "Member",
                      "Role",
                      "Assigned",
                      "Completed",
                      "Performance",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        align={h === "Actions" ? "center" : "left"}
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          color: C.text.secondary,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          py: 1.8,
                          borderBottom: `1px solid ${C.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((member) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                      onView={handleViewMember}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              sx={{ borderTop: `1px solid ${C.border}`, bgcolor: C.surface }}
            >
              <TablePagination
                component="div"
                count={pagination.total || teamMembers.length}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    fontSize: "0.8rem",
                    minHeight: 52,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontSize: "0.75rem",
                      color: C.text.secondary,
                    },
                }}
              />
            </Box>
          </Paper>
        )}
      </Container>

      {/* Modals */}
      <AddMemberModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddMember}
        loading={actionLoading}
      />
      <EditMemberModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSubmit={handleEditMember}
        loading={actionLoading}
      />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onConfirm={handleDeleteMember}
        loading={actionLoading}
      />

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: "10px", fontSize: "0.8rem" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
