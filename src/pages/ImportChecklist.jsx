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
      setSnackbarMessage("File selected successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Please upload a valid Excel file (.xlsx or .xls)");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setSelectedFile(file);
      setSnackbarMessage("File selected successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (file) {
      setSnackbarMessage("Please upload a valid Excel file (.xlsx or .xls)");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Import Excel file to backend
  // In ImportChecklistFields.jsx, remove the validation for file selection
  const handleImport = async () => {
    // Removed the validation check for selectedFile
    setImporting(true);
    const result = await importFromExcel(selectedFile);
    setImporting(false);

    if (result.success) {
      setImportResponse(result.data);
      setImportSuccess(true);
      setSnackbarMessage("Checklist imported successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage(result.error || "Failed to import checklist");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handlePreview = () => {
    if (!selectedFile) {
      setSnackbarMessage("Please select a file first");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
    if (importResponse?._id || importResponse?.id) {
      navigate(
        `/admin/checklists/view/${importResponse._id || importResponse.id}`,
      );
    } else {
      navigate("/admin/checklists");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    clearMessages();
  };

  // Display imported sections data
  const renderImportedSections = () => {
    if (!importResponse?.sections) return null;

    return (
      <Box sx={{ mt: 2 }}>
        {importResponse.sections.map((section, idx) => (
          <Box key={idx} sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#1a4a5c", mb: 1 }}
            >
              {section.sectionTitle}
            </Typography>
            {section.sectionDescription && (
              <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 1 }}>
                {section.sectionDescription}
              </Typography>
            )}
            <Box sx={{ ml: 2 }}>
              {section.fields.map((field, fIdx) => (
                <Box
                  key={fIdx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Rule sx={{ fontSize: 14, color: "#9ca3af" }} />
                  <Typography sx={{ fontSize: 13 }}>
                    {field.label}
                    {field.isRequired && (
                      <span style={{ color: "#e74c3c" }}>*</span>
                    )}
                    <span
                      style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}
                    >
                      ({field.fieldType?.replace("_", " ") || field.fieldType})
                    </span>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
          <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
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
        fontFamily: "'DM Sans', sans-serif",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Top Nav */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
          px: { xs: 1, sm: 2, md: 3 },
          pt: { xs: 2, sm: 2.5 },
          pb: { xs: 1, sm: 1 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
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
            <ArrowBack fontSize="small" />
          </IconButton>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1a2e44",
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                lineHeight: 1.2,
              }}
            >
              Import Checklist Fields
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#8a95a3", fontSize: "0.75rem" }}
            >
              Upload an Excel sheet to auto-generate input fields.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "flex-end", sm: "flex-start" },
          }}
        >
          <Button
            startIcon={<Visibility sx={{ fontSize: "1rem" }} />}
            onClick={handlePreview}
            disabled={!selectedFile}
            sx={{
              textTransform: "none",
              color: "#1a2e44",
              fontWeight: 500,
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
              "&:hover": { backgroundColor: "rgba(26,46,68,0.06)" },
            }}
          >
            Preview File
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUpload sx={{ fontSize: "1rem" }} />}
            onClick={handleImport}
            disabled={!selectedFile || importing}
            sx={{
              textTransform: "none",
              backgroundColor: "#1a3a4a",
              color: "#fff",
              fontWeight: 600,
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
              borderRadius: "8px",
              px: { xs: 2, sm: 2.5 },
              py: { xs: 0.8, sm: 1 },
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#122b38",
                boxShadow: "none",
              },
            }}
          >
            {importing ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Import Checklist"
            )}
          </Button>
        </Box>
      </Box>

      {/* Checklist Builder chip */}
      <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, pt: 1, pb: 2 }}>
        <Chip
          label="Excel Import"
          variant="outlined"
          sx={{
            borderRadius: "6px",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#1a2e44",
            borderColor: "#c5cdd6",
            backgroundColor: "#fff",
            height: 30,
          }}
        />
      </Box>

      {/* Centered drop zone card */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 1, sm: 2, md: 3 },
          pt: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 980,
            backgroundColor: "#fff",
            borderRadius: "14px",
            p: { xs: 2, sm: 3, md: 4 },
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          {importSuccess ? (
            // Success state - show import result
            <Box>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <CheckCircle sx={{ fontSize: 64, color: "#4caf50", mb: 2 }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#1a3a4a", mb: 1 }}
                >
                  Import Successful!
                </Typography>
                <Typography sx={{ color: "#6b7280" }}>
                  Your checklist has been imported successfully.
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a3a4a", mb: 2 }}
              >
                Imported Checklist Details
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>
                  Name:{" "}
                  <span style={{ fontWeight: 400 }}>
                    {importResponse?.name}
                  </span>
                </Typography>
                <Typography sx={{ fontWeight: 600, mt: 1 }}>
                  Description:{" "}
                  <span style={{ fontWeight: 400 }}>
                    {importResponse?.description}
                  </span>
                </Typography>
                <Typography sx={{ fontWeight: 600, mt: 1 }}>
                  Category:{" "}
                  <span style={{ fontWeight: 400 }}>
                    {importResponse?.category}
                  </span>
                </Typography>
                <Typography sx={{ fontWeight: 600, mt: 1 }}>
                  Type:{" "}
                  <span style={{ fontWeight: 400 }}>
                    {importResponse?.type}
                  </span>
                </Typography>
              </Box>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#1a4a5c", mt: 2, mb: 1 }}
              >
                Sections & Fields
              </Typography>
              {renderImportedSections()}

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mt: 4,
                }}
              >
                <Button variant="outlined" onClick={handleReset}>
                  Import Another
                </Button>
                <Button
                  variant="contained"
                  onClick={handleViewChecklist}
                  sx={{ bgcolor: "#1a4a5c" }}
                >
                  View Checklist
                </Button>
              </Box>
            </Box>
          ) : (
            // Drop zone
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed ${isDragging ? "#1a3a4a" : "#a8c4d4"}`,
                borderRadius: "10px",
                backgroundColor: isDragging
                  ? "rgba(26,58,74,0.04)"
                  : "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: { xs: 6, sm: 7, md: 8 },
                px: { xs: 2, sm: 3, md: 4 },
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

              <Box
                sx={{
                  width: { xs: 48, sm: 52 },
                  height: { xs: 48, sm: 52 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <UploadFile
                  sx={{
                    fontSize: { xs: 40, sm: 46 },
                    color: "#1a3a4a",
                  }}
                />
              </Box>

              {selectedFile ? (
                <>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#1a3a4a",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      mb: 0.5,
                      textAlign: "center",
                      wordBreak: "break-all",
                    }}
                  >
                    {selectedFile.name}
                  </Typography>
                  <Typography sx={{ color: "#8a95a3", fontSize: "0.8rem" }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </Typography>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#1a3a4a",
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                      mb: 0.5,
                      textAlign: "center",
                    }}
                  >
                    Drop your Excel file here or click to browse
                  </Typography>
                  <Typography
                    sx={{
                      color: "#8a95a3",
                      fontSize: "0.8rem",
                      mb: 2.5,
                      textAlign: "center",
                    }}
                  >
                    Supported formats: .xlsx / .xls
                  </Typography>
                </>
              )}

              <Button
                variant="contained"
                startIcon={<InsertDriveFile sx={{ fontSize: "1rem" }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                sx={{
                  mt: selectedFile ? 2 : 0,
                  textTransform: "none",
                  backgroundColor: "#1a3a4a",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", sm: "0.88rem" },
                  borderRadius: "8px",
                  px: { xs: 2, sm: 3 },
                  py: { xs: 0.8, sm: 1.1 },
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

          {/* Excel template info - only show when no file selected and not imported */}
          {!selectedFile && !importSuccess && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.75rem", color: "#8a95a3" }}>
                <TableChart
                  sx={{ fontSize: "0.9rem", verticalAlign: "middle", mr: 0.5 }}
                />
                Required columns: Field Name, Field Type, Required, Options (for
                dropdown)
              </Typography>
              <Button
                size="small"
                sx={{ mt: 1, fontSize: "0.7rem" }}
                onClick={() =>
                  window.open("/sample-checklist-template.xlsx", "_blank")
                }
              >
                Download Sample Template
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Preview Dialog - shows file info before import */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "16px" },
            maxHeight: { xs: "100%", sm: "90vh" },
          },
        }}
      >
        <DialogTitle sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 1, sm: 2 } }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 18, sm: 20 },
                  fontWeight: 700,
                  color: "#1a1d23",
                }}
              >
                File Preview
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#6b7280", mt: 0.5 }}>
                {selectedFile?.name}
              </Typography>
            </Box>
            <IconButton onClick={() => setPreviewOpen(false)} size="small">
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Description sx={{ fontSize: 48, color: "#1a4a5c", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {selectedFile?.name}
            </Typography>
            <Typography sx={{ color: "#6b7280", mb: 2 }}>
              Size: {(selectedFile?.size / 1024).toFixed(1)} KB
            </Typography>
            <Typography sx={{ color: "#6b7280", fontSize: 14 }}>
              The Excel file will be parsed and converted into a checklist with:
            </Typography>
            <Box
              sx={{
                mt: 2,
                textAlign: "left",
                bgcolor: "#f8fafc",
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography sx={{ fontSize: 13 }}>✓ Multiple sections</Typography>
              <Typography sx={{ fontSize: 13 }}>
                ✓ Various field types (text, dropdown, rating, etc.)
              </Typography>
              <Typography sx={{ fontSize: 13 }}>
                ✓ Required field validation
              </Typography>
              <Typography sx={{ fontSize: 13 }}>✓ Dropdown options</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 1, sm: 2 } }}>
          <Button
            onClick={() => setPreviewOpen(false)}
            variant="outlined"
            size="medium"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setPreviewOpen(false);
              handleImport();
            }}
            variant="contained"
            size="medium"
            sx={{ bgcolor: "#1a4a5c" }}
          >
            Import Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
    </Box>
  );
}
