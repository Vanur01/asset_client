// CustomChecklistBuilder.jsx
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
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/Save";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TagIcon from "@mui/icons-material/Tag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useChecklistBuilder } from "../context/ChecklistBuilderContext";
import { useAuth } from "../context/AuthContexts";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
          fontSize: 14,
          "& fieldset": { borderColor: "#e5e7eb" },
          "&:hover fieldset": { borderColor: "#cbd5e1" },
          "&.Mui-focused fieldset": { borderColor: "#2a7a9b" },
        },
      },
    },
  },
});

const LOCATION_OPTIONS = [
  "Warehouse A",
  "Warehouse B",
  "Factory Floor",
  "Office Building",
];
const CATEGORY_OPTIONS = [
  "Heavy Machinery",
  "Electrical",
  "Safety Equipment",
  "Tools",
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeader({ title }) {
  return (
    <Box
      sx={{ bgcolor: "#eef2f5", borderRadius: "10px", px: 2.5, py: 1.5, mb: 3 }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1a4a5c" }}>
        {title}
      </Typography>
    </Box>
  );
}

function FieldLabel({ label, required }) {
  return (
    <Typography
      sx={{ fontSize: 13, fontWeight: 600, color: "#1a4a5c", mb: 0.8 }}
    >
      {label}
      {required && " *"}
    </Typography>
  );
}

function SignaturePad({ readOnly = false, onSignatureChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasSig, setHasSig] = useState(false);

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
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1a4a5c";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    if (!hasSig) {
      setHasSig(true);
      if (onSignatureChange) onSignatureChange(true);
    }
  };
  const stopDraw = () => {
    drawing.current = false;
    if (hasSig && canvasRef.current && onSignatureChange) {
      onSignatureChange(true, canvasRef.current.toDataURL());
    }
  };
  const clearCanvas = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
    if (onSignatureChange) onSignatureChange(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 700;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

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
        style={{
          display: "block",
          width: "100%",
          height: 100,
          cursor: readOnly ? "default" : "crosshair",
          backgroundColor: "#fff",
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
          {hasSig ? "Signature captured" : "Sign above using mouse or touch"}
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

function SuccessDialog({ open, onClose, message }) {
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function CustomChecklistBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createChecklist, loading, error, success, clearMessages } =
    useChecklistBuilder();

  const [signatureData, setSignatureData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
    photos: [],
  });

  const showSnack = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const handleInputChange = (field, value) => {
    if (!editMode) return;
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const toggleCheck = (index) => {
    if (!editMode) return;
    const newChecks = formData.preInspectionChecks.map((c, i) =>
      i === index ? { ...c, checked: !c.checked } : c,
    );
    setFormData((p) => ({ ...p, preInspectionChecks: newChecks }));
  };

  // ─── Prepare data for API ─────────────────────────────────────────────────
  // IMPORTANT: fieldType values MUST match the Mongoose enum exactly.
  const prepareChecklistData = () => ({
    name: formData.name.trim(),
    description: formData.description.trim(),
    type: "custom",
    category: formData.category,
    status: "active",
    tags: ["Safety", "Equipment", "Inspection"],
    sections: [
      {
        sectionTitle: "Basic Information",
        sectionDescription: "Equipment and inspection details",
        order: 0,
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
            order: 2,
          },
          {
            label: "Equipment Category",
            fieldType: "dropdown",
            isRequired: true,
            options: CATEGORY_OPTIONS,
            order: 3,
          },
          {
            label: "Inspection Date",
            fieldType: "date_picker",
            isRequired: true,
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
        order: 1,
        fields: [
          {
            label: "Pre-Inspection Checklist",
            fieldType: "checkbox", // ← correct enum value
            isRequired: true,
            checkboxItems: formData.preInspectionChecks.map((c) => c.label),
            order: 0,
          },
          {
            label: "Overall Equipment Condition",
            fieldType: "rating", // ← correct enum value
            isRequired: true,
            ratingMax: 5,
            ratingIcon: "star",
            order: 1,
          },
        ],
      },
      {
        sectionTitle: "Documentation",
        sectionDescription: "Upload supporting documents",
        order: 2,
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
            placeholder: "Enter any additional observations…",
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
    ],
  });

  const handleSave = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }
    if (!formData.name.trim()) {
      showSnack("Please enter a checklist name", "error");
      return;
    }

    setSubmitting(true);
    const result = await createChecklist(prepareChecklistData());
    setSubmitting(false);

    if (result.success) {
      setSuccessDialogOpen(true);
      setEditMode(false);
    } else {
      showSnack(result.error || "Failed to create checklist", "error");
    }
  };

  const downloadFormAsPDF = async () => {
    const pdfContent = document.createElement("div");
    pdfContent.style.cssText =
      "width:800px;padding:40px;font-family:'DM Sans','Helvetica Neue',sans-serif;background:#fff;color:#1a1d23;";

    const checkStar = (c) => (c ? "✓ Yes" : "☐ No");

    pdfContent.innerHTML = `
      <div style="margin-bottom:30px;border-bottom:3px solid #1a4a5c;padding-bottom:20px;">
        <h1 style="font-size:24px;font-weight:700;color:#1a4a5c;margin:0 0 8px 0;">${formData.name}</h1>
        <p style="font-size:13px;color:#6b7280;margin:0;">${formData.description}</p>
      </div>

      <div style="margin-bottom:25px;">
        <div style="background:#eef2f5;padding:10px 16px;border-radius:10px;margin-bottom:20px;">
          <h2 style="font-size:16px;font-weight:700;color:#1a4a5c;margin:0;">Basic Information</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><th style="text-align:left;padding:8px 12px;background:#f8fafc;font-weight:600;color:#1a4a5c;">Equipment Name *</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${formData.equipmentName || "—"}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f8fafc;font-weight:600;color:#1a4a5c;">Equipment ID *</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${formData.equipmentId || "—"}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f8fafc;font-weight:600;color:#1a4a5c;">Location *</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${formData.location || "—"}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f8fafc;font-weight:600;color:#1a4a5c;">Equipment Category *</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${formData.equipmentCategory || "—"}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f8fafc;font-weight:600;color:#1a4a5c;">Inspection Date *</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${formData.inspectionDate}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f8fafc;font-weight:600;color:#1a4a5c;">Inspector Name *</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${formData.inspectorName || "—"}</td></tr>
        </table>
      </div>

      <div style="margin-bottom:25px;">
        <div style="background:#eef2f5;padding:10px 16px;border-radius:10px;margin-bottom:20px;">
          <h2 style="font-size:16px;font-weight:700;color:#1a4a5c;margin:0;">Safety Checks</h2>
        </div>
        <h3 style="font-size:14px;font-weight:600;color:#1a4a5c;margin:0 0 12px 0;">Pre-Inspection Checklist *</h3>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:10px;">
          ${formData.preInspectionChecks
            .map(
              (c, i) => `
            <tr style="${i % 2 === 0 ? "background:#fafafa;" : ""}">
              <td style="padding:8px 12px;border-bottom:${i === formData.preInspectionChecks.length - 1 ? "none" : "1px solid #e5e7eb"};">
                <span style="font-size:14px;">${checkStar(c.checked)}</span>
                <span style="font-size:13px;margin-left:8px;color:#374151;">${c.label}</span>
              </td>
            </tr>`,
            )
            .join("")}
        </table>
        <h3 style="font-size:14px;font-weight:600;color:#1a4a5c;margin:20px 0 12px 0;">Overall Equipment Condition *</h3>
        <div style="padding:12px 16px;background:#fafafa;border-radius:10px;border:1px solid #e5e7eb;">
          <span style="font-size:18px;color:#ffb74d;">${"★".repeat(formData.overallCondition)}${"☆".repeat(5 - formData.overallCondition)}</span>
          <span style="font-size:13px;color:#6b7280;margin-left:10px;">Rating: ${formData.overallCondition}/5</span>
        </div>
      </div>

      <div style="margin-bottom:25px;">
        <div style="background:#eef2f5;padding:10px 16px;border-radius:10px;margin-bottom:20px;">
          <h2 style="font-size:16px;font-weight:700;color:#1a4a5c;margin:0;">Documentation</h2>
        </div>
        <h3 style="font-size:14px;font-weight:600;color:#1a4a5c;margin:0 0 12px 0;">Additional Notes</h3>
        <div style="padding:12px 16px;background:#fafafa;border-radius:10px;border:1px solid #e5e7eb;min-height:80px;">
          <p style="font-size:13px;color:#374151;margin:0;white-space:pre-wrap;">${formData.additionalNotes || "[No notes added]"}</p>
        </div>
        <h3 style="font-size:14px;font-weight:600;color:#1a4a5c;margin:20px 0 12px 0;">Inspector Signature *</h3>
        <div style="padding:12px 16px;background:#fafafa;border-radius:10px;border:1px solid #e5e7eb;min-height:60px;">
          <p style="font-size:13px;color:${signatureData ? "#1a4a5c" : "#9ca3af"};margin:0;">
            ${signatureData ? "✓ Signature captured" : "[Signature not captured yet]"}
          </p>
        </div>
      </div>

      <div style="margin-top:30px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;">
        <p style="font-size:10px;color:#9ca3af;margin:0;">
          Form ID: CUSTOM-${Date.now()} | Generated: ${new Date().toLocaleString()}
        </p>
      </div>`;

    document.body.appendChild(pdfContent);
    try {
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const imgData = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight,
        position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.height;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.height;
      }
      pdf.save(`${formData.name.replace(/\s/g, "_")}_Inspection_Report.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      showSnack("Failed to generate PDF", "error");
    } finally {
      document.body.removeChild(pdfContent);
    }
  };

  useEffect(() => {
    if (error) showSnack(error, "error");
    if (success && !successDialogOpen) showSnack(success, "success");
  }, [error, success, successDialogOpen]);

  const clearForm = () => {
    if (!editMode) return;
    setFormData((p) => ({
      ...p,
      equipmentName: "",
      equipmentId: "",
      location: "",
      equipmentCategory: "",
      inspectorName: "",
      preInspectionChecks: p.preInspectionChecks.map((c) => ({
        ...c,
        checked: false,
      })),
      overallCondition: 3,
      additionalNotes: "",
      photos: [],
    }));
    setSignatureData(null);
    showSnack("Form cleared!");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <Box sx={{ minHeight: "100vh", p: 3 }}>
        {/* Top nav */}
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
                <CircularProgress size={20} color="inherit" />
              ) : editMode ? (
                "Save Checklist"
              ) : (
                "Edit Form"
              )}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2.5,
            alignItems: "flex-start",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Form */}
          <Box sx={{ flex: 1, minWidth: 0, width: { xs: "100%", md: "auto" } }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              {editMode ? (
                <TextField
                  fullWidth
                  value={formData.name}
                  variant="standard"
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
                  variant="standard"
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                  {formData.description}
                </Typography>
              )}
              <Divider sx={{ mb: 3 }} />

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
                    <MenuItem value="">Select location</MenuItem>
                    {LOCATION_OPTIONS.map((o) => (
                      <MenuItem key={o} value={o}>
                        {o}
                      </MenuItem>
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
                    <MenuItem value="">Select category</MenuItem>
                    {CATEGORY_OPTIONS.map((o) => (
                      <MenuItem key={o} value={o}>
                        {o}
                      </MenuItem>
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
                }}
              >
                {formData.preInspectionChecks.map((item, i) => (
                  <FormControlLabel
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 0.5,
                      ml: 0,
                    }}
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
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Rating
                  value={formData.overallCondition}
                  size="large"
                  readOnly={!editMode}
                  onChange={(_, v) => handleInputChange("overallCondition", v)}
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
                    : formData.photos?.length
                      ? `${formData.photos.length} photo(s) uploaded`
                      : "Image upload area"}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#2a7a9b" }}>
                  Supported: JPG, PNG, PDF (Max 10MB)
                </Typography>
              </Box>

              <FieldLabel label="Additional Notes" />
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter any additional observations…"
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                InputProps={{ readOnly: !editMode }}
                sx={{ mb: 3 }}
              />

              <FieldLabel label="Inspector Signature" required />
              <SignaturePad
                readOnly={!editMode}
                onSignatureChange={(_, data) => setSignatureData(data)}
              />

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
                    ? "Edit mode: Make changes to the form"
                    : "View mode: Click Edit Form to make changes"}
                </Typography>
                <Box display="flex" gap={1.2}>
                  <Button
                    variant="outlined"
                    onClick={clearForm}
                    disabled={!editMode}
                  >
                    Clear Form
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#1a4a5c" }}
                    onClick={() => {
                      if (!editMode)
                        showSnack("Please enter edit mode first", "info");
                      else showSnack("Inspection submitted!");
                    }}
                  >
                    Submit Inspection
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Details panel */}
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

              {[
                {
                  icon: (
                    <FolderOutlinedIcon
                      sx={{ fontSize: 17, color: "#6b7280" }}
                    />
                  ),
                  label: "Form Name",
                  value: formData.name,
                },
                {
                  icon: (
                    <PersonOutlineIcon
                      sx={{ fontSize: 17, color: "#6b7280" }}
                    />
                  ),
                  label: "Created By",
                  value: user?.firstName
                    ? `${user.firstName} ${user.lastName || ""}`.trim()
                    : user?.email || "System Admin",
                },
                {
                  icon: (
                    <CalendarTodayOutlinedIcon
                      sx={{ fontSize: 17, color: "#6b7280" }}
                    />
                  ),
                  label: "Created On",
                  value: new Date().toLocaleDateString(),
                },
              ].map(({ icon, label, value }) => (
                <Box
                  key={label}
                  display="flex"
                  alignItems="flex-start"
                  gap={1.5}
                  mb={2.5}
                >
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
                    {icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{ fontSize: 11.5, color: "#9ca3af", mb: 0.2 }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 13.5, fontWeight: 600, color: "#1a1d23" }}
                    >
                      {value}
                    </Typography>
                  </Box>
                </Box>
              ))}

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
                <CheckCircleIcon
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

      <SuccessDialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        message="Custom checklist has been created successfully!"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar((s) => ({ ...s, open: false }));
          clearMessages();
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => {
            setSnackbar((s) => ({ ...s, open: false }));
            clearMessages();
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
