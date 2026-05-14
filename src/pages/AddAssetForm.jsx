// AddNewAsset.jsx (Optimized with Role-Based Access)
import { useState, useRef, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  Button,
  Chip,
  Paper,
  InputAdornment,
  IconButton,
  Grid,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
  LinearProgress,
  AlertTitle,
} from "@mui/material";
import {
  ArrowBack,
  Search,
  CalendarToday,
  Inventory2Outlined,
  DirectionsCarOutlined,
  SettingsOutlined,
  DeleteOutlineOutlined,
  ComputerOutlined,
  ApartmentOutlined,
  AddPhotoAlternate,
  Close,
  LockOutlined,
  CloudUpload,
  Image,
  DeleteSweep,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAsset } from "../context/AssetContext";
import { useAuth } from "../context/AuthContexts";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: { main: "#1a5c6b" },
    background: { default: "#f0f2f5", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8, backgroundColor: "#f8f9fa", fontSize: 13 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: "none", fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
  },
});

const SectionCard = ({
  icon,
  title,
  color = "#1a5c6b",
  children,
  disabled,
}) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #e8eaed",
      borderRadius: 3,
      p: 3,
      mb: 2,
      opacity: disabled ? 0.6 : 1,
      position: "relative",
    }}
  >
    {disabled && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(255,255,255,0.7)",
          borderRadius: 3,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Chip
          icon={<LockOutlined />}
          label="Read Only - Admin Access Required"
          size="small"
          sx={{ bgcolor: "#fff", boxShadow: 1 }}
        />
      </Box>
    )}
    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
      <Box sx={{ color }}>{icon}</Box>
      <Typography fontWeight={600} color={color} fontSize={14}>
        {title}
      </Typography>
    </Stack>
    {children}
  </Paper>
);

const FilterLabel = ({ children, required }) => (
  <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={1}>
    {children} {required && <span style={{ color: "#d32f2f" }}>*</span>}
  </Typography>
);

const CBRow = ({ labels, values = {}, onChange, name, disabled }) => (
  <Grid container spacing={1} mb={1}>
    {labels.map(
      (label) =>
        label && (
          <Grid item xs={4} key={`${name}-${label}`}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={values[label] || false}
                  onChange={(e) =>
                    onChange && onChange(name, label, e.target.checked)
                  }
                  disabled={disabled}
                />
              }
              label={<Typography fontSize={13}>{label}</Typography>}
            />
          </Grid>
        ),
    )}
  </Grid>
);

export default function AddNewAsset() {
  const { user } = useAuth();
  const { createAsset, canWriteAssets } = useAsset();
  const navigate = useNavigate();

  // Check if user has write permission (Admin only)
  const isAdmin = user?.role === "admin";
  const isTeam = user?.role === "team";
  const canEdit = isAdmin || isTeam; // Only Admin can create/edit assets

  const [assetCategory, setAssetCategory] = useState("Equipment");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form state
  const [formData, setFormData] = useState({
    assetName: "",
    description: "",
    serialNumber: "",
    currentLocation: "",
    customPhysicalAddress: {
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
    },
    status: "Active",
    assetCondition: "Normal",
    purchaseCost: "",
    commissioningDate: "",
    healthScore: 100,
    metadata: {
      tags: [],
      notes: "",
    },
  });

  // Filter checkbox states
  const [mheFilters, setMheFilters] = useState({});
  const [vehicleFilters, setVehicleFilters] = useState({});
  const [faultTypeFilters, setFaultTypeFilters] = useState({});
  const [containerFilters, setContainerFilters] = useState({});
  const [osFilters, setOsFilters] = useState({});
  const [pmFilters, setPmFilters] = useState({});

  // Category-specific state
  const [mheData, setMheData] = useState({
    utilizationStatus: "",
    engineRuntimeHours: "",
    safetyCertification: "",
  });

  const [transportationData, setTransportationData] = useState({
    vehicleType: "",
    driver: "",
    loadStatus: 50,
  });

  const [rotatingMachineryData, setRotatingMachineryData] = useState({
    healthStatusIndex: null,
    vibrationAlert: false,
    temperatureAlert: false,
  });

  const [garbageManagementData, setGarbageManagementData] = useState({
    containerTypeSize: "",
    smartStatusIoTFillLevel: 50,
    collectionStatus: "",
  });

  const [itAssetsData, setItAssetsData] = useState({
    osPlatform: [],
    softwareName: "",
    licenseStatus: "",
  });

  const [facilityManagementData, setFacilityManagementData] = useState({
    pmStatus: "",
    maintenancePriority: "Medium",
  });

  const [inspectionSystems, setInspectionSystems] = useState({
    amcInspection: { enabled: false, schedule: "Monthly" },
    camcInspection: { enabled: false, schedule: "Monthly" },
  });

  const handleInputChange = (field, value) => {
    if (!canEdit) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    if (!canEdit) return;
    setFormData((prev) => ({
      ...prev,
      customPhysicalAddress: { ...prev.customPhysicalAddress, [field]: value },
    }));
  };

  const handleTagsChange = (e) => {
    if (!canEdit) return;
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, tags },
    }));
  };

  const handleCheckboxChange = (section, label, checked) => {
    if (!canEdit) return;
    const setters = {
      mhe: setMheFilters,
      vehicle: setVehicleFilters,
      faultType: setFaultTypeFilters,
      container: setContainerFilters,
      os: setOsFilters,
      pm: setPmFilters,
    };
    if (setters[section]) {
      setters[section]((prev) => ({ ...prev, [label]: checked }));
    }
  };

  const handleSubmit = async () => {
    if (!canEdit) {
      setSnackbar({
        open: true,
        message: "You don't have permission to create assets",
        severity: "error",
      });
      return;
    }

    if (!formData.assetName) {
      setSnackbar({
        open: true,
        message: "Asset name is required",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare submission data
      const submissionData = {
        assetName: formData.assetName,
        description: formData.description,
        serialNumber: formData.serialNumber,
        currentLocation: formData.currentLocation,
        customPhysicalAddress: formData.customPhysicalAddress,
        status: formData.status,
        assetCondition: formData.assetCondition,
        assetCategory,
        purchaseCost: formData.purchaseCost
          ? parseFloat(formData.purchaseCost)
          : undefined,
        commissioningDate: formData.commissioningDate,
        healthScore: formData.healthScore,
        metadata: formData.metadata,

        mhe: {
          utilizationStatus:
            Object.keys(mheFilters).find((key) => mheFilters[key]) ||
            mheData.utilizationStatus,
          engineRuntimeHours: mheData.engineRuntimeHours
            ? parseFloat(mheData.engineRuntimeHours)
            : undefined,
          safetyCertification: mheData.safetyCertification,
        },

        transportation: {
          vehicleType:
            Object.keys(vehicleFilters).find((key) => vehicleFilters[key]) ||
            transportationData.vehicleType,
          driver: transportationData.driver,
          loadStatus: transportationData.loadStatus,
        },

        rotatingMachinery: {
          healthStatusIndex: rotatingMachineryData.healthStatusIndex,
          vibrationAlert: rotatingMachineryData.vibrationAlert,
          temperatureAlert: rotatingMachineryData.temperatureAlert,
          faultType: Object.keys(faultTypeFilters).filter(
            (key) => faultTypeFilters[key],
          ),
        },

        garbageManagement: {
          containerTypeSize:
            Object.keys(containerFilters).find(
              (key) => containerFilters[key],
            ) || garbageManagementData.containerTypeSize,
          smartStatusIoTFillLevel:
            garbageManagementData.smartStatusIoTFillLevel,
          collectionStatus: garbageManagementData.collectionStatus,
        },

        itAssets: {
          osPlatform: Object.keys(osFilters).filter((key) => osFilters[key]),
          softwareName: itAssetsData.softwareName,
          licenseStatus: itAssetsData.licenseStatus,
        },

        facilityManagement: {
          pmStatus:
            Object.keys(pmFilters).find((key) => pmFilters[key]) ||
            facilityManagementData.pmStatus,
          maintenancePriority: facilityManagementData.maintenancePriority,
        },

        inspectionSystems,
      };

      const response = await createAsset(submissionData);

      if (response.success) {
        setSnackbar({
          open: true,
          message: "Asset created successfully!",
          severity: "success",
        });
        setTimeout(() => navigate("/admin/assets"), 2000);
      } else {
        throw new Error(response.error || "Failed to create asset");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create asset",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show access denied for Super Admin
  if (user?.role === "super_admin") {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ maxWidth: 500, mx: "auto" }}>
          <AlertTitle>Access Denied</AlertTitle>
          Super Admin does not have access to Asset Management. Please contact
          your administrator.
        </Alert>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/admin")}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Box sx={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        {/* Top Bar */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #e8eaed",
            px: { xs: 2, sm: 3 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            width: "1130px",
            marginLeft: "28px",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            borderRadius: "10px",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton
              size="small"
              onClick={() => navigate("/admin/assets")}
              sx={{ bgcolor: "#f0f2f5", borderRadius: 2 }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            <Box>
              <Typography fontWeight={700} fontSize={15} color="#1a1a2e">
                Add New Asset
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {isAdmin
                  ? "Asset details, classification, and category filters"
                  : isTeam
                    ? "View mode - Contact admin to create assets"
                    : "Asset management"}
              </Typography>
            </Box>
          </Stack>
          {isTeam && (
            <Chip
              icon={<LockOutlined />}
              label="Read Only Mode"
              size="small"
              sx={{ bgcolor: "#fff3e0", color: "#ed6c02" }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 2.5,
            p: 3,
            maxWidth: 1400,
            mx: "auto",
          }}
        >
          {/* LEFT PANEL */}
          <Box sx={{ width: { xs: "100%", lg: 320 }, flexShrink: 0 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e8eaed",
                borderRadius: 3,
                p: 3,
                mb: 2.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
                <Search fontSize="small" sx={{ color: "#1a5c6b" }} />
                <Typography fontWeight={700} fontSize={14} color="#1a1a2e">
                  Core Identification
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ width: "270px" }}>
                  <FilterLabel required>Asset Name</FilterLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter asset name"
                    value={formData.assetName}
                    onChange={(e) =>
                      handleInputChange("assetName", e.target.value)
                    }
                    disabled={!canEdit}
                    required
                  />
                </Grid>
                <Grid item xs={12} sx={{ width: "270px" }}>
                  <FilterLabel>Description</FilterLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={!canEdit}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sx={{ width: "270px" }}>
                  <FilterLabel>Serial Number</FilterLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter serial number"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      handleInputChange("serialNumber", e.target.value)
                    }
                    disabled={!canEdit}
                  />
                </Grid>
                <Grid item xs={12} sx={{ width: "270px" }}>
                  <FilterLabel required>Asset Category</FilterLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      value={assetCategory}
                      onChange={(e) => setAssetCategory(e.target.value)}
                      disabled={!canEdit}
                    >
                      <MenuItem value="Equipment">Equipment</MenuItem>
                      <MenuItem value="Vehicle">Vehicle</MenuItem>
                      <MenuItem value="Tool">Tool</MenuItem>
                      <MenuItem value="Machinery">Machinery</MenuItem>
                      <MenuItem value="IT">IT</MenuItem>
                      <MenuItem value="Furniture">Furniture</MenuItem>
                      <MenuItem value="Electrical">Electrical</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, bgcolor: "#eef4f7", borderRadius: 2, p: 1.5 }}>
                <Typography fontSize={12} color="#1a5c6b">
                  Category selected: {assetCategory}
                </Typography>
              </Box>
            </Paper>

            {/* Primary Filters */}
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e8eaed",
                borderRadius: 3,
                p: 3,
                mb: 2.5,
              }}
            >
              <Typography fontWeight={700} fontSize={13} mb={2} color="#1a1a2e">
                Primary Information
              </Typography>

              <FilterLabel>Current Location</FilterLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter current location"
                value={formData.currentLocation}
                onChange={(e) =>
                  handleInputChange("currentLocation", e.target.value)
                }
                disabled={!canEdit}
                sx={{ mb: 2 }}
              />

              <FilterLabel>Status</FilterLabel>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  disabled={!canEdit}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="In Maintenance">In Maintenance</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                  <MenuItem value="In Transit">In Transit</MenuItem>
                  <MenuItem value="Reserved">Reserved</MenuItem>
                </Select>
              </FormControl>

              <FilterLabel>Asset Condition</FilterLabel>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <Select
                  value={formData.assetCondition}
                  onChange={(e) =>
                    handleInputChange("assetCondition", e.target.value)
                  }
                  disabled={!canEdit}
                >
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                </Select>
              </FormControl>

              <FilterLabel>Health Score (0-100)</FilterLabel>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={formData.healthScore}
                onChange={(e) =>
                  handleInputChange(
                    "healthScore",
                    parseInt(e.target.value) || 0,
                  )
                }
                disabled={!canEdit}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                sx={{ mb: 2 }}
              />

              <FilterLabel>Purchase Cost </FilterLabel>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="Enter purchase cost"
                value={formData.purchaseCost}
                onChange={(e) =>
                  handleInputChange("purchaseCost", e.target.value)
                }
                disabled={!canEdit}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <FilterLabel>Commissioning Date</FilterLabel>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={formData.commissioningDate}
                onChange={(e) =>
                  handleInputChange("commissioningDate", e.target.value)
                }
                disabled={!canEdit}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday fontSize="small" sx={{ color: "#888" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <FilterLabel>Tags (comma-separated)</FilterLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g., urgent, high-value, critical"
                value={formData.metadata.tags.join(", ")}
                onChange={handleTagsChange}
                disabled={!canEdit}
                sx={{ mb: 2 }}
              />

              <FilterLabel>Notes</FilterLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="Additional notes"
                value={formData.metadata.notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metadata: { ...prev.metadata, notes: e.target.value },
                  }))
                }
                disabled={!canEdit}
                multiline
                rows={2}
              />
            </Paper>
          </Box>

          {/* RIGHT PANEL - Category Specific Sections */}
          <Box sx={{ flex: 1 }}>
            <SectionCard
              icon={<Inventory2Outlined fontSize="small" />}
              title="Material Handling Equipment"
              disabled={!canEdit}
            >
              <FilterLabel>Utilization Status</FilterLabel>
              <CBRow
                name="mhe"
                labels={[
                  "Active",
                  "Idle",
                  "Not Applicable",
                  "Under Maintenance",
                  "Decommissioned",
                ]}
                values={mheFilters}
                onChange={handleCheckboxChange}
                disabled={!canEdit}
              />
              <Box mt={2}>
                <FilterLabel>Engine Runtime (Hours)</FilterLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="Enter runtime hours"
                  value={mheData.engineRuntimeHours}
                  onChange={(e) =>
                    setMheData((prev) => ({
                      ...prev,
                      engineRuntimeHours: e.target.value,
                    }))
                  }
                  disabled={!canEdit}
                />
              </Box>
              <Box mt={2}>
                <FilterLabel>Safety Certification</FilterLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter safety certification"
                  value={mheData.safetyCertification}
                  onChange={(e) =>
                    setMheData((prev) => ({
                      ...prev,
                      safetyCertification: e.target.value,
                    }))
                  }
                  disabled={!canEdit}
                />
              </Box>
            </SectionCard>

            <SectionCard
              icon={<DirectionsCarOutlined fontSize="small" />}
              title="Transportation"
              disabled={!canEdit}
            >
              <FilterLabel>Vehicle Type</FilterLabel>
              <CBRow
                name="vehicle"
                labels={["Truck", "Car", "Heavy Duty", "Van", "Motorcycle"]}
                values={vehicleFilters}
                onChange={handleCheckboxChange}
                disabled={!canEdit}
              />
              <Box mt={2}>
                <FilterLabel>Driver</FilterLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter driver name/ID"
                  value={transportationData.driver}
                  onChange={(e) =>
                    setTransportationData((prev) => ({
                      ...prev,
                      driver: e.target.value,
                    }))
                  }
                  disabled={!canEdit}
                />
              </Box>
              <Box mt={2}>
                <Typography fontSize={13} mb={1}>
                  Load Status: {transportationData.loadStatus}%
                </Typography>
                <Slider
                  value={transportationData.loadStatus}
                  onChange={(_, v) =>
                    setTransportationData((prev) => ({
                      ...prev,
                      loadStatus: v,
                    }))
                  }
                  min={0}
                  max={100}
                  disabled={!canEdit}
                />
              </Box>
            </SectionCard>

            <SectionCard
              icon={<SettingsOutlined fontSize="small" />}
              title="Rotating Machinery"
              disabled={!canEdit}
            >
              <FilterLabel>Health Status Index</FilterLabel>
              <Stack direction="row" spacing={1} mb={2}>
                {["Green", "Yellow", "Red"].map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    variant={
                      rotatingMachineryData.healthStatusIndex === color
                        ? "filled"
                        : "outlined"
                    }
                    clickable={canEdit}
                    onClick={() =>
                      canEdit &&
                      setRotatingMachineryData((prev) => ({
                        ...prev,
                        healthStatusIndex: color,
                      }))
                    }
                    sx={{
                      bgcolor:
                        rotatingMachineryData.healthStatusIndex === color
                          ? color === "Green"
                            ? "#4caf50"
                            : color === "Yellow"
                              ? "#ff9800"
                              : "#f44336"
                          : "transparent",
                      color:
                        rotatingMachineryData.healthStatusIndex === color
                          ? "#fff"
                          : "inherit",
                    }}
                  />
                ))}
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography fontSize={13}>Vibration Alert</Typography>
                <Switch
                  checked={rotatingMachineryData.vibrationAlert}
                  onChange={(e) =>
                    canEdit &&
                    setRotatingMachineryData((prev) => ({
                      ...prev,
                      vibrationAlert: e.target.checked,
                    }))
                  }
                  disabled={!canEdit}
                />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography fontSize={13}>Temperature Alert</Typography>
                <Switch
                  checked={rotatingMachineryData.temperatureAlert}
                  onChange={(e) =>
                    canEdit &&
                    setRotatingMachineryData((prev) => ({
                      ...prev,
                      temperatureAlert: e.target.checked,
                    }))
                  }
                  disabled={!canEdit}
                />
              </Stack>
              <FilterLabel>Fault Type</FilterLabel>
              <CBRow
                name="faultType"
                labels={[
                  "Mechanical",
                  "Electrical",
                  "Thermal",
                  "Hydraulic",
                  "Software",
                ]}
                values={faultTypeFilters}
                onChange={handleCheckboxChange}
                disabled={!canEdit}
              />
            </SectionCard>

            <SectionCard
              icon={<DeleteOutlineOutlined fontSize="small" />}
              title="Garbage Management"
              disabled={!canEdit}
            >
              <FilterLabel>Container Type</FilterLabel>
              <CBRow
                name="container"
                labels={[
                  "Small (120L)",
                  "Medium (240L)",
                  "Large (660L)",
                  "Industrial (1100L)",
                ]}
                values={containerFilters}
                onChange={handleCheckboxChange}
                disabled={!canEdit}
              />
              <Box mt={2}>
                <Typography fontSize={13} mb={1}>
                  IoT Fill Level:{" "}
                  {garbageManagementData.smartStatusIoTFillLevel}%
                </Typography>
                <Slider
                  value={garbageManagementData.smartStatusIoTFillLevel}
                  onChange={(_, v) =>
                    setGarbageManagementData((prev) => ({
                      ...prev,
                      smartStatusIoTFillLevel: v,
                    }))
                  }
                  min={0}
                  max={100}
                  disabled={!canEdit}
                />
              </Box>
              <Box mt={2}>
                <FilterLabel>Collection Status</FilterLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Collection status"
                  value={garbageManagementData.collectionStatus}
                  onChange={(e) =>
                    setGarbageManagementData((prev) => ({
                      ...prev,
                      collectionStatus: e.target.value,
                    }))
                  }
                  disabled={!canEdit}
                />
              </Box>
            </SectionCard>

            <SectionCard
              icon={<ComputerOutlined fontSize="small" />}
              title="IT Assets"
              disabled={!canEdit}
            >
              <FilterLabel>OS Platform</FilterLabel>
              <CBRow
                name="os"
                labels={["Windows", "macOS", "Linux", "iOS", "Android"]}
                values={osFilters}
                onChange={handleCheckboxChange}
                disabled={!canEdit}
              />
              <Box mt={2}>
                <FilterLabel>Software Name</FilterLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter software name"
                  value={itAssetsData.softwareName}
                  onChange={(e) =>
                    setItAssetsData((prev) => ({
                      ...prev,
                      softwareName: e.target.value,
                    }))
                  }
                  disabled={!canEdit}
                />
              </Box>
              <Box mt={2}>
                <FilterLabel>License Status</FilterLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={itAssetsData.licenseStatus}
                    onChange={(e) =>
                      setItAssetsData((prev) => ({
                        ...prev,
                        licenseStatus: e.target.value,
                      }))
                    }
                    disabled={!canEdit}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </SectionCard>

            <SectionCard
              icon={<ApartmentOutlined fontSize="small" />}
              title="Facility Management"
              disabled={!canEdit}
            >
              <FilterLabel>PM Status</FilterLabel>
              <CBRow
                name="pm"
                labels={["Up to Date", "Due Soon", "Overdue", "Not Scheduled"]}
                values={pmFilters}
                onChange={handleCheckboxChange}
                disabled={!canEdit}
              />
              <FilterLabel sx={{ mt: 2 }}>Maintenance Priority</FilterLabel>
              <RadioGroup
                value={facilityManagementData.maintenancePriority}
                onChange={(e) =>
                  canEdit &&
                  setFacilityManagementData((prev) => ({
                    ...prev,
                    maintenancePriority: e.target.value,
                  }))
                }
              >
                <Stack direction="row" spacing={2}>
                  {["High", "Medium", "Low"].map((p) => (
                    <FormControlLabel
                      key={p}
                      value={p}
                      control={<Radio size="small" disabled={!canEdit} />}
                      label={p}
                    />
                  ))}
                </Stack>
              </RadioGroup>
            </SectionCard>

            <SectionCard
              icon={<Search fontSize="small" />}
              title="Inspection Systems"
              disabled={!canEdit}
            >
              <Box mb={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontSize={13}>AMC Inspection</Typography>
                  <Switch
                    checked={inspectionSystems.amcInspection.enabled}
                    onChange={(e) =>
                      canEdit &&
                      setInspectionSystems((prev) => ({
                        ...prev,
                        amcInspection: {
                          ...prev.amcInspection,
                          enabled: e.target.checked,
                        },
                      }))
                    }
                    disabled={!canEdit}
                  />
                </Stack>
                {inspectionSystems.amcInspection.enabled && (
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <Select
                      value={inspectionSystems.amcInspection.schedule}
                      onChange={(e) =>
                        canEdit &&
                        setInspectionSystems((prev) => ({
                          ...prev,
                          amcInspection: {
                            ...prev.amcInspection,
                            schedule: e.target.value,
                          },
                        }))
                      }
                      disabled={!canEdit}
                    >
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Quarterly">Quarterly</MenuItem>
                      <MenuItem value="Yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontSize={13}>CAMC Inspection</Typography>
                  <Switch
                    checked={inspectionSystems.camcInspection.enabled}
                    onChange={(e) =>
                      canEdit &&
                      setInspectionSystems((prev) => ({
                        ...prev,
                        camcInspection: {
                          ...prev.camcInspection,
                          enabled: e.target.checked,
                        },
                      }))
                    }
                    disabled={!canEdit}
                  />
                </Stack>
                {inspectionSystems.camcInspection.enabled && (
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <Select
                      value={inspectionSystems.camcInspection.schedule}
                      onChange={(e) =>
                        canEdit &&
                        setInspectionSystems((prev) => ({
                          ...prev,
                          camcInspection: {
                            ...prev.camcInspection,
                            schedule: e.target.value,
                          },
                        }))
                      }
                      disabled={!canEdit}
                    >
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Quarterly">Quarterly</MenuItem>
                      <MenuItem value="Yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>
            </SectionCard>

            {/* Footer Buttons */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              mt={3}
              pb={3}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/admin/assets")}
                sx={{ px: 3 }}
              >
                Cancel
              </Button>
              {canEdit && (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    px: 4,
                    bgcolor: "#1a3a4a",
                    "&:hover": { bgcolor: "#0f2530" },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Save Asset"}
                </Button>
              )}
              {!canEdit && isTeam && (
                <Button
                  variant="outlined"
                  startIcon={<LockOutlined />}
                  disabled
                  sx={{ px: 4 }}
                >
                  Read Only Mode
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
