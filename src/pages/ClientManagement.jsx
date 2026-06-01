// pages/ClientManagement.jsx - Complete Fixed Version with Role-Based Access

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Skeleton,
  Button,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  useTheme,
  useMediaQuery,
  Menu,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Inbox as InboxIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircleOutline as ActiveIcon,
  Clear as ClearIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Close as CloseIcon,
  Storefront as StoreIcon,
  ShieldOutlined as ShieldIcon,
  PersonAdd as PersonAddIcon,
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
  Add,
  Remove,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useClient } from "../context/ClientContext";
import { useAuth } from "../context/AuthContexts";

// Color palette
const colors = {
  primary: "#0d4a5c",
  primaryDark: "#0a3a49",
  primaryLight: "#e6f0f3",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  surface: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    muted: "#94a3b8",
  },
};

const plans = {
  free: { label: "Free", color: "#94a3b8", bg: "#f1f5f9" },
  standard: { label: "Standard", color: "#0d4a5c", bg: "#e6f0f3" },
  premium: { label: "Premium", color: "#f59e0b", bg: "#fffbeb" },
  enterprise: { label: "Enterprise", color: "#8b5cf6", bg: "#f5f3ff" },
};

const PLANS = ["free", "standard", "premium", "enterprise"];

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const formatError = (err) => {
  if (typeof err === "string") return err;
  return err.response?.data?.message || err.message || "Something went wrong";
};

// Access Denied Component
const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 200px)",
        textAlign: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "#fef2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <LockIcon sx={{ fontSize: 40, color: colors.error }} />
      </Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "1.25rem",
          color: colors.text.primary,
          mb: 1,
        }}
      >
        Access Denied
      </Typography>
      <Typography
        sx={{
          fontSize: "0.875rem",
          color: colors.text.secondary,
          mb: 3,
          maxWidth: 400,
        }}
      >
        You don't have permission to access this page. This area is restricted
        to Super Administrators only.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/admin/dashboard")}
        sx={{
          bgcolor: colors.primary,
          textTransform: "none",
          borderRadius: 2,
          "&:hover": { bgcolor: colors.primaryDark },
        }}
      >
        Return to Dashboard
      </Button>
    </Box>
  );
};

// Stepper Component
const Stepper = ({ value, onChange, min = 1, max = 1000, label }) => (
  <Box>
    <Typography
      sx={{ fontSize: "0.72rem", color: colors.text.secondary, mb: 0.75 }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        px: 1,
        py: 0.5,
        width: "fit-content",
      }}
    >
      <IconButton
        size="small"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        sx={{ width: 24, height: 24 }}
      >
        <Remove sx={{ fontSize: "0.85rem" }} />
      </IconButton>
      <Typography
        sx={{
          fontSize: "0.85rem",
          fontWeight: 600,
          minWidth: 36,
          textAlign: "center",
          color: colors.text.primary,
        }}
      >
        {value}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        sx={{ width: 24, height: 24 }}
      >
        <Add sx={{ fontSize: "0.85rem" }} />
      </IconButton>
    </Box>
  </Box>
);

// Password Rule Component
const PwRule = ({ ok, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: ok ? colors.success : colors.text.muted,
        flexShrink: 0,
        transition: "background-color 0.2s",
      }}
    />
    <Typography
      sx={{
        fontSize: "0.7rem",
        color: ok ? colors.success : colors.text.secondary,
        transition: "color 0.2s",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, loading }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="circular" width={32} height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="40%" height={28} />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card
      sx={{
        borderRadius: 2,
        height: "100%",
        width: "277px",
        transition: "all 0.2s",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <Icon sx={{ fontSize: 16, color }} />
        </Box>
        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 500,
            color: colors.text.muted,
            textTransform: "uppercase",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: colors.text.primary,
          }}
        >
          {value ?? 0}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Client Card Component
const ClientCard = ({ client, onEdit, onDelete, onView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const plan = plans[client.membershipPlan] || plans.free;
  const isActive = client.status === "active";
  const daysLeft = client.daysRemaining || 0;
  const used = client.usersUsed || 0;
  const limit = client.licenseLimit || 1;
  const percentage = Math.min(100, Math.round((used / limit) * 100));
  const isExpiring = daysLeft > 0 && daysLeft <= 7;

  return (
    <Card
      sx={{
        borderRadius: 2,
        width: "375px",
        border: `1px solid ${colors.border}`,
        position: "relative",
        transition: "all 0.2s",
        "&:hover": { borderColor: colors.primary, boxShadow: 2 },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: isActive ? colors.success : colors.text.muted,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              bgcolor: colors.primary,
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            {getInitials(client.customerName)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color: colors.text.primary,
                mb: 0.25,
              }}
            >
              {client.customerName}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.65rem",
                color: colors.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {client.email}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ color: colors.text.muted }}
          >
            <MoreVertIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Chip
            label={plan.label}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.6rem",
              fontWeight: 600,
              bgcolor: plan.bg,
              color: plan.color,
            }}
          />
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: isExpiring ? colors.warning : colors.text.secondary,
            }}
          >
            {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography sx={{ fontSize: "0.6rem", color: colors.text.muted }}>
              License Usage
            </Typography>
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 600,
                color: colors.text.secondary,
              }}
            >
              {used}/{limit} · {percentage}%
            </Typography>
          </Box>
          <Box
            sx={{
              height: 4,
              bgcolor: colors.surface,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${percentage}%`,
                bgcolor: percentage > 85 ? colors.error : colors.primary,
                borderRadius: 2,
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            size="small"
            onClick={() => onView(client._id)}
            startIcon={<VisibilityIcon sx={{ fontSize: "0.7rem" }} />}
            sx={{
              fontSize: "0.65rem",
              textTransform: "none",
              color: colors.primary,
            }}
          >
            View
          </Button>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(client)}
                sx={{
                  p: 0.5,
                  color: colors.text.secondary,
                  "&:hover": { color: colors.primary },
                }}
              >
                <EditIcon sx={{ fontSize: "0.85rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={isActive ? "Deactivate" : "Activate"}>
              <IconButton
                size="small"
                onClick={() => onDelete(client)}
                sx={{
                  p: 0.5,
                  color: colors.text.secondary,
                  "&:hover": { color: colors.error },
                }}
              >
                <DeleteIcon sx={{ fontSize: "0.85rem" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { minWidth: 140, borderRadius: 2, mt: 0.5 } }}
        >
          <MenuItem
            onClick={() => {
              onEdit(client);
              setAnchorEl(null);
            }}
            sx={{ fontSize: "0.75rem", gap: 1 }}
          >
            <EditIcon sx={{ fontSize: "0.8rem" }} /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              onView(client._id);
              setAnchorEl(null);
            }}
            sx={{ fontSize: "0.75rem", gap: 1 }}
          >
            <VisibilityIcon sx={{ fontSize: "0.8rem" }} /> View Details
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              onDelete(client);
              setAnchorEl(null);
            }}
            sx={{ fontSize: "0.75rem", gap: 1, color: colors.error }}
          >
            <DeleteIcon sx={{ fontSize: "0.8rem" }} />{" "}
            {isActive ? "Deactivate" : "Activate"}
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

// Client Modal Component
const ClientModal = ({ open, client, onClose, onSave, loading }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isEdit = !!client;

  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const defaultForm = {
    customerName: "",
    email: "",
    phone: "",
    website: "",
    membershipPlan: "standard",
    licenseLimit: 10,
    duration: 30,
    notes: "",
    password: "",
  };

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setActiveTab(0);
      setShowPassword(false);
      setErrors({});
      setForm(
        client
          ? {
              customerName: client.customerName || "",
              email: client.email || "",
              phone: client.phone || "",
              website: client.website || "",
              membershipPlan: client.membershipPlan || "standard",
              licenseLimit: client.licenseLimit || 10,
              duration: 30,
              notes: client.notes || "",
              password: "",
            }
          : defaultForm,
      );
    }
  }, [client, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.customerName?.trim())
      e.customerName = "Customer name is required";
    if (!form.email?.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email format";
    if (!form.phone?.trim()) e.phone = "Phone is required";
    if (
      form.website &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i.test(
        form.website,
      )
    )
      e.website = "Invalid URL format";
    if (!isEdit) {
      if (!form.password) e.password = "Password is required";
      else if (form.password.length < 8) e.password = "Min 8 characters";
      else if (!/[A-Z]/.test(form.password))
        e.password = "Needs an uppercase letter";
      else if (!/[a-z]/.test(form.password))
        e.password = "Needs a lowercase letter";
      else if (!/[0-9]/.test(form.password)) e.password = "Needs a number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      const hasAccountError =
        errors.customerName || errors.email || errors.phone || errors.website;
      if (hasAccountError) setActiveTab(0);
      else if (errors.password) setActiveTab(2);
      return;
    }
    await onSave(form);
  };

  const pw = form.password;
  const pwRules = [
    { ok: pw.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Z]/.test(pw), label: "One uppercase letter" },
    { ok: /[a-z]/.test(pw), label: "One lowercase letter" },
    { ok: /[0-9]/.test(pw), label: "One number" },
  ];

  const TABS = isEdit
    ? ["Account info", "Plan & limits"]
    : ["Account info", "Plan & limits", "Security"];

  const tabHasError = (i) => {
    if (i === 0)
      return !!(
        errors.customerName ||
        errors.email ||
        errors.phone ||
        errors.website
      );
    if (i === 2) return !!errors.password;
    return false;
  };

  const TabAccountInfo = (
    <Stack spacing={1.75} sx={{ mt: 3 }}>
      <TextField
        name="customerName"
        label="Customer name"
        value={form.customerName}
        onChange={handleChange}
        fullWidth
        size="small"
        required
        error={!!errors.customerName}
        helperText={errors.customerName}
        placeholder="Acme Corp"
      />
      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="email"
            label="Email address"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            error={!!errors.email}
            helperText={errors.email}
            placeholder="admin@acme.com"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="phone"
            label="Phone number"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            error={!!errors.phone}
            helperText={errors.phone}
            placeholder="+1 555 000 0000"
          />
        </Grid>
      </Grid>
      <TextField
        name="website"
        label="Website (optional)"
        value={form.website}
        onChange={handleChange}
        fullWidth
        size="small"
        error={!!errors.website}
        helperText={errors.website}
        placeholder="https://acme.com"
      />
      <TextField
        name="notes"
        label="Notes (optional)"
        multiline
        rows={3}
        value={form.notes}
        onChange={handleChange}
        fullWidth
        size="small"
        placeholder="Any internal notes about this customer…"
      />
    </Stack>
  );

  const TabPlanLimits = (
    <Stack spacing={2.5} sx={{ mt: 3 }}>
      <Box>
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: colors.text.muted,
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          Membership plan
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {PLANS.map((plan) => (
            <Chip
              key={plan}
              label={plan.charAt(0).toUpperCase() + plan.slice(1)}
              onClick={() =>
                setForm((prev) => ({ ...prev, membershipPlan: plan }))
              }
              size="small"
              sx={{
                cursor: "pointer",
                fontWeight: form.membershipPlan === plan ? 600 : 400,
                bgcolor:
                  form.membershipPlan === plan ? colors.primary : "transparent",
                color:
                  form.membershipPlan === plan
                    ? "white"
                    : colors.text.secondary,
                border: `1px solid ${form.membershipPlan === plan ? colors.primary : colors.border}`,
                "&:hover": {
                  bgcolor:
                    form.membershipPlan === plan
                      ? colors.primaryDark
                      : colors.surface,
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Divider />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Stepper
            label="License limit"
            value={form.licenseLimit}
            onChange={(v) => setForm((prev) => ({ ...prev, licenseLimit: v }))}
            min={1}
            max={1000}
          />
        </Grid>
        {!isEdit && (
          <Grid item xs={12} sm={6}>
            <Stepper
              label="Duration (days)"
              value={form.duration}
              onChange={(v) => setForm((prev) => ({ ...prev, duration: v }))}
              min={1}
              max={365}
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  );

  const TabSecurity = (
    <Stack spacing={2} sx={{ mt: 3 }}>
      <TextField
        name="password"
        label="Temporary password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        fullWidth
        size="small"
        required
        error={!!errors.password}
        helperText={errors.password}
        placeholder="Min 8 chars, uppercase, number"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setShowPassword((p) => !p)}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOff sx={{ fontSize: "1rem" }} />
                ) : (
                  <Visibility sx={{ fontSize: "1rem" }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {form.password && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: "8px",
            bgcolor: colors.surface,
            border: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
          }}
        >
          {pwRules.map((r) => (
            <PwRule key={r.label} ok={r.ok} label={r.label} />
          ))}
        </Box>
      )}
    </Stack>
  );

  const panels = [TabAccountInfo, TabPlanLimits, TabSecurity];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: { borderRadius: fullScreen ? 0 : "16px", overflow: "hidden" },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 1.75,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                bgcolor: colors.primaryLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StoreIcon sx={{ fontSize: "1.1rem", color: colors.primary }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: colors.text.primary,
                }}
              >
                {isEdit ? "Edit customer" : "Add new customer"}
              </Typography>
              <Typography
                sx={{ fontSize: "0.7rem", color: colors.text.secondary }}
              >
                {isEdit
                  ? "Update the customer's details"
                  : "Fill in the details to create an account"}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              width: 28,
              height: 28,
            }}
          >
            <CloseIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            borderBottom: `1px solid ${colors.border}`,
            px: 2.5,
            bgcolor: colors.surface,
          }}
        >
          {TABS.map((tab, i) => (
            <Box
              key={tab}
              onClick={() => setActiveTab(i)}
              sx={{
                px: 1.5,
                py: 1.25,
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: activeTab === i ? 600 : 400,
                color: activeTab === i ? colors.primary : colors.text.secondary,
                borderBottom: "2px solid",
                borderColor: activeTab === i ? colors.primary : "transparent",
                transition: "all 0.15s",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  color: activeTab === i ? colors.primary : colors.text.primary,
                },
              }}
            >
              {tab}
              {tabHasError(i) && (
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    bgcolor: colors.error,
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 2.5 }}>
        {panels[activeTab]}
      </DialogContent>

      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${colors.border}`,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <ShieldIcon sx={{ fontSize: "0.9rem", color: colors.text.muted }} />
          <Typography sx={{ fontSize: "0.7rem", color: colors.text.muted }}>
            Encrypted & secure
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={onClose}
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "0.78rem",
              borderRadius: "8px",
              border: `1px solid ${colors.border}`,
              color: colors.text.secondary,
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="small"
            disabled={loading}
            startIcon={
              loading ? null : isEdit ? (
                <SaveIcon sx={{ fontSize: "0.9rem !important" }} />
              ) : (
                <PersonAddIcon sx={{ fontSize: "0.9rem !important" }} />
              )
            }
            sx={{
              textTransform: "none",
              fontSize: "0.78rem",
              fontWeight: 600,
              borderRadius: "8px",
              bgcolor: colors.primary,
              px: 2,
              "&:hover": { bgcolor: colors.primaryDark },
              "&.Mui-disabled": { bgcolor: colors.border },
            }}
          >
            {loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Create customer"
            )}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// Delete Confirm Dialog
const DeleteConfirmDialog = ({ open, client, onClose, onConfirm, loading }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
  >
    <DialogTitle sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.75,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              bgcolor: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon sx={{ fontSize: "1rem", color: colors.error }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: colors.text.primary,
            }}
          >
            {client?.status === "active" ? "Deactivate" : "Activate"} customer
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            width: 28,
            height: 28,
          }}
        >
          <CloseIcon sx={{ fontSize: "0.9rem" }} />
        </IconButton>
      </Box>
    </DialogTitle>

    <DialogContent sx={{ px: 2.5, py: 2 }}>
      <Typography
        sx={{
          fontSize: "0.8rem",
          color: colors.text.secondary,
          lineHeight: 1.6,
        }}
      >
        Are you sure you want to{" "}
        <strong>
          {client?.status === "active" ? "deactivate" : "activate"}
        </strong>{" "}
        <strong style={{ color: colors.text.primary }}>
          {client?.customerName}
        </strong>
        ?{" "}
        {client?.status === "active"
          ? "They will lose access to the platform immediately."
          : "They will regain access to the platform."}
      </Typography>
    </DialogContent>

    <DialogActions
      sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${colors.border}`, gap: 1 }}
    >
      <Button
        onClick={onClose}
        size="small"
        sx={{
          textTransform: "none",
          fontSize: "0.78rem",
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
          color: colors.text.secondary,
          px: 2,
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        size="small"
        disabled={loading}
        sx={{
          textTransform: "none",
          fontSize: "0.78rem",
          fontWeight: 600,
          borderRadius: "8px",
          bgcolor: client?.status === "active" ? colors.error : colors.success,
          px: 2,
          "&:hover": {
            bgcolor: client?.status === "active" ? "#dc2626" : "#059669",
          },
          "&.Mui-disabled": { bgcolor: colors.border },
        }}
      >
        {loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : client?.status === "active" ? (
          "Deactivate"
        ) : (
          "Activate"
        )}
      </Button>
    </DialogActions>
  </Dialog>
);

// Main Component
export default function ClientManagement() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, isAuthenticated } = useAuth();

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
    clearError,
  } = useClient();

  const [search, setSearch] = useState(filters.search || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [planAnchor, setPlanAnchor] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const searchTimer = useRef(null);
  const isInitialMount = useRef(true);

  // Check if user has super_admin role
  const isSuperAdmin = useMemo(() => {
    return user?.role === "super_admin";
  }, [user]);

  const showToast = useCallback((message, severity = "success") => {
    setToast({ open: true, message, severity });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // Sync search state with filters
  useEffect(() => {
    if (filters.search !== search) {
      setSearch(filters.search);
    }
  }, [filters.search]);

  // Debounced search
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (search !== filters.search) {
        updateFilters({ search: search.trim() });
        fetchClients({ search: search.trim(), page: 1 });
      }
    }, 500);

    return () => clearTimeout(searchTimer.current);
  }, [search, updateFilters, fetchClients, filters.search]);

  const handleAddClient = async (formData) => {
    try {
      await addClient(formData);
      showToast("Customer created successfully!");
      setModalOpen(false);
      fetchClients({ page: 1 });
    } catch (err) {
      showToast(formatError(err), "error");
    }
  };

  const handleEditClient = async (formData) => {
    try {
      await editClient(editingClient._id, {
        customerName: formData.customerName,
        membershipPlan: formData.membershipPlan,
        licenseLimit: parseInt(formData.licenseLimit),
        phone: formData.phone,
        website: formData.website,
        notes: formData.notes,
      });
      showToast("Customer updated successfully!");
      setModalOpen(false);
      setEditingClient(null);
      fetchClients();
    } catch (err) {
      showToast(formatError(err), "error");
    }
  };

  const handleStatusChange = async () => {
    try {
      const newStatus =
        selectedClient?.status === "active" ? "inactive" : "active";
      await changeClientStatus(selectedClient._id, newStatus);
      showToast(
        `Customer ${newStatus === "active" ? "activated" : "deactivated"} successfully!`,
      );
      setDeleteDialogOpen(false);
      setSelectedClient(null);
      fetchClients();
    } catch (err) {
      showToast(formatError(err), "error");
    }
  };

  const handleFilterChange = useCallback(
    (type, value) => {
      updateFilters({ [type]: value });
      fetchClients({ [type]: value, page: 1 });
    },
    [updateFilters, fetchClients],
  );

  const handleClearFilters = useCallback(() => {
    resetFilters();
    setSearch("");
    fetchClients({ search: "", status: "all", membershipPlan: "all", page: 1 });
  }, [resetFilters, fetchClients]);

  const handleRefresh = useCallback(() => {
    fetchClients({ page: pagination.page });
  }, [fetchClients, pagination.page]);

  const handlePageChange = useCallback(
    (newPage) => {
      changePage(newPage);
      fetchClients({ page: newPage });
    },
    [changePage, fetchClients],
  );

  const hasFilters =
    filters.status !== "all" || filters.membershipPlan !== "all" || search;

  const statCards = useMemo(
    () => [
      {
        icon: GroupIcon,
        label: "Total Customers",
        value: stats?.total || 0,
        color: colors.primary,
      },
      {
        icon: ActiveIcon,
        label: "Active",
        value: stats?.active || 0,
        color: colors.success,
      },
      {
        icon: TrendingUpIcon,
        label: "Premium",
        value: stats?.byPlan?.premium || 0,
        color: colors.warning,
      },
      {
        icon: WarningIcon,
        label: "Expiring Soon",
        value: stats?.expiringSoon || 0,
        color: colors.error,
      },
    ],
    [stats],
  );

  // Check authentication and role
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  if (!isSuperAdmin) {
    return <AccessDenied />;
  }

  // Loading state
  if (initialLoading && !clients?.length) {
    return (
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: colors.surface,
          minHeight: "100vh",
        }}
      >
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={300} height={20} sx={{ mb: 3 }} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} item xs={6} sm={3}>
              <StatCard loading />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} item xs={12} sm={6} lg={4}>
              <Skeleton
                variant="rounded"
                height={240}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box
      sx={{ bgcolor: colors.surface, minHeight: "100vh", p: { xs: 2, sm: 3 } }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.2rem", sm: "1.3rem" },
              color: colors.text.primary,
              mb: 0.25,
            }}
          >
            Customer Management
          </Typography>
          <Typography
            sx={{ fontSize: "0.75rem", color: colors.text.secondary }}
          >
            Manage customer accounts and subscriptions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingClient(null);
            setModalOpen(true);
          }}
          sx={{
            bgcolor: colors.primary,
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
            "&:hover": { bgcolor: colors.primaryDark },
          }}
        >
          Add Customer
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={clearError}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((stat, i) => (
          <Grid key={i} item xs={6} sm={6} md={3}>
            <StatCard {...stat} loading={initialLoading} />
          </Grid>
        ))}
      </Grid>

      {/* Filters Section */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
        }}
        elevation={0}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: "0.9rem", color: colors.text.muted }}
                    />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <ClearIcon sx={{ fontSize: "0.8rem" }} />
                  </IconButton>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Button
                size="small"
                variant={filters.status !== "all" ? "contained" : "outlined"}
                onClick={(e) => setStatusAnchor(e.currentTarget)}
                endIcon={<ArrowDownIcon sx={{ fontSize: "0.8rem" }} />}
                sx={{
                  textTransform: "none",
                  borderRadius: 1.5,
                  fontSize: "0.75rem",
                  ...(filters.status !== "all" && { bgcolor: colors.primary }),
                }}
              >
                {filters.status === "all"
                  ? "All Status"
                  : filters.status === "active"
                    ? "Active"
                    : "Inactive"}
              </Button>
              <Button
                size="small"
                variant={
                  filters.membershipPlan !== "all" ? "contained" : "outlined"
                }
                onClick={(e) => setPlanAnchor(e.currentTarget)}
                endIcon={<ArrowDownIcon sx={{ fontSize: "0.8rem" }} />}
                sx={{
                  textTransform: "none",
                  borderRadius: 1.5,
                  fontSize: "0.75rem",
                  ...(filters.membershipPlan !== "all" && {
                    bgcolor: colors.primary,
                  }),
                }}
              >
                {filters.membershipPlan === "all"
                  ? "All Plans"
                  : filters.membershipPlan.charAt(0).toUpperCase() +
                    filters.membershipPlan.slice(1)}
              </Button>
              {hasFilters && (
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  sx={{
                    textTransform: "none",
                    color: colors.error,
                    borderRadius: 1.5,
                    fontSize: "0.75rem",
                  }}
                >
                  Clear
                </Button>
              )}
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={loading}
                sx={{ border: `1px solid ${colors.border}`, borderRadius: 1.5 }}
              >
                <RefreshIcon
                  sx={{
                    fontSize: "0.9rem",
                    animation: loading ? "spin 1s linear infinite" : "none",
                  }}
                />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize: "0.7rem", color: colors.text.muted }}>
          Showing <strong>{clients?.length || 0}</strong> of{" "}
          <strong>{pagination?.total || 0}</strong> customers
        </Typography>
        {loading && (
          <CircularProgress size={16} sx={{ color: colors.primary }} />
        )}
      </Box>

      {/* Client Grid */}
      {!clients?.length && !loading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: colors.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <InboxIcon sx={{ fontSize: 32, color: colors.primary }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              color: colors.text.primary,
              mb: 0.5,
            }}
          >
            {search ? "No results found" : "No customers yet"}
          </Typography>
          <Typography
            sx={{ fontSize: "0.75rem", color: colors.text.secondary, mb: 2 }}
          >
            {search
              ? "Try adjusting your search"
              : "Add your first customer to get started"}
          </Typography>
          {!search && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingClient(null);
                setModalOpen(true);
              }}
              sx={{ bgcolor: colors.primary, textTransform: "none" }}
            >
              Add Customer
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {clients?.map((client) => (
            <Grid key={client._id} item xs={12} sm={6} lg={4} xl={3}>
              <ClientCard
                client={client}
                onEdit={(c) => {
                  setEditingClient(c);
                  setModalOpen(true);
                }}
                onDelete={(c) => {
                  setSelectedClient(c);
                  setDeleteDialogOpen(true);
                }}
                onView={(id) => navigate(`/admin/clients-details/${id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <Button
            size="small"
            disabled={pagination.page <= 1 || loading}
            onClick={() => handlePageChange(pagination.page - 1)}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              border: `1px solid ${colors.border}`,
              color: colors.text.secondary,
            }}
          >
            Previous
          </Button>
          <Typography
            sx={{ fontSize: "0.75rem", color: colors.text.secondary }}
          >
            Page {pagination.page} of {pagination.pages}
          </Typography>
          <Button
            size="small"
            disabled={pagination.page >= pagination.pages || loading}
            onClick={() => handlePageChange(pagination.page + 1)}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              border: `1px solid ${colors.border}`,
              color: colors.text.secondary,
            }}
          >
            Next
          </Button>
        </Box>
      )}

      {/* Status Filter Menu */}
      <Menu
        anchorEl={statusAnchor}
        open={Boolean(statusAnchor)}
        onClose={() => setStatusAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 140 } }}
      >
        {["all", "active", "inactive"].map((s) => (
          <MenuItem
            key={s}
            onClick={() => {
              handleFilterChange("status", s);
              setStatusAnchor(null);
            }}
            sx={{ fontSize: "0.75rem" }}
          >
            {s === "all"
              ? "All Status"
              : s.charAt(0).toUpperCase() + s.slice(1)}
          </MenuItem>
        ))}
      </Menu>

      {/* Plan Filter Menu */}
      <Menu
        anchorEl={planAnchor}
        open={Boolean(planAnchor)}
        onClose={() => setPlanAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 140 } }}
      >
        {["all", "free", "standard", "premium", "enterprise"].map((p) => (
          <MenuItem
            key={p}
            onClick={() => {
              handleFilterChange("membershipPlan", p);
              setPlanAnchor(null);
            }}
            sx={{ fontSize: "0.75rem" }}
          >
            {p === "all" ? "All Plans" : p.charAt(0).toUpperCase() + p.slice(1)}
          </MenuItem>
        ))}
      </Menu>

      {/* Modals */}
      <ClientModal
        open={modalOpen}
        client={editingClient}
        onClose={() => {
          setModalOpen(false);
          setEditingClient(null);
        }}
        onSave={editingClient ? handleEditClient : handleAddClient}
        loading={actionLoading}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        client={selectedClient}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={handleStatusChange}
        loading={actionLoading}
      />

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Box>
  );
}
