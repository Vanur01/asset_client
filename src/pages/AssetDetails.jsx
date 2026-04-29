// AssetDetails.jsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Tab,
  Tabs,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  Tooltip,
  LinearProgress,
  InputAdornment,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  LocationOn,
  Category,
  CalendarToday,
  Person,
  Assessment,
  AttachMoney,
  Build,
  Info,
  Close,
  Link as LinkIcon,
  History,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Search,
  Add,
  Inventory2,
  QrCode,
  TrendingUp,
  Settings,
  Memory,
} from "@mui/icons-material";
import { useAsset } from "../context/AssetContext";

const statusColors = {
  Active: { bg: "#e8f5e9", color: "#2e7d32", icon: CheckCircle },
  "In Maintenance": { bg: "#fff3e0", color: "#ed6c02", icon: Build },
  "Under Inspection": { bg: "#e3f2fd", color: "#1565c0", icon: History },
  Inactive: { bg: "#ffebee", color: "#c62828", icon: ErrorIcon },
  Decommissioned: { bg: "#f5f5f5", color: "#757575", icon: Warning },
};

const InfoCard = ({ title, children, icon: Icon, elevation = 0 }) => (
  <Card
    sx={{
      mb: 2,
      height: "100%",
      borderRadius: 3,
      transition: "all 0.2s",
      "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
    }}
    elevation={elevation}
  >
    <CardContent>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            bgcolor: "rgba(13, 79, 107, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Icon && <Icon sx={{ color: "#0d4f6b", fontSize: 18 }} />}
        </Box>
        <Typography
          variant="h6"
          sx={{ fontSize: 15, fontWeight: 700, color: "#1a2332" }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

const InfoRow = ({ label, value, icon: Icon }) => (
  <Box display="flex" alignItems="flex-start" gap={1.5} py={0.75}>
    {Icon && <Icon sx={{ fontSize: 16, color: "#6b7a8d", mt: 0.2 }} />}
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ minWidth: 100, fontSize: 12 }}
    >
      {label}:
    </Typography>
    <Typography
      variant="body2"
      fontWeight={500}
      sx={{ fontSize: 12, color: "#1a2332", wordBreak: "break-word", flex: 1 }}
    >
      {value || "N/A"}
    </Typography>
  </Box>
);

const StatusChip = ({ status }) => {
  const colors = statusColors[status] || {
    bg: "#eef2f6",
    color: "#5a6e85",
    icon: Info,
  };
  const IconComponent = colors.icon;
  return (
    <Chip
      icon={<IconComponent sx={{ fontSize: 14 }} />}
      label={status}
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        borderRadius: 2,
        height: 28,
        "& .MuiChip-icon": { fontSize: 16 },
      }}
    />
  );
};

// ── Link Child Assets Dialog ──────────────────────────────────────────────────
const LinkChildAssetsDialog = ({
  open,
  onClose,
  availableAssets,
  selectedIds,
  onToggle,
  onLink,
  onCreateNew,
  loading,
}) => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetCategory, setNewAssetCategory] = useState("Equipment");
  const [creating, setCreating] = useState(false);

  const filtered = availableAssets.filter(
    (a) =>
      !search ||
      a.assetName?.toLowerCase().includes(search.toLowerCase()) ||
      a.assetId?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreateAndLink = async () => {
    if (!newAssetName.trim()) return;
    setCreating(true);
    await onCreateNew(newAssetName, newAssetCategory);
    setCreating(false);
    setNewAssetName("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1.5,
          pt: 2.5,
          px: 3,
          fontWeight: 700,
          fontSize: 18,
          color: "#1a2332",
          borderBottom: "1px solid #eef2f6",
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "#0d4f6b10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LinkIcon sx={{ fontSize: 18, color: "#0d4f6b" }} />
        </Box>
        Link Child Assets
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>

        {tab === 0 && (
          <>
            <TextField
              fullWidth
              size="small"
              placeholder="Search assets by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 16, color: "#9aa5b1" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#fafafa",
                },
              }}
            />

            <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <Typography
                  textAlign="center"
                  py={4}
                  color="text.secondary"
                  fontSize={13}
                >
                  No assets found
                </Typography>
              ) : (
                filtered.map((a) => {
                  const isSelected = selectedIds.includes(a._id);
                  return (
                    <Paper
                      key={a._id}
                      onClick={() => onToggle(a._id)}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        mb: 1.5,
                        cursor: "pointer",
                        bgcolor: isSelected ? "#e8f3f8" : "#fff",
                        border: isSelected
                          ? "1.5px solid #0d4f6b"
                          : "1px solid #eef2f6",
                        borderRadius: 2,
                        transition: "all 0.15s",
                        "&:hover": {
                          borderColor: "#0d4f6b",
                          bgcolor: isSelected ? "#e8f3f8" : "#f8fbfd",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                          sx={{ bgcolor: "#0d4f6b", width: 32, height: 32 }}
                        >
                          <Build sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Box flex={1}>
                          <Typography
                            fontWeight={700}
                            fontSize={13}
                            color="#1a2332"
                          >
                            {a.assetName}
                          </Typography>
                          <Typography fontSize={11} color="#6b7a8d">
                            {a.assetId} • {a.assetCategory}
                          </Typography>
                        </Box>
                        <Checkbox checked={isSelected} sx={{ p: 0.5 }} />
                      </Box>
                    </Paper>
                  );
                })
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #eef2f6" }}>
        <Typography fontSize={12} color="#6b7a8d">
          {selectedIds.length > 0 && `${selectedIds.length} asset(s) selected`}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          {tab === 0 && (
            <Button
              variant="contained"
              onClick={() => onLink(selectedIds)}
              disabled={selectedIds.length === 0 || loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                bgcolor: "#0d4f6b",
              }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                `Link (${selectedIds.length})`
              )}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const AssetDetails = ({ asset: initialAsset, onBack, onUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const {
    updateAsset,
    deleteAsset,
    linkChildAssets,
    createAsset,
    getAllAssets,
    loading,
  } = useAsset();
  const [asset, setAsset] = useState(initialAsset);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permanentDelete, setPermanentDelete] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedChildAssets, setSelectedChildAssets] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [activeTab, setActiveTab] = useState(0);

  const [editFormData, setEditFormData] = useState({
    assetName: asset.assetName || "",
    status: asset.status || "Active",
    statusChangeReason: "",
    assetCondition: asset.assetCondition || "Excellent",
    currentValue: asset.currentValue || "",
    currentLocation: asset.currentLocation || "",
    description: asset.description || "",
  });

  const fetchAvailableAssets = async () => {
    try {
      const response = await getAllAssets({ limit: 100 });
      const allAssets = response?.assets || [];
      setAvailableAssets(allAssets.filter((a) => a._id !== asset._id));
    } catch (error) {
      console.error("Error fetching available assets:", error);
    }
  };

  const handleToggleChild = (id) => {
    setSelectedChildAssets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCreateAndLink = async (assetName, category) => {
    try {
      const newAsset = await createAsset({
        assetName,
        assetCategory: category,
        status: "Active",
        assetCondition: "Excellent",
        currentLocation: asset.currentLocation || "Main Warehouse",
        serialNumber: `NEW-${Date.now()}`,
      });

      if (newAsset?.success) {
        await linkChildAssets(asset._id, [newAsset.data?._id || newAsset._id]);
        setSnackbar({
          open: true,
          message: "Asset created and linked successfully!",
          severity: "success",
        });
        setLinkDialogOpen(false);
        onUpdate();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create and link asset",
        severity: "error",
      });
    }
  };

  const handleLinkChildren = async (ids) => {
    if (ids.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one asset",
        severity: "warning",
      });
      return;
    }
    try {
      await linkChildAssets(asset._id, ids);
      setSnackbar({
        open: true,
        message: "Child assets linked successfully!",
        severity: "success",
      });
      setLinkDialogOpen(false);
      setSelectedChildAssets([]);
      onUpdate();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to link assets",
        severity: "error",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        assetName: editFormData.assetName,
        status: editFormData.status,
        assetCondition: editFormData.assetCondition,
        currentLocation: editFormData.currentLocation,
        description: editFormData.description,
      };
      if (editFormData.statusChangeReason)
        updateData.statusChangeReason = editFormData.statusChangeReason;
      if (editFormData.currentValue)
        updateData.currentValue = parseFloat(editFormData.currentValue);

      const result = await updateAsset(asset._id, updateData);
      setAsset(result);
      setSnackbar({
        open: true,
        message: "Asset updated successfully!",
        severity: "success",
      });
      setEditMode(false);
      onUpdate();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update asset",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAsset(asset._id, permanentDelete);
      setSnackbar({
        open: true,
        message: permanentDelete
          ? "Asset permanently deleted!"
          : "Asset moved to trash!",
        severity: "success",
      });
      setTimeout(() => {
        setDeleteDialogOpen(false);
        onBack();
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete asset",
        severity: "error",
      });
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";
  const formatCurrency = (value) =>
    value
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value)
      : "N/A";

  if (editMode) {
    return (
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
            flexWrap="wrap"
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton onClick={() => setEditMode(false)}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" fontWeight={700}>
                Edit Asset
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={loading}
              sx={{ bgcolor: "#0d4f6b" }}
            >
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Asset Name"
                value={editFormData.assetName}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    assetName: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.value })
                  }
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="In Maintenance">In Maintenance</MenuItem>
                  <MenuItem value="Under Inspection">Under Inspection</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              {editFormData.status !== asset.status && (
                <TextField
                  fullWidth
                  label="Status Change Reason"
                  multiline
                  rows={2}
                  value={editFormData.statusChangeReason}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      statusChangeReason: e.target.value,
                    })
                  }
                  sx={{ mb: 2 }}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={editFormData.assetCondition}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      assetCondition: e.target.value,
                    })
                  }
                >
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Current Value"
                type="number"
                value={editFormData.currentValue}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    currentValue: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Current Location"
                value={editFormData.currentLocation}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    currentLocation: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Header Card */}
      <Card sx={{ mb: 3, borderRadius: 1  }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            flexWrap="wrap"
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <IconButton onClick={onBack}>
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ fontSize: { xs: 20, sm: 24 } }}
                >
                  {asset.assetName}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ mt: 0.5 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    ID: {asset.assetId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tag: {asset.tagNumber}
                  </Typography>
                </Stack>
              </Box>
            </Box>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => setEditMode(true)}
                  sx={{ color: "#0d4f6b", bgcolor: "#0d4f6b10" }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Link Child Assets">
                <IconButton
                  onClick={() => {
                    setLinkDialogOpen(true);
                    fetchAvailableAssets();
                  }}
                  sx={{ color: "#0d4f6b", bgcolor: "#0d4f6b10" }}
                >
                  <LinkIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ color: "#d32f2f", bgcolor: "#d32f2f10" }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mt: 2 }}
            flexWrap="wrap"
            useFlexGap
          >
            <StatusChip status={asset.status} />
            <Chip
              label={`Condition: ${asset.assetCondition}`}
              size="small"
              sx={{ borderRadius: 2 }}
            />
            <Chip
              icon={<Assessment sx={{ fontSize: 16 }} />}
              label={`Health: ${asset.healthScore || 0}%`}
              size="small"
              sx={{ borderRadius: 2 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Overview Cards - All in same row */}
      <Grid container spacing={2}>
        {/* Asset Information Card */}
        <Grid item xs={12} sm={6} md={4} sx={{width:"360px"}}>
          <InfoCard title="Asset Information" icon={Info}>
            <InfoRow label="Description" value={asset.description} />
            <InfoRow
              label="Serial Number"
              value={asset.serialNumber}
              icon={QrCode}
            />
            <InfoRow
              label="Category"
              value={asset.assetCategory}
              icon={Category}
            />
            <InfoRow label="Tag Number" value={asset.tagNumber} />
            <InfoRow
              label="Parent Relationship"
              value={asset.parentChildRelationship}
            />
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Health Score
              </Typography>
              <LinearProgress
                variant="determinate"
                value={asset.healthScore || 0}
                sx={{ borderRadius: 2, height: 6, mt: 0.5 }}
              />
            </Box>
          </InfoCard>
        </Grid>

        {/* Financial Card */}
        <Grid item xs={12} sm={6} md={4} sx={{width:"360px"}}>
          <InfoCard title="Financial" icon={AttachMoney}>
            <InfoRow
              label="Purchase Cost"
              value={formatCurrency(asset.purchaseCost)}
            />
            <InfoRow
              label="Current Value"
              value={formatCurrency(asset.currentValue)}
            />
            <InfoRow
              label="Commissioning Date"
              value={formatDate(asset.commissioningDate)}
            />
            <InfoRow label="Clone Version" value={asset.cloneVersion} />
            <InfoRow label="Is Clone" value={asset.isClone ? "Yes" : "No"} />
          </InfoCard>
        </Grid>

        {/* Status & Dates Card */}
        <Grid item xs={12} sm={6} md={4} sx={{width:"350px"}}>
          <InfoCard title="Status & Dates" icon={CalendarToday}>
            <InfoRow label="Created" value={formatDate(asset.createdAt)} />
            <InfoRow label="Last Updated" value={formatDate(asset.updatedAt)} />
            <InfoRow label="Created By" value={asset.createdByModel} />
            <InfoRow label="Is Active" value={asset.isActive ? "Yes" : "No"} />
            <InfoRow label="Clone Count" value={asset.cloneCount} />
          </InfoCard>
        </Grid>

        {/* IoT / Operational Data Card */}
        <Grid item xs={12} sm={6} md={4} sx={{width:"360px"}}>
          <InfoCard title="Operational Data" icon={TrendingUp}>
            <InfoRow
              label="Load Status"
              value={
                asset.transportation?.loadStatus !== undefined
                  ? `${asset.transportation.loadStatus}%`
                  : "N/A"
              }
            />
            <InfoRow
              label="Fill Level"
              value={
                asset.garbageManagement?.smartStatusIoTFillLevel !== undefined
                  ? `${asset.garbageManagement.smartStatusIoTFillLevel}%`
                  : "N/A"
              }
            />
            <InfoRow
              label="Vibration Alert"
              value={asset.rotatingMachinery?.vibrationAlert ? "Yes" : "No"}
            />
            <InfoRow
              label="Temperature Alert"
              value={asset.rotatingMachinery?.temperatureAlert ? "Yes" : "No"}
            />
          </InfoCard>
        </Grid>

        {/* Location Card */}
        <Grid item xs={12} sm={6} md={4} sx={{width:"360px"}}>
          <InfoCard title="Location" icon={LocationOn}>
            <InfoRow label="Current Location" value={asset.currentLocation} />
            {asset.customPhysicalAddress && (
              <>
                <InfoRow
                  label="Address"
                  value={`${asset.customPhysicalAddress.streetAddress}, ${asset.customPhysicalAddress.city}`}
                />
                <InfoRow
                  label="City/State"
                  value={`${asset.customPhysicalAddress.city}, ${asset.customPhysicalAddress.stateProvince}`}
                />
                <InfoRow
                  label="Country"
                  value={asset.customPhysicalAddress.country}
                />
              </>
            )}
          </InfoCard>
        </Grid>

        {/* Assigned Users Card */}
        <Grid item xs={12} sm={6} md={4} sx={{width:"360px"}}>
          <InfoCard title="Assigned Users" icon={Person}>
            {asset.assignedUsers?.primaryUser ? (
              <>
                <InfoRow
                  label="Primary User"
                  value={
                    `${asset.assignedUsers.primaryUser.firstName || ""} ${asset.assignedUsers.primaryUser.lastName || ""}`.trim() ||
                    "N/A"
                  }
                />
                {asset.assignedUsers.primaryUser.email && (
                  <InfoRow
                    label="Email"
                    value={asset.assignedUsers.primaryUser.email}
                  />
                )}
              </>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                py={2}
              >
                No users assigned
              </Typography>
            )}
          </InfoCard>
        </Grid>

        {/* IT Assets Card (if applicable) */}
        {asset.itAssets?.osPlatform?.length > 0 && (
          <Grid item xs={12} sm={6} md={4} sx={{width:"360px"}}>
            <InfoCard title="IT Assets" icon={Memory}>
              <InfoRow
                label="OS Platform"
                value={asset.itAssets.osPlatform.join(", ")}
              />
            </InfoCard>
          </Grid>
        )}
      </Grid>

      {/* Link Child Assets Dialog */}
      <LinkChildAssetsDialog
        open={linkDialogOpen}
        onClose={() => {
          setLinkDialogOpen(false);
          setSelectedChildAssets([]);
        }}
        availableAssets={availableAssets}
        selectedIds={selectedChildAssets}
        onToggle={handleToggleChild}
        onLink={handleLinkChildren}
        onCreateNew={handleCreateAndLink}
        loading={loading}
      />

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Asset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{asset.assetName}"?
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <Checkbox
              checked={permanentDelete}
              onChange={(e) => setPermanentDelete(e.target.checked)}
            />
            <Typography variant="body2">
              Permanently delete (cannot be undone)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssetDetails;
