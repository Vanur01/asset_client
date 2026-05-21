// GlobalChecklistBuilder.jsx - Fixed Version
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
  Rating,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddIcon from "@mui/icons-material/Add";
import TitleIcon from "@mui/icons-material/Title";
import SubjectIcon from "@mui/icons-material/Subject";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import GestureIcon from "@mui/icons-material/Gesture";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveIcon from "@mui/icons-material/Save";
import { useChecklistBuilder } from "../context/ChecklistBuilderContext";
import { useAuth } from "../context/AuthContexts";
import { useNavigate } from "react-router-dom";

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a4a5c" },
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
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          "& fieldset": { borderColor: "#e5e7eb" },
          "&:hover fieldset": { borderColor: "#cbd5e1" },
          "&.Mui-focused fieldset": { borderColor: "#1a4a5c" },
        },
      },
    },
  },
});

// ─── Field Types Config ───────────────────────────────────────────────────────
const FIELD_TYPES = [
  {
    type: "text_input",
    label: "Text Input",
    icon: <TitleIcon sx={{ fontSize: 18, color: "#374151" }} />,
  },
  {
    type: "text_area",
    label: "Text Area",
    icon: <SubjectIcon sx={{ fontSize: 18, color: "#374151" }} />,
  },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: <ExpandMoreIcon sx={{ fontSize: 18, color: "#374151" }} />,
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <CheckBoxOutlinedIcon sx={{ fontSize: 18, color: "#374151" }} />,
  },
  {
    type: "rating",
    label: "Rating",
    icon: <StarBorderIcon sx={{ fontSize: 18, color: "#374151" }} />,
  },
  {
    type: "image_upload",
    label: "Image Upload",
    icon: <ImageOutlinedIcon sx={{ fontSize: 18, color: "#374151" }} />,
  },
  {
    type: "signature",
    label: "Signature",
    icon: <GestureIcon sx={{ fontSize: 18, color: "#374151" }} />,
  },
  {
    type: "date_picker",
    label: "Date Picker",
    icon: <ExpandMoreIcon sx={{ fontSize: 18, color: "#374151" }} />,
  },
];

// ─── Preview Component ────────────────────────────────────────────────────────
function PreviewDialog({ open, onClose, checklistName, description, fields }) {
  const [values, setValues] = useState({});
  const [rating, setRating] = useState({});
  const [checked, setChecked] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleValueChange = (fieldId, value) =>
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  const handleRatingChange = (fieldId, value) =>
    setRating((prev) => ({ ...prev, [fieldId]: value }));
  const handleCheckboxChange = (fieldId, checkedValue) =>
    setChecked((prev) => ({ ...prev, [fieldId]: checkedValue }));

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const renderPreviewField = (field) => {
    switch (field.type) {
      case "text_input":
        return (
          <TextField
            fullWidth
            size="small"
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            value={values[field.id] || ""}
            onChange={(e) => handleValueChange(field.id, e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 13 },
            }}
          />
        );
      case "text_area":
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Enter text..."
            value={values[field.id] || ""}
            onChange={(e) => handleValueChange(field.id, e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 13 },
            }}
          />
        );
      case "dropdown":
        return (
          <TextField
            fullWidth
            select
            size="small"
            value={values[field.id] || ""}
            onChange={(e) => handleValueChange(field.id, e.target.value)}
            SelectProps={{ native: true }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 13 },
            }}
          >
            <option value="">Select an option...</option>
            <option value="opt1">Option 1</option>
            <option value="opt2">Option 2</option>
          </TextField>
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={checked[field.id] || false}
                onChange={(e) =>
                  handleCheckboxChange(field.id, e.target.checked)
                }
                size="small"
                sx={{ color: "#1a4a5c", "&.Mui-checked": { color: "#1a4a5c" } }}
              />
            }
            label={
              <Typography sx={{ fontSize: 13, color: "#374151" }}>
                Checkbox option
              </Typography>
            }
            sx={{ ml: 0 }}
          />
        );
      case "rating":
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Rating
              value={rating[field.id] || 0}
              onChange={(_, v) => handleRatingChange(field.id, v)}
              size="medium"
              sx={{ "& .MuiRating-iconFilled": { color: "#1a4a5c" } }}
            />
            <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
              {rating[field.id] ? `${rating[field.id]}/5` : "Rate 1-5"}
            </Typography>
          </Box>
        );
      case "image_upload":
        return (
          <Box
            sx={{
              border: "2px dashed #d1d5db",
              borderRadius: "8px",
              bgcolor: "#fafafa",
              py: 2.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.8,
              cursor: "pointer",
            }}
          >
            <ImageOutlinedIcon sx={{ fontSize: 28, color: "#d1d5db" }} />
            <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
              Drag & drop or click to browse
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "#2a7a9b" }}>
              JPG, PNG, PDF (Max 10MB)
            </Typography>
          </Box>
        );
      case "signature":
        return (
          <Box
            sx={{
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
              bgcolor: "#fff",
            }}
          >
            <Box
              sx={{
                height: 120,
                bgcolor: "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
                Signature pad will appear here
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ px: 2, py: 0.8 }}>
              <Typography
                sx={{ fontSize: 11.5, color: "#2a7a9b", textAlign: "center" }}
              >
                Sign above using mouse or touch
              </Typography>
            </Box>
          </Box>
        );
      case "date_picker":
        return (
          <TextField
            fullWidth
            type="date"
            size="small"
            value={values[field.id] || ""}
            onChange={(e) => handleValueChange(field.id, e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 13 },
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", maxHeight: "90vh" } }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              sx={{ fontSize: 20, fontWeight: 700, color: "#1a1d23" }}
            >
              Preview: {checklistName}
            </Typography>
            {description && (
              <Typography sx={{ fontSize: 13, color: "#6b7280", mt: 0.5 }}>
                {description}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {submitted ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 64, color: "#4caf50", mb: 2 }} />
            <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 1 }}>
              Form Submitted Successfully!
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
              Thank you for completing the checklist.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3, pb: 2, borderBottom: "1px solid #e5e7eb" }}>
              <Chip
                label={`${fields.length} fields`}
                size="small"
                sx={{ bgcolor: "#e8f4f8", color: "#1a4a5c", fontWeight: 500 }}
              />
              <Chip
                label="Preview Mode"
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: "#fff3e0",
                  color: "#ed6c02",
                  fontWeight: 500,
                }}
              />
            </Box>
            {fields.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography sx={{ fontSize: 14, color: "#9ca3af" }}>
                  No fields to preview. Add some fields to see the preview.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={3}>
                {fields.map((field) => (
                  <Box key={field.id}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#374151",
                        mb: 1.5,
                      }}
                    >
                      {field.label}
                    </Typography>
                    {renderPreviewField(field)}
                  </Box>
                ))}
              </Stack>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined" size="medium">
          Close
        </Button>
        {!submitted && fields.length > 0 && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="medium"
            sx={{ bgcolor: "#1a4a5c", "&:hover": { bgcolor: "#0f3d4a" } }}
          >
            Submit Form
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

// ─── Draggable Field Type Item ─────────────────────────────────────────────────
function DraggableFieldType({ fieldType, onDragStart }) {
  return (
    <Box
      draggable
      onDragStart={(e) => onDragStart(e, fieldType)}
      onDragEnd={(e) => e.preventDefault()}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.8,
        py: 1.6,
        px: 1,
        cursor: "grab",
        borderRadius: "8px",
        transition: "all 0.12s",
        "&:hover": {
          bgcolor: "#f1f5f9",
          "& .field-type-label": { color: "#1a4a5c" },
          "& .field-type-icon": { color: "#1a4a5c" },
        },
        "&:active": { cursor: "grabbing" },
        userSelect: "none",
      }}
    >
      <Box
        className="field-type-icon"
        sx={{
          display: "flex",
          alignItems: "center",
          color: "#374151",
          transition: "color 0.12s",
        }}
      >
        {fieldType.icon}
      </Box>
      <Typography
        className="field-type-label"
        sx={{
          fontSize: 13.5,
          color: "#374151",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          transition: "color 0.12s",
        }}
      >
        {fieldType.label}
      </Typography>
    </Box>
  );
}

// ─── Draggable Field Preview ───────────────────────────────────────────────────
function DraggableFieldPreview({
  field,
  index,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onLabelChange,
}) {
  const [value, setValue] = useState("");
  const [rating, setRating] = useState(0);
  const [checked, setChecked] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(field.label);
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const startDraw = (e) => {
    drawing.current = true;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  const draw = (e) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1a4a5c";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };
  const stopDraw = () => {
    drawing.current = false;
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas)
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (field.type === "signature" && canvasRef.current) {
      canvasRef.current.width = 600;
      canvasRef.current.height = 80;
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [field.type]);

  const handleLabelDoubleClick = () => setIsEditingLabel(true);
  const handleLabelChange = (e) => setLabelValue(e.target.value);
  const handleLabelBlur = () => {
    setIsEditingLabel(false);
    if (labelValue.trim() && labelValue !== field.label)
      onLabelChange(field.id, labelValue);
    else setLabelValue(field.label);
  };
  const handleLabelKeyPress = (e) => {
    if (e.key === "Enter") handleLabelBlur();
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case "text_input":
        return (
          <TextField
            fullWidth
            size="small"
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      case "text_area":
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Enter text..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      case "dropdown":
        return (
          <TextField
            fullWidth
            select
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">Select an option...</option>
            <option value="opt1">Option 1</option>
            <option value="opt2">Option 2</option>
          </TextField>
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                size="small"
                sx={{ color: "#1a4a5c" }}
              />
            }
            label="Checkbox option"
          />
        );
      case "rating":
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Rating
              value={rating}
              onChange={(_, v) => setRating(v)}
              size="medium"
            />
            <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
              {rating ? `${rating}/5` : "Rate 1-5"}
            </Typography>
          </Box>
        );
      case "image_upload":
        return (
          <Box
            sx={{
              border: "2px dashed #d1d5db",
              borderRadius: "8px",
              bgcolor: "#fafafa",
              py: 2.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.8,
              cursor: "pointer",
            }}
          >
            <ImageOutlinedIcon sx={{ fontSize: 28, color: "#d1d5db" }} />
            <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
              Drag & drop or click to browse
            </Typography>
          </Box>
        );
      case "signature":
        return (
          <Box
            sx={{
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: "block",
                width: "100%",
                height: 80,
                cursor: "crosshair",
                backgroundColor: "#fff",
              }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
            />
            <Divider />
            <Box
              sx={{
                px: 2,
                py: 0.8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 11.5, color: "#2a7a9b" }}>
                Sign above using mouse or touch
              </Typography>
              <Button
                size="small"
                onClick={clearCanvas}
                sx={{ fontSize: 11, color: "#9ca3af", minWidth: "auto", p: 0 }}
              >
                Clear
              </Button>
            </Box>
          </Box>
        );
      case "date_picker":
        return (
          <TextField
            fullWidth
            type="date"
            size="small"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      sx={{
        border: "1.5px solid #e5e7eb",
        borderRadius: "10px",
        p: "14px 16px",
        mb: 1.5,
        bgcolor: "#fff",
        position: "relative",
        "&:hover .field-actions": { opacity: 1 },
        "&:hover": { borderColor: "#cbd5e1" },
        transition: "border-color 0.15s",
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <DragIndicatorIcon
            sx={{ fontSize: 16, color: "#d1d5db", cursor: "grab" }}
          />
          {isEditingLabel ? (
            <TextField
              autoFocus
              value={labelValue}
              onChange={handleLabelChange}
              onBlur={handleLabelBlur}
              onKeyPress={handleLabelKeyPress}
              size="small"
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: 13,
                  fontWeight: 600,
                  padding: 0,
                },
                "& .MuiInputBase-input": { padding: "4px 8px", width: "auto" },
              }}
            />
          ) : (
            <Typography
              onDoubleClick={handleLabelDoubleClick}
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                fontFamily: "'DM Sans', sans-serif",
                cursor: "text",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              {field.label}
            </Typography>
          )}
        </Box>
        <IconButton
          className="field-actions"
          size="small"
          onClick={() => onDelete(field.id)}
          sx={{
            opacity: 0,
            transition: "opacity 0.15s",
            color: "#9ca3af",
            "&:hover": { color: "#e74c3c" },
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      {renderFieldPreview()}
    </Box>
  );
}

// ─── Main Page with API Integration ────────────────────────────────────────────
export default function GlobalChecklistBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createChecklist, loading, error, success, clearMessages } =
    useChecklistBuilder();

  const [checklistName, setChecklistName] = useState(
    "New Global Inspection Form",
  );
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Safety");
  const [fields, setFields] = useState([]);
  const [counter, setCounter] = useState(1);
  const [draggedFieldIndex, setDraggedFieldIndex] = useState(null);
  const [draggedFieldType, setDraggedFieldType] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const addField = (type) => {
    const typeConfig = FIELD_TYPES.find((f) => f.type === type);
    setFields((prev) => [
      ...prev,
      {
        id: `field_${counter}`,
        type,
        label: typeConfig.label,
        required: false,
        placeholder: `Enter ${typeConfig.label.toLowerCase()}...`,
      },
    ]);
    setCounter((c) => c + 1);
  };

  const deleteField = (id) =>
    setFields((prev) => prev.filter((f) => f.id !== id));
  const updateFieldLabel = (id, newLabel) =>
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, label: newLabel } : field,
      ),
    );

  const handleFieldDragStart = (e, index) => {
    setDraggedFieldIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };
  const handleFieldDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleFieldDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedFieldIndex === null || draggedFieldIndex === dropIndex) return;
    const reorderedFields = [...fields];
    const [removed] = reorderedFields.splice(draggedFieldIndex, 1);
    reorderedFields.splice(dropIndex, 0, removed);
    setFields(reorderedFields);
    setDraggedFieldIndex(null);
  };
  const handleFieldTypeDragStart = (e, fieldType) => {
    setDraggedFieldType(fieldType);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", fieldType.type);
  };
  const handleDropZoneDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const handleDropZoneDrop = (e) => {
    e.preventDefault();
    if (draggedFieldType) {
      addField(draggedFieldType.type);
      setDraggedFieldType(null);
    }
  };
  const handlePreview = () => setPreviewOpen(true);

  const handleSave = async () => {
    if (!checklistName.trim()) {
      setSnackbarMessage("Please enter a checklist name");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    if (fields.length === 0) {
      setSnackbarMessage("Please add at least one field to the checklist");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const sections = [
      {
        sectionTitle: "Checklist Fields",
        sectionDescription: description,
        fields: fields.map((field, index) => ({
          label: field.label,
          fieldType: field.type,
          isRequired: field.required || false,
          placeholder: field.placeholder || "",
          options:
            field.type === "dropdown"
              ? ["Option 1", "Option 2", "Option 3"]
              : [],
          ratingMax: field.type === "rating" ? 5 : null,
          order: index,
        })),
      },
    ];

    const checklistData = {
      name: checklistName.trim(),
      description: description.trim(),
      type: "global",
      category: category,
      status: "active",
      sections: sections,
      tags: [category],
      totalFields: fields.length,
      version: "v1.0",
    };

    const result = await createChecklist(checklistData);
    if (result.success) {
      setSnackbarMessage("Global checklist created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/admin/checklists"), 2000);
    } else {
      setSnackbarMessage(result.error || "Failed to create checklist");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
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
    if (success) {
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
            px: 4,
            py: 1.8,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
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
                Global Checklist Builder
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                Create global checklists for organization-wide use
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1.5}>
            <Button
              startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={handlePreview}
              sx={{ color: "#374151" }}
            >
              Preview
            </Button>
            <Button
              startIcon={<SaveIcon sx={{ fontSize: 16 }} />}
              onClick={handleSave}
              disabled={loading}
              variant="contained"
              sx={{ bgcolor: "#1a4a5c" }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save as Global"
              )}
            </Button>
          </Box>
        </Box>

        {/* Sub nav tab */}
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Chip
            label="Global Checklist Builder"
            variant="outlined"
            sx={{
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: 500,
              color: "#1a2e44",
              borderColor: "#c5cdd6",
              backgroundColor: "#fff",
              height: 30,
            }}
          />
        </Box>

        {/* Body */}
        <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start" }}>
          <Box
            onDragOver={handleDropZoneDragOver}
            onDrop={handleDropZoneDrop}
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Basic Info */}
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                p: "24px 28px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#374151",
                  mb: 0.7,
                }}
              >
                Checklist Name
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                value={checklistName}
                onChange={(e) => setChecklistName(e.target.value)}
                placeholder="Enter checklist name"
                sx={{ mb: 2.5 }}
              />
              <Divider sx={{ mb: 2.5 }} />
              <Typography
                sx={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#374151",
                  mb: 0.7,
                }}
              >
                Description
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Enter form description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Divider sx={{ my: 2.5 }} />
              <Typography
                sx={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#374151",
                  mb: 0.7,
                }}
              >
                Category
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g., Safety, Quality, Compliance"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Paper>

            {/* Fields Area */}
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                p: "24px 28px",
                minHeight: 280,
                ...(draggedFieldType && {
                  borderColor: "#1a4a5c",
                  borderStyle: "dashed",
                  bgcolor: "#f8fafc",
                }),
              }}
            >
              <Typography
                sx={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "#1a1d23",
                  mb: 2.5,
                }}
              >
                Checklist Fields
              </Typography>
              {fields.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                    gap: 0.8,
                  }}
                >
                  <Typography sx={{ fontSize: 14, color: "#9ca3af" }}>
                    No fields added yet
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#c4c9d4" }}>
                    Drag and drop field types here or click to add
                  </Typography>
                </Box>
              ) : (
                <Box onDragOver={handleFieldDragOver}>
                  {fields.map((field, index) => (
                    <DraggableFieldPreview
                      key={field.id}
                      field={field}
                      index={index}
                      onDelete={deleteField}
                      onLabelChange={updateFieldLabel}
                      onDragStart={handleFieldDragStart}
                      onDragOver={handleFieldDragOver}
                      onDrop={handleFieldDrop}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          </Box>

          {/* Right: Field Types Panel */}
          <Box sx={{ width: 280, flexShrink: 0 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                p: "22px 20px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1a1d23",
                  mb: 2.5,
                }}
              >
                Field Types
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#9ca3af",
                  mb: 2,
                  fontStyle: "italic",
                }}
              >
                Drag any field to the left panel
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {FIELD_TYPES.map((ft, i) => (
                  <React.Fragment key={ft.type}>
                    <DraggableFieldType
                      fieldType={ft}
                      onDragStart={handleFieldTypeDragStart}
                    />
                    {i < FIELD_TYPES.length - 1 && (
                      <Divider sx={{ borderColor: "#f1f3f5" }} />
                    )}
                  </React.Fragment>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#9ca3af",
                  mb: 1.5,
                  textAlign: "center",
                }}
              >
                Or click to add:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {FIELD_TYPES.map((ft) => (
                  <Button
                    key={ft.type}
                    size="small"
                    variant="outlined"
                    onClick={() => addField(ft.type)}
                    sx={{
                      fontSize: 11,
                      textTransform: "none",
                      borderRadius: "6px",
                    }}
                  >
                    {ft.label}
                  </Button>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Preview Dialog */}
      <PreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        checklistName={checklistName}
        description={description}
        fields={fields}
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
