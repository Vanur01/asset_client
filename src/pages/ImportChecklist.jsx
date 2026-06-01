import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Rating,
  Alert,
  Snackbar,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  Visibility,
  UploadFile,
  InsertDriveFile,
  Close,
  CheckCircle,
  TableChart,
  CloudUpload,
  Description,
  Rule,
} from "@mui/icons-material";
import { useChecklistBuilder } from "../context/ChecklistBuilderContext";
import { useNavigate } from "react-router-dom";

export default function ImportChecklistFields() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { importFromExcel, loading, error, success, clearMessages } =
    useChecklistBuilder();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [importResponse, setImportResponse] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setSelectedFile(file);
      showSnackbar("File selected successfully!", "success");
    } else {
      showSnackbar("Please upload a valid Excel file (.xlsx or .xls)", "error");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setSelectedFile(file);
      showSnackbar("File selected successfully!", "success");
    } else if (file) {
      showSnackbar("Please upload a valid Excel file (.xlsx or .xls)", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showSnackbar("Please select a file first", "error");
      return;
    }

    setImporting(true);
    const result = await importFromExcel(selectedFile);
    setImporting(false);

    if (result.success) {
      setImportResponse(result.data);
      setImportSuccess(true);
      showSnackbar("Checklist imported successfully!", "success");
    } else {
      showSnackbar(result.error || "Failed to import checklist", "error");
    }
  };

  const handlePreview = () => {
    if (!selectedFile) {
      showSnackbar("Please select a file first", "error");
      return;
    }
    setPreviewOpen(true);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImportResponse(null);
    setImportSuccess(false);
    setPreviewOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewChecklist = () => {
    const checklistId = importResponse?._id || importResponse?.id;
    if (checklistId) {
      navigate(`/admin/checklists`);
    } else {
      navigate("/admin/checklists");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    clearMessages();
  };

  const renderImportedSections = () => {
    if (!importResponse?.sections) return null;

    return (
      <Box sx={{ mt: 2 }}>
        {importResponse.sections.map((section, idx) => (
          <Box key={idx} sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: "#1a4a5c",
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                mb: 0.5,
              }}
            >
              {section.sectionTitle}
            </Typography>
            {section.sectionDescription && (
              <Typography
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                  color: "#6b7280",
                  mb: 0.75,
                }}
              >
                {section.sectionDescription}
              </Typography>
            )}
            <Box sx={{ ml: 1.5 }}>
              {section.fields.map((field, fIdx) => (
                <Box
                  key={fIdx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    mb: 0.5,
                  }}
                >
                  <Rule sx={{ fontSize: 12, color: "#9ca3af" }} />
                  <Typography
                    sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                  >
                    {field.label}
                    {field.isRequired && (
                      <span style={{ color: "#e74c3c" }}>*</span>
                    )}
                    <span
                      style={{
                        fontSize: { xs: "0.6rem", sm: "0.65rem" },
                        color: "#9ca3af",
                        marginLeft: 6,
                      }}
                    >
                      ({field.fieldType?.replace("_", " ") || field.fieldType})
                    </span>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            bgcolor: "#f8fafc",
            borderRadius: 1.5,
          }}
        >
          <Typography
            sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem" }, color: "#6b7280" }}
          >
            Total Fields: {importResponse.totalFields} | Version:{" "}
            {importResponse.version} | Status: {importResponse.status}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 0 },
          px: { xs: 1, sm: 2, md: 3 },
          pt: { xs: 1.5, sm: 2 },
          pb: { xs: 1, sm: 1 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <IconButton
            size="small"
            onClick={() => navigate("/admin/checklists")}
            sx={{
              color: "#1a2e44",
              "&:hover": { backgroundColor: "rgba(26,46,68,0.08)" },
            }}
          >
            <ArrowBack sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }} />
          </IconButton>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#1a2e44",
                fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.2rem" },
                lineHeight: 1.3,
              }}
            >
              Import Checklist Fields
            </Typography>
            <Typography
              sx={{
                color: "#8a95a3",
                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
              }}
            >
              Upload an Excel sheet to auto-generate input fields
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "flex-end", sm: "flex-start" },
          }}
        >
          <Button
            startIcon={<Visibility sx={{ fontSize: "0.9rem" }} />}
            onClick={handlePreview}
            disabled={!selectedFile}
            sx={{
              textTransform: "none",
              color: "#1a2e44",
              fontWeight: 500,
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              "&:hover": { backgroundColor: "rgba(26,46,68,0.06)" },
            }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUpload sx={{ fontSize: "0.9rem" }} />}
            onClick={handleImport}
            disabled={!selectedFile || importing}
            sx={{
              textTransform: "none",
              backgroundColor: "#1a3a4a",
              fontWeight: 600,
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              borderRadius: "6px",
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.6, sm: 0.8 },
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#122b38",
                boxShadow: "none",
              },
            }}
          >
            {importing ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Import"
            )}
          </Button>
        </Box>
      </Box>

      {/* Excel Import Chip */}
      <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, pt: 0.5, pb: 1.5 }}>
        <Chip
          label="Excel Import"
          variant="outlined"
          sx={{
            borderRadius: "4px",
            fontSize: { xs: "0.6rem", sm: "0.65rem" },
            fontWeight: 500,
            color: "#1a2e44",
            borderColor: "#c5cdd6",
            height: 24,
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          px: { xs: 1, sm: 2, md: 3 },
          pt: { xs: 1, sm: 2 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 900,
            borderRadius: "12px",
            p: { xs: 1.5, sm: 2.5, md: 3 },
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          {importSuccess ? (
            // Success State
            <Box>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <CheckCircle
                  sx={{
                    fontSize: { xs: 48, sm: 56 },
                    color: "#4caf50",
                    mb: 1.5,
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#1a3a4a",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    mb: 0.5,
                  }}
                >
                  Import Successful!
                </Typography>
                <Typography
                  sx={{
                    color: "#6b7280",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                >
                  Your checklist has been imported successfully
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#1a3a4a",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  mb: 1.5,
                }}
              >
                Checklist Details
              </Typography>

              <Box sx={{ mb: 1.5 }}>
                <Typography
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mb: 0.5 }}
                >
                  <strong>Name:</strong> {importResponse?.name}
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mb: 0.5 }}
                >
                  <strong>Description:</strong> {importResponse?.description}
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mb: 0.5 }}
                >
                  <strong>Category:</strong> {importResponse?.category}
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mb: 0.5 }}
                >
                  <strong>Type:</strong> {importResponse?.type}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#1a4a5c",
                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  mt: 1.5,
                  mb: 1,
                }}
              >
                Sections & Fields
              </Typography>
              {renderImportedSections()}

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  size="small"
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                >
                  Import Another
                </Button>
                <Button
                  variant="contained"
                  onClick={handleViewChecklist}
                  size="small"
                  sx={{
                    bgcolor: "#1a4a5c",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                >
                  View Checklist
                </Button>
              </Box>
            </Box>
          ) : (
            // Drop Zone
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed ${isDragging ? "#1a3a4a" : "#a8c4d4"}`,
                borderRadius: "8px",
                backgroundColor: isDragging
                  ? "rgba(26,58,74,0.04)"
                  : "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: { xs: 4, sm: 5, md: 6 },
                px: { xs: 2, sm: 3 },
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#1a3a4a",
                  backgroundColor: "rgba(26,58,74,0.03)",
                },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              <UploadFile
                sx={{
                  fontSize: { xs: 36, sm: 42 },
                  color: "#1a3a4a",
                  mb: 1.5,
                }}
              />

              {selectedFile ? (
                <>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1a3a4a",
                      fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      mb: 0.25,
                      textAlign: "center",
                      wordBreak: "break-all",
                    }}
                  >
                    {selectedFile.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#8a95a3",
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                    }}
                  >
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </Typography>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    sx={{ mt: 1, fontSize: { xs: "0.65rem", sm: "0.7rem" } }}
                  >
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1a3a4a",
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      mb: 0.5,
                      textAlign: "center",
                    }}
                  >
                    Drop your Excel file here or click to browse
                  </Typography>
                  <Typography
                    sx={{
                      color: "#8a95a3",
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      mb: 2,
                      textAlign: "center",
                    }}
                  >
                    Supported: .xlsx / .xls
                  </Typography>
                </>
              )}

              <Button
                variant="contained"
                startIcon={<InsertDriveFile sx={{ fontSize: "0.85rem" }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                sx={{
                  mt: selectedFile ? 1.5 : 0,
                  textTransform: "none",
                  backgroundColor: "#1a3a4a",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  borderRadius: "6px",
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 0.6, sm: 0.7 },
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#122b38",
                    boxShadow: "none",
                  },
                }}
              >
                {selectedFile ? "Change File" : "Select File"}
              </Button>
            </Box>
          )}

          {/* Template Info - Removed download button */}
          {!selectedFile && !importSuccess && (
            <Box sx={{ mt: 2.5, textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                  color: "#8a95a3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <TableChart sx={{ fontSize: "0.8rem" }} />
                Required columns: Field Name, Field Type, Required, Options (for
                dropdown)
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "12px" },
            maxHeight: { xs: "100%", sm: "85vh" },
          },
        }}
      >
        <DialogTitle sx={{ p: { xs: 1.5, sm: 2 }, pb: { xs: 1, sm: 1.5 } }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  fontWeight: 700,
                  color: "#1a1d23",
                }}
              >
                File Preview
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                  color: "#6b7280",
                  mt: 0.25,
                }}
              >
                {selectedFile?.name}
              </Typography>
            </Box>
            <IconButton onClick={() => setPreviewOpen(false)} size="small">
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ textAlign: "center", py: { xs: 2, sm: 3 } }}>
            <Description
              sx={{ fontSize: { xs: 36, sm: 42 }, color: "#1a4a5c", mb: 1.5 }}
            />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                mb: 0.5,
              }}
            >
              {selectedFile?.name}
            </Typography>
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                mb: 1.5,
              }}
            >
              Size: {(selectedFile?.size / 1024).toFixed(1)} KB
            </Typography>
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              The Excel file will be parsed into a checklist with:
            </Typography>
            <Box
              sx={{
                mt: 1.5,
                textAlign: "left",
                bgcolor: "#f8fafc",
                p: 1.5,
                borderRadius: 1.5,
              }}
            >
              <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                ✓ Multiple sections
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mt: 0.5 }}
              >
                ✓ Various field types (text, dropdown, rating, etc.)
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mt: 0.5 }}
              >
                ✓ Required field validation
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mt: 0.5 }}
              >
                ✓ Dropdown options
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, pt: { xs: 1, sm: 1.5 } }}>
          <Button
            onClick={() => setPreviewOpen(false)}
            variant="outlined"
            size="small"
            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setPreviewOpen(false);
              handleImport();
            }}
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#1a4a5c",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            }}
          >
            Import Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%", fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
