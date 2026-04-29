// pages/CreateAssetRequest.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArrowBack,
  Send,
  Save,
  HelpOutline,
  BusinessCenter,
  LocationOn,
  Category,
  PriorityHigh,
  Description,
  AttachMoney,
  CalendarToday,
  Numbers,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAssetRequest } from "../context/AssetRequestContext";
import { useAuth } from "../context/AuthContexts";

// Design Tokens
const C = {
  navy: "#0f4c61",
  ink: "#1a2e3b",
  muted: "#64748b",
  ghost: "#94a3b8",
  border: "#e8edf2",
  white: "#ffffff",
  bg: "#f3f5f8",
  surface: "#f8fafc",
  green: "#16a34a",
  red: "#ef4444",
  amber: "#f59e0b",
};

const PageWrap = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: C.bg,
  padding: theme.spacing(3, 4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const FormCard = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  background: C.white,
  border: `1px solid ${C.border}`,
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  overflow: "hidden",
  marginBottom: theme.spacing(3),
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)({
  fontSize: "1rem",
  fontWeight: 700,
  color: C.navy,
  marginBottom: 16,
  display: "flex",
  alignItems: "center",
  gap: 8,
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    backgroundColor: C.surface,
    "& fieldset": { borderColor: C.border },
    "&:hover fieldset": { borderColor: C.navy },
    "&.Mui-focused fieldset": { borderColor: C.navy, borderWidth: 2 },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.82rem",
    color: C.muted,
    "&.Mui-focused": { color: C.navy },
  },
  "& .MuiOutlinedInput-input": { fontSize: "0.85rem" },
});

const StyledSelect = styled(Select)({
  borderRadius: 10,
  backgroundColor: C.surface,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: C.border },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: C.navy },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: C.navy },
  "& .MuiSelect-select": { fontSize: "0.85rem", py: 1.5 },
});

const ActionButton = styled(Button)({
  borderRadius: 10,
  textTransform: "none",
  fontSize: "0.85rem",
  fontWeight: 600,
  padding: "10px 24px",
});

const CreateAssetRequest = () => {
  const navigate = useNavigate();
  const { createRequest, loading } = useAssetRequest();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    requestType: "parent",
    assetName: "",
    category: "",
    location: "",
    priority: "medium",
    description: "",
    quantity: 1,
    estimatedBudget: "",
    requiredByDate: "",
    parentAssetId: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
  });
  
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Electronics", "Machinery", "Vehicles", "Furniture", 
    "Software", "Tools", "Safety Equipment", "Office Equipment", 
    "IT Equipment", "Medical Equipment", "Other"
  ];

  const locations = [
    "Warehouse A", "Warehouse B", "Building A - Floor 1", "Building A - Floor 2",
    "Building B", "IT Department", "Maintenance Shop", "Office", "Remote Site"
  ];

  const steps = ["Basic Information", "Asset Details", "Review & Submit"];

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      if (!formData.requestType) newErrors.requestType = "Request type is required";
      if (!formData.assetName.trim()) newErrors.assetName = "Asset name is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.location) newErrors.location = "Location is required";
      if (formData.requestType === "child" && !formData.parentAssetId) {
        newErrors.parentAssetId = "Parent asset ID is required for child assets";
      }
    }
    
    if (activeStep === 1) {
      if (formData.quantity < 1) newErrors.quantity = "Quantity must be at least 1";
      if (formData.estimatedBudget && isNaN(formData.estimatedBudget)) {
        newErrors.estimatedBudget = "Budget must be a number";
      }
      if (formData.requiredByDate && new Date(formData.requiredByDate) < new Date()) {
        newErrors.requiredByDate = "Required date cannot be in the past";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setSubmitting(true);
    try {
      const submitData = {
        requestType: formData.requestType,
        assetName: formData.assetName,
        category: formData.category,
        location: formData.location,
        priority: formData.priority,
        description: formData.description,
        quantity: parseInt(formData.quantity),
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : undefined,
        requiredByDate: formData.requiredByDate || undefined,
        ...(formData.requestType === "child" && { parentAssetId: formData.parentAssetId }),
        serialNumber: formData.serialNumber || undefined,
        manufacturer: formData.manufacturer || undefined,
        model: formData.model || undefined,
      };
      
      const response = await createRequest(submitData);
      
      setSnackbar({
        open: true,
        message: "Asset request created successfully!",
        severity: "success",
      });
      
      setTimeout(() => {
        // Redirect based on user role
        if (user?.role === "admin" || user?.role === "super_admin") {
          navigate("/admin/asset-requests");
        } else {
          navigate("/team/asset-requests");
        }
      }, 1500);
    } catch (error) {
      console.error("Error creating request:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create asset request",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Request Type</InputLabel>
                <StyledSelect
                  value={formData.requestType}
                  onChange={handleChange("requestType")}
                  label="Request Type"
                  error={!!errors.requestType}
                >
                  <MenuItem value="parent">Parent Asset (New Asset)</MenuItem>
                  <MenuItem value="child">Child Asset (Sub-Asset/Accessory)</MenuItem>
                </StyledSelect>
                {errors.requestType && <FormHelperText error>{errors.requestType}</FormHelperText>}
              </FormControl>
            </Grid>

            {formData.requestType === "child" && (
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Parent Asset ID"
                  placeholder="Enter the parent asset ID"
                  value={formData.parentAssetId}
                  onChange={handleChange("parentAssetId")}
                  error={!!errors.parentAssetId}
                  helperText={errors.parentAssetId}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessCenter sx={{ color: C.ghost }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Asset Name"
                placeholder="e.g., Laptop Dell XPS 15, Forklift Model A"
                value={formData.assetName}
                onChange={handleChange("assetName")}
                error={!!errors.assetName}
                helperText={errors.assetName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessCenter sx={{ color: C.ghost }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <StyledSelect
                  value={formData.category}
                  onChange={handleChange("category")}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </StyledSelect>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.location}>
                <InputLabel>Location</InputLabel>
                <StyledSelect
                  value={formData.location}
                  onChange={handleChange("location")}
                  label="Location"
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                  ))}
                </StyledSelect>
                {errors.location && <FormHelperText>{errors.location}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type="number"
                label="Quantity"
                value={formData.quantity}
                onChange={handleChange("quantity")}
                error={!!errors.quantity}
                helperText={errors.quantity}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Numbers sx={{ color: C.ghost }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type="number"
                label="Estimated Budget (USD)"
                placeholder="Enter estimated budget"
                value={formData.estimatedBudget}
                onChange={handleChange("estimatedBudget")}
                error={!!errors.estimatedBudget}
                helperText={errors.estimatedBudget}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney sx={{ color: C.ghost }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type="date"
                label="Required By Date"
                value={formData.requiredByDate}
                onChange={handleChange("requiredByDate")}
                error={!!errors.requiredByDate}
                helperText={errors.requiredByDate}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: C.ghost }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <StyledSelect
                  value={formData.priority}
                  onChange={handleChange("priority")}
                  label="Priority"
                >
                  <MenuItem value="low">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PriorityHigh sx={{ color: C.green, fontSize: 16 }} />
                      Low
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PriorityHigh sx={{ color: C.amber, fontSize: 16 }} />
                      Medium
                    </Box>
                  </MenuItem>
                  <MenuItem value="high">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PriorityHigh sx={{ color: C.red, fontSize: 16 }} />
                      High
                    </Box>
                  </MenuItem>
                </StyledSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Provide detailed description of the asset and reason for request..."
                value={formData.description}
                onChange={handleChange("description")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description sx={{ color: C.ghost }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Optional Details" size="small" />
              </Divider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <StyledTextField
                fullWidth
                label="Serial Number"
                placeholder="Enter serial number"
                value={formData.serialNumber}
                onChange={handleChange("serialNumber")}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <StyledTextField
                fullWidth
                label="Manufacturer"
                placeholder="Enter manufacturer name"
                value={formData.manufacturer}
                onChange={handleChange("manufacturer")}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <StyledTextField
                fullWidth
                label="Model Number"
                placeholder="Enter model number"
                value={formData.model}
                onChange={handleChange("model")}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Please review your request details before submitting.
            </Alert>

            <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={700} color={C.navy} gutterBottom>
                  Request Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color={C.muted}>Request Type</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formData.requestType === "parent" ? "Parent Asset" : "Child Asset"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color={C.muted}>Priority</Typography>
                    <Chip 
                      label={formData.priority} 
                      size="small"
                      sx={{ 
                        bgcolor: formData.priority === "high" ? "#fee2e2" : formData.priority === "medium" ? "#fef3c7" : "#dcfce7",
                        color: formData.priority === "high" ? C.red : formData.priority === "medium" ? C.amber : C.green,
                        fontWeight: 600,
                        fontSize: "0.7rem"
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color={C.muted}>Asset Name</Typography>
                    <Typography variant="body2" fontWeight={500}>{formData.assetName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color={C.muted}>Category</Typography>
                    <Typography variant="body2">{formData.category}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color={C.muted}>Location</Typography>
                    <Typography variant="body2">{formData.location}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color={C.muted}>Quantity</Typography>
                    <Typography variant="body2">{formData.quantity}</Typography>
                  </Grid>
                  {formData.estimatedBudget && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color={C.muted}>Estimated Budget</Typography>
                      <Typography variant="body2">${parseFloat(formData.estimatedBudget).toLocaleString()}</Typography>
                    </Grid>
                  )}
                  {formData.requiredByDate && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color={C.muted}>Required By</Typography>
                      <Typography variant="body2">{new Date(formData.requiredByDate).toLocaleDateString()}</Typography>
                    </Grid>
                  )}
                  {formData.description && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color={C.muted}>Description</Typography>
                      <Typography variant="body2" color={C.muted}>{formData.description}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <PageWrap>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ bgcolor: C.white, border: `1px solid ${C.border}` }}
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={800} color={C.ink}>
            Create Asset Request
          </Typography>
          <Typography variant="body2" color={C.muted}>
            Submit a request for new asset addition
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <FormCard>
            <Box sx={{ px: 3, pt: 3 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Divider />
            <FormSection>
              {getStepContent(activeStep)}
              
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <ActionButton
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting || loading}
                    sx={{ bgcolor: C.green, "&:hover": { bgcolor: C.green } }}
                  >
                    {submitting || loading ? (
                      <CircularProgress size={24} sx={{ color: C.white }} />
                    ) : (
                      <>
                        <Send sx={{ mr: 1 }} /> Submit Request
                      </>
                    )}
                  </ActionButton>
                ) : (
                  <ActionButton
                    variant="contained"
                    onClick={handleNext}
                    sx={{ bgcolor: C.navy }}
                  >
                    Next
                  </ActionButton>
                )}
              </Box>
            </FormSection>
          </FormCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: `1px solid ${C.border}`, position: "sticky", top: 20 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <HelpOutline sx={{ color: C.navy }} />
                <Typography fontWeight={700} color={C.navy}>Tips for Request</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="caption" color={C.muted} display="block" gutterBottom>
                <CheckCircle sx={{ fontSize: 12, mr: 0.5, verticalAlign: "middle" }} />
                Provide accurate asset details for faster approval
              </Typography>
              <Typography variant="caption" color={C.muted} display="block" gutterBottom sx={{ mt: 1 }}>
                <CheckCircle sx={{ fontSize: 12, mr: 0.5, verticalAlign: "middle" }} />
                High priority requests are reviewed within 24 hours
              </Typography>
              <Typography variant="caption" color={C.muted} display="block" gutterBottom sx={{ mt: 1 }}>
                <CheckCircle sx={{ fontSize: 12, mr: 0.5, verticalAlign: "middle" }} />
                Include estimated budget for better planning
              </Typography>
              <Typography variant="caption" color={C.muted} display="block" gutterBottom sx={{ mt: 1 }}>
                <CheckCircle sx={{ fontSize: 12, mr: 0.5, verticalAlign: "middle" }} />
                Child assets require a valid parent asset ID
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <Typography variant="caption" display="block">
                  Requests can only be edited while in "Pending" status.
                  Once approved or rejected, they become final.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageWrap>
  );
};

export default CreateAssetRequest;