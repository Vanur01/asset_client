// GlobalChecklistBuilder.jsx
import React, { useState, useEffect } from "react";
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
  Select,
  FormControl,
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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useChecklistBuilder } from "../context/ChecklistBuilderContext";
import { useNavigate } from "react-router-dom";

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
          fontSize: 14,
          "& fieldset": { borderColor: "#e5e7eb" },
          "&:hover fieldset": { borderColor: "#cbd5e1" },
          "&.Mui-focused fieldset": { borderColor: "#1a4a5c" },
        },
      },
    },
  },
});

// IMPORTANT: type values here are the EXACT strings used in FIELD_TYPE_MAP
// and sent as fieldType to the API. They must match the backend Mongoose enum.
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
    icon: <CalendarTodayIcon sx={{ fontSize: 18, color: "#374151" }} />,
  },
];

// Build field-specific extra properties the backend requires
function buildFieldExtras(type) {
  switch (type) {
    case "dropdown":
      return { options: ["Option 1", "Option 2", "Option 3"] };
    case "rating":
      return { ratingMax: 5, ratingIcon: "star" };
    case "checkbox":
      return { checkboxItems: ["Item 1"], checkboxLabel: "Checkbox option" };
    case "date_picker":
      return { dateFormat: "YYYY-MM-DD" };
    case "image_upload":
      return { acceptedFormats: ["jpg", "png", "pdf"], maxSize: 10 };
    case "signature":
      return { signatureType: "draw" };
    default:
      return {};
  }
}

// Option Editor Dialog
function OptionEditorDialog({ open, onClose, options, onSave }) {
  const [tempOptions, setTempOptions] = useState(
    options?.length ? options : ["Option 1", "Option 2"],
  );

  const handleSave = () => {
    onSave(tempOptions.filter((o) => o.trim()));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Dropdown Options</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {tempOptions.map((option, i) => (
            <Box key={i} display="flex" alignItems="center" gap={1}>
              <TextField
                fullWidth
                size="small"
                value={option}
                onChange={(e) => {
                  const n = [...tempOptions];
                  n[i] = e.target.value;
                  setTempOptions(n);
                }}
                placeholder={`Option ${i + 1}`}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() =>
                  setTempOptions(tempOptions.filter((_, j) => j !== i))
                }
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            size="small"
            onClick={() =>
              setTempOptions([
                ...tempOptions,
                `Option ${tempOptions.length + 1}`,
              ])
            }
          >
            Add Option
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Options
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Preview Dialog
function PreviewDialog({
  open,
  onClose,
  checklistName,
  description,
  category,
  tags,
  fields,
}) {
  const [values, setValues] = useState({});
  const [ratings, setRatings] = useState({});
  const [checked, setChecked] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const renderField = (field) => {
    switch (field.type) {
      case "text_input":
        return (
          <TextField
            fullWidth
            size="small"
            placeholder={`Enter ${field.label.toLowerCase()}…`}
            value={values[field.id] || ""}
            onChange={(e) =>
              setValues((p) => ({ ...p, [field.id]: e.target.value }))
            }
          />
        );
      case "text_area":
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Enter text…"
            value={values[field.id] || ""}
            onChange={(e) =>
              setValues((p) => ({ ...p, [field.id]: e.target.value }))
            }
          />
        );
      case "dropdown":
        return (
          <FormControl fullWidth size="small">
            <Select
              value={values[field.id] || ""}
              displayEmpty
              onChange={(e) =>
                setValues((p) => ({ ...p, [field.id]: e.target.value }))
              }
            >
              <MenuItem value="" disabled>
                Select an option…
              </MenuItem>
              {(field.options || ["Option 1", "Option 2"]).map((o, i) => (
                <MenuItem key={i} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={checked[field.id] || false}
                onChange={(e) =>
                  setChecked((p) => ({ ...p, [field.id]: e.target.checked }))
                }
                sx={{ color: "#1a4a5c", "&.Mui-checked": { color: "#1a4a5c" } }}
              />
            }
            label={field.checkboxLabel || "Checkbox option"}
          />
        );
      case "rating":
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Rating
              value={ratings[field.id] || 0}
              onChange={(_, v) => setRatings((p) => ({ ...p, [field.id]: v }))}
              sx={{ "& .MuiRating-iconFilled": { color: "#1a4a5c" } }}
            />
            <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
              {ratings[field.id] ? `${ratings[field.id]}/5` : "Rate 1–5"}
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
        );
      case "date_picker":
        return (
          <TextField
            fullWidth
            type="date"
            size="small"
            value={values[field.id] || ""}
            onChange={(e) =>
              setValues((p) => ({ ...p, [field.id]: e.target.value }))
            }
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
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
              Preview: {checklistName}
            </Typography>
            {description && (
              <Typography sx={{ fontSize: 13, color: "#6b7280", mt: 0.5 }}>
                {description}
              </Typography>
            )}
            <Box display="flex" gap={1} mt={1}>
              <Chip
                label={category}
                size="small"
                sx={{ bgcolor: "#e8f4f8", color: "#1a4a5c" }}
              />
              {tags?.slice(0, 3).map((tag, i) => (
                <Chip key={i} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
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
              py: 8,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 64, color: "#4caf50", mb: 2 }} />
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
              Form Submitted Successfully!
            </Typography>
          </Box>
        ) : fields.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ fontSize: 14, color: "#9ca3af" }}>
              No fields to preview.
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
                {renderField(field)}
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {!submitted && fields.length > 0 && (
          <Button
            onClick={() => {
              setSubmitted(true);
              setTimeout(() => {
                setSubmitted(false);
                onClose();
              }, 2000);
            }}
            variant="contained"
            sx={{ bgcolor: "#1a4a5c" }}
          >
            Submit Form
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

// Draggable sidebar field type
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
        "&:hover": { bgcolor: "#f1f5f9" },
        "&:active": { cursor: "grabbing" },
        userSelect: "none",
      }}
    >
      {fieldType.icon}
      <Typography sx={{ fontSize: 13.5, color: "#374151", fontWeight: 500 }}>
        {fieldType.label}
      </Typography>
    </Box>
  );
}

// Field card in the builder canvas
function FieldCard({
  field,
  index,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onLabelChange,
  onOptionsChange,
}) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(field.label);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const commitLabel = () => {
    setEditingLabel(false);
    if (labelValue.trim() && labelValue !== field.label)
      onLabelChange(field.id, labelValue);
    else setLabelValue(field.label);
  };

  const renderPreview = () => {
    switch (field.type) {
      case "dropdown":
        return (
          <Box>
            <FormControl fullWidth size="small">
              <Select value="" displayEmpty disabled>
                <MenuItem value="" disabled>
                  Select an option…
                </MenuItem>
                {(field.options || ["Option 1", "Option 2"]).map((o, i) => (
                  <MenuItem key={i} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              size="small"
              onClick={() => setOptionsOpen(true)}
              sx={{ mt: 0.5, fontSize: 11 }}
            >
              Edit Options ({field.options?.length || 0})
            </Button>
          </Box>
        );
      case "text_input":
        return (
          <TextField
            fullWidth
            size="small"
            disabled
            placeholder={`Enter ${field.label.toLowerCase()}…`}
          />
        );
      case "text_area":
        return (
          <TextField
            fullWidth
            multiline
            rows={2}
            size="small"
            disabled
            placeholder="Enter text…"
          />
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={<Checkbox disabled />}
            label={field.checkboxLabel || "Checkbox option"}
          />
        );
      case "rating":
        return <Rating value={0} disabled />;
      case "image_upload":
        return (
          <Box
            sx={{
              border: "2px dashed #d1d5db",
              borderRadius: "8px",
              bgcolor: "#fafafa",
              py: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ImageOutlinedIcon sx={{ fontSize: 28, color: "#d1d5db" }} />
            <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
              Image Upload
            </Typography>
          </Box>
        );
      case "signature":
        return (
          <Box
            sx={{
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              height: 60,
              bgcolor: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>
              Signature field
            </Typography>
          </Box>
        );
      case "date_picker":
        return <TextField fullWidth type="date" size="small" disabled />;
      default:
        return null;
    }
  };

  return (
    <>
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
          "&:hover": { borderColor: "#cbd5e1" },
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
            <DragIndicatorIcon sx={{ fontSize: 16, color: "#d1d5db" }} />
            {editingLabel ? (
              <TextField
                autoFocus
                value={labelValue}
                size="small"
                onChange={(e) => setLabelValue(e.target.value)}
                onBlur={commitLabel}
                onKeyPress={(e) => {
                  if (e.key === "Enter") commitLabel();
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "4px 8px",
                  },
                }}
              />
            ) : (
              <Typography
                onDoubleClick={() => setEditingLabel(true)}
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  cursor: "text",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                {field.label}
              </Typography>
            )}
            <Chip
              label={field.type}
              size="small"
              sx={{
                fontSize: 10,
                height: 18,
                bgcolor: "#f1f5f9",
                color: "#6b7280",
              }}
            />
          </Box>
          <IconButton
            size="small"
            onClick={() => onDelete(field.id)}
            sx={{ color: "#9ca3af", "&:hover": { color: "#e74c3c" } }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
        {renderPreview()}
      </Box>
      {field.type === "dropdown" && (
        <OptionEditorDialog
          open={optionsOpen}
          onClose={() => setOptionsOpen(false)}
          options={field.options}
          onSave={(opts) => onOptionsChange(field.id, opts)}
        />
      )}
    </>
  );
}

// Main component
export default function GlobalChecklistBuilder() {
  const navigate = useNavigate();
  const { createChecklist, loading, error, clearMessages } =
    useChecklistBuilder();

  const [checklistName, setChecklistName] = useState(
    "Global Safety Inspection",
  );
  const [description, setDescription] = useState(
    "Standard safety checklist available to all users",
  );
  const [category, setCategory] = useState("Safety");
  const [subcategory, setSubcategory] = useState("General");
  const [tags, setTags] = useState(["safety", "inspection", "global"]);
  const [tagInput, setTagInput] = useState("");
  const [fields, setFields] = useState([]);
  const [counter, setCounter] = useState(1);
  const [draggedFieldIndex, setDraggedFieldIndex] = useState(null);
  const [draggedFieldType, setDraggedFieldType] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const addField = (type) => {
    const config = FIELD_TYPES.find((f) => f.type === type);
    const newField = {
      id: `field_${counter}`,
      type: type, // stored as-is; must be a valid FIELD_TYPE_MAP key
      label: config.label,
      required: false,
      placeholder: `Enter ${config.label.toLowerCase()}…`,
      order: fields.length,
      ...buildFieldExtras(type),
    };
    setFields((prev) => [...prev, newField]);
    setCounter((c) => c + 1);
  };

  const deleteField = (id) => setFields((p) => p.filter((f) => f.id !== id));
  const updateFieldLabel = (id, newLabel) =>
    setFields((p) =>
      p.map((f) => (f.id === id ? { ...f, label: newLabel } : f)),
    );
  const updateFieldOptions = (id, options) =>
    setFields((p) => p.map((f) => (f.id === id ? { ...f, options } : f)));

  const handleAddTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  // Drag – reorder fields
  const handleFieldDragStart = (e, index) => {
    setDraggedFieldIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleFieldDragOver = (e) => e.preventDefault();
  const handleFieldDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedFieldIndex === null || draggedFieldIndex === dropIndex) return;
    const reordered = [...fields];
    const [removed] = reordered.splice(draggedFieldIndex, 1);
    reordered.splice(dropIndex, 0, removed);
    setFields(reordered.map((f, i) => ({ ...f, order: i })));
    setDraggedFieldIndex(null);
  };

  // Drag – add new field from sidebar
  const handleFieldTypeDragStart = (e, fieldType) => {
    setDraggedFieldType(fieldType);
    e.dataTransfer.effectAllowed = "copy";
  };
  const handleDropZoneDrop = (e) => {
    e.preventDefault();
    if (draggedFieldType) {
      addField(draggedFieldType.type);
      setDraggedFieldType(null);
    }
  };

  const handleSave = async () => {
    if (!checklistName.trim()) {
      showSnack("Please enter a checklist name", "error");
      return;
    }
    if (fields.length === 0) {
      showSnack("Please add at least one field", "error");
      return;
    }

    // Build the API payload – field types are already the correct enum strings
    const sectionFields = fields.map((field, index) => {
      // Base field object with all required properties
      const baseField = {
        label: field.label,
        fieldType: field.type, // direct, no mapping needed – types are already API enum values
        isRequired: field.required || false,
        placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}…`,
        order: index,
        columnWidth: 12,
      };

      // Add type-specific properties
      switch (field.type) {
        case "dropdown":
          return {
            ...baseField,
            options: field.options || ["Option 1", "Option 2", "Option 3"],
          };
        case "rating":
          return {
            ...baseField,
            ratingMax: field.ratingMax || 5,
            ratingIcon: field.ratingIcon || "star",
          };
        case "checkbox":
          return {
            ...baseField,
            checkboxItems: field.checkboxItems || ["Item 1"],
            checkboxLabel: field.checkboxLabel || "Checkbox option",
          };
        case "date_picker":
          return {
            ...baseField,
            dateFormat: field.dateFormat || "YYYY-MM-DD",
          };
        case "image_upload":
          return {
            ...baseField,
            acceptedFormats: field.acceptedFormats || ["jpg", "png", "pdf"],
            maxSize: field.maxSize || 10,
          };
        case "signature":
          return {
            ...baseField,
            signatureType: field.signatureType || "draw",
          };
        default:
          return baseField;
      }
    });

    const checklistData = {
      name: checklistName.trim(),
      description: description.trim(),
      category,
      subcategory,
      type: "global",
      tags,
      status: "active",
      settings: {
        showProgressBar: true,
        showSectionNumbers: true,
        allowSaveDraft: true,
        autoSave: false,
        confirmationMessage: "Thank you for completing the checklist!",
        emailNotifications: false,
      },
      sections: [
        {
          sectionTitle: "Checklist Fields",
          sectionDescription: description.trim(),
          order: 0,
          fields: sectionFields,
        },
      ],
    };

    console.log("=== SAVING GLOBAL CHECKLIST ===");
    console.log("Fields count:", fields.length);
    console.log("Section fields count:", sectionFields.length);
    console.log("Full Payload:", JSON.stringify(checklistData, null, 2));

    const result = await createChecklist(checklistData);

    if (result.success) {
      console.log("Created ID:", result.data?._id || result.data?.data?._id);
      console.log("Response:", result);
      showSnack("Global checklist created successfully!");
      setTimeout(() => navigate("/admin/checklists"), 2000);
    } else {
      console.error("Failed:", result.error);
      showSnack(result.error || "Failed to create checklist", "error");
    }
  };

  useEffect(() => {
    if (error) showSnack(error, "error");
  }, [error]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", p: 3 }}>
        {/* Top bar */}
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
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                Global Checklist Builder
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                Create global checklists for organization-wide use
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1.5}>
            <Button
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => setPreviewOpen(true)}
            >
              Preview
            </Button>
            <Button
              startIcon={loading ? null : <SaveIcon />}
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

        <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start" }}>
          {/* Canvas */}
          <Box
            flex={1}
            minWidth={0}
            display="flex"
            flexDirection="column"
            gap={2}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropZoneDrop}
          >
            {/* Metadata */}
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                p: "24px 28px",
              }}
            >
              <Typography sx={{ fontSize: 12.5, fontWeight: 600, mb: 0.7 }}>
                Checklist Name *
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                value={checklistName}
                onChange={(e) => setChecklistName(e.target.value)}
                sx={{ mb: 2.5 }}
              />
              <Divider sx={{ mb: 2.5 }} />

              <Typography sx={{ fontSize: 12.5, fontWeight: 600, mb: 0.7 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Enter form description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2.5 }}
              />
              <Divider sx={{ mb: 2.5 }} />

              <Typography sx={{ fontSize: 12.5, fontWeight: 600, mb: 0.7 }}>
                Category *
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g., Safety, Quality, Compliance"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ mb: 2.5 }}
              />

              <Typography sx={{ fontSize: 12.5, fontWeight: 600, mb: 0.7 }}>
                Subcategory
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g., General, Daily, Weekly"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                sx={{ mb: 2.5 }}
              />

              <Typography sx={{ fontSize: 12.5, fontWeight: 600, mb: 0.7 }}>
                Tags
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() => setTags(tags.filter((t) => t !== tag))}
                    sx={{ bgcolor: "#e8f4f8", color: "#1a4a5c" }}
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Add tag (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
            </Paper>

            {/* Fields canvas */}
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                p: "24px 28px",
                minHeight: 280,
                ...(draggedFieldType
                  ? {
                      borderColor: "#1a4a5c",
                      borderStyle: "dashed",
                      bgcolor: "#f8fafc",
                    }
                  : {}),
              }}
            >
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, mb: 2.5 }}>
                Checklist Fields ({fields.length})
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
                    Drag field types from the right panel or click to add
                  </Typography>
                </Box>
              ) : (
                <Box onDragOver={handleFieldDragOver}>
                  {fields.map((field, index) => (
                    <FieldCard
                      key={field.id}
                      field={field}
                      index={index}
                      onDelete={deleteField}
                      onLabelChange={updateFieldLabel}
                      onOptionsChange={updateFieldOptions}
                      onDragStart={handleFieldDragStart}
                      onDragOver={handleFieldDragOver}
                      onDrop={handleFieldDrop}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: 280, flexShrink: 0 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                p: "22px 20px",
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2.5 }}>
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
                Drag to the canvas, or click to add
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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {FIELD_TYPES.map((ft) => (
                  <Button
                    key={ft.type}
                    size="small"
                    variant="outlined"
                    onClick={() => addField(ft.type)}
                    sx={{ fontSize: 11 }}
                  >
                    {ft.label}
                  </Button>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      <PreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        checklistName={checklistName}
        description={description}
        category={category}
        tags={tags}
        fields={fields}
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