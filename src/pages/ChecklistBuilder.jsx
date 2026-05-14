// pages/admin/ChecklistPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Divider,
  Pagination,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import PublicIcon from "@mui/icons-material/Public";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import ArchiveIcon from "@mui/icons-material/Archive";
import CategoryIcon from "@mui/icons-material/Category";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useNavigate } from "react-router-dom";
import { useChecklistBuilder } from "../context/ChecklistBuilderContext";
import { useAssignment } from "../context/AssignmentContext";
import { useAuth } from "../context/AuthContexts";
import axios from "axios";
import AssignChecklistDialog from "./AssignChecklistDialog";

// ─── Consistent Palette ───────────────────────────────────────────────────
const C = {
  primary: "#0d4a5c",
  primaryDark: "#0a3a49",
  primaryLight: "#e8f2f5",
  success: "#16a34a",
  successBg: "#dcfce7",
  surface: "#f1f4f8",
  card: "#ffffff",
  border: "#e2e8f0",
  error: "#d32f2f",
  warning: "#f59e0b",
  warningBg: "#fef3c7",
  info: "#3b82f6",
  infoBg: "#dbeafe",
  text: { primary: "#1e293b", secondary: "#64748b", disabled: "#94a3b8" },
};

// ─── Status Configuration ─────────────────────────────────────────────────
const statusConfig = {
  active: {
    bg: C.successBg,
    color: C.success,
    icon: <CheckCircleIcon sx={{ fontSize: 12 }} />,
    label: "Active",
  },
  draft: {
    bg: C.warningBg,
    color: C.warning,
    icon: <PendingIcon sx={{ fontSize: 12 }} />,
    label: "Draft",
  },
  archived: {
    bg: "#f1f5f9",
    color: C.text.disabled,
    icon: <ArchiveIcon sx={{ fontSize: 12 }} />,
    label: "Archived",
  },
};

const StatusChip = ({ status }) => {
  const cfg = statusConfig[status?.toLowerCase()] || statusConfig.draft;
  return (
    <Chip
      label={cfg.label}
      size="small"
      icon={cfg.icon}
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 600,
        fontSize: "0.7rem",
        height: 30 , width: 100,
        borderRadius: "20px",
        "& .MuiChip-icon": { fontSize: 12, color: cfg.color },
      }}
    />
  );
};

// ─── Checklist Types for Modal ──────────────────────────────────────────────
const CHECKLIST_TYPES = [
  {
    icon: <ArticleOutlinedIcon sx={{ fontSize: 22 }} />,
    label: "Custom Checklist",
    desc: "Create a custom checklist from scratch",
    redirectTo: "/create-checklist/custom",
    color: C.primary,
  },
  {
    icon: <PublicIcon sx={{ fontSize: 22 }} />,
    label: "Global Checklist",
    desc: "Use predefined global templates",
    redirectTo: "/create-checklist/global",
    color: C.info,
  },
  {
    icon: <TableChartIcon sx={{ fontSize: 22 }} />,
    label: "Import from Excel",
    desc: "Upload Excel file to generate checklist",
    redirectTo: "/import-checklist/excel",
    color: C.success,
  },
];

// ─── Create Checklist Modal ───────────────────────────────────────────────────
function CreateChecklistModal({ open, onClose }) {
  const navigate = useNavigate();

  const handleTypeClick = (type) => {
    onClose();
    if (type.redirectTo) {
      navigate(type.redirectTo);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ p: 3, pb: 2, bgcolor: C.primary, color: "#fff" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 700 }}>
              Create New Checklist
            </Typography>
            <Typography
              sx={{ fontSize: "0.75rem", color: "#ffffffcc", mt: 0.5 }}
            >
              Choose the type of checklist you want to create
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {CHECKLIST_TYPES.map((item, i) => (
            <Box
              key={i}
              onClick={() => handleTypeClick(item)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                border: `1px solid ${C.border}`,
                borderRadius: 2,
                p: 2.5,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: item.color,
                  bgcolor: C.primaryLight,
                  transform: "translateX(4px)",
                },
              }}
            >
              <Box sx={{ color: item.color }}>{item.icon}</Box>
              <Box flex={1}>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: C.text.primary,
                    mb: 0.25,
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: C.text.secondary }}
                >
                  {item.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Delete Confirmation Dialog ──────────────────────────────────────────────
function DeleteConfirmDialog({ open, onClose, onConfirm, checklistName }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Typography
          sx={{ fontSize: "1.1rem", fontWeight: 700, color: C.text.primary }}
        >
          Delete Checklist
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: "0.85rem", color: C.text.secondary }}>
          Are you sure you want to delete "<strong>{checklistName}</strong>"?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          size="small"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── View Checklist Details Dialog ──────────────────────────────────────────
function ViewChecklistDialog({ open, onClose, checklist }) {
  if (!checklist) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ p: 3, pb: 2, bgcolor: C.primary, color: "#fff" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
              {checklist.name}
            </Typography>
            <Typography
              sx={{ fontSize: "0.75rem", color: "#ffffffcc", mt: 0.5 }}
            >
              {checklist.description || "No description provided"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 2 }}>
        {/* Meta Info Chips */}
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 3 }}
        >
          <Chip
            size="small"
            label={`Type: ${checklist.type || "N/A"}`}
            variant="outlined"
            sx={{ fontSize: "0.7rem" }}
          />
          <Chip
            size="small"
            label={`Category: ${checklist.category || "N/A"}`}
            variant="outlined"
            sx={{ fontSize: "0.7rem" }}
          />
          <StatusChip status={checklist.status} />
          <Chip
            size="small"
            label={`Version: ${checklist.version || "v1.0"}`}
            variant="outlined"
            sx={{ fontSize: "0.7rem" }}
          />
          <Chip
            size="small"
            label={`Fields: ${checklist.totalFields || 0}`}
            variant="outlined"
            sx={{ fontSize: "0.7rem" }}
          />
          {checklist.isApproved && (
            <Chip
              size="small"
              label="Approved"
              sx={{ bgcolor: C.infoBg, color: C.info, fontSize: "0.7rem" }}
            />
          )}
        </Stack>

        {/* Created By */}
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, bgcolor: C.surface, borderRadius: 2 }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: C.text.secondary,
              mb: 1.5,
              textTransform: "uppercase",
            }}
          >
            Created By
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: C.primary }}>
              {checklist.createdBy?.name?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: C.text.primary,
                }}
              >
                {checklist.createdBy?.name || "Unknown"}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: C.text.secondary }}>
                {checklist.createdBy?.email || ""} • Role:{" "}
                {checklist.createdByRole || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Sections & Fields */}
        <Typography
          sx={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: C.text.primary,
            mb: 2,
          }}
        >
          Sections & Fields
        </Typography>

        {checklist.sections?.map((section, idx) => (
          <Paper
            key={idx}
            variant="outlined"
            sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: C.surface }}
          >
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: C.text.primary,
                mb: 0.5,
              }}
            >
              {section.sectionTitle || `Section ${idx + 1}`}
            </Typography>
            {section.sectionDescription && (
              <Typography
                sx={{ fontSize: "0.7rem", color: C.text.secondary, mb: 1.5 }}
              >
                {section.sectionDescription}
              </Typography>
            )}
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {section.fields?.map((field, fIdx) => (
                <Typography
                  component="li"
                  key={fIdx}
                  sx={{ fontSize: "0.75rem", py: 0.5, color: C.text.secondary }}
                >
                  {field.label}
                  {field.isRequired && (
                    <span style={{ color: C.error }}> *</span>
                  )}
                  <Chip
                    label={field.fieldType?.replace(/_/g, " ") || "text"}
                    size="small"
                    sx={{ ml: 1, height: 18, fontSize: "0.6rem" }}
                  />
                </Typography>
              ))}
            </Box>
          </Paper>
        ))}

        {/* Timestamps */}
        <Box mt={2} pt={1}>
          <Typography sx={{ fontSize: "0.65rem", color: C.text.disabled }}>
            Created: {new Date(checklist.createdAt).toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: C.text.disabled }}>
            Last Updated: {new Date(checklist.updatedAt).toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Checklist Card (Grid View) ──────────────────────────────────────────────
function ChecklistCard({ checklist, onView, onDelete, onAssign }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: `1px solid ${C.border}`,
        height: "100%",
        display: "flex",
        width: "365px",
        flexDirection: "column",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ flex: 1, p: 2.5 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1.5}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: C.text.primary,
              lineHeight: 1.3,
            }}
          >
            {checklist.name}
          </Typography>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon sx={{ fontSize: "1rem", color: C.text.secondary }} />
          </IconButton>
        </Box>

        <Typography
          sx={{ fontSize: "0.7rem", color: C.text.disabled, mb: 1.5 }}
        >
          ID: {checklist._id?.slice(-8) || "N/A"}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.75rem",
            color: C.text.secondary,
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {checklist.description || "No description provided"}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 2 }}
        >
          <Chip
            size="small"
            icon={<CategoryIcon sx={{ fontSize: 12 }} />}
            label={checklist.category || "Uncategorized"}
            variant="outlined"
            sx={{ fontSize: "0.65rem", height: 30 , width: 100 }}
          />
          <Chip
            size="small"
            icon={<FormatListBulletedIcon sx={{ fontSize: 12 }} />}
            label={`${checklist.totalFields || 0} fields`}
            variant="outlined"
            sx={{ fontSize: "0.65rem", height: 30 , width: 100 }}
          />
          <StatusChip status={checklist.status} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              bgcolor: C.primaryLight,
              fontSize: "0.7rem",
              color: C.primary,
            }}
          >
            {checklist.createdBy?.name?.charAt(0) || "U"}
          </Avatar>
          <Typography sx={{ fontSize: "0.7rem", color: C.text.secondary }}>
            {checklist.createdBy?.name || "Unknown"}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
          onClick={() => onView(checklist)}
          sx={{
            flex: 1,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.7rem",
          }}
        >
          View
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<AssignmentIcon sx={{ fontSize: 14 }} />}
          onClick={() => onAssign(checklist)}
          sx={{
            flex: 1,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.7rem",
            bgcolor: C.primary,
          }}
        >
          Assign
        </Button>
      </CardActions>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDelete(checklist);
          }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ fontSize: 18, color: C.error }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText>Clone</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ChecklistPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  const {
    getAllChecklists,
    deleteChecklist,
    loading: checklistLoading,
    error,
    success,
    clearMessages,
  } = useChecklistBuilder();
  const {
    assignToAdmin,
    assignToTeam,
    loading: assignmentLoading,
    clearMessages: clearAssignmentMessages,
  } = useAssignment();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const [checklists, setChecklists] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [checklistToAssign, setChecklistToAssign] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isSuperAdmin = user?.role === "super_admin";
  const token = localStorage.getItem("accessToken");

  const showToast = (msg, sev = "success") =>
    setSnackbar({ open: true, message: msg, severity: sev });
  const closeToast = () => setSnackbar((p) => ({ ...p, open: false }));

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const fetchAdmins = useCallback(async () => {
    if (!isSuperAdmin) return;
    try {
      const response = await axios.get(
        "http://localhost:9001/api/v1/user/clients",
        getAuthHeaders(),
      );
      if (response.data?.success && response.data?.clients) {
        setAdmins(
          response.data.clients.map((client) => ({
            _id: client._id,
            name: client.customerName || client.email,
            email: client.email,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  }, [isSuperAdmin, token]);

  const fetchTeamMembers = useCallback(async () => {
    if (isSuperAdmin) return;
    try {
      const response = await axios.get(
        "http://localhost:9001/api/v1/user/team",
        getAuthHeaders(),
      );
      if (response.data?.success && response.data?.members) {
        setTeamMembers(
          response.data.members.map((member) => ({
            _id: member.id,
            name: member.firstName
              ? `${member.firstName} ${member.lastName || ""}`
              : member.email,
            email: member.email,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  }, [isSuperAdmin, token]);

  const fetchAssets = useCallback(async () => {
    if (isSuperAdmin) return;
    try {
      const response = await axios.get(
        "http://localhost:9001/api/v1/asset",
        getAuthHeaders(),
      );
      if (response.data?.success && response.data?.assets)
        setAssets(response.data.assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  }, [isSuperAdmin, token]);

  useEffect(() => {
    if (assignDialogOpen && checklistToAssign) {
      if (isSuperAdmin) fetchAdmins();
      else {
        fetchTeamMembers();
        fetchAssets();
      }
    }
  }, [
    assignDialogOpen,
    checklistToAssign,
    isSuperAdmin,
    fetchAdmins,
    fetchTeamMembers,
    fetchAssets,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchChecklists = useCallback(async () => {
    const filters = { page: pagination.page, limit: pagination.limit };
    if (debouncedSearch) filters.search = debouncedSearch;
    const result = await getAllChecklists(filters);
    if (result.success && result.data) {
      const checklistArray = Array.isArray(result.data)
        ? result.data
        : result.data.checklists || [];
      setChecklists(checklistArray);
      if (result.data.pagination)
        setPagination((prev) => ({
          ...prev,
          total: result.data.pagination.total,
          totalPages: result.data.pagination.totalPages,
        }));
    }
  }, [getAllChecklists, debouncedSearch, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  useEffect(() => {
    if (success) {
      showToast(success, "success");
      clearMessages();
      fetchChecklists();
    }
    if (error) {
      showToast(error, "error");
      clearMessages();
    }
  }, [success, error, clearMessages, fetchChecklists]);

  const handleViewChecklist = (checklist) => {
    setSelectedChecklist(checklist);
    setViewDialogOpen(true);
  };
  const handleAssignClick = (checklist) => {
    setChecklistToAssign(checklist);
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = async (assignmentData) => {
    const result = isSuperAdmin
      ? await assignToAdmin(assignmentData)
      : await assignToTeam(assignmentData);
    if (result.success) {
      showToast("Checklist assigned successfully!", "success");
      setAssignDialogOpen(false);
      setChecklistToAssign(null);
    } else showToast(result.error || "Failed to assign checklist", "error");
  };

  const handleDeleteClick = (checklist) => {
    setChecklistToDelete(checklist);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (checklistToDelete) {
      const result = await deleteChecklist(checklistToDelete._id);
      if (result.success) {
        showToast("Checklist deleted successfully", "success");
        fetchChecklists();
      } else showToast(result.error || "Failed to delete checklist", "error");
      setDeleteDialogOpen(false);
      setChecklistToDelete(null);
    }
  };

  const handlePageChange = (event, value) =>
    setPagination((prev) => ({ ...prev, page: value }));

  const isLoading = checklistLoading || assignmentLoading;
  const getGridSize = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 4;
  };

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, sm: 3 } }}>
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
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.35rem" },
              color: C.text.primary,
            }}
          >
            Checklists
          </Typography>
          <Typography
            sx={{ fontSize: "0.75rem", color: C.text.secondary, mt: 0.5 }}
          >
            Manage inspection checklists and assignments •{" "}
            {pagination.total || 0} total checklists
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={() => navigate("/admin/checklists/clone")}
            sx={{
              borderColor: C.primary,
              color: C.primary,
              textTransform: "none",
              borderRadius: 1,
            }}
          >
            {!isMobile && "Clone Checklist"}
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ bgcolor: C.primary, textTransform: "none", borderRadius: 2 , fontSize:13 , padding: 1.3 }}
          >
            Create Checklist
          </Button>
        </Stack>
      </Stack>

      {/* Search Bar */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          p: 2,
          mb: 3,
          bgcolor: C.card,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search checklists by name, category, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: "1rem", color: C.text.disabled }} />
              </InputAdornment>
            ),
            sx: { fontSize: "0.75rem" },
          }}
        />
      </Paper>

      {/* Loading State */}
      {isLoading && checklists.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress sx={{ color: C.primary }} />
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && checklists.length === 0 && (
        <Paper
          sx={{
            textAlign: "center",
            py: 8,
            borderRadius: 3,
            border: `1px solid ${C.border}`,
          }}
        >
          <Typography sx={{ color: C.text.secondary, mb: 2 }}>
            {debouncedSearch
              ? "No checklists match your search"
              : "No checklists found"}
          </Typography>
          {!debouncedSearch && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateOpen(true)}
              sx={{ bgcolor: C.primary }}
            >
              Create Your First Checklist
            </Button>
          )}
        </Paper>
      )}

      {/* Grid View */}
      {!isLoading && checklists.length > 0 && (
        <>
          <Grid container spacing={2.5}>
            {checklists.map((checklist) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={checklist._id}>
                <ChecklistCard
                  checklist={checklist}
                  onView={handleViewChecklist}
                  onDelete={handleDeleteClick}
                  onAssign={handleAssignClick}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Modals */}
      <CreateChecklistModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <ViewChecklistDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        checklist={selectedChecklist}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        checklistName={checklistToDelete?.name || ""}
      />
      <AssignChecklistDialog
        open={assignDialogOpen}
        onClose={() => {
          setAssignDialogOpen(false);
          setChecklistToAssign(null);
        }}
        checklist={checklistToAssign}
        userRole={user?.role}
        admins={admins}
        teamMembers={teamMembers}
        assets={assets}
        onAssign={handleAssignSubmit}
        loading={assignmentLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={snackbar.severity}
          sx={{ borderRadius: 2, fontSize: "0.75rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
