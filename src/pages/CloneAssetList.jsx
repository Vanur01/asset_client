// pages/CloneAssetList.jsx - Optimized with Role-Based Access & Error Handling

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  Stack,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Tooltip,
  Avatar,
  LinearProgress,
  Fade,
  Collapse,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAsset } from "../context/AssetContext";
import { useAuth } from "../context/AuthContexts";
import {
  ArrowBack,
  Search,
  LocationOn,
  KeyboardArrowDown,
  ContentCopy,
  Info,
  Visibility,
  Inventory2Outlined,
  CheckCircle,
  Cancel,
  Build,
  DirectionsCar,
  Computer,
  Weekend,
  ElectricalServices,
  Delete,
  Warning,
  Refresh,
  FilterList,
  ClearAll,
  Person,
  AdminPanelSettings,
  ErrorOutline,
} from "@mui/icons-material";

// Color Constants
const C = {
  primary: "#0f4c61",
  primaryDark: "#0a3a4a",
  primaryLight: "#e8f2f5",
  success: "#16a34a",
  successBg: "#dcfce7",
  error: "#ef4444",
  errorBg: "#fee2e2",
  warning: "#f59e0b",
  warningBg: "#fef3c7",
  info: "#0284c7",
  infoBg: "#e0f2fe",
  surface: "#f8fafc",
  border: "#e2e8f0",
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    disabled: "#94a3b8",
  },
};

// Category Icons
const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("vehicle") || cat.includes("car"))
    return <DirectionsCar sx={{ fontSize: 18 }} />;
  if (cat.includes("computer") || cat.includes("it") || cat.includes("laptop"))
    return <Computer sx={{ fontSize: 18 }} />;
  if (cat.includes("furniture")) return <Weekend sx={{ fontSize: 18 }} />;
  if (cat.includes("electrical"))
    return <ElectricalServices sx={{ fontSize: 18 }} />;
  if (cat.includes("machinery") || cat.includes("equipment"))
    return <Build sx={{ fontSize: 18 }} />;
  return <Inventory2Outlined sx={{ fontSize: 18 }} />;
};

// Status chip configuration
const statusConfig = {
  active: {
    bg: C.successBg,
    color: C.success,
    icon: <CheckCircle sx={{ fontSize: 12 }} />,
  },
  operational: {
    bg: C.successBg,
    color: C.success,
    icon: <CheckCircle sx={{ fontSize: 12 }} />,
  },
  underinspection: {
    bg: C.infoBg,
    color: C.info,
    icon: <Visibility sx={{ fontSize: 12 }} />,
  },
  underreview: {
    bg: C.warningBg,
    color: C.warning,
    icon: <Info sx={{ fontSize: 12 }} />,
  },
  maintenance: {
    bg: "#fce4ec",
    color: "#e91e63",
    icon: <Build sx={{ fontSize: 12 }} />,
  },
  inmaintenance: {
    bg: "#fce4ec",
    color: "#e91e63",
    icon: <Build sx={{ fontSize: 12 }} />,
  },
  retired: {
    bg: C.errorBg,
    color: C.error,
    icon: <Cancel sx={{ fontSize: 12 }} />,
  },
  intransit: {
    bg: C.infoBg,
    color: C.info,
    icon: <LocationOn sx={{ fontSize: 12 }} />,
  },
  reserved: {
    bg: "#f3e5f5",
    color: "#7b1fa2",
    icon: <Info sx={{ fontSize: 12 }} />,
  },
};

const StatusChip = ({ status }) => {
  const statusLower = (status || "").toLowerCase().replace(/\s+/g, "");
  const cfg = statusConfig[statusLower] || {
    bg: "#f1f5f9",
    color: C.text.secondary,
    icon: null,
  };
  return (
    <Chip
      label={status}
      size="small"
      icon={cfg.icon}
      sx={{
        borderRadius: "20px",
        fontWeight: 600,
        fontSize: "11px",
        height: 24,
        bgcolor: cfg.bg,
        color: cfg.color,
        "& .MuiChip-icon": { fontSize: 12, color: cfg.color },
      }}
    />
  );
};

// Role Badge Component
const RoleBadge = ({ role }) => {
  if (role === "admin" || role === "super_admin") {
    return (
      <Chip
        icon={<AdminPanelSettings sx={{ fontSize: 12 }} />}
        label="Admin"
        size="small"
        sx={{
          height: 18,
          fontSize: "9px",
          bgcolor: C.primaryLight,
          color: C.primary,
        }}
      />
    );
  }
  return (
    <Chip
      icon={<Person sx={{ fontSize: 12 }} />}
      label="Team"
      size="small"
      sx={{
        height: 18,
        fontSize: "9px",
        bgcolor: C.surface,
        color: C.text.secondary,
      }}
    />
  );
};

// Main Component
export default function CloneAssets() {
  const navigate = useNavigate();
  const {
    assets,
    getAllAssets,
    cloneAsset,
    loading: assetLoading,
  } = useAsset();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isTeam = user?.role === "team";

  // State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [cloning, setCloning] = useState(false);
  const [cloneNote, setCloneNote] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cloneError, setCloneError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch assets with error handling
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = { limit: 100 };

      if (isTeam) {
        // Team members: Fetch only their own clone assets
        filters.isClone = true;
        filters.createdBy = user?._id;
      } else if (isAdmin) {
        // Admins: Fetch all non-clone assets for cloning
        filters.isClone = false;
      }

      const response = await getAllAssets(filters);

      if (!response || response.error) {
        throw new Error(response?.error || "Failed to fetch assets");
      }
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err.message || "Failed to load assets. Please try again.");
      setSnackbar({
        open: true,
        message: err.message || "Failed to fetch assets",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [getAllAssets, isTeam, isAdmin, user?._id]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Check if asset can be cloned
  const canAssetBeCloned = (asset) => {
    if (asset.isClone) return false;
    if (asset.status?.toLowerCase() === "retired") return false;
    if (asset.status?.toLowerCase() === "inactive") return false;
    return true;
  };

  // Get unique categories
  const categories = [
    "All Categories",
    ...new Set(assets?.map((a) => a.assetCategory).filter(Boolean) || []),
  ];

  // Filter assets
  const filteredAssets = (assets || []).filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      a.assetName?.toLowerCase().includes(q) ||
      a.assetId?.toLowerCase().includes(q) ||
      a.currentLocation?.toLowerCase().includes(q) ||
      a.assetCategory?.toLowerCase().includes(q);
    const matchCat =
      category === "All Categories" || a.assetCategory === category;
    return matchSearch && matchCat;
  });

  // Pagination
  const paginatedAssets = filteredAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleCloneClick = (asset) => {
    setCloneError(null);
    if (!canAssetBeCloned(asset)) {
      const reason = asset.isClone
        ? "This asset is already a clone and cannot be cloned again."
        : asset.status?.toLowerCase() === "retired"
          ? "Retired assets cannot be cloned."
          : "This asset cannot be cloned due to its current status.";

      setSnackbar({
        open: true,
        message: reason,
        severity: "warning",
      });
      return;
    }
    setSelectedAsset(asset);
    setCloneNote(
      `Cloned from ${asset.assetName} on ${new Date().toLocaleDateString()}`,
    );
    setCloneDialogOpen(true);
  };

  const handleConfirmClone = async () => {
    if (!selectedAsset) return;

    setCloning(true);
    setCloneError(null);
    try {
      const cloneData = {
        cloneNote: cloneNote.trim() || `Cloned from ${selectedAsset.assetName}`,
      };

      const result = await cloneAsset(selectedAsset._id, cloneData);

      if (result && result.success !== false) {
        setSnackbar({
          open: true,
          message: `Successfully cloned "${selectedAsset.assetName}"`,
          severity: "success",
        });

        setCloneDialogOpen(false);
        setSelectedAsset(null);
        setCloneNote("");

        // Refresh the asset list
        await fetchAssets();

        // For team members, show success and stay on page
        if (isTeam) {
          // Stay on same page to see newly cloned asset
        }
      } else {
        throw new Error(result?.message || "Failed to clone asset");
      }
    } catch (err) {
      console.error("Error cloning asset:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to clone asset";
      setCloneError(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error",
      });
    } finally {
      setCloning(false);
    }
  };

  const handleViewAsset = (asset) => {
    navigate(`/admin/assets/view/${asset._id}`);
  };

  const handleBack = () => {
    if (isTeam) {
      navigate("/admin/assets");
    } else {
      navigate("/admin/assets");
    }
  };

  const handleRefresh = async () => {
    await fetchAssets();
    setSnackbar({
      open: true,
      message: "Assets refreshed successfully",
      severity: "success",
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setPage(0);
  };

  const getHealthColor = (score) => {
    if (score >= 70) return C.success;
    if (score >= 40) return C.warning;
    return C.error;
  };

  // Get creator name
  const getCreatorName = (asset) => {
    if (asset.createdBy?.firstName) {
      return `${asset.createdBy.firstName} ${asset.createdBy.lastName || ""}`.trim();
    }
    return asset.createdBy?.email?.split("@")[0] || "Unknown";
  };

  // Empty state component
  const EmptyState = () => (
    <TableRow>
      <TableCell colSpan={isAdmin ? 9 : 8} align="center" sx={{ py: 8 }}>
        <Stack alignItems="center" spacing={2}>
          <Inventory2Outlined sx={{ fontSize: 64, color: C.text.disabled }} />
          <Typography variant="h6" color={C.text.secondary}>
            {isTeam
              ? "You haven't cloned any assets yet."
              : search || category !== "All Categories"
                ? "No assets match your search criteria"
                : "No assets available for cloning"}
          </Typography>
          <Typography variant="body2" color={C.text.disabled}>
            {isTeam
              ? "Clone assets from the Asset Management page to see them here."
              : search || category !== "All Categories"
                ? "Try adjusting your search or filter criteria"
                : "Create assets first before cloning"}
          </Typography>
          {isTeam && (
            <Button
              variant="outlined"
              onClick={() => navigate("/team/assets")}
              sx={{ mt: 1, borderColor: C.primary, color: C.primary }}
            >
              Go to Asset Management
            </Button>
          )}
          {(search || category !== "All Categories") && !isTeam && (
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearAll />}
              sx={{ mt: 1 }}
            >
              Clear Filters
            </Button>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell colSpan={isAdmin ? 9 : 8}>
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={60}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3 }, bgcolor: C.surface }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton
            onClick={handleBack}
            sx={{
              bgcolor: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: 2,
              width: 38,
              height: 38,
              "&:hover": { bgcolor: C.surface },
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>
          <Box>
            <Typography
              sx={{ fontSize: 18, fontWeight: 700, color: C.text.primary }}
            >
              {isTeam ? "My Cloned Assets" : "Clone Assets"}
            </Typography>
            <Typography sx={{ fontSize: 13, color: C.text.secondary, mt: 0.3 }}>
              {isTeam
                ? "View and manage assets you've cloned from original assets"
                : "Select an original asset to clone (Clone assets cannot be cloned again)"}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{ bgcolor: "#fff", border: `1px solid ${C.border}` }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Refresh sx={{ fontSize: 20, color: C.text.secondary }} />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Error Banner */}
      {error && (
        <Fade in>
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
            icon={<ErrorOutline />}
          >
            <AlertTitle>Error Loading Assets</AlertTitle>
            {error}
            <Button
              size="small"
              onClick={handleRefresh}
              sx={{ mt: 1 }}
              startIcon={<Refresh />}
            >
              Try Again
            </Button>
          </Alert>
        </Fade>
      )}

      {/* Search + Filter */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          p: 2,
          mb: 3,
          bgcolor: "#fff",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            fullWidth
            size="small"
            placeholder={
              isTeam
                ? "Search my clones by name, ID, or location..."
                : "Search assets by name, ID, category, or location..."
            }
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: C.text.disabled, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <ClearAll sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                "& fieldset": { borderColor: C.border },
              },
            }}
          />
          <FormControl sx={{ minWidth: 200, flexShrink: 0 }}>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(0);
              }}
              size="small"
              displayEmpty
              startAdornment={
                <FilterList
                  sx={{ mr: 1, fontSize: 18, color: C.text.disabled }}
                />
              }
              sx={{
                borderRadius: 2,
                bgcolor: C.surface,
                "& fieldset": { borderColor: C.border },
              }}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(search || category !== "All Categories") && (
            <Button
              size="small"
              onClick={handleClearFilters}
              startIcon={<ClearAll />}
              sx={{ whiteSpace: "nowrap" }}
            >
              Clear Filters
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Table View */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        <TableContainer
          sx={{ maxHeight: "calc(100vh - 350px)", overflowX: "auto" }}
        >
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: C.surface }}>
                <TableCell
                  sx={{ fontWeight: 700, color: C.text.primary, fontSize: 12 }}
                >
                  Asset
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.text.primary, fontSize: 12 }}
                >
                  Asset ID
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.text.primary, fontSize: 12 }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.text.primary, fontSize: 12 }}
                >
                  Location
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.text.primary, fontSize: 12 }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.text.primary, fontSize: 12 }}
                >
                  Health
                </TableCell>
                {isAdmin && (
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: C.text.primary,
                      fontSize: 12,
                    }}
                  >
                    Created By
                  </TableCell>
                )}
                <TableCell
                  sx={{ fontWeight: 700, color: C.text.primary, fontSize: 12 }}
                >
                  Clone Info
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: C.text.primary, fontSize: 12 }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <LoadingSkeleton />
              ) : paginatedAssets.length === 0 ? (
                <EmptyState />
              ) : (
                paginatedAssets.map((asset) => {
                  const canClone = canAssetBeCloned(asset);

                  return (
                    <TableRow
                      key={asset._id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: C.surface },
                        opacity: canClone ? 1 : 0.7,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: C.primaryLight,
                              color: C.primary,
                            }}
                          >
                            {getCategoryIcon(asset.assetCategory)}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: 13,
                                color: C.text.primary,
                              }}
                            >
                              {asset.assetName}
                            </Typography>
                            {!canClone && !asset.isClone && (
                              <Chip
                                label="Cannot Clone"
                                size="small"
                                sx={{
                                  mt: 0.5,
                                  height: 18,
                                  fontSize: "9px",
                                  bgcolor: C.errorBg,
                                  color: C.error,
                                }}
                              />
                            )}
                            {asset.isClone && (
                              <Chip
                                label="Clone"
                                size="small"
                                sx={{
                                  mt: 0.5,
                                  height: 18,
                                  fontSize: "9px",
                                  bgcolor: C.infoBg,
                                  color: C.info,
                                }}
                              />
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: C.text.secondary,
                            fontFamily: "monospace",
                          }}
                        >
                          {asset.assetId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={asset.assetCategory || "N/A"}
                          size="small"
                          sx={{
                            bgcolor: C.surface,
                            color: C.text.secondary,
                            fontSize: "11px",
                            height: 24,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <LocationOn
                            sx={{ fontSize: 14, color: C.text.disabled }}
                          />
                          <Typography
                            sx={{ fontSize: 12, color: C.text.secondary }}
                          >
                            {asset.currentLocation || "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={asset.status} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: 80 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={asset.healthScore || 0}
                              sx={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                bgcolor: C.border,
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: getHealthColor(
                                    asset.healthScore || 0,
                                  ),
                                },
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: C.text.secondary,
                              }}
                            >
                              {asset.healthScore || 0}%
                            </Typography>
                          </Stack>
                        </Box>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                fontSize: "10px",
                                bgcolor: C.primaryLight,
                                color: C.primary,
                              }}
                            >
                              {getCreatorName(asset).charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography
                                sx={{ fontSize: 11, fontWeight: 500 }}
                              >
                                {getCreatorName(asset)}
                              </Typography>
                              <RoleBadge role={asset.createdBy?.role} />
                            </Box>
                          </Stack>
                        </TableCell>
                      )}
                      <TableCell>
                        {asset.isClone ? (
                          <Chip
                            icon={<ContentCopy sx={{ fontSize: 12 }} />}
                            label="Clone Asset"
                            size="small"
                            sx={{
                              bgcolor: C.infoBg,
                              color: C.info,
                              fontSize: "10px",
                              height: 22,
                            }}
                          />
                        ) : asset.cloneSource ? (
                          <Tooltip
                            title={`Cloned from ${asset.cloneSource?.assetName || "unknown"}`}
                          >
                            <Chip
                              icon={<Info sx={{ fontSize: 12 }} />}
                              label="Has Clone Source"
                              size="small"
                              sx={{
                                bgcolor: C.warningBg,
                                color: C.warning,
                                fontSize: "10px",
                                height: 22,
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <Chip
                            label="Original"
                            size="small"
                            sx={{
                              bgcolor: C.successBg,
                              color: C.success,
                              fontSize: "10px",
                              height: 22,
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewAsset(asset)}
                              sx={{
                                bgcolor: C.surface,
                                "&:hover": { bgcolor: C.border },
                              }}
                            >
                              <Visibility
                                sx={{ fontSize: 18, color: C.text.secondary }}
                              />
                            </IconButton>
                          </Tooltip>

                          {canClone && (
                            <Tooltip title="Clone Asset">
                              <IconButton
                                size="small"
                                onClick={() => handleCloneClick(asset)}
                                sx={{
                                  bgcolor: C.primaryLight,
                                  "&:hover": {
                                    bgcolor: C.primaryDark,
                                    "& svg": { color: "#fff" },
                                  },
                                }}
                              >
                                <ContentCopy
                                  sx={{ fontSize: 18, color: C.primary }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}

                          {!canClone && asset.isClone && (
                            <Tooltip title="Cannot clone - Already a clone">
                              <IconButton size="small" disabled>
                                <Delete
                                  sx={{ fontSize: 18, color: C.text.disabled }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredAssets.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredAssets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              borderTop: `1px solid ${C.border}`,
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: 12,
                },
            }}
          />
        )}
      </Paper>

      {/* Clone Confirmation Dialog */}
      <Dialog
        open={cloneDialogOpen}
        onClose={() => !cloning && setCloneDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${C.border}`, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: C.primary }}>
            Clone Asset
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 2, color: C.text.secondary }}>
            Are you sure you want to clone{" "}
            <strong>"{selectedAsset?.assetName}"</strong>?
            {isTeam &&
              " The cloned asset will be associated with your account."}
          </DialogContentText>

          {cloneError && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 2 }}
              onClose={() => setCloneError(null)}
            >
              {cloneError}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Clone Note (Optional)"
            fullWidth
            multiline
            rows={3}
            value={cloneNote}
            onChange={(e) => setCloneNote(e.target.value)}
            placeholder="Add a note about why you're cloning this asset..."
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />

          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            <Typography variant="caption">
              Cloning will create a new asset with the same properties. The
              original asset will remain unchanged.
              {isTeam &&
                " Your clone will be visible in 'My Cloned Assets' after creation."}
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
          <Button
            onClick={() => setCloneDialogOpen(false)}
            disabled={cloning}
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClone}
            variant="contained"
            disabled={cloning}
            startIcon={
              cloning ? <CircularProgress size={18} /> : <ContentCopy />
            }
            sx={{
              bgcolor: C.primary,
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: C.primaryDark },
            }}
          >
            {cloning ? "Cloning..." : "Confirm Clone"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2, minWidth: 300 }}
        >
          {snackbar.severity === "success" && <AlertTitle>Success</AlertTitle>}
          {snackbar.severity === "error" && <AlertTitle>Error</AlertTitle>}
          {snackbar.severity === "warning" && <AlertTitle>Notice</AlertTitle>}
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
