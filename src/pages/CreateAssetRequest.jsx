// CreateAssetRequest.jsx - Optimized for both Admin and Team with Role-Based Access

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,alpha,
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
  Divider,
  FormLabel,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  AccountTree,
  Share,
  Send,
  CheckCircle,
  Pending,
  Visibility,
  Edit,
  Warning,
  Info,
} from "@mui/icons-material";
import { useAsset } from "../context/AssetContext";
import { useAssetRequest } from "../context/AssetRequestContext";
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

// Color Constants
const C = {
  navy: "#0f4c61",
  ink: "#1a2e3b",
  muted: "#64748b",
  ghost: "#94a3b8",
  border: "#e8edf2",
  white: "#ffffff",
  surface: "#f8fafc",
  green: "#16a34a",
  greenBg: "#dcfce7",
  red: "#ef4444",
  redBg: "#fee2e2",
  amber: "#f59e0b",
  amberBg: "#fef3c7",
  purple: "#7c3aed",
  purpleBg: "#ede9fe",
};

const SectionCard = ({
  icon,
  title,
  color = "#1a5c6b",
  children,
  disabled,
  tooltip,
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
      transition: "all 0.2s ease",
      "&:hover": disabled ? {} : { boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
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
          bgcolor: "rgba(255,255,255,0.8)",
          borderRadius: 3,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Chip
          icon={<LockOutlined />}
          label={tooltip || "Read Only - Admin Access Required"}
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
          <Grid item xs={6} sm={4} key={`${name}-${label}`}>
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
              label={<Typography fontSize={12}>{label}</Typography>}
            />
          </Grid>
        ),
    )}
  </Grid>
);

export default function CreateAssetRequest() {
  const { user } = useAuth();
  const { createAsset, getAllAssets, loading: assetLoading } = useAsset();
  const { createRequest, loading: requestLoading } = useAssetRequest();
  const navigate = useNavigate();

  // Role-based access
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isTeam = user?.role === "team";
  const canEdit = isAdmin; // Only Admin can create/edit assets directly
  const canRequest = isTeam || isAdmin; // Both can request, but admin can also create directly

  // Request type: "direct" (admin) or "request" (team/admin request mode)
  const [requestType, setRequestType] = useState(
    canEdit ? "direct" : "request",
  );

  // Parent/Child selection
  const [assetType, setAssetType] = useState("parent");
  const [parentAssetId, setParentAssetId] = useState("");
  const [searchParentQuery, setSearchParentQuery] = useState("");
  const [availableParentAssets, setAvailableParentAssets] = useState([]);
  const [showParentSearch, setShowParentSearch] = useState(false);
  const [selectedParentAsset, setSelectedParentAsset] = useState(null);
  const [parentAssetsLoading, setParentAssetsLoading] = useState(false);

  const [assetCategory, setAssetCategory] = useState("Equipment");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load parent assets for child asset selection
  const loadParentAssets = async () => {
    if (!searchParentQuery || searchParentQuery.length < 2) return;
    setParentAssetsLoading(true);
    try {
      const filters = {
        search: searchParentQuery,
        assetType: "parent",
        isClone: false,
        limit: 20,
      };
      const response = await getAllAssets(filters);
      setAvailableParentAssets(response?.assets || []);
    } catch (error) {
      console.error("Error loading parent assets:", error);
    } finally {
      setParentAssetsLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchParentQuery) loadParentAssets();
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchParentQuery]);

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
    if (requestType === "direct" && !canEdit) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    if (requestType === "direct" && !canEdit) return;
    setFormData((prev) => ({
      ...prev,
      customPhysicalAddress: { ...prev.customPhysicalAddress, [field]: value },
    }));
  };

  const handleTagsChange = (e) => {
    if (requestType === "direct" && !canEdit) return;
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
    if (requestType === "direct" && !canEdit) return;
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

  const handleSelectParentAsset = (asset) => {
    setSelectedParentAsset(asset);
    setParentAssetId(asset._id);
    setShowParentSearch(false);
    setSearchParentQuery("");
  };

  const validateForm = () => {
    if (!formData.assetName.trim()) {
      setSnackbar({
        open: true,
        message: "Asset name is required",
        severity: "error",
      });
      return false;
    }
    if (assetType === "child" && !parentAssetId) {
      setSnackbar({
        open: true,
        message: "Please select a parent asset",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (requestType === "direct" && !canEdit) {
      setSnackbar({
        open: true,
        message: "You don't have permission to create assets directly",
        severity: "error",
      });
      return;
    }

    if (requestType === "request" && !canRequest) {
      setSnackbar({
        open: true,
        message: "You don't have permission to submit asset requests",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare submission data
      const submissionData = {
        assetName: formData.assetName.trim(),
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

        // Parent/Child info
        assetType,
        parentAssetId: assetType === "child" ? parentAssetId : undefined,

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

      let response;
      if (requestType === "direct") {
        response = await createAsset(submissionData);
        if (response && response.success !== false) {
          setSnackbar({
            open: true,
            message: `Asset "${formData.assetName}" created successfully as ${assetType} asset!`,
            severity: "success",
          });
          setTimeout(() => navigate("/admin/assets"), 2000);
        } else {
          throw new Error(response?.error || "Failed to create asset");
        }
      } else {
        // Submit as request
        submissionData.requestType = "asset_creation";
        response = await createRequest(submissionData);
        if (response && response.success !== false) {
          setSnackbar({
            open: true,
            message: `Asset request "${formData.assetName}" submitted successfully! Admin will review your request.`,
            severity: "success",
          });
          setTimeout(
            () =>
              navigate(isAdmin ? "/admin/asset-requests" : "/team/my-requests"),
            2000,
          );
        } else {
          throw new Error(response?.error || "Failed to submit request");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          (requestType === "direct"
            ? "Failed to create asset"
            : "Failed to submit request"),
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
        <Alert
          severity="error"
          sx={{ maxWidth: 500, mx: "auto", borderRadius: 3 }}
        >
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

  const isSubmitting = loading || assetLoading || requestLoading;
  const canSubmit =
    (requestType === "direct" && canEdit) ||
    (requestType === "request" && canRequest);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: C.surface }}>
        {/* Top Bar */}
        <Box
          sx={{
            bgcolor: C.white,
            borderBottom: `1px solid ${C.border}`,
            px: { xs: 2, sm: 3 },
            py: 1.5,
            display: "flex",
            width:"1180px",
            ml:3,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton
              size="small"
              onClick={() =>
                navigate(isAdmin ? "/admin/assets" : "/admin/assets")
              }
              sx={{ bgcolor: C.surface, borderRadius: 2 }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            <Box>
              <Typography fontWeight={700} fontSize={18} color={C.ink}>
                {requestType === "direct"
                  ? "Create New Asset"
                  : "Request New Asset"}
              </Typography>
              <Typography fontSize={12} color={C.muted}>
                {isAdmin
                  ? requestType === "direct"
                    ? "Direct asset creation with parent/child support"
                    : "Submit asset request for approval"
                  : "Submit asset request for admin approval"}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            {isAdmin && (
              <Chip
                icon={requestType === "direct" ? <CheckCircle /> : <Send />}
                label={
                  requestType === "direct"
                    ? "Direct Create Mode"
                    : "Request Mode"
                }
                onClick={() =>
                  setRequestType(
                    requestType === "direct" ? "request" : "direct",
                  )
                }
                clickable
                sx={{
                  bgcolor: requestType === "direct" ? C.greenBg : C.amberBg,
                  color: requestType === "direct" ? C.green : C.amber,
                  fontWeight: 600,
                }}
              />
            )}
            {isTeam && (
              <Chip
                icon={<Send />}
                label="Request Mode"
                sx={{ bgcolor: C.amberBg, color: C.amber, fontWeight: 600 }}
              />
            )}
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 2.5,
            p: 3,
            maxWidth: 1600,
            mx: "auto",
          }}
        >
          {/* LEFT PANEL */}
          <Box sx={{ width: { xs: "100%", lg: 320 }, flexShrink: 0 }}>
            {/* Asset Type Selection */}
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${C.border}`,
                borderRadius: 3,
                p: 3,
                mb: 2.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
                <AccountTree fontSize="small" sx={{ color: C.navy }} />
                <Typography fontWeight={700} fontSize={14} color={C.ink}>
                  Asset Type Selection
                </Typography>
              </Stack>

              <RadioGroup
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={3}>
                  <FormControlLabel
                    value="parent"
                    control={<Radio size="small" />}
                    label="Parent Asset"
                  />
                  <FormControlLabel
                    value="child"
                    control={<Radio size="small" />}
                    label="Child Asset"
                  />
                </Stack>
              </RadioGroup>

              {assetType === "child" && (
                <Box sx={{ mt: 2 }}>
                  <FilterLabel required>Select Parent Asset</FilterLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search parent asset by name or ID..."
                    value={searchParentQuery}
                    onChange={(e) => setSearchParentQuery(e.target.value)}
                    onFocus={() => setShowParentSearch(true)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: parentAssetsLoading && (
                        <CircularProgress size={16} />
                      ),
                    }}
                  />

                  {showParentSearch &&
                    (availableParentAssets.length > 0 || searchParentQuery) && (
                      <Paper
                        sx={{
                          position: "absolute",
                          zIndex: 10,
                          mt: 0.5,
                          width: "calc(100% - 48px)",
                          maxHeight: 250,
                          overflow: "auto",
                          borderRadius: 2,
                          boxShadow: 3,
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        {availableParentAssets.length > 0 ? (
                          availableParentAssets.map((asset) => (
                            <Box
                              key={asset._id}
                              sx={{
                                p: 1.5,
                                cursor: "pointer",
                                borderBottom: `1px solid ${C.border}`,
                                "&:hover": { bgcolor: C.surface },
                              }}
                              onClick={() => handleSelectParentAsset(asset)}
                            >
                              <Typography fontWeight={600} fontSize={13}>
                                {asset.assetName}
                              </Typography>
                              <Typography fontSize={11} color={C.muted}>
                                ID: {asset.assetId}
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography
                            sx={{
                              p: 2,
                              textAlign: "center",
                              color: C.muted,
                              fontSize: 12,
                            }}
                          >
                            No parent assets found
                          </Typography>
                        )}
                      </Paper>
                    )}

                  {selectedParentAsset && (
                    <Chip
                      label={`Parent: ${selectedParentAsset.assetName}`}
                      onDelete={() => {
                        setSelectedParentAsset(null);
                        setParentAssetId("");
                      }}
                      size="small"
                      sx={{ mt: 1, bgcolor: C.navy, color: C.white }}
                    />
                  )}
                </Box>
              )}
            </Paper>

            {/* Core Identification */}
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${C.border}`,
                borderRadius: 3,
                p: 3,
                mb: 2.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
                <Search fontSize="small" sx={{ color: C.navy }} />
                <Typography fontWeight={700} fontSize={14} color={C.ink}>
                  Core Identification
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FilterLabel required>Asset Name</FilterLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter asset name"
                    value={formData.assetName}
                    onChange={(e) =>
                      handleInputChange("assetName", e.target.value)
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FilterLabel>Description</FilterLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FilterLabel>Serial Number</FilterLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter serial number"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      handleInputChange("serialNumber", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FilterLabel required>Asset Category</FilterLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      value={assetCategory}
                      onChange={(e) => setAssetCategory(e.target.value)}
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

              <Box
                sx={{
                  mt: 2,
                  bgcolor: alpha(C.navy, 0.05),
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Typography fontSize={12} color={C.navy}>
                  Category selected: {assetCategory}
                </Typography>
              </Box>
            </Paper>

            {/* Primary Information */}
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${C.border}`,
                borderRadius: 3,
                p: 3,
                mb: 2.5,
              }}
            >
              <Typography fontWeight={700} fontSize={13} mb={2} color={C.ink}>
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
                sx={{ mb: 2 }}
              />

              <FilterLabel>Status</FilterLabel>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
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
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                sx={{ mb: 2 }}
              />

              <FilterLabel>Purchase Cost ($)</FilterLabel>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="Enter purchase cost"
                value={formData.purchaseCost}
                onChange={(e) =>
                  handleInputChange("purchaseCost", e.target.value)
                }
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
                multiline
                rows={2}
              />
            </Paper>
          </Box>

          {/* RIGHT PANEL - Category Specific Sections */}
          <Box sx={{ flex: 1 }}>
            {/* Material Handling Equipment */}
            <SectionCard
              icon={<Inventory2Outlined fontSize="small" />}
              title="Material Handling Equipment"
              disabled={requestType === "direct" && !canEdit}
              tooltip="Admin access required to edit"
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
                disabled={requestType === "direct" && !canEdit}
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
                />
              </Box>
            </SectionCard>

            {/* Transportation */}
            <SectionCard
              icon={<DirectionsCarOutlined fontSize="small" />}
              title="Transportation"
              disabled={requestType === "direct" && !canEdit}
              tooltip="Admin access required to edit"
            >
              <FilterLabel>Vehicle Type</FilterLabel>
              <CBRow
                name="vehicle"
                labels={["Truck", "Car", "Heavy Duty", "Van", "Motorcycle"]}
                values={vehicleFilters}
                onChange={handleCheckboxChange}
                disabled={requestType === "direct" && !canEdit}
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
                />
              </Box>
              <Box mt={2}>
                <Typography fontSize={12} mb={1}>
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
                />
              </Box>
            </SectionCard>

            {/* Rotating Machinery */}
            <SectionCard
              icon={<SettingsOutlined fontSize="small" />}
              title="Rotating Machinery"
              disabled={requestType === "direct" && !canEdit}
              tooltip="Admin access required to edit"
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
                    clickable={requestType !== "direct" || canEdit}
                    onClick={() =>
                      setRotatingMachineryData((prev) => ({
                        ...prev,
                        healthStatusIndex: color,
                      }))
                    }
                    sx={{
                      bgcolor:
                        rotatingMachineryData.healthStatusIndex === color
                          ? color === "Green"
                            ? C.green
                            : color === "Yellow"
                              ? C.amber
                              : C.red
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
                <Typography fontSize={12}>Vibration Alert</Typography>
                <Switch
                  checked={rotatingMachineryData.vibrationAlert}
                  onChange={(e) =>
                    setRotatingMachineryData((prev) => ({
                      ...prev,
                      vibrationAlert: e.target.checked,
                    }))
                  }
                />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography fontSize={12}>Temperature Alert</Typography>
                <Switch
                  checked={rotatingMachineryData.temperatureAlert}
                  onChange={(e) =>
                    setRotatingMachineryData((prev) => ({
                      ...prev,
                      temperatureAlert: e.target.checked,
                    }))
                  }
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
                disabled={requestType === "direct" && !canEdit}
              />
            </SectionCard>

            {/* Garbage Management */}
            <SectionCard
              icon={<DeleteOutlineOutlined fontSize="small" />}
              title="Garbage Management"
              disabled={requestType === "direct" && !canEdit}
              tooltip="Admin access required to edit"
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
                disabled={requestType === "direct" && !canEdit}
              />
              <Box mt={2}>
                <Typography fontSize={12} mb={1}>
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
                />
              </Box>
            </SectionCard>

            {/* IT Assets */}
            <SectionCard
              icon={<ComputerOutlined fontSize="small" />}
              title="IT Assets"
              disabled={requestType === "direct" && !canEdit}
              tooltip="Admin access required to edit"
            >
              <FilterLabel>OS Platform</FilterLabel>
              <CBRow
                name="os"
                labels={["Windows", "macOS", "Linux", "iOS", "Android"]}
                values={osFilters}
                onChange={handleCheckboxChange}
                disabled={requestType === "direct" && !canEdit}
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
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </SectionCard>

            {/* Facility Management */}
            <SectionCard
              icon={<ApartmentOutlined fontSize="small" />}
              title="Facility Management"
              disabled={requestType === "direct" && !canEdit}
              tooltip="Admin access required to edit"
            >
              <FilterLabel>PM Status</FilterLabel>
              <CBRow
                name="pm"
                labels={["Up to Date", "Due Soon", "Overdue", "Not Scheduled"]}
                values={pmFilters}
                onChange={handleCheckboxChange}
                disabled={requestType === "direct" && !canEdit}
              />
              <FilterLabel sx={{ mt: 2 }}>Maintenance Priority</FilterLabel>
              <RadioGroup
                value={facilityManagementData.maintenancePriority}
                onChange={(e) =>
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
                      control={<Radio size="small" />}
                      label={p}
                    />
                  ))}
                </Stack>
              </RadioGroup>
            </SectionCard>

            {/* Inspection Systems */}
            <SectionCard
              icon={<Search fontSize="small" />}
              title="Inspection Systems"
              disabled={requestType === "direct" && !canEdit}
              tooltip="Admin access required to edit"
            >
              <Box mb={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontSize={12}>AMC Inspection</Typography>
                  <Switch
                    checked={inspectionSystems.amcInspection.enabled}
                    onChange={(e) =>
                      setInspectionSystems((prev) => ({
                        ...prev,
                        amcInspection: {
                          ...prev.amcInspection,
                          enabled: e.target.checked,
                        },
                      }))
                    }
                  />
                </Stack>
                {inspectionSystems.amcInspection.enabled && (
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <Select
                      value={inspectionSystems.amcInspection.schedule}
                      onChange={(e) =>
                        setInspectionSystems((prev) => ({
                          ...prev,
                          amcInspection: {
                            ...prev.amcInspection,
                            schedule: e.target.value,
                          },
                        }))
                      }
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
                  <Typography fontSize={12}>CAMC Inspection</Typography>
                  <Switch
                    checked={inspectionSystems.camcInspection.enabled}
                    onChange={(e) =>
                      setInspectionSystems((prev) => ({
                        ...prev,
                        camcInspection: {
                          ...prev.camcInspection,
                          enabled: e.target.checked,
                        },
                      }))
                    }
                  />
                </Stack>
                {inspectionSystems.camcInspection.enabled && (
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <Select
                      value={inspectionSystems.camcInspection.schedule}
                      onChange={(e) =>
                        setInspectionSystems((prev) => ({
                          ...prev,
                          camcInspection: {
                            ...prev.camcInspection,
                            schedule: e.target.value,
                          },
                        }))
                      }
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

            {/* Info Banner for Request Mode */}
            {requestType === "request" && (
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: C.amberBg,
                  border: `1px solid #ffe082`,
                  borderRadius: 2,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Pending sx={{ color: C.amber, fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color={C.amber}
                    >
                      This is a Request
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Your request will be sent to admin for review and approval
                      before the asset is created.
                      {isTeam &&
                        " You can track your request status in 'My Requests' page."}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            {/* Info Banner for Direct Mode */}
            {requestType === "direct" && isAdmin && (
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: alpha(C.green, 0.1),
                  border: `1px solid ${C.greenBg}`,
                  borderRadius: 2,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <CheckCircle sx={{ color: C.green, fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color={C.green}
                    >
                      Direct Creation Mode
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Assets will be created immediately in the system. Make
                      sure all information is accurate.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

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
                onClick={() =>
                  navigate(isAdmin ? "/admin/assets" : "/team/assets")
                }
                sx={{ px: 3 }}
              >
                Cancel
              </Button>
              {canSubmit ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  sx={{
                    px: 4,
                    bgcolor: requestType === "request" ? C.amber : C.navy,
                    "&:hover": {
                      bgcolor:
                        requestType === "request" ? "#e65100" : "#0a3a4a",
                    },
                  }}
                  startIcon={
                    requestType === "request" ? <Send /> : <CheckCircle />
                  }
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : requestType === "request" ? (
                    "Submit Request"
                  ) : (
                    "Create Asset"
                  )}
                </Button>
              ) : (
                <Tooltip
                  title={
                    !canEdit && requestType === "direct"
                      ? "Admin access required"
                      : "Team members can only submit requests"
                  }
                >
                  <Button
                    variant="outlined"
                    startIcon={<LockOutlined />}
                    disabled
                    sx={{ px: 4 }}
                  >
                    {!canEdit && requestType === "direct"
                      ? "Admin Only"
                      : "Request Mode Only"}
                  </Button>
                </Tooltip>
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
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: 2, minWidth: 300 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
