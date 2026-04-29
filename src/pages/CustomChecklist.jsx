// Updated CustomChecklistBuilder with proper API integration
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Divider,
  Checkbox,
  FormControlLabel,
  Chip,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Rating,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/Save";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TagIcon from "@mui/icons-material/Tag";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import jsPDF from "jspdf";
import { useChecklistBuilder } from "../context/ChecklistBuilderContext";
import { useNavigate } from "react-router-dom";

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a4a5c", dark: "#0f3040", light: "#2a7a9b" },
    background: { default: "#f4f5f7", paper: "#ffffff" },
    text: { primary: "#1a1d23", secondary: "#6b7280" },
  },
  typography: { fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          fontSize: 13,
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          "& fieldset": { borderColor: "#e5e7eb" },
          "&:hover fieldset": { borderColor: "#cbd5e1" },
          "&.Mui-focused fieldset": { borderColor: "#2a7a9b" },
        },
      },
    },
  },
});

// Location options
const LOCATION_OPTIONS = [
  "Warehouse A",
  "Warehouse B",
  "Factory Floor",
  "Office Building",
];

// Equipment category options
const CATEGORY_OPTIONS = [
  "Heavy Machinery",
  "Electrical",
  "Safety Equipment",
  "Tools",
];

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title }) {
  return (
    <Box
      sx={{
        bgcolor: "#eef2f5",
        borderRadius: "10px",
        px: 2.5,
        py: 1.5,
        mb: 3,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 15,
          color: "#1a4a5c",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

// ─── Form Field Label ─────────────────────────────────────────────────────────
function FieldLabel({ label, required }) {
  return (
    <Typography
      sx={{
        fontSize: 13,
        fontWeight: 600,
        color: "#1a4a5c",
        mb: 0.8,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
      {required && " *"}
    </Typography>
  );
}

// ─── Signature Pad ────────────────────────────────────────────────────────────
function SignaturePad({ readOnly = false, onSignatureChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    if (readOnly) return;
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!drawing.current || readOnly) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1a4a5c";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    if (!hasSignature) {
      setHasSignature(true);
      if (onSignatureChange) onSignatureChange(true);
    }
  };

  const stopDraw = () => {
    drawing.current = false;
  };

  const clearCanvas = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    if (onSignatureChange) onSignatureChange(false);
  };

  return (
    <Box
      sx={{
        border: "1.5px solid #e5e7eb",
        borderRadius: "10px",
        bgcolor: "#fff",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={700}
        height={100}
        style={{
          display: "block",
          width: "100%",
          height: 100,
          cursor: readOnly ? "default" : "crosshair",
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <Divider sx={{ borderColor: "#e5e7eb" }} />
      <Box
        sx={{
          px: 2.5,
          py: 1.2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 12.5, color: "#2a7a9b" }}>
          {hasSignature
            ? "Signature captured"
            : "Sign above using mouse or touch"}
        </Typography>
        {!readOnly && (
          <Button
            size="small"
            onClick={clearCanvas}
            sx={{ fontSize: 11, color: "#9ca3af", minWidth: "auto", p: 0 }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
}

// ─── Success Dialog ───────────────────────────────────────────────────────────
function SuccessDialog({ open, onClose, message, checklistId }) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: "#4caf50", mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Success!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ textAlign: "center", color: "#6b7280" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Continue Editing
        </Button>
        <Button
          onClick={() => navigate("/admin/checklists")}
          variant="contained"
          sx={{ bgcolor: "#1a4a5c" }}
        >
          View Checklists
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Page with API Integration ────────────────────────────────────────────
export default function CustomChecklistBuilder() {
  const navigate = useNavigate();
  const { createChecklist, loading, error, success, clearMessages } =
    useChecklistBuilder();

  // Form Data State
  const [formData, setFormData] = useState({
    name: "Equipment Safety Inspection Form",
    description:
      "Complete this form to document equipment safety inspection results. All fields marked with * are required.",
    category: "Safety",
    equipmentName: "",
    equipmentId: "",
    location: "",
    equipmentCategory: "",
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectorName: "",
    preInspectionChecks: [
      { label: "Equipment is powered off", checked: false },
      { label: "Safety gear is available", checked: false },
      { label: "Area is clear of hazards", checked: false },
      { label: "Documentation is ready", checked: false },
    ],
    overallCondition: 3,
    additionalNotes: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [createdChecklistId, setCreatedChecklistId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const toggleCheck = (index) => {
    if (!editMode) return;
    const newChecks = [...formData.preInspectionChecks];
    newChecks[index].checked = !newChecks[index].checked;
    setFormData({ ...formData, preInspectionChecks: newChecks });
  };

  const handleInputChange = (field, value) => {
    if (!editMode) return;
    setFormData({ ...formData, [field]: value });
  };

  // Prepare data for API submission
  const prepareChecklistData = () => {
    const sections = [
      {
        sectionTitle: "Basic Information",
        sectionDescription: "Equipment and inspection details",
        fields: [
          {
            label: "Equipment Name",
            fieldType: "text_input",
            isRequired: true,
            placeholder: "Enter equipment name",
            order: 0,
          },
          {
            label: "Equipment ID",
            fieldType: "text_input",
            isRequired: true,
            placeholder: "Enter equipment ID",
            order: 1,
          },
          {
            label: "Location",
            fieldType: "dropdown",
            isRequired: true,
            options: LOCATION_OPTIONS,
            placeholder: "Select location",
            order: 2,
          },
          {
            label: "Equipment Category",
            fieldType: "dropdown",
            isRequired: true,
            options: CATEGORY_OPTIONS,
            placeholder: "Select category",
            order: 3,
          },
          {
            label: "Inspection Date",
            fieldType: "date_picker",
            isRequired: true,
            placeholder: "Select date",
            order: 4,
          },
          {
            label: "Inspector Name",
            fieldType: "text_input",
            isRequired: true,
            placeholder: "Enter inspector name",
            order: 5,
          },
        ],
      },
      {
        sectionTitle: "Safety Checks",
        sectionDescription: "Pre-inspection safety checklist",
        fields: [
          {
            label: "Pre-Inspection Checklist",
            fieldType: "checkbox",
            isRequired: true,
            checkboxItems: formData.preInspectionChecks.map((c) => c.label),
            order: 0,
          },
          {
            label: "Overall Equipment Condition",
            fieldType: "rating",
            isRequired: true,
            ratingMax: 5,
            order: 1,
          },
        ],
      },
      {
        sectionTitle: "Documentation",
        sectionDescription: "Upload supporting documents",
        fields: [
          {
            label: "Upload Equipment Photos",
            fieldType: "image_upload",
            isRequired: false,
            order: 0,
          },
          {
            label: "Additional Notes",
            fieldType: "text_area",
            isRequired: false,
            placeholder: "Enter any additional observations...",
            order: 1,
          },
          {
            label: "Inspector Signature",
            fieldType: "signature",
            isRequired: true,
            order: 2,
          },
        ],
      },
    ];

    return {
      name: formData.name,
      description: formData.description,
      type: "custom",
      category: formData.category,
      status: "active",
      sections: sections,
      tags: ["Safety", "Equipment", "Inspection"],
    };
  };

  // Handle Save/Create Checklist
  const handleSave = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      setSnackbarMessage("Please enter a checklist name");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const checklistData = prepareChecklistData();
    setSubmitting(true);
    const result = await createChecklist(checklistData);
    setSubmitting(false);

    if (result.success) {
      setCreatedChecklistId(result.data?._doc?._id || result.data?._id);
      setSuccessDialogOpen(true);
    } else {
      setSnackbarMessage(result.error || "Failed to create checklist");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Download Form as PDF with filled data
  const downloadFormAsPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const teal = [26, 74, 92];
    const gray = [107, 114, 128];
    const lightGray = [243, 244, 246];
    const W = 210;
    let y = 0;

    // Header
    doc.setFillColor(...teal);
    doc.rect(0, 0, W, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(formData.name, 14, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(formData.description.substring(0, 80) + "...", 14, 20);
    y = 36;

    const section = (title) => {
      doc.setFillColor(...lightGray);
      doc.roundedRect(10, y, W - 20, 10, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...teal);
      doc.text(title, 14, y + 7);
      y += 16;
    };

    const field = (label, value, x, w) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...teal);
      doc.text(label, x, y);
      doc.setDrawColor(229, 231, 235);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y + 2, w, 10, 2, 2, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...gray);
      const displayValue = value || "[Not filled]";
      const truncatedValue =
        displayValue.length > 25
          ? displayValue.substring(0, 22) + "..."
          : displayValue;
      doc.text(truncatedValue, x + 3, y + 8.5);
    };

    // Basic Information
    section("Basic Information");
    field("Equipment Name", formData.equipmentName, 10, 90);
    field("Equipment ID", formData.equipmentId, 108, 92);
    y += 18;
    field("Location", formData.location, 10, 90);
    field("Equipment Category", formData.equipmentCategory, 108, 92);
    y += 18;
    field("Inspection Date", formData.inspectionDate, 10, 90);
    field("Inspector Name", formData.inspectorName, 108, 92);
    y += 22;

    // Safety Checks
    section("Safety Checks");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...teal);
    doc.text("Pre-Inspection Checklist *", 10, y);
    y += 5;
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, y, W - 20, 34, 2, 2, "FD");
    formData.preInspectionChecks.forEach((check, i) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      doc.text(
        `${check.checked ? "☑" : "☐"}  ${check.label}`,
        16,
        y + 7 + i * 7,
      );
    });
    y += 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...teal);
    doc.text("Overall Equipment Condition *", 10, y);
    y += 5;
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, y, W - 20, 14, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    const stars =
      "★".repeat(formData.overallCondition) +
      "☆".repeat(5 - formData.overallCondition);
    doc.text(`${stars}   [Rating: ${formData.overallCondition}/5]`, 20, y + 9);
    y += 20;

    // Documentation
    section("Documentation");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...teal);
    doc.text("Additional Notes", 10, y);
    y += 5;
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, y, W - 20, 18, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    const notes = formData.additionalNotes || "[No notes added]";
    const truncatedNotes =
      notes.length > 50 ? notes.substring(0, 47) + "..." : notes;
    doc.text(truncatedNotes, 14, y + 8);
    y += 24;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...teal);
    doc.text("Inspector Signature *", 10, y);
    y += 5;
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, y, W - 20, 20, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.setFontSize(9);
    doc.text("[Signature captured in system]", W / 2, y + 10, {
      align: "center",
    });
    y += 28;

    // Footer
    doc.setDrawColor(229, 231, 235);
    doc.line(10, y, W - 10, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...gray);
    doc.text(
      `Form ID: CUSTOM-${Date.now()}  |  Generated: ${new Date().toLocaleDateString()}`,
      14,
      y,
    );

    doc.save(`${formData.name.replace(/\s/g, "_")}_Inspection_Report.pdf`);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    clearMessages();
  };

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    if (success && !successDialogOpen) {
      setSnackbarMessage(success);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  }, [error, success]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <Box
        sx={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", p: 3 }}
      >
        {/* Top Nav */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            px: 3,
            py: 2,
            borderRadius: "10px",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <IconButton
              size="small"
              onClick={() => navigate("/admin/checklists")}
              sx={{
                color: "#374151",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                p: 0.6,
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Box>
              <Typography
                sx={{ fontSize: 18, fontWeight: 700, color: "#1a1d23" }}
              >
                Custom Checklist Builder
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                Create and manage custom inspection checklists
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1.2}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
              onClick={downloadFormAsPDF}
              sx={{
                borderColor: "#cbd5e1",
                color: "#374151",
                bgcolor: "#f8fafc",
              }}
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              startIcon={
                editMode ? (
                  <SaveIcon sx={{ fontSize: 16 }} />
                ) : (
                  <EditOutlinedIcon sx={{ fontSize: 16 }} />
                )
              }
              onClick={handleSave}
              disabled={loading || submitting}
              sx={{ bgcolor: editMode ? "#1a4a5c" : "#374151" }}
            >
              {submitting ? (
                <CircularProgress size={20} />
              ) : editMode ? (
                "Save Checklist"
              ) : (
                "Edit Form"
              )}
            </Button>
          </Box>
        </Box>

        {/* Body */}
        <Box
          sx={{
            display: "flex",
            gap: 2.5,
            alignItems: "flex-start",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Left: Form */}
          <Box sx={{ flex: 1, minWidth: 0, width: { xs: "100%", md: "auto" } }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              {/* Form Title */}
              {editMode ? (
                <TextField
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  variant="standard"
                  sx={{
                    mb: 1,
                    "& .MuiInputBase-input": { fontSize: 22, fontWeight: 800 },
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#1a1d23",
                    mb: 0.8,
                  }}
                >
                  {formData.name}
                </Typography>
              )}

              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  variant="standard"
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                  {formData.description}
                </Typography>
              )}

              <Divider sx={{ mb: 3, borderColor: "#f1f3f5" }} />

              {/* Basic Information */}
              <SectionHeader title="Basic Information" />
              <Grid container spacing={2.5} mb={3}>
                <Grid item xs={12} sm={6}>
                  <FieldLabel label="Equipment Name" required />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter equipment name"
                    value={formData.equipmentName}
                    onChange={(e) =>
                      handleInputChange("equipmentName", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FieldLabel label="Equipment ID" required />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter equipment ID"
                    value={formData.equipmentId}
                    onChange={(e) =>
                      handleInputChange("equipmentId", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FieldLabel label="Location" required />
                  <TextField
                    fullWidth
                    select
                    size="small"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    disabled={!editMode}
                  >
                    <option value="">Select location</option>
                    {LOCATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FieldLabel label="Equipment Category" required />
                  <TextField
                    fullWidth
                    select
                    size="small"
                    value={formData.equipmentCategory}
                    onChange={(e) =>
                      handleInputChange("equipmentCategory", e.target.value)
                    }
                    disabled={!editMode}
                  >
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FieldLabel label="Inspection Date" required />
                  <TextField
                    fullWidth
                    type={editMode ? "date" : "text"}
                    size="small"
                    value={formData.inspectionDate}
                    onChange={(e) =>
                      handleInputChange("inspectionDate", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FieldLabel label="Inspector Name" required />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter inspector name"
                    value={formData.inspectorName}
                    onChange={(e) =>
                      handleInputChange("inspectorName", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                  />
                </Grid>
              </Grid>

              {/* Safety Checks */}
              <SectionHeader title="Safety Checks" />
              <FieldLabel label="Pre-Inspection Checklist" required />
              <Box
                sx={{
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  px: 2.5,
                  py: 1.5,
                  mb: 3,
                  bgcolor: "#fff",
                }}
              >
                {formData.preInspectionChecks.map((item, i) => (
                  <FormControlLabel
                    key={i}
                    control={
                      <Checkbox
                        checked={item.checked}
                        onChange={() => toggleCheck(i)}
                        disabled={!editMode}
                        size="small"
                        sx={{
                          color: "#1a4a5c",
                          "&.Mui-checked": { color: "#1a4a5c" },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13.5, color: "#374151" }}>
                        {item.label}
                      </Typography>
                    }
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 0.5,
                      ml: 0,
                    }}
                  />
                ))}
              </Box>

              <FieldLabel label="Overall Equipment Condition" required />
              <Box
                sx={{
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  px: 2.5,
                  py: 1.8,
                  mb: 3,
                  bgcolor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Rating
                  value={formData.overallCondition}
                  onChange={(_, v) => handleInputChange("overallCondition", v)}
                  readOnly={!editMode}
                  size="large"
                  sx={{ "& .MuiRating-iconFilled": { color: "#ffb74d" } }}
                />
                <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
                  {formData.overallCondition}/5
                </Typography>
              </Box>

              {/* Documentation */}
              <SectionHeader title="Documentation" />
              <FieldLabel label="Upload Equipment Photos" />
              <Box
                sx={{
                  border: "2px dashed #d1d5db",
                  borderRadius: "10px",
                  bgcolor: "#fafafa",
                  p: "28px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                  cursor: editMode ? "pointer" : "default",
                }}
              >
                <ImageOutlinedIcon sx={{ fontSize: 36, color: "#d1d5db" }} />
                <Typography sx={{ fontSize: 14, color: "#374151" }}>
                  {editMode
                    ? "Drag and drop images here or click to browse"
                    : "Image upload area"}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#2a7a9b" }}>
                  Supported formats: JPG, PNG, PDF (Max 10MB)
                </Typography>
              </Box>

              <FieldLabel label="Additional Notes" />
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter any additional observations..."
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                InputProps={{ readOnly: !editMode }}
                sx={{ mb: 3 }}
              />

              <FieldLabel label="Inspector Signature" required />
              <SignaturePad readOnly={!editMode} />

              {/* Footer */}
              <Divider sx={{ mt: 4, mb: 2.5 }} />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
              >
                <Typography sx={{ fontSize: 12.5, color: "#9ca3af" }}>
                  {editMode
                    ? "Edit Mode: Make changes to the form"
                    : "View Mode: Click Edit Form to make changes"}
                </Typography>
                <Box display="flex" gap={1.2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (editMode) {
                        setFormData({
                          ...formData,
                          equipmentName: "",
                          equipmentId: "",
                          location: "",
                          equipmentCategory: "",
                          inspectorName: "",
                          preInspectionChecks: formData.preInspectionChecks.map(
                            (c) => ({ ...c, checked: false }),
                          ),
                          overallCondition: 3,
                          additionalNotes: "",
                        });
                        setSnackbarMessage("Form cleared successfully!");
                        setSnackbarSeverity("success");
                        setSnackbarOpen(true);
                      }
                    }}
                    disabled={!editMode}
                  >
                    Clear Form
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (!editMode) {
                        setSnackbarMessage(
                          "Please enter edit mode to fill the form",
                        );
                        setSnackbarSeverity("info");
                        setSnackbarOpen(true);
                      } else {
                        setSnackbarMessage(
                          "Inspection submitted successfully!",
                        );
                        setSnackbarSeverity("success");
                        setSnackbarOpen(true);
                      }
                    }}
                    sx={{ bgcolor: "#1a4a5c" }}
                  >
                    Submit Inspection
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Right: Form Details Panel */}
          <Box sx={{ width: { xs: "100%", md: 280 }, flexShrink: 0 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                p: "24px 22px",
              }}
            >
              <Typography
                sx={{ fontSize: 16, fontWeight: 700, color: "#1a1d23", mb: 3 }}
              >
                Form Details
              </Typography>

              <Box display="flex" alignItems="flex-start" gap={1.5} mb={2.5}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "8px",
                    bgcolor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FolderOutlinedIcon sx={{ fontSize: 17, color: "#6b7280" }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: 11.5, color: "#9ca3af", mb: 0.2 }}
                  >
                    Form Name
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13.5, fontWeight: 600, color: "#1a1d23" }}
                  >
                    {formData.name}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="flex-start" gap={1.5} mb={2.5}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "8px",
                    bgcolor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 17, color: "#6b7280" }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: 11.5, color: "#9ca3af", mb: 0.2 }}
                  >
                    Created By
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13.5, fontWeight: 600, color: "#1a1d23" }}
                  >
                    System Admin
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="flex-start" gap={1.5} mb={2.5}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "8px",
                    bgcolor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 17, color: "#6b7280" }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: 11.5, color: "#9ca3af", mb: 0.2 }}
                  >
                    Created On
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13.5, fontWeight: 600, color: "#1a1d23" }}
                  >
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="flex-start" gap={1.5} mb={2.5}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "8px",
                    bgcolor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TagIcon sx={{ fontSize: 17, color: "#6b7280" }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: 11.5, color: "#9ca3af", mb: 0.8 }}
                  >
                    Tags
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.7}>
                    {["Safety", "Equipment", "Inspection", "Custom"].map(
                      (tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: "#eef2f5",
                            color: "#374151",
                            fontSize: 11.5,
                            fontWeight: 500,
                            height: 24,
                            borderRadius: "6px",
                          }}
                        />
                      ),
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Status */}
              <Box
                sx={{
                  bgcolor: editMode ? "#fff3e0" : "#e8f5e9",
                  borderRadius: "10px",
                  py: 1.5,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 16, color: editMode ? "#ed6c02" : "#4caf50" }}
                />
                <Typography
                  sx={{
                    fontSize: 13,
                    color: editMode ? "#ed6c02" : "#4caf50",
                    fontWeight: 500,
                  }}
                >
                  {editMode ? "Edit Mode Active" : "Ready to Submit"}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Success Dialog */}
      <SuccessDialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        message="Custom checklist has been created successfully!"
        checklistId={createdChecklistId}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
