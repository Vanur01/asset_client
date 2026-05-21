import React, { useState, useRef, useCallback, useMemo } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DescriptionIcon from "@mui/icons-material/Description";
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
  { value: "low", label: "Low", color: "#10b981" },
  { value: "medium", label: "Medium", color: "#f59e0b" },
  { value: "high", label: "High", color: "#ef4444" },
  { value: "critical", label: "Critical", color: "#dc2626" },
];

const USAGE_FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "as_needed", label: "As Needed" },
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

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
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

// ─── Main Component ────────────────────────────────────────────────────────────
const SubmitRequestModal = ({ open, onClose, onSubmitSuccess }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const fileInputRef = useRef(null);

  const { submitRequest, loading: contextLoading } = useRequestChecklist();

  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // ─── Memoized Values ─────────────────────────────────────────────────────────
  const isDisabled = useMemo(() => {
    return (
      !form.checklistName.trim() ||
      !form.category ||
      !form.detailedDescription.trim() ||
      !form.businessJustification.trim() ||
      !form.urgencyLevel ||
      contextLoading
    );
  }, [form, contextLoading]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const showError = useCallback((message) => {
    setSnackbar({ open: true, message, severity: "error" });
  }, []);

  const showSuccess = useCallback((message) => {
    setSnackbar({ open: true, message, severity: "success" });
  }, []);

  const handleChange = useCallback(
    (field) => (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setFiles([]);
    setSubmitted(false);
    setDragOver(false);
  }, []);

  const handleClose = useCallback(() => {
    if (contextLoading) return;
    resetForm();
    onClose?.();
  }, [contextLoading, resetForm, onClose]);

  // ─── File Handling ───────────────────────────────────────────────────────────
  const validateFiles = useCallback((newFiles) => {
    const valid = [];
    const invalid = [];

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
            ? "Invalid type"
            : `Exceeds ${MAX_FILE_SIZE_MB}MB`,
        });
      }
    });

    return { valid, invalid };
  }, []);

  const addFiles = useCallback(
    (newFiles) => {
      const { valid, invalid } = validateFiles(newFiles);

      if (invalid.length > 0) {
        const errorMessages = invalid
          .map((f) => `${f.name} (${f.reason})`)
          .join(", ");
        showError(`Cannot add: ${errorMessages}`);
      }

      if (valid.length > 0) {
        setFiles((prev) => {
          const existingNames = new Set(prev.map((f) => f.name));
          const unique = valid.filter((f) => !existingNames.has(f.name));

          if (unique.length < valid.length) {
            showError(
              `${valid.length - unique.length} duplicate file(s) were skipped.`,
            );
          }
          return [...prev, ...unique];
        });
      }
    },
    [validateFiles, showError],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) addFiles(droppedFiles);
    },
    [addFiles],
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

  // ─── Submit Handler ──────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (isDisabled) return;

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
      parseInt(form.numberOfTeamMembers, 10) || 1,
    );

    if (form.additionalNotes.trim())
      formData.append("additionalNotes", form.additionalNotes.trim());
    if (form.message.trim()) formData.append("message", form.message.trim());

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
        }, 2000);
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
    isDisabled,
    form,
    files,
    submitRequest,
    showSuccess,
    showError,
    onSubmitSuccess,
    resetForm,
    onClose,
  ]);

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const labelSx = {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: C.text.primary,
    mb: 0.75,
    display: "block",
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      fontSize: "0.82rem",
      bgcolor: "#f8fafc",
      borderRadius: "8px",
      "& fieldset": { borderColor: C.border },
      "&:hover fieldset": { borderColor: "#94a3b8" },
      "&.Mui-focused fieldset": { borderColor: C.primary, borderWidth: 1.5 },
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
            <IconButton
              onClick={handleClose}
              disabled={contextLoading}
              size="small"
              sx={{ color: "#fff", mt: -0.5, mr: -0.5 }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Body */}
        <DialogContent sx={{ p: 0, overflowX: "hidden" }}>
          {submitted ? (
            <SuccessContent />
          ) : (
            <Box sx={{ px: 3, py: 3 }}>
              <Grid container spacing={2.5}>
                {/* Checklist Name */}
                <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                  <Typography component="label" sx={labelSx}>
                    Checklist Name <span style={{ color: C.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={form.checklistName}
                    onChange={handleChange("checklistName")}
                    disabled={contextLoading}
                    sx={inputSx}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                  <Typography component="label" sx={labelSx}>
                    Category <span style={{ color: C.error }}>*</span>
                  </Typography>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={inputSx}
                    disabled={contextLoading}
                  >
                    <Select
                      displayEmpty
                      value={form.category}
                      onChange={handleChange("category")}
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
                  </FormControl>
                </Grid>

                {/* Detailed Description */}
                <Grid item xs={12} sx={{width:"250px"}}>
                  <Typography component="label" sx={labelSx}>
                    Detailed Description{" "}
                    <span style={{ color: C.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    value={form.detailedDescription}
                    onChange={handleChange("detailedDescription")}
                    disabled={contextLoading}
                    sx={inputSx}
                  />
                </Grid>

                {/* Business Justification */}
                <Grid item xs={12} sx={{width:"250px"}}>
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
                    disabled={contextLoading}
                    sx={inputSx}
                  />
                </Grid>

                {/* Urgency Level */}
                <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                  <Typography component="label" sx={labelSx}>
                    Urgency Level <span style={{ color: C.error }}>*</span>
                  </Typography>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={inputSx}
                    disabled={contextLoading}
                  >
                    <Select
                      displayEmpty
                      value={form.urgencyLevel}
                      onChange={handleChange("urgencyLevel")}
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
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: u.color,
                            }}
                          />
                          {u.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Expected Usage Frequency */}
                <Grid item xs={12} sm={6} sx={{width:"250px"}}>
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
                          sx={{ fontSize: "0.82rem" }}
                        >
                          {f.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Number of Team Members */}
                <Grid item xs={12} sm={6} sx={{width:"250px"}}>
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
                    inputProps={{ min: 1, max: 1000 }}
                    disabled={contextLoading}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon
                            sx={{ fontSize: 16, color: C.text.muted }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Message */}
                <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                  <Typography component="label" sx={labelSx}>
                    Message{" "}
                    <span style={{ color: C.text.muted, fontWeight: 400 }}>
                      (Optional)
                    </span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add any additional message for the reviewer..."
                    value={form.message}
                    onChange={handleChange("message")}
                    disabled={contextLoading}
                    sx={inputSx}
                  />
                </Grid>

                {/* Additional Notes */}
                <Grid item xs={12} sx={{width:"530px"}}>
                  <Typography component="label" sx={labelSx}>
                    Additional Notes{" "}
                    <span style={{ color: C.text.muted, fontWeight: 400 }}>
                      (Optional)
                    </span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    value={form.additionalNotes}
                    onChange={handleChange("additionalNotes")}
                    disabled={contextLoading}
                    sx={inputSx}
                  />
                </Grid>

                {/* File Upload */}
                <Grid item xs={12} sx={{width:"530px"}}>
                  <Typography component="label" sx={labelSx}>
                    Reference Files & Documents
                  </Typography>
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
                      border: `2px dashed ${dragOver ? C.primary : C.border}`,
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
                      {MAX_FILE_SIZE_MB}MB per file)
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
                                color: C.text.muted,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                            >
                              ({formatFileSize(file.size)})
                            </Typography>
                          </Box>
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
              sx={{ px: 3, py: 2.5, gap: 1.5, justifyContent: "flex-end" }}
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
