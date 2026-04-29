// pages/RequestChecklist.jsx
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
  RadioGroup,
  Radio,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FlagIcon from "@mui/icons-material/Flag";
import { useAuth } from "../context/AuthContexts";
import { useRequestChecklist } from "../context/RequestChecklistContext";

// ─── Constants ────────────────────────────────────────────────────────────────
const PRIMARY = "#1a4a5c";
const PRIMARY_LIGHT = "#e8f4f8";
const PRIMARY_MID = "#2d7a9a";

// ─── Styled Components ────────────────────────────────────────────────────────
const StatCard = styled(Card)(() => ({
  borderRadius: 14,
  width:"268px",
  border: `1px solid ${PRIMARY}18`,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 18px ${PRIMARY}18`,
  },
}));

const PrimaryButton = styled(Button)(() => ({
  backgroundColor: PRIMARY,
  color: "#fff",
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 10,
  textTransform: "none",
  padding: "8px 20px",
  "&:hover": { backgroundColor: PRIMARY_MID },
  "&:disabled": { backgroundColor: `${PRIMARY}50`, color: "#fff" },
}));

const OutlineButton = styled(Button)(() => ({
  borderColor: `${PRIMARY}50`,
  color: PRIMARY,
  fontWeight: 500,
  fontSize: 13,
  borderRadius: 10,
  textTransform: "none",
  padding: "8px 20px",
  "&:hover": { borderColor: PRIMARY, backgroundColor: PRIMARY_LIGHT },
}));

// ─── Status Chip ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
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
  const cfg = STATUS_MAP[key] || STATUS_MAP.pending;
  const { Icon } = cfg;
  return (
    <Chip
      size="small"
      label={cfg.label}
      icon={
        <Icon
          sx={{ fontSize: "13px !important", color: `${cfg.color} !important` }}
        />
      }
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 700,
        fontSize: 11,
        height: 26,
        borderRadius: "6px",
        "& .MuiChip-icon": { ml: "6px" },
      }}
    />
  );
};

const UrgencyChip = ({ level }) => {
  const map = {
    low: { bg: "#ecfdf5", color: "#065f46" },
    medium: { bg: "#fff8e1", color: "#b45309" },
    high: { bg: "#fff3e0", color: "#c2410c" },
    critical: { bg: "#fef2f2", color: "#991b1b" },
  };
  const levelLower = level?.toLowerCase() || "medium";
  const cfg = map[levelLower] || { bg: `${PRIMARY}10`, color: PRIMARY };
  return (
    <Chip
      size="small"
      label={(level || "MEDIUM").toUpperCase()}
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 700,
        fontSize: 10,
        height: 24,
        borderRadius: "6px",
      }}
    />
  );
};

// ─── Section Label ─────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontSize: 11,
      fontWeight: 700,
      color: "#94a3b8",
      textTransform: "uppercase",
      letterSpacing: ".6px",
      mb: 0.75,
    }}
  >
    {children}
  </Typography>
);

const InfoBox = styled(Paper)(({ variant: v }) => ({
  padding: "10px 14px",
  borderRadius: 8,
  fontSize: 13,
  lineHeight: 1.6,
  ...(v === "danger" && {
    background: "#fef2f2",
    borderColor: "#fca5a5",
    color: "#991b1b",
  }),
  ...(v === "success" && {
    background: "#ecfdf5",
    borderColor: "#6ee7b7",
    color: "#065f46",
  }),
  ...(!v && {
    background: "#f8fafc",
    borderColor: "#e2e8f0",
    color: "#334155",
  }),
}));

// ─── Submit Request Dialog ────────────────────────────────────────────────────
function SubmitRequestDialog({ open, onClose, onSubmit, loading }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const init = {
    checklistName: "",
    category: "",
    detailedDescription: "",
    businessJustification: "",
    urgencyLevel: "medium",
    expectedUsageFrequency: "monthly",
    numberOfTeamMembers: 1,
    additionalNotes: "",
  };
  const [form, setForm] = useState(init);

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const disabled =
    !form.checklistName ||
    !form.category ||
    !form.detailedDescription ||
    !form.businessJustification;

  const handleClose = () => {
    setForm(init);
    onClose();
  };

  const handleSubmit = () => {
    // Prepare data for API
    const submitData = {
      checklistName: form.checklistName,
      category: form.category,
      detailedDescription: form.detailedDescription,
      businessJustification: form.businessJustification,
      urgencyLevel: form.urgencyLevel.toLowerCase(),
      expectedUsageFrequency: form.expectedUsageFrequency.toLowerCase(),
      numberOfTeamMembers: parseInt(form.numberOfTeamMembers) || 1,
      additionalNotes: form.additionalNotes || "",
    };
    onSubmit(submitData);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontSize: 13,
      "&.Mui-focused fieldset": { borderColor: PRIMARY },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: PRIMARY },
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
          width: "100%",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_MID} 100%)`,
          color: "#fff",
          px: 3,
          py: 2.5,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography fontWeight={700} fontSize={18}>
              Request New Checklist
            </Typography>
            <Typography fontSize={12} sx={{ opacity: 0.8, mt: 0.5 }}>
              Submit your request for a custom checklist form
            </Typography>
          </Box>

          <IconButton onClick={handleClose} sx={{ color: "#fff", mt: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 2, sm: 3 },
          py: 3,
          bgcolor: "#fafbfc",
          mt: 2,
        }}
      >
        <Grid container spacing={2}>
          {/* Checklist Name */}
          <Grid item xs={12} sm={6} sx={{width:"250px"}}>
            <TextField
              fullWidth
              size="small"
              label="Checklist Name *"
              placeholder="e.g. Fire Safety Inspection"
              value={form.checklistName}
              onChange={set("checklistName")}
              sx={fieldSx}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6} sx={{width:"250px"}}>
            <FormControl fullWidth size="small">
              <InputLabel>Category *</InputLabel>
              <Select
                label="Category *"
                value={form.category}
                onChange={set("category")}
                sx={{ borderRadius: "10px" }}
              >
                {[
                  "Safety",
                  "Equipment",
                  "Environmental",
                  "Quality",
                  "Compliance",
                ].map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Description */}
          <Grid item xs={12} sx={{width:"250px"}}>
            <TextField
            fullWidth
              label="Detailed Description *"
              placeholder="Mention fields, sections, approvals, workflow, etc."
              value={form.detailedDescription}
              onChange={set("detailedDescription")}
              sx={fieldSx}
            />
          </Grid>

          {/* Business Justification */}
          <Grid item xs={12} sx={{width:"250px"}}>
            <TextField
              fullWidth
              label="Business Justification *"
              placeholder="Why is this checklist required?"
              value={form.businessJustification}
              onChange={set("businessJustification")}
              sx={fieldSx}
            />
          </Grid>

          {/* Urgency */}
          <Grid item xs={12} sm={6} sx={{width:"250px"}}>
            <FormControl fullWidth size="small">
              <InputLabel>Urgency Level</InputLabel>
              <Select
                label="Urgency Level"
                value={form.urgencyLevel}
                onChange={set("urgencyLevel")}
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Frequency */}
          <Grid item xs={12} sm={6} sx={{width:"250px"}}>
            <FormControl fullWidth size="small">
              <InputLabel>Usage Frequency</InputLabel>
              <Select
                label="Usage Frequency"
                value={form.expectedUsageFrequency}
                onChange={set("expectedUsageFrequency")}
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Team Members */}
          <Grid item xs={12} sm={6} sx={{width:"250px"}}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Number of Team Members"
              value={form.numberOfTeamMembers}
              onChange={set("numberOfTeamMembers")}
              inputProps={{ min: 1, max: 100 }}
              sx={fieldSx}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12} sm={6} sx={{width:"250px"}}>
            <TextField
              fullWidth
              size="small"
              label="Additional Notes"
              placeholder="Optional notes..."
              value={form.additionalNotes}
              onChange={set("additionalNotes")}
              sx={fieldSx}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1.5,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <OutlineButton
          fullWidth={fullScreen}
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </OutlineButton>

        <PrimaryButton
          fullWidth={fullScreen}
          onClick={handleSubmit}
          disabled={loading || disabled}
          startIcon={
            loading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <AddIcon fontSize="small" />
            )
          }
        >
          {loading ? "Submitting..." : "Submit Request"}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}

// ─── Review Dialog ────────────────────────────────────────────────────────────
function ReviewRequestDialog({ open, onClose, request, onReview, loading }) {
  const [action, setAction] = useState("under_review");
  const [comments, setComments] = useState("");
  const [checklistId, setChecklistId] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (open) {
      setAction("under_review");
      setComments("");
      setChecklistId("");
      setRejectReason("");
    }
  }, [open]);

  const canSubmit =
    comments.trim() &&
    (action !== "approved" || checklistId.trim()) &&
    (action !== "rejected" || rejectReason.trim());

  const handleSubmit = () => {
    onReview(
      action,
      comments,
      action === "approved" ? checklistId : null,
      action === "rejected" ? rejectReason : null,
    );
  };

  const radioSx = { color: PRIMARY, "&.Mui-checked": { color: PRIMARY } };
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontSize: 13,
      "&.Mui-focused fieldset": { borderColor: PRIMARY },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: PRIMARY },
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
          background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_MID})`,
          color: "#fff",
          px: 3,
          py: 2.5,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography fontWeight={700} fontSize={18}>
              Review Request
            </Typography>
            <Typography fontSize={12} sx={{ opacity: 0.8, mt: 0.5 }}>
              {request?.checklistName}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#fff", mt: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, bgcolor: "#fafbfc" }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <SectionLabel>Action *</SectionLabel>
            <RadioGroup
              row
              value={action}
              onChange={(e) => setAction(e.target.value)}
              sx={{ gap: 1 }}
            >
              {[
                { value: "under_review", label: "Under Review" },
                { value: "approved", label: "Approve" },
                { value: "rejected", label: "Reject" },
              ].map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  control={<Radio size="small" sx={radioSx} />}
                  sx={{
                    border: `1.5px solid`,
                    borderColor: action === opt.value ? PRIMARY : "#e2e8f0",
                    borderRadius: "10px",
                    px: 1.5,
                    py: 0.5,
                    mr: 0,
                    bgcolor:
                      action === opt.value ? PRIMARY_LIGHT : "transparent",
                    transition: "all .15s",
                    "& .MuiFormControlLabel-label": {
                      fontSize: 13,
                      fontWeight: action === opt.value ? 600 : 400,
                      color: action === opt.value ? PRIMARY : "#475569",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="Review Comments *"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              sx={fieldSx}
            />
          </Grid>

          {action === "approved" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Created Checklist ID *"
                placeholder="Enter the ID of the created checklist"
                helperText="Enter the checklist ID that was created from this request"
                value={checklistId}
                onChange={(e) => setChecklistId(e.target.value)}
                sx={fieldSx}
              />
            </Grid>
          )}

          {action === "rejected" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Rejection Reason *"
                helperText="Explain why this request is being rejected"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                sx={fieldSx}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
        <OutlineButton variant="outlined" onClick={onClose}>
          Cancel
        </OutlineButton>
        <PrimaryButton
          onClick={handleSubmit}
          disabled={loading || !canSubmit}
          startIcon={
            loading ? <CircularProgress size={15} color="inherit" /> : null
          }
        >
          {loading ? "Processing…" : "Submit Review"}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}

// ─── View Request Dialog ──────────────────────────────────────────────────────
function ViewRequestDialog({
  open,
  onClose,
  request,
  userRole,
  onReviewClick,
}) {
  if (!request) return null;

  const canReview =
    userRole === "super_admin" &&
    request.status !== "approved" &&
    request.status !== "rejected";

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
          background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_MID})`,
          color: "#fff",
          px: 3,
          py: 2.5,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={700} fontSize={18}>
            Request Details
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 3, bgcolor: "#fafbfc" }}>
        {/* Title row */}
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
              fontSize={17}
              color={PRIMARY}
              mb={0.75}
            >
              {request.checklistName}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <StatusChip status={request.status} />
              <UrgencyChip level={request.urgencyLevel} />
            </Box>
          </Box>
          <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
            {new Date(request.requestDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Meta grid */}
        <Grid container spacing={2} mb={2}>
          {[
            { label: "Category", value: request.category },
            {
              label: "Requested By",
              value: request.requestedByName || request.requestedBy?.email,
            },
            { label: "Team Members", value: request.numberOfTeamMembers || 1 },
            {
              label: "Usage Frequency",
              value: request.expectedUsageFrequency || "—",
            },
          ].map((item) => (
            <Grid item xs={6} sm={3} key={item.label}>
              <SectionLabel>{item.label}</SectionLabel>
              <Typography fontSize={13} fontWeight={600} color={PRIMARY}>
                {item.value}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Text blocks */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <SectionLabel>Detailed Description</SectionLabel>
            <InfoBox variant="outlined">{request.detailedDescription}</InfoBox>
          </Box>
          <Box>
            <SectionLabel>Business Justification</SectionLabel>
            <InfoBox variant="outlined">
              {request.businessJustification}
            </InfoBox>
          </Box>
          {request.additionalNotes && (
            <Box>
              <SectionLabel>Additional Notes</SectionLabel>
              <InfoBox variant="outlined">{request.additionalNotes}</InfoBox>
            </Box>
          )}
          {request.reviewComments && (
            <Box>
              <SectionLabel>Review Comments</SectionLabel>
              <InfoBox
                variant="success"
                sx={{
                  background: "#ecfdf5",
                  borderColor: "#6ee7b7",
                  color: "#065f46",
                }}
              >
                {request.reviewComments}
              </InfoBox>
            </Box>
          )}
          {request.rejectionReason && (
            <Box>
              <SectionLabel>Rejection Reason</SectionLabel>
              <InfoBox
                variant="danger"
                sx={{
                  background: "#fef2f2",
                  borderColor: "#fca5a5",
                  color: "#991b1b",
                }}
              >
                {request.rejectionReason}
              </InfoBox>
            </Box>
          )}
          {request.createdChecklistName && (
            <Box>
              <SectionLabel>Created Checklist</SectionLabel>
              <InfoBox
                variant="success"
                sx={{
                  background: "#ecfdf5",
                  borderColor: "#6ee7b7",
                  color: "#065f46",
                }}
              >
                {request.createdChecklistName}
              </InfoBox>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
        <OutlineButton variant="outlined" onClick={onClose}>
          Close
        </OutlineButton>
        {canReview && (
          <PrimaryButton onClick={() => onReviewClick(request)}>
            Review Request
          </PrimaryButton>
        )}
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RequestChecklist() {
  const { user } = useAuth();
  const {
    submitRequest,
    getAllRequests,
    getRequestStats,
    reviewRequest,
    loading,
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchStats = useCallback(async () => {
    const r = await getRequestStats();
    if (r.success && r.data?.counts) setStats(r.data.counts);
  }, [getRequestStats]);

  const fetchRequests = useCallback(async () => {
    const filters = { page, limit };
    if (debouncedSearch) filters.search = debouncedSearch;
    if (tabValue === 1) filters.status = "pending";
    if (tabValue === 2) filters.status = "under_review";
    if (tabValue === 3) filters.status = "approved";
    const r = await getAllRequests(filters);
    if (r.success && r.data?.requests) {
      setRequests(r.data.requests);
      if (r.data.pagination)
        setPagination({
          total: r.data.pagination.total || 0,
          totalPages: r.data.pagination.totalPages || 1,
        });
    }
  }, [getAllRequests, page, limit, debouncedSearch, tabValue]);

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, [fetchStats, fetchRequests]);

  const handleSubmitRequest = async (formData) => {
    setSubmitLoading(true);
    const r = await submitRequest(formData);
    setSubmitLoading(false);
    if (r.success) {
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
        message: r.error || "Failed to submit request",
        severity: "error",
      });
    }
  };

  const handleReviewRequest = async (
    action,
    reviewComments,
    createdChecklistId = null,
    rejectionReason = null,
  ) => {
    setReviewLoading(true);
    const r = await reviewRequest(
      selectedRequest._id,
      action,
      reviewComments,
      createdChecklistId,
      rejectionReason,
    );
    setReviewLoading(false);
    if (r.success) {
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
        message: r.error || "Failed to review request",
        severity: "error",
      });
    }
  };

  const statCards = [
    {
      label: "Total Requests",
      value: stats.total || 0,
      icon: <AssignmentIcon />,
      iconBg: PRIMARY_LIGHT,
      iconColor: PRIMARY,
    },
    {
      label: "Pending",
      value: stats.pending || 0,
      icon: <PendingIcon />,
      iconBg: "#fff8e1",
      iconColor: "#b45309",
    },
    {
      label: "Under Review",
      value: stats.under_review || 0,
      icon: <RateReviewIcon />,
      iconBg: "#eff6ff",
      iconColor: "#1d4ed8",
    },
    {
      label: "High Priority",
      value: (stats.pending || 0) + (stats.under_review || 0),
      icon: <FlagIcon />,
      iconBg: "#fff3e0",
      iconColor: "#c2410c",
    },
  ];

  const tabSx = {
    "& .MuiTab-root": {
      textTransform: "none",
      fontSize: 13,
      fontWeight: 500,
      minHeight: 46,
      color: "#64748b",
    },
    "& .MuiTab-root.Mui-selected": { color: PRIMARY, fontWeight: 700 },
    "& .MuiTabs-indicator": {
      backgroundColor: PRIMARY,
      height: 3,
      borderRadius: "3px 3px 0 0",
    },
  };

  const thSx = {
    fontWeight: 700,
    fontSize: 11,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: ".5px",
    py: 1.5,
    bgcolor: "#f8fafc",
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
      {/* ── Header ── */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={3.5}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 22 },
              fontWeight: 800,
              color: PRIMARY,
              letterSpacing: "-.3px",
            }}
          >
            Checklist Requests
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.25 }}>
            {isSuperAdmin
              ? "Manage and review checklist requests"
              : "Submit and track your checklist requests"}
          </Typography>
        </Box>
        {!isSuperAdmin && (
          <PrimaryButton
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => setSubmitDialogOpen(true)}
          >
            New Request
          </PrimaryButton>
        )}
      </Box>

      {/* ── Stat Cards ── */}
      <Grid container spacing={2} mb={3.5}>
        {statCards.map((s, i) => (
          <Grid item xs={6} sm={6} md={3} key={i}>
            <StatCard elevation={0}>
              <CardContent sx={{ p: "18px 20px !important" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                        mb: 0.75,
                      }}
                    >
                      {s.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: PRIMARY,
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      bgcolor: s.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: s.iconColor,
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(s.icon, { sx: { fontSize: 22 } })}
                  </Box>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Controls: Tabs + Search ── */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${PRIMARY}15`,
          borderRadius: "14px",
          mb: 2,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, v) => {
            setTabValue(v);
            setPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ ...tabSx, borderBottom: `1px solid ${PRIMARY}12`, px: 1 }}
        >
          {["All Requests", "Pending", "Under Review", "Approved"].map(
            (label) => (
              <Tab key={label} label={label} />
            ),
          )}
        </Tabs>
        <Box sx={{ px: 2, py: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by checklist name, category, or requester…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: 13,
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: "#e2e8f0" },
                "&.Mui-focused fieldset": { borderColor: PRIMARY },
              },
            }}
          />
        </Box>
      </Paper>

      {/* ── Table ── */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${PRIMARY}15`,
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table size="small" sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={thSx}>Checklist Request</TableCell>
                <TableCell sx={thSx}>Customer</TableCell>
                <TableCell sx={thSx}>Category</TableCell>
                <TableCell sx={thSx}>Date</TableCell>
                <TableCell sx={thSx}>Urgency</TableCell>
                <TableCell sx={thSx}>Status</TableCell>
                <TableCell sx={thSx}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} sx={{ color: PRIMARY }} />
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>
                      {debouncedSearch
                        ? "No requests match your search"
                        : "No requests found"}
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
                      "& td": { borderColor: "#f1f5f9" },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{ fontWeight: 700, fontSize: 13, color: PRIMARY }}
                      >
                        {row.checklistName}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 11, color: "#94a3b8", mt: 0.25 }}
                      >
                        By {row.requestedByName || row.requestedBy?.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, color: "#475569" }}>
                      {row.requestedByName || row.requestedBy?.email}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.category}
                        size="small"
                        sx={{
                          bgcolor: PRIMARY_LIGHT,
                          color: PRIMARY,
                          fontWeight: 700,
                          fontSize: 11,
                          height: 24,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 12,
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(row.requestDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <UrgencyChip level={row.urgencyLevel} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details" placement="left">
                        <Button
                          size="small"
                          startIcon={
                            <VisibilityIcon
                              sx={{ fontSize: "15px !important" }}
                            />
                          }
                          onClick={() => {
                            setSelectedRequest(row);
                            setViewDialogOpen(true);
                          }}
                          sx={{
                            color: PRIMARY,
                            bgcolor: PRIMARY_LIGHT,
                            borderRadius: "8px",
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: "none",
                            px: 1.5,
                            "&:hover": { bgcolor: "#cce9f3" },
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

      {/* ── Pagination ── */}
      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                fontSize: 13,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: PRIMARY,
                color: "#fff",
                "&:hover": {
                  bgcolor: PRIMARY_MID,
                },
              },
            }}
          />
        </Box>
      )}

      {/* ── Dialogs ── */}
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

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => {
          setSnackbar((p) => ({ ...p, open: false }));
          clearMessages();
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => {
            setSnackbar((p) => ({ ...p, open: false }));
            clearMessages();
          }}
          sx={{ borderRadius: "12px", fontWeight: 500, fontSize: 13 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
