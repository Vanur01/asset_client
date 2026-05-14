// pages/RequestChecklist.jsx - Complete Working Version
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
  alpha,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useAuth } from "../context/AuthContexts";
import { useRequestChecklist } from "../context/RequestChecklistContext";

// ─── Color Palette ────────────────────────────────────────────────────────────────
const C = {
  primary: "#0d4a5c",
  primaryLight: "#e6f0f3",
  primaryMid: "#2d7a9a",
  success: "#2e7d32",
  warning: "#ed6c02",
  error: "#d32f2f",
  surface: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  text: { primary: "#1e293b", secondary: "#475569", disabled: "#94a3b8" },
};

// Responsive font sizes (reduced)
const fontSizes = {
  xs: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
  sm: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
  md: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
  lg: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
  xl: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
  xxl: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
};

const getResponsiveFont = (size) => fontSizes[size];

// ─── Status Chip ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  approved: {
    bg: "#ecfdf5",
    color: "#065f46",
    label: "Approved",
    Icon: CheckCircleIcon,
  },
  rejected: {
    bg: "#fef2f2",
    color: "#991b1b",
    label: "Rejected",
    Icon: CancelIcon,
  },
  under_review: {
    bg: "#eff6ff",
    color: "#1d4ed8",
    label: "Under Review",
    Icon: RateReviewIcon,
  },
  in_progress: {
    bg: "#fdf4ff",
    color: "#7e22ce",
    label: "In Progress",
    Icon: AssignmentIcon,
  },
  pending: {
    bg: "#fff8e1",
    color: "#b45309",
    label: "Pending",
    Icon: PendingIcon,
  },
};

const StatusChip = ({ status }) => {
  const key = typeof status === "string" ? status : status?.status || "pending";
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.pending;
  const { Icon } = cfg;
  return (
    <Chip
      size="small"
      label={cfg.label}
      icon={
        <Icon
          sx={{ fontSize: "12px !important", color: `${cfg.color} !important` }}
        />
      }
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 600,
        fontSize: getResponsiveFont("xs"),
        height: 24,
        borderRadius: "6px",
        "& .MuiChip-icon": { ml: "4px", mr: "2px" },
      }}
    />
  );
};

const UrgencyChip = ({ level }) => {
  const urgencyMap = {
    low: { bg: "#ecfdf5", color: "#065f46", label: "LOW" },
    medium: { bg: "#fff8e1", color: "#b45309", label: "MEDIUM" },
    high: { bg: "#fff3e0", color: "#c2410c", label: "HIGH" },
    critical: { bg: "#fef2f2", color: "#991b1b", label: "CRITICAL" },
  };
  const levelLower = level?.toLowerCase() || "medium";
  const cfg = urgencyMap[levelLower] || urgencyMap.medium;
  return (
    <Chip
      size="small"
      label={cfg.label}
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 700,
        fontSize: getResponsiveFont("xs"),
        height: 22,
        borderRadius: "4px",
      }}
    />
  );
};

// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, iconBg, iconColor }) => (
  <Card
    sx={{
      borderRadius: "12px",
      border: `1px solid ${alpha(C.primary, 0.08)}`,
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      transition: "all 0.2s ease",
      width: "285px",
      height: "100%",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: `0 4px 12px ${alpha(C.primary, 0.08)}`,
      },
    }}
  >
    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography
            sx={{
              fontSize: getResponsiveFont("xs"),
              fontWeight: 600,
              color: C.text.disabled,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontSize: getResponsiveFont("xl"),
              fontWeight: 800,
              color: C.primary,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            borderRadius: "10px",
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: { xs: 18, sm: 20 } } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// ─── Section Label ─────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontSize: getResponsiveFont("xs"),
      fontWeight: 700,
      color: C.text.disabled,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      mb: 0.75,
    }}
  >
    {children}
  </Typography>
);

// ─── Submit Request Dialog ─────────────────────────────────────────────────
const SubmitRequestDialog = ({ open, onClose, onSubmit, loading }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState({
    checklistName: "",
    category: "",
    detailedDescription: "",
    businessJustification: "",
    urgencyLevel: "medium",
    expectedUsageFrequency: "monthly",
    numberOfTeamMembers: 1,
    additionalNotes: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    setForm({
      checklistName: "",
      category: "",
      detailedDescription: "",
      businessJustification: "",
      urgencyLevel: "medium",
      expectedUsageFrequency: "monthly",
      numberOfTeamMembers: 1,
      additionalNotes: "",
    });
    onClose();
  };

  const isDisabled =
    !form.checklistName.trim() ||
    !form.category ||
    !form.detailedDescription.trim() ||
    !form.businessJustification.trim();

  const handleSubmit = () => {
    onSubmit({
      checklistName: form.checklistName,
      category: form.category,
      detailedDescription: form.detailedDescription,
      businessJustification: form.businessJustification,
      urgencyLevel: form.urgencyLevel,
      expectedUsageFrequency: form.expectedUsageFrequency,
      numberOfTeamMembers: parseInt(form.numberOfTeamMembers) || 1,
      additionalNotes: form.additionalNotes || "",
    });
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: getResponsiveFont("md"),
      "&.Mui-focused fieldset": { borderColor: C.primary },
    },
    "& .MuiInputLabel-root": {
      fontSize: getResponsiveFont("sm"),
      "&.Mui-focused": { color: C.primary },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : "16px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryMid} 100%)`,
          color: "#fff",
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              fontWeight={700}
              sx={{ fontSize: getResponsiveFont("lg") }}
            >
              Request New Checklist
            </Typography>
            <Typography
              sx={{
                fontSize: getResponsiveFont("sm"),
                opacity: 0.85,
                mt: 0.25,
              }}
            >
              Submit your request for a custom checklist form
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "#fff", mt: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2.5, bgcolor: "#fafbfc" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Checklist Name *"
              placeholder="e.g., Fire Safety Inspection"
              value={form.checklistName}
              onChange={handleChange("checklistName")}
              size="small"
              sx={textFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: getResponsiveFont("sm") }}>
                Category *
              </InputLabel>
              <Select
                value={form.category}
                onChange={handleChange("category")}
                label="Category *"
                sx={{ borderRadius: "8px", fontSize: getResponsiveFont("md") }}
              >
                {[
                  "Safety",
                  "Equipment",
                  "Environmental",
                  "Quality",
                  "Compliance",
                  "Maintenance",
                  "Audit",
                ].map((c) => (
                  <MenuItem
                    key={c}
                    value={c}
                    sx={{ fontSize: getResponsiveFont("md") }}
                  >
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Detailed Description *"
              placeholder="Mention fields, sections, approvals, workflow, etc."
              value={form.detailedDescription}
              onChange={handleChange("detailedDescription")}
              size="small"
              sx={textFieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Business Justification *"
              placeholder="Why is this checklist required? What problem will it solve?"
              value={form.businessJustification}
              onChange={handleChange("businessJustification")}
              size="small"
              sx={textFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: getResponsiveFont("sm") }}>
                Urgency Level
              </InputLabel>
              <Select
                value={form.urgencyLevel}
                onChange={handleChange("urgencyLevel")}
                label="Urgency Level"
                sx={{ borderRadius: "8px", fontSize: getResponsiveFont("md") }}
              >
                <MenuItem
                  value="low"
                  sx={{ fontSize: getResponsiveFont("md") }}
                >
                  Low
                </MenuItem>
                <MenuItem
                  value="medium"
                  sx={{ fontSize: getResponsiveFont("md") }}
                >
                  Medium
                </MenuItem>
                <MenuItem
                  value="high"
                  sx={{ fontSize: getResponsiveFont("md") }}
                >
                  High
                </MenuItem>
                <MenuItem
                  value="critical"
                  sx={{ fontSize: getResponsiveFont("md") }}
                >
                  Critical
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: getResponsiveFont("sm") }}>
                Usage Frequency
              </InputLabel>
              <Select
                value={form.expectedUsageFrequency}
                onChange={handleChange("expectedUsageFrequency")}
                label="Usage Frequency"
                sx={{ borderRadius: "8px", fontSize: getResponsiveFont("md") }}
              >
                <MenuItem
                  value="daily"
                  sx={{ fontSize: getResponsiveFont("md") }}
                >
                  Daily
                </MenuItem>
                <MenuItem
                  value="weekly"
                  sx={{ fontSize: getResponsiveFont("md") }}
                >
                  Weekly
                </MenuItem>
                <MenuItem
                  value="monthly"
                  sx={{ fontSize: getResponsiveFont("md") }}
                >
                  Monthly
                </MenuItem>
                <MenuItem
                  value="quarterly"
                  sx={{ fontSize: getResponsiveFont("md") }}
                >
                  Quarterly
                </MenuItem>
                <MenuItem
                  value="yearly"
                  sx={{ fontSize: getResponsiveFont("md") }}
                >
                  Yearly
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Number of Team Members"
              value={form.numberOfTeamMembers}
              onChange={handleChange("numberOfTeamMembers")}
              inputProps={{ min: 1, max: 100 }}
              size="small"
              sx={textFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Additional Notes"
              placeholder="Optional notes or special requirements..."
              value={form.additionalNotes}
              onChange={handleChange("additionalNotes")}
              multiline
              rows={1}
              size="small"
              sx={textFieldSx}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.5,
          gap: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          fullWidth={fullScreen}
          variant="outlined"
          onClick={handleClose}
          size="small"
          sx={{
            borderRadius: "8px",
            fontSize: getResponsiveFont("sm"),
            textTransform: "none",
            py: 0.5,
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth={fullScreen}
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || isDisabled}
          size="small"
          sx={{
            backgroundColor: C.primary,
            borderRadius: "8px",
            fontSize: getResponsiveFont("sm"),
            textTransform: "none",
            py: 0.5,
            "&:hover": { backgroundColor: C.primaryMid },
          }}
        >
          {loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Submit Request"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Review Request Dialog ─────────────────────────────────────────────────
const ReviewRequestDialog = ({ open, onClose, request, onReview, loading }) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    if (open) {
      setRejectionReason("");
      setSelectedAction(null);
    }
  }, [open]);

  const handleAction = (action) => {
    if (action === "rejected" && !rejectionReason.trim()) {
      return;
    }
    onReview(action, rejectionReason || null);
    setSelectedAction(action);
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: getResponsiveFont("md"),
      "&.Mui-focused fieldset": { borderColor: C.primary },
    },
    "& .MuiInputLabel-root": {
      fontSize: getResponsiveFont("sm"),
      "&.Mui-focused": { color: C.primary },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`,
          color: "#fff",
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              fontWeight={700}
              sx={{ fontSize: getResponsiveFont("lg") }}
            >
              Review Request
            </Typography>
            <Typography
              sx={{
                fontSize: getResponsiveFont("sm"),
                opacity: 0.85,
                mt: 0.25,
              }}
            >
              {request?.checklistName}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#fff", mt: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2.5, bgcolor: "#fafbfc" }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <Box sx={{ mb: 1, mt: 1 }}>
              <SectionLabel>Select Action</SectionLabel>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleAction("approved")}
                disabled={loading}
                startIcon={<ThumbUpIcon />}
                sx={{
                  backgroundColor: C.success,
                  borderRadius: "8px",
                  width: "200px",
                  fontSize: getResponsiveFont("md"),
                  textTransform: "none",
                  py: 1,
                  "&:hover": { backgroundColor: "#1b5e20" },
                }}
              >
                Approve
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleAction("under_review")}
                disabled={loading}
                startIcon={<RemoveRedEyeIcon />}
                sx={{
                  backgroundColor: "#1d4ed8",
                  borderRadius: "8px",
                  width: "200px",
                  fontSize: getResponsiveFont("md"),
                  textTransform: "none",
                  py: 1,
                  "&:hover": { backgroundColor: "#1e40af" },
                }}
              >
                Under Review
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleAction("rejected")}
                disabled={loading || !rejectionReason.trim()}
                startIcon={<ThumbDownIcon />}
                sx={{
                  backgroundColor: C.error,
                  borderRadius: "8px",
                  fontSize: getResponsiveFont("md"),
                  textTransform: "none",
                  width: "200px",
                  py: 1,
                  "&:hover": { backgroundColor: "#b71c1c" },
                }}
              >
                Reject
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason"
              placeholder="Please provide a reason for rejection (required for rejection)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              size="small"
              helperText="Required when rejecting a request"
              sx={{
                ...textFieldSx,
                width: "400px",
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 1.5, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          size="small"
          sx={{
            borderRadius: "8px",
            fontSize: getResponsiveFont("sm"),
            textTransform: "none",
            py: 0.5,
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── View Request Dialog ───────────────────────────────────────────────────
const ViewRequestDialog = ({
  open,
  onClose,
  request,
  userRole,
  onReviewClick,
}) => {
  if (!request) return null;

  const canReview =
    userRole === "super_admin" &&
    request.status !== "approved" &&
    request.status !== "rejected";

  const InfoField = ({ label, value }) => (
    <Box>
      <SectionLabel>{label}</SectionLabel>
      <Typography
        sx={{
          fontSize: getResponsiveFont("md"),
          color: C.text.primary,
          fontWeight: 500,
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`,
          color: "#fff",
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            fontWeight={700}
            sx={{ fontSize: getResponsiveFont("lg") }}
          >
            Request Details
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2.5, bgcolor: "#fafbfc" }}>
        {/* Header */}
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1}
          mb={2}
        >
          <Box>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: getResponsiveFont("md"),
                color: C.primary,
                mb: 0.5,
              }}
            >
              {request.checklistName}
            </Typography>
            <Box display="flex" gap={0.75} flexWrap="wrap">
              <StatusChip status={request.status} />
              <UrgencyChip level={request.urgencyLevel} />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarTodayIcon sx={{ fontSize: 12, color: C.text.disabled }} />
            <Typography
              sx={{
                fontSize: getResponsiveFont("xs"),
                color: C.text.secondary,
              }}
            >
              {new Date(request.requestDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Meta Info Grid */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6} sm={3}>
            <InfoField label="Category" value={request.category} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoField
              label="Requested By"
              value={request.requestedByName || request.requestedBy?.email}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoField
              label="Team Members"
              value={request.numberOfTeamMembers || 1}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoField
              label="Usage Frequency"
              value={request.expectedUsageFrequency || "—"}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 1.5 }} />

        {/* Description Fields */}
        <Stack spacing={2}>
          <Box>
            <SectionLabel>Detailed Description</SectionLabel>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: "8px",
                bgcolor: "#fff",
                borderColor: C.border,
                fontSize: getResponsiveFont("sm"),
                lineHeight: 1.5,
              }}
            >
              {request.detailedDescription}
            </Paper>
          </Box>

          <Box>
            <SectionLabel>Business Justification</SectionLabel>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: "8px",
                bgcolor: "#fff",
                borderColor: C.border,
                fontSize: getResponsiveFont("sm"),
                lineHeight: 1.5,
              }}
            >
              {request.businessJustification}
            </Paper>
          </Box>

          {request.additionalNotes && (
            <Box>
              <SectionLabel>Additional Notes</SectionLabel>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: "8px",
                  bgcolor: "#fff",
                  borderColor: C.border,
                  fontSize: getResponsiveFont("sm"),
                  lineHeight: 1.5,
                }}
              >
                {request.additionalNotes}
              </Paper>
            </Box>
          )}

          {request.rejectionReason && (
            <Box>
              <SectionLabel>Rejection Reason</SectionLabel>
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: "8px",
                  bgcolor: alpha(C.error, 0.05),
                  border: `1px solid ${alpha(C.error, 0.2)}`,
                  fontSize: getResponsiveFont("sm"),
                  color: C.error,
                }}
              >
                {request.rejectionReason}
              </Paper>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 1.5, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          size="small"
          sx={{
            borderRadius: "8px",
            fontSize: getResponsiveFont("sm"),
            textTransform: "none",
            py: 0.5,
          }}
        >
          Close
        </Button>
        {canReview && (
          <Button
            variant="contained"
            onClick={() => onReviewClick(request)}
            size="small"
            sx={{
              backgroundColor: C.primary,
              borderRadius: "8px",
              fontSize: getResponsiveFont("sm"),
              textTransform: "none",
              py: 0.5,
              "&:hover": { backgroundColor: C.primaryMid },
            }}
          >
            Review Request
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function RequestChecklist() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const {
    submitRequest,
    getAllRequests,
    getRequestStats,
    reviewRequest,
    loading: contextLoading,
    clearMessages,
  } = useRequestChecklist();

  const isSuperAdmin = user?.role === "super_admin";

  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    under_review: 0,
    in_progress: 0,
    total: 0,
  });
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await getRequestStats();
      if (result.success && result.data?.counts) {
        setStats(result.data.counts);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [getRequestStats]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { page, limit };
      if (debouncedSearch) filters.search = debouncedSearch;
      if (tabValue === 1) filters.status = "pending";
      if (tabValue === 2) filters.status = "under_review";
      if (tabValue === 3) filters.status = "approved";

      const result = await getAllRequests(filters);
      if (result.success && result.data?.requests) {
        setRequests(result.data.requests);
        if (result.data.pagination) {
          setPagination({
            total: result.data.pagination.total || 0,
            totalPages: result.data.pagination.totalPages || 1,
          });
        }
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch requests",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [getAllRequests, page, limit, debouncedSearch, tabValue]);

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, [fetchStats, fetchRequests]);

  const handleSubmitRequest = async (formData) => {
    setSubmitLoading(true);
    try {
      const result = await submitRequest(formData);
      if (result.success) {
        setSubmitDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Request submitted successfully!",
          severity: "success",
        });
        fetchRequests();
        fetchStats();
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to submit request",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "An error occurred",
        severity: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReviewRequest = async (action, rejectionReason = null) => {
    setReviewLoading(true);
    try {
      const result = await reviewRequest(
        selectedRequest._id,
        action,
        rejectionReason,
      );
      if (result.success) {
        setReviewDialogOpen(false);
        setViewDialogOpen(false);
        setSnackbar({
          open: true,
          message: `Request ${action.replace("_", " ")} successfully!`,
          severity: "success",
        });
        fetchRequests();
        fetchStats();
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to review request",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "An error occurred",
        severity: "error",
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Requests",
      value: stats.total || 0,
      icon: <AssignmentIcon />,
      iconBg: alpha(C.primary, 0.1),
      iconColor: C.primary,
    },
    {
      label: "Pending",
      value: stats.pending || 0,
      icon: <PendingIcon />,
      iconBg: alpha("#b45309", 0.1),
      iconColor: "#b45309",
    },
    {
      label: "Under Review",
      value: stats.under_review || 0,
      icon: <RateReviewIcon />,
      iconBg: alpha("#1d4ed8", 0.1),
      iconColor: "#1d4ed8",
    },
    {
      label: "Approved",
      value: stats.approved || 0,
      icon: <CheckCircleIcon />,
      iconBg: alpha("#065f46", 0.1),
      iconColor: "#065f46",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2.5, md: 3 },
        minHeight: "100vh",
        bgcolor: C.surface,
      }}
    >
      {/* Loading Overlay */}
      {(loading || contextLoading) && !submitLoading && !reviewLoading && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            height: 2,
          }}
        />
      )}

      {/* Header */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2.5}
      >
        <Box>
          <Typography
            sx={{
              fontSize: getResponsiveFont("xl"),
              fontWeight: 800,
              color: C.primary,
            }}
          >
            Checklist Requests
          </Typography>
          <Typography
            sx={{
              fontSize: getResponsiveFont("sm"),
              color: C.text.secondary,
              mt: 0.25,
            }}
          >
            {isSuperAdmin
              ? "Manage and review checklist requests"
              : "Submit and track your checklist requests"}
          </Typography>
        </Box>
        {!isSuperAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setSubmitDialogOpen(true)}
            size="small"
            sx={{
              backgroundColor: C.primary,
              borderRadius: "8px",
              fontSize: getResponsiveFont("sm"),
              textTransform: "none",
              py: 0.5,
              px: 2,
              "&:hover": { backgroundColor: C.primaryMid },
            }}
          >
            New Request
          </Button>
        )}
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={1.5} mb={2.5}>
        {statCards.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Tabs and Search */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${alpha(C.primary, 0.08)}`,
          borderRadius: "12px",
          mb: 2,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => {
            setTabValue(newValue);
            setPage(1);
          }}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            borderBottom: `1px solid ${alpha(C.primary, 0.08)}`,
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: getResponsiveFont("sm"),
              fontWeight: 500,
              py: 1,
              color: C.text.secondary,
            },
            "& .MuiTab-root.Mui-selected": {
              color: C.primary,
              fontWeight: 700,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: C.primary,
              height: 2,
              borderRadius: "2px",
            },
          }}
        >
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="Under Review" />
          <Tab label="Approved" />
        </Tabs>

        <Box sx={{ p: 1.5 }}>
          <TextField
            fullWidth
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: C.text.disabled, fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: getResponsiveFont("sm"),
                bgcolor: "#f8fafc",
              },
            }}
          />
        </Box>
      </Paper>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${alpha(C.primary, 0.08)}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: getResponsiveFont("xs"),
                    color: C.text.disabled,
                    py: 1,
                  }}
                >
                  Request
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: getResponsiveFont("xs"),
                    color: C.text.disabled,
                    py: 1,
                  }}
                >
                  Requester
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: getResponsiveFont("xs"),
                    color: C.text.disabled,
                    py: 1,
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: getResponsiveFont("xs"),
                    color: C.text.disabled,
                    py: 1,
                  }}
                >
                  Urgency
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: getResponsiveFont("xs"),
                    color: C.text.disabled,
                    py: 1,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: getResponsiveFont("xs"),
                    color: C.text.disabled,
                    py: 1,
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} sx={{ color: C.primary }} />
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography
                      sx={{
                        fontSize: getResponsiveFont("sm"),
                        color: C.text.disabled,
                      }}
                    >
                      {debouncedSearch ? "No matches" : "No requests"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((row) => (
                  <TableRow
                    key={row._id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#f8fafc" },
                      "& td": { py: 1 },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: getResponsiveFont("sm"),
                          color: C.primary,
                        }}
                      >
                        {row.checklistName}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: getResponsiveFont("sm"),
                        color: C.text.secondary,
                      }}
                    >
                      {row.requestedByName || row.requestedBy?.email}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.category}
                        size="small"
                        sx={{
                          bgcolor: alpha(C.primary, 0.08),
                          color: C.primary,
                          fontWeight: 600,
                          fontSize: getResponsiveFont("xs"),
                          height: 22,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <UrgencyChip level={row.urgencyLevel} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <Button
                          size="small"
                          startIcon={
                            <VisibilityIcon
                              sx={{ fontSize: "14px !important" }}
                            />
                          }
                          onClick={() => {
                            setSelectedRequest(row);
                            setViewDialogOpen(true);
                          }}
                          sx={{
                            color: C.primary,
                            bgcolor: alpha(C.primary, 0.08),
                            borderRadius: "6px",
                            fontSize: getResponsiveFont("xs"),
                            textTransform: "none",
                            px: 1,
                            minWidth: "auto",
                          }}
                        >
                          View
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: getResponsiveFont("sm"),
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: C.primary,
                color: "#fff",
              },
            }}
          />
        </Box>
      )}

      {/* Dialogs */}
      <SubmitRequestDialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        onSubmit={handleSubmitRequest}
        loading={submitLoading}
      />
      <ViewRequestDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        request={selectedRequest}
        userRole={user?.role}
        onReviewClick={(req) => {
          setSelectedRequest(req);
          setReviewDialogOpen(true);
        }}
      />
      <ReviewRequestDialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        request={selectedRequest}
        onReview={handleReviewRequest}
        loading={reviewLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => {
          setSnackbar((prev) => ({ ...prev, open: false }));
          clearMessages();
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => {
            setSnackbar((prev) => ({ ...prev, open: false }));
            clearMessages();
          }}
          sx={{ borderRadius: "8px", fontSize: getResponsiveFont("sm") }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
