import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  Divider,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
  LinearProgress,
  InputAdornment,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import { useRequestChecklist } from "../context/RequestChecklistContext";

// ─── Constants ──────────────────────────────────────────────────────────────────
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
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    disabled: "#94a3b8",
    muted: "#94a3b8",
  },
};

const CATEGORIES = [
  "Safety",
  "Equipment",
  "Environmental",
  "Quality",
  "Compliance",
  "Maintenance",
  "Audit",
  "Customer Success",
  "Sales",
  "Development",
  "Marketing",
];

const URGENCY_LEVELS = [
  {
    value: "low",
    label: "Low",
    color: "#10b981",
    description: "Can be addressed when convenient",
  },
  {
    value: "medium",
    label: "Medium",
    color: "#f59e0b",
    description: "Should be addressed within 2 weeks",
  },
  {
    value: "high",
    label: "High",
    color: "#ef4444",
    description: "Needs attention within 1 week",
  },
  {
    value: "critical",
    label: "Critical",
    color: "#dc2626",
    description: "Immediate attention required",
  },
];

const USAGE_FREQUENCIES = [
  { value: "daily", label: "Daily", description: "Used every day" },
  { value: "weekly", label: "Weekly", description: "Used once per week" },
  { value: "monthly", label: "Monthly", description: "Used once per month" },
  {
    value: "quarterly",
    label: "Quarterly",
    description: "Used every 3 months",
  },
  { value: "yearly", label: "Yearly", description: "Used once per year" },
  {
    value: "as_needed",
    label: "As Needed",
    description: "Used on an ad-hoc basis",
  },
];

const INITIAL_FORM = {
  checklistName: "",
  category: "",
  detailedDescription: "",
  businessJustification: "",
  urgencyLevel: "",
  expectedUsageFrequency: "",
  numberOfTeamMembers: "",
  additionalNotes: "",
  message: "",
};

const INITIAL_ERRORS = {
  checklistName: "",
  category: "",
  detailedDescription: "",
  businessJustification: "",
  urgencyLevel: "",
  expectedUsageFrequency: "",
  numberOfTeamMembers: "",
  additionalNotes: "",
  message: "",
};

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_FILES = 10;
const MAX_FILE_SIZE_WARNING_MB = 5;

const ALLOWED_FILE_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".png",
  ".jpg",
  ".jpeg",
];

const VALIDATION_RULES = {
  checklistName: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_&()]+$/,
    patternMessage: "Only letters, numbers, spaces, and -_&() are allowed",
  },
  category: {
    required: true,
  },
  detailedDescription: {
    required: true,
    minLength: 20,
    maxLength: 2000,
  },
  businessJustification: {
    required: true,
    minLength: 20,
    maxLength: 2000,
  },
  urgencyLevel: {
    required: true,
  },
  expectedUsageFrequency: {
    required: false,
  },
  numberOfTeamMembers: {
    required: false,
    min: 1,
    max: 1000,
    integer: true,
  },
  additionalNotes: {
    required: false,
    maxLength: 500,
  },
  message: {
    required: false,
    maxLength: 500,
  },
};

// ─── Helper Functions ──────────────────────────────────────────────────────────
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getUrgencyColor = (level) => {
  const urgency = URGENCY_LEVELS.find((u) => u.value === level);
  return urgency?.color || C.text.secondary;
};

const getUrgencyDescription = (level) => {
  const urgency = URGENCY_LEVELS.find((u) => u.value === level);
  return urgency?.description || "";
};

const validateField = (name, value) => {
  const rule = VALIDATION_RULES[name];
  if (!rule) return "";

  if (
    rule.required &&
    (!value || (typeof value === "string" && !value.trim()))
  ) {
    return `${name.replace(/([A-Z])/g, " $1").trim()} is required`;
  }

  if (rule.minLength && value && value.length < rule.minLength) {
    return `${name.replace(/([A-Z])/g, " $1").trim()} must be at least ${rule.minLength} characters`;
  }

  if (rule.maxLength && value && value.length > rule.maxLength) {
    return `${name.replace(/([A-Z])/g, " $1").trim()} cannot exceed ${rule.maxLength} characters`;
  }

  if (rule.pattern && value && !rule.pattern.test(value)) {
    return rule.patternMessage || `Invalid format for ${name}`;
  }

  if (rule.min && value && Number(value) < rule.min) {
    return `${name.replace(/([A-Z])/g, " $1").trim()} must be at least ${rule.min}`;
  }

  if (rule.max && value && Number(value) > rule.max) {
    return `${name.replace(/([A-Z])/g, " $1").trim()} cannot exceed ${rule.max}`;
  }

  if (rule.integer && value && !Number.isInteger(Number(value))) {
    return `${name.replace(/([A-Z])/g, " $1").trim()} must be a whole number`;
  }

  return "";
};

// ─── Main Component ────────────────────────────────────────────────────────────
const SubmitRequestModal = ({ open, onClose, onSubmitSuccess }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const fileInputRef = useRef(null);

  const { submitRequest, loading: contextLoading } = useRequestChecklist();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // ─── Validation Functions ─────────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(VALIDATION_RULES).forEach((field) => {
      const error = validateField(field, form[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  }, [form]);

  const validateFieldOnBlur = useCallback((field, value) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  }, []);

  // ─── Memoized Values ─────────────────────────────────────────────────────────
  const isDisabled = useMemo(() => {
    // Check required fields
    const hasRequiredErrors = Object.keys(errors).some(
      (field) => errors[field] && VALIDATION_RULES[field]?.required,
    );

    // Check if all required fields are filled
    const requiredFieldsFilled = Object.keys(VALIDATION_RULES)
      .filter((field) => VALIDATION_RULES[field]?.required)
      .every(
        (field) =>
          form[field] &&
          (typeof form[field] === "string" ? form[field].trim() : form[field]),
      );

    return hasRequiredErrors || !requiredFieldsFilled || contextLoading;
  }, [errors, form, contextLoading]);

  const totalFileSize = useMemo(() => {
    return files.reduce((sum, file) => sum + file.size, 0);
  }, [files]);

  const isFileSizeWarning = useMemo(() => {
    return totalFileSize > MAX_FILE_SIZE_WARNING_MB * 1024 * 1024;
  }, [totalFileSize]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const showError = useCallback((message) => {
    setSnackbar({ open: true, message, severity: "error" });
  }, []);

  const showSuccess = useCallback((message) => {
    setSnackbar({ open: true, message, severity: "success" });
  }, []);

  const showWarning = useCallback((message) => {
    setSnackbar({ open: true, message, severity: "warning" });
  }, []);

  const handleChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors],
  );

  const handleBlur = useCallback(
    (field) => (e) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateFieldOnBlur(field, e.target.value);
    },
    [validateFieldOnBlur],
  );

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setTouched({});
    setFiles([]);
    setSubmitted(false);
    setDragOver(false);
  }, []);

  const handleClose = useCallback(() => {
    if (contextLoading) return;

    // Show warning if form has data
    const hasData =
      Object.values(form).some((v) => v && v.trim?.()) || files.length > 0;
    if (hasData && !submitted) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?",
        )
      ) {
        resetForm();
        onClose?.();
      }
    } else {
      resetForm();
      onClose?.();
    }
  }, [contextLoading, form, files, submitted, resetForm, onClose]);

  // ─── File Handling ───────────────────────────────────────────────────────────
  const validateFiles = useCallback(
    (newFiles) => {
      const valid = [];
      const invalid = [];

      if (files.length + newFiles.length > MAX_TOTAL_FILES) {
        showError(`Maximum ${MAX_TOTAL_FILES} files allowed`);
        return { valid: [], invalid: newFiles };
      }

      newFiles.forEach((file) => {
        const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
        const isValidType = ALLOWED_FILE_TYPES.includes(fileExtension);
        const isValidSize = file.size <= MAX_FILE_SIZE_BYTES;

        if (isValidType && isValidSize) {
          valid.push(file);
        } else {
          invalid.push({
            name: file.name,
            reason: !isValidType
              ? `Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(", ")}`
              : `File size exceeds ${MAX_FILE_SIZE_MB}MB`,
          });
        }
      });

      return { valid, invalid };
    },
    [files.length, showError],
  );

  const addFiles = useCallback(
    (newFiles) => {
      const { valid, invalid } = validateFiles(newFiles);

      if (invalid.length > 0) {
        const errorMessages = invalid
          .slice(0, 3)
          .map((f) => `${f.name} (${f.reason})`)
          .join(", ");
        showError(
          `${invalid.length} file(s) rejected: ${errorMessages}${invalid.length > 3 ? ` and ${invalid.length - 3} more` : ""}`,
        );
      }

      if (valid.length > 0) {
        setFiles((prev) => {
          const existingNames = new Set(prev.map((f) => f.name));
          const unique = valid.filter((f) => !existingNames.has(f.name));

          if (unique.length < valid.length) {
            showWarning(
              `${valid.length - unique.length} duplicate file(s) were skipped.`,
            );
          }
          return [...prev, ...unique];
        });
      }
    },
    [validateFiles, showError, showWarning],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      if (contextLoading) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) addFiles(droppedFiles);
    },
    [addFiles, contextLoading],
  );

  const handleFileInput = useCallback(
    (e) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) addFiles(selectedFiles);
      e.target.value = "";
    },
    [addFiles],
  );

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ─── Submit Handler with Validation ──────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    // Validate all fields
    const isValid = validateForm();

    if (!isValid) {
      // Mark all fields as touched to show errors
      const allTouched = {};
      Object.keys(VALIDATION_RULES).forEach((field) => {
        allTouched[field] = true;
      });
      setTouched(allTouched);
      showError("Please fix the errors before submitting");
      return;
    }

    // Additional validation for business justification
    if (form.businessJustification.length < 20) {
      showError("Business justification must be at least 20 characters");
      return;
    }

    const formData = new FormData();
    formData.append("checklistName", form.checklistName.trim());
    formData.append("category", form.category);
    formData.append("detailedDescription", form.detailedDescription.trim());
    formData.append("businessJustification", form.businessJustification.trim());
    formData.append("urgencyLevel", form.urgencyLevel);
    formData.append(
      "expectedUsageFrequency",
      form.expectedUsageFrequency || "as_needed",
    );
    formData.append(
      "numberOfTeamMembers",
      form.numberOfTeamMembers ? parseInt(form.numberOfTeamMembers, 10) : 1,
    );

    if (form.additionalNotes?.trim())
      formData.append("additionalNotes", form.additionalNotes.trim());
    if (form.message?.trim()) formData.append("message", form.message.trim());

    files.forEach((file) => formData.append("referenceFiles", file));

    try {
      const result = await submitRequest(formData);
      if (result.success) {
        setSubmitted(true);
        showSuccess("Checklist request submitted successfully!");
        onSubmitSuccess?.();
        setTimeout(() => {
          resetForm();
          onClose?.();
        }, 2500);
      } else {
        showError(
          result.error || "Failed to submit request. Please try again.",
        );
      }
    } catch (err) {
      showError(
        err?.message || "An unexpected error occurred. Please try again.",
      );
    }
  }, [
    form,
    files,
    validateForm,
    submitRequest,
    showSuccess,
    showError,
    onSubmitSuccess,
    resetForm,
    onClose,
  ]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const labelSx = {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: C.text.primary,
    mb: 0.75,
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      fontSize: "0.82rem",
      bgcolor: "#f8fafc",
      borderRadius: "8px",
      "& fieldset": { borderColor: C.border },
      "&:hover fieldset": { borderColor: "#94a3b8" },
      "&.Mui-focused fieldset": { borderColor: C.primary, borderWidth: 1.5 },
      "&.Mui-error fieldset": { borderColor: C.error },
    },
    "& .MuiSelect-select": { fontSize: "0.82rem" },
  };

  const selectPlaceholder = (text) => (
    <span style={{ color: C.text.muted, fontSize: "0.82rem" }}>{text}</span>
  );

  // ─── Success Content ─────────────────────────────────────────────────────────
  const SuccessContent = useMemo(
    () => () => (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={6}
        px={3}
        textAlign="center"
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: C.successBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 40, color: C.success }} />
        </Box>
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: C.text.primary,
            mb: 1,
          }}
        >
          Request Submitted!
        </Typography>
        <Typography
          sx={{ fontSize: "0.82rem", color: C.text.secondary, maxWidth: 300 }}
        >
          Your checklist request has been submitted successfully. The admin will
          review it shortly.
        </Typography>
      </Box>
    ),
    [],
  );

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : "20px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          },
        }}
      >
        {contextLoading && (
          <LinearProgress
            sx={{
              height: 3,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          />
        )}

        {/* Header */}
        <DialogTitle sx={{ bgcolor: C.primary, color: "#fff", px: 3, py: 2.5 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3 }}
              >
                Request New Checklist
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.8)",
                  mt: 0.5,
                }}
              >
                Submit a detailed request to create a new checklist form
              </Typography>
            </Box>
            <Tooltip title="Close">
              <IconButton
                onClick={handleClose}
                disabled={contextLoading}
                size="small"
                sx={{ color: "#fff", mt: -0.5, mr: -0.5 }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>

        {/* Body */}
        <DialogContent sx={{ p: 0, overflowX: "hidden" }}>
          {submitted ? (
            <SuccessContent />
          ) : (
            <Box sx={{ px: 3, py: 3 }}>
              {/* Info Banner */}
              <Alert
                severity="info"
                icon={<InfoIcon />}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  "& .MuiAlert-message": { width: "100%" },
                }}
              >
                <Typography variant="caption" display="block">
                  <strong>Tip:</strong> Provide as much detail as possible to
                  help us understand your requirements better. Fields marked
                  with <span style={{ color: C.error }}>*</span> are required.
                </Typography>
              </Alert>

              <Grid container spacing={2.5}>
                {/* Checklist Name */}
                <Grid item xs={12} sm={6} sx={{ width: "250px" }}>
                  <Typography component="label" sx={labelSx}>
                    Checklist Name <span style={{ color: C.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={form.checklistName}
                    onChange={handleChange("checklistName")}
                    onBlur={handleBlur("checklistName")}
                    disabled={contextLoading}
                    error={touched.checklistName && !!errors.checklistName}
                    helperText={
                      touched.checklistName && errors.checklistName
                        ? errors.checklistName
                        : `${form.checklistName.length || 0}/100 characters`
                    }
                    sx={inputSx}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12} sm={6} sx={{ width: "250px" }}>
                  <Typography component="label" sx={labelSx}>
                    Category <span style={{ color: C.error }}>*</span>
                  </Typography>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={inputSx}
                    disabled={contextLoading}
                    error={touched.category && !!errors.category}
                  >
                    <Select
                      displayEmpty
                      value={form.category}
                      onChange={handleChange("category")}
                      onBlur={handleBlur("category")}
                      renderValue={(v) =>
                        v || selectPlaceholder("Select category")
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <MenuItem
                          key={c}
                          value={c}
                          sx={{ fontSize: "0.82rem" }}
                        >
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.category && errors.category && (
                      <FormHelperText error>{errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Detailed Description */}
                <Grid item xs={12} sx={{ width: "250px" }}>
                  <Typography component="label" sx={labelSx}>
                    Detailed Description{" "}
                    <span style={{ color: C.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    value={form.detailedDescription}
                    onChange={handleChange("detailedDescription")}
                    onBlur={handleBlur("detailedDescription")}
                    disabled={contextLoading}
                    error={
                      touched.detailedDescription &&
                      !!errors.detailedDescription
                    }
                    helperText={
                      touched.detailedDescription && errors.detailedDescription
                        ? errors.detailedDescription
                        : `${form.detailedDescription.length || 0}/2000 characters (minimum 20)`
                    }
                    sx={inputSx}
                  />
                </Grid>

                {/* Business Justification */}
                <Grid item xs={12} sx={{ width: "250px" }}>
                  <Typography component="label" sx={labelSx}>
                    Business Justification{" "}
                    <span style={{ color: C.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    value={form.businessJustification}
                    onChange={handleChange("businessJustification")}
                    onBlur={handleBlur("businessJustification")}
                    disabled={contextLoading}
                    error={
                      touched.businessJustification &&
                      !!errors.businessJustification
                    }
                    helperText={
                      touched.businessJustification &&
                      errors.businessJustification
                        ? errors.businessJustification
                        : `${form.businessJustification.length || 0}/2000 characters (minimum 20)`
                    }
                    sx={inputSx}
                  />
                </Grid>

                {/* Urgency Level */}
                <Grid item xs={12} sm={6} sx={{ width: "250px" }}>
                  <Typography component="label" sx={labelSx}>
                    Urgency Level <span style={{ color: C.error }}>*</span>
                  </Typography>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={inputSx}
                    disabled={contextLoading}
                    error={touched.urgencyLevel && !!errors.urgencyLevel}
                  >
                    <Select
                      displayEmpty
                      value={form.urgencyLevel}
                      onChange={handleChange("urgencyLevel")}
                      onBlur={handleBlur("urgencyLevel")}
                      renderValue={(v) => {
                        if (!v)
                          return selectPlaceholder("Select urgency level");
                        const urgency = URGENCY_LEVELS.find(
                          (u) => u.value === v,
                        );
                        return (
                          <Box
                            component="span"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: getUrgencyColor(v),
                              }}
                            />
                            {urgency?.label || v}
                          </Box>
                        );
                      }}
                    >
                      {URGENCY_LEVELS.map((u) => (
                        <MenuItem
                          key={u.value}
                          value={u.value}
                          sx={{
                            fontSize: "0.82rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.5,
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: u.color,
                              }}
                            />
                            <strong>{u.label}</strong>
                          </Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 2 }}
                          >
                            {u.description}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.urgencyLevel && errors.urgencyLevel && (
                      <FormHelperText error>
                        {errors.urgencyLevel}
                      </FormHelperText>
                    )}
                    {form.urgencyLevel && (
                      <FormHelperText>
                        {getUrgencyDescription(form.urgencyLevel)}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Expected Usage Frequency */}
                <Grid item xs={12} sm={6} sx={{ width: "250px" }}>
                  <Typography component="label" sx={labelSx}>
                    Expected Usage Frequency
                  </Typography>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={inputSx}
                    disabled={contextLoading}
                  >
                    <Select
                      displayEmpty
                      value={form.expectedUsageFrequency}
                      onChange={handleChange("expectedUsageFrequency")}
                      renderValue={(v) => {
                        if (!v)
                          return selectPlaceholder(
                            "How often will this be used?",
                          );
                        const found = USAGE_FREQUENCIES.find(
                          (f) => f.value === v,
                        );
                        return found ? found.label : v;
                      }}
                    >
                      {USAGE_FREQUENCIES.map((f) => (
                        <MenuItem
                          key={f.value}
                          value={f.value}
                          sx={{
                            fontSize: "0.82rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.5,
                          }}
                        >
                          <strong>{f.label}</strong>
                          <Typography variant="caption" color="text.secondary">
                            {f.description}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Number of Team Members */}
                <Grid item xs={12} sm={6} sx={{ width: "250px" }}>
                  <Typography component="label" sx={labelSx}>
                    Number of Team Members
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="e.g., 5"
                    value={form.numberOfTeamMembers}
                    onChange={handleChange("numberOfTeamMembers")}
                    onBlur={handleBlur("numberOfTeamMembers")}
                    inputProps={{ min: 1, max: 1000, step: 1 }}
                    disabled={contextLoading}
                    error={
                      touched.numberOfTeamMembers &&
                      !!errors.numberOfTeamMembers
                    }
                    sx={inputSx}
                  />
                </Grid>

                {/* Message */}
                <Grid item xs={12} sm={6} sx={{ width: "250px" }}>
                  <Typography component="label" sx={labelSx}>
                    Message{" "}
                    <span style={{ color: C.text.muted, fontWeight: 400 }}>
                      (Optional)
                    </span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={form.message}
                    onChange={handleChange("message")}
                    onBlur={handleBlur("message")}
                    disabled={contextLoading}
                    error={touched.message && !!errors.message}
                    helperText={
                      touched.message && errors.message
                        ? errors.message
                        : `${form.message.length || 0}/500 characters`
                    }
                    sx={inputSx}
                  />
                </Grid>

                {/* Additional Notes */}
                <Grid item xs={12} sx={{ width: "522px" }}>
                  <Typography component="label" sx={labelSx}>
                    Additional Notes{" "}
                    <span style={{ color: C.text.muted, fontWeight: 400 }}>
                      (Optional)
                    </span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={form.additionalNotes}
                    onChange={handleChange("additionalNotes")}
                    onBlur={handleBlur("additionalNotes")}
                    disabled={contextLoading}
                    error={touched.additionalNotes && !!errors.additionalNotes}
                    sx={inputSx}
                  />
                </Grid>

                {/* File Upload */}
                <Grid item xs={12} sx={{width:"522px"}}>
                  <Typography component="label" sx={labelSx}>
                    Reference Files & Documents
                    {files.length > 0 && (
                      <Typography
                        component="span"
                        sx={{
                          ml: 1,
                          fontSize: "0.7rem",
                          color: isFileSizeWarning ? C.warning : C.text.muted,
                        }}
                      >
                        ({files.length}/{MAX_TOTAL_FILES} files,{" "}
                        {formatFileSize(totalFileSize)})
                      </Typography>
                    )}
                  </Typography>

                  {isFileSizeWarning &&
                    totalFileSize > MAX_FILE_SIZE_WARNING_MB * 1024 * 1024 && (
                      <Alert
                        severity="warning"
                        icon={<WarningIcon />}
                        sx={{
                          mb: 1.5,
                          py: 0,
                          "& .MuiAlert-message": { fontSize: "0.75rem" },
                        }}
                      >
                        Total file size exceeds {MAX_FILE_SIZE_WARNING_MB}MB.
                        Large files may take longer to upload.
                      </Alert>
                    )}

                  <Box
                    onClick={() =>
                      !contextLoading && fileInputRef.current?.click()
                    }
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!contextLoading) setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={contextLoading ? undefined : handleDrop}
                    sx={{
                      border: `2px dashed ${dragOver ? C.primary : errors.files ? C.error : C.border}`,
                      borderRadius: "12px",
                      bgcolor: dragOver ? "rgba(13,74,92,0.04)" : "#fafbfc",
                      py: 3.5,
                      px: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: contextLoading ? "not-allowed" : "pointer",
                      opacity: contextLoading ? 0.6 : 1,
                      transition: "all 0.2s",
                      "&:hover": !contextLoading && {
                        borderColor: C.primary,
                        bgcolor: "rgba(13,74,92,0.03)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1.5,
                      }}
                    >
                      <CloudUploadIcon
                        sx={{ fontSize: 24, color: C.text.secondary }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: C.text.primary,
                      }}
                    >
                      Click to upload or drag & drop
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: C.text.secondary,
                        mt: 0.5,
                        textAlign: "center",
                      }}
                    >
                      PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (Max{" "}
                      {MAX_FILE_SIZE_MB}MB per file, {MAX_TOTAL_FILES} files
                      max)
                    </Typography>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ALLOWED_FILE_TYPES.join(",")}
                      style={{ display: "none" }}
                      onChange={handleFileInput}
                    />
                  </Box>

                  {/* Attached files list */}
                  {files.length > 0 && (
                    <Stack spacing={1} mt={2}>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: C.text.secondary,
                        }}
                      >
                        Attached Files ({files.length})
                      </Typography>
                      {files.map((file, idx) => (
                        <Box
                          key={`${file.name}-${idx}`}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: "10px",
                            border: `1px solid ${C.border}`,
                            bgcolor: "#fafbfc",
                            "&:hover": { bgcolor: "#f8fafc" },
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            sx={{ flex: 1, minWidth: 0 }}
                          >
                            <AttachFileIcon
                              sx={{
                                fontSize: 15,
                                color: C.text.secondary,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
                                color: C.text.primary,
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {file.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.65rem",
                                color:
                                  file.size >
                                  MAX_FILE_SIZE_WARNING_MB * 1024 * 1024
                                    ? C.warning
                                    : C.text.muted,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                            >
                              ({formatFileSize(file.size)})
                            </Typography>
                          </Box>
                          <Tooltip title="Remove file">
                            <IconButton
                              size="small"
                              onClick={() => removeFile(idx)}
                              disabled={contextLoading}
                              sx={{ flexShrink: 0 }}
                            >
                              <DeleteOutlineIcon
                                sx={{ fontSize: 16, color: C.error }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        {/* Footer */}
        {!submitted && (
          <>
            <Divider />
            <DialogActions
              sx={{ px: 3, py: 2.5, gap: 1.5, justifyContent: "space-between" }}
            >
              <Button
                onClick={handleClose}
                disabled={contextLoading}
                variant="outlined"
                sx={{
                  borderColor: C.border,
                  color: C.text.secondary,
                  textTransform: "none",
                  fontSize: "0.8rem",
                  borderRadius: "10px",
                  px: 3,
                  "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                }}
              >
                Cancel
              </Button>

              {/* Character count summary */}
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: C.text.muted,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {form.detailedDescription.length}/2000 chars •{" "}
                {form.businessJustification.length}/2000 chars
              </Typography>

              <Button
                onClick={handleSubmit}
                disabled={isDisabled}
                variant="contained"
                startIcon={
                  contextLoading ? (
                    <CircularProgress size={15} sx={{ color: "#fff" }} />
                  ) : (
                    <SendIcon sx={{ fontSize: 16 }} />
                  )
                }
                sx={{
                  bgcolor: C.primary,
                  textTransform: "none",
                  fontSize: "0.8rem",
                  borderRadius: "10px",
                  px: 3,
                  fontWeight: 600,
                  "&:hover": { bgcolor: C.primaryDark },
                  "&.Mui-disabled": { bgcolor: "#94a3b8", color: "#fff" },
                }}
              >
                {contextLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          severity={snackbar.severity}
          sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SubmitRequestModal;
