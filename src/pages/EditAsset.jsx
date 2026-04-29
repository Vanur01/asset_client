// EditAsset.jsx
import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Stack, Button, TextField,
  Select, MenuItem, FormControl, Grid, Divider, IconButton,
  Snackbar, Alert, CircularProgress, Chip, InputAdornment,
  Switch, FormControlLabel, Slider, RadioGroup, Radio,
  Autocomplete, Checkbox
} from "@mui/material";
import { ArrowBack, Save, Cancel, Delete, Add } from "@mui/icons-material";
import { useAsset } from "../context/AssetContext";
import { useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1a5c6b" },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
  },
});

export default function EditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAssetById, updateAsset, loading } = useAsset();
  const [formData, setFormData] = useState({});
  const [originalAsset, setOriginalAsset] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAsset();
  }, [id]);

  const fetchAsset = async () => {
    try {
      const response = await getAssetById(id);
      if (response.success) {
        const asset = response.data || response.asset;
        setOriginalAsset(asset);
        setFormData(asset);
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to fetch asset details", severity: "error" });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const updateData = {
        assetName: formData.assetName,
        description: formData.description,
        serialNumber: formData.serialNumber,
        assetCategory: formData.assetCategory,
        currentLocation: formData.currentLocation,
        status: formData.status,
        assetCondition: formData.assetCondition,
        purchaseCost: formData.purchaseCost,
        commissioningDate: formData.commissioningDate,
        customPhysicalAddress: formData.customPhysicalAddress
      };
      
      const response = await updateAsset(id, updateData);
      if (response.success) {
        setSnackbar({ open: true, message: "Asset updated successfully", severity: "success" });
        setTimeout(() => navigate(`/admin/assets/view/${id}`), 1500);
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Failed to update asset", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData.assetName) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
        {/* Header */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={() => navigate(`/admin/assets/view/${id}`)} sx={{ bgcolor: "#f0f2f5" }}>
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography fontWeight={700} fontSize={18} color="#1a1a2e">
                  Edit Asset: {originalAsset?.assetName}
                </Typography>
                <Typography fontSize={12} color="#888">
                  Asset ID: {originalAsset?.assetId}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<Cancel />} onClick={() => navigate(`/admin/assets/view/${id}`)}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={saving}>
                {saving ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography fontWeight={700} fontSize={16} mb={3}>Asset Information</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography fontSize={12} fontWeight={600} mb={1}>Asset Name *</Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.assetName || ""}
                onChange={(e) => handleChange("assetName", e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography fontSize={12} fontWeight={600} mb={1}>Asset Category</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.assetCategory || ""}
                  onChange={(e) => handleChange("assetCategory", e.target.value)}
                >
                  <MenuItem value="Equipment">Equipment</MenuItem>
                  <MenuItem value="IT Assets">IT Assets</MenuItem>
                  <MenuItem value="Vehicles">Vehicles</MenuItem>
                  <MenuItem value="Machinery">Machinery</MenuItem>
                  <MenuItem value="Plumbing">Plumbing</MenuItem>
                  <MenuItem value="Electrical">Electrical</MenuItem>
                  <MenuItem value="HVAC">HVAC</MenuItem>
                  <MenuItem value="Safety">Safety</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography fontSize={12} fontWeight={600} mb={1}>Description</Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography fontSize={12} fontWeight={600} mb={1}>Serial Number</Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.serialNumber || ""}
                onChange={(e) => handleChange("serialNumber", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography fontSize={12} fontWeight={600} mb={1}>Status</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.status || "Active"}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="In Maintenance">In Maintenance</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                  <MenuItem value="In Transit">In Transit</MenuItem>
                  <MenuItem value="Reserved">Reserved</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography fontSize={12} fontWeight={600} mb={1}>Condition</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.assetCondition || "Good"}
                  onChange={(e) => handleChange("assetCondition", e.target.value)}
                >
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography fontSize={12} fontWeight={600} mb={1}>Purchase Cost ($)</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={formData.purchaseCost || ""}
                onChange={(e) => handleChange("purchaseCost", e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography fontSize={12} fontWeight={600} mb={1}>Current Location</Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.currentLocation || ""}
                onChange={(e) => handleChange("currentLocation", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography fontWeight={600} fontSize={14} mb={2}>Physical Address</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Street Address"
                    value={formData.customPhysicalAddress?.streetAddress || ""}
                    onChange={(e) => handleNestedChange("customPhysicalAddress", "streetAddress", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="City"
                    value={formData.customPhysicalAddress?.city || ""}
                    onChange={(e) => handleNestedChange("customPhysicalAddress", "city", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="State/Province"
                    value={formData.customPhysicalAddress?.stateProvince || ""}
                    onChange={(e) => handleNestedChange("customPhysicalAddress", "stateProvince", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Postal Code"
                    value={formData.customPhysicalAddress?.postalCode || ""}
                    onChange={(e) => handleNestedChange("customPhysicalAddress", "postalCode", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Country"
                    value={formData.customPhysicalAddress?.country || ""}
                    onChange={(e) => handleNestedChange("customPhysicalAddress", "country", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}