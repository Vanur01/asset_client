// AssetManagement.jsx - Unified version for both Admin and Team with fixed navigation

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Stack,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Pagination,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  LinearProgress,
  useMediaQuery,
  useTheme,
  Fade,
} from "@mui/material";
import {
  Search,
  LocationOn,
  ContentCopy,
  Visibility,
  Add,
  GridView,
  ViewList,
  CheckCircle,
  Cancel,
  Warning,
  AssignmentTurnedIn,
  Schedule,
  Settings,
  Close,
  ClearAll,
  FileDownload,
  RateReview,
  Block,
  Info,
} from "@mui/icons-material";
import { useAsset } from "../context/AssetContext";
import { useAuth } from "../context/AuthContexts";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

// Consistent Palette
const C = {
  primary: "#0d4a5c",
  primaryDark: "#0a3a49",
  primaryLight: "#e8f2f5",
  success: "#16a34a",
  successBg: "#dcfce7",
  surface: "#f1f4f8",
  card: "#ffffff",
  border: "#e2e8f0",
  error: "#d32f2f",
  warning: "#f59e0b",
  warningBg: "#fef3c7",
  info: "#0284c7",
  infoBg: "#e0f2fe",
  text: { primary: "#1e293b", secondary: "#64748b", disabled: "#94a3b8" },
};

// Status Configuration
const statusConfig = {
  Active: {
    bg: C.successBg,
    color: C.success,
    icon: <CheckCircle sx={{ fontSize: 12 }} />,
  },
  "In Maintenance": {
    bg: "#dbeafe",
    color: "#1d4ed8",
    icon: <Settings sx={{ fontSize: 12 }} />,
  },
  Retired: {
    bg: "#f1f5f9",
    color: C.text.disabled,
    icon: <Cancel sx={{ fontSize: 12 }} />,
  },
  "In Transit": {
    bg: "#fef3c7",
    color: "#d97706",
    icon: <Schedule sx={{ fontSize: 12 }} />,
  },
  Reserved: {
    bg: "#e0f2fe",
    color: "#0891b2",
    icon: <AssignmentTurnedIn sx={{ fontSize: 12 }} />,
  },
  "Under Repair": {
    bg: "#ffebea",
    color: C.error,
    icon: <Warning sx={{ fontSize: 12 }} />,
  },
  "Pending Approval": {
    bg: "#fef3c7",
    color: "#d97706",
    icon: <Schedule sx={{ fontSize: 12 }} />,
  },
};

const StatusChip = ({ status }) => {
  const cfg = statusConfig[status] || {
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
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 600,
        fontSize: "0.72rem",
        height: 24,
        borderRadius: "20px",
        "& .MuiChip-icon": { fontSize: 14, color: cfg.color },
      }}
    />
  );
};

// Asset Card Component
const AssetCard = ({ asset, onView, onClone, isAdmin }) => {
  const canClone = !asset.isClone && asset.canBeCloned !== false;

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${C.border}`,
        borderRadius: 3,
        p: 2.5,
        height: "100%",
        width: "378px",
        bgcolor: C.card,
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        opacity: asset.isClone ? 0.85 : 1,
        position: "relative",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
      onClick={() => onView(asset)}
    >
      {/* Clone Badge */}
      {asset.isClone && (
        <Chip
          label="Clone"
          size="small"
          icon={<ContentCopy sx={{ fontSize: 12 }} />}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: C.infoBg,
            color: C.info,
            fontSize: "0.6rem",
            height: 20,
            fontWeight: 600,
          }}
        />
      )}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1}
        pr={asset.isClone ? 6 : 0}
      >
        <Typography
          fontWeight={700}
          fontSize="0.95rem"
          color={C.text.primary}
          sx={{ flex: 1, mr: 1 }}
        >
          {asset.assetName}
        </Typography>
        <StatusChip status={asset.status} />
      </Stack>

      <Typography fontSize="0.7rem" color={C.text.disabled} mb={1.5}>
        ID: {asset.assetId}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={0.5} mb={2}>
        <LocationOn sx={{ fontSize: 14, color: C.text.disabled }} />
        <Typography fontSize="0.75rem" color={C.text.secondary} noWrap>
          {asset.currentLocation || "No location specified"}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2, borderColor: C.border }} />

      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize="0.7rem" color={C.text.disabled}>
            Category:
          </Typography>
          <Typography
            fontSize="0.75rem"
            fontWeight={600}
            color={C.text.primary}
          >
            {asset.assetCategory}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize="0.7rem" color={C.text.disabled}>
            Condition:
          </Typography>
          <Typography
            fontSize="0.75rem"
            fontWeight={600}
            color={C.text.primary}
          >
            {asset.assetCondition || "N/A"}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize="0.7rem" color={C.text.disabled}>
            Purchase Cost:
          </Typography>
          <Typography fontSize="0.75rem" fontWeight={600} color={C.primary}>
            {asset.purchaseCost
              ? `$${asset.purchaseCost.toLocaleString()}`
              : "N/A"}
          </Typography>
        </Stack>
        {asset.healthScore && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontSize="0.7rem" color={C.text.disabled}>
              Health Score:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={asset.healthScore}
                sx={{ width: 60, height: 4, borderRadius: 2 }}
                color={
                  asset.healthScore > 70
                    ? "success"
                    : asset.healthScore > 40
                      ? "warning"
                      : "error"
                }
              />
              <Typography fontSize="0.75rem" fontWeight={600}>
                {asset.healthScore}%
              </Typography>
            </Box>
          </Stack>
        )}
        {asset.isClone && asset.clonedFrom && (
          <Typography
            fontSize="0.65rem"
            color={C.text.disabled}
            sx={{ mt: 0.5 }}
          >
            Cloned from:{" "}
            {typeof asset.clonedFrom === "object"
              ? asset.clonedFrom.assetName
              : asset.clonedFrom}
          </Typography>
        )}
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${C.border}` }}
      >
        <Tooltip
          title={
            canClone
              ? "Clone Asset"
              : "Cannot clone - This asset is already a clone"
          }
        >
          <span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (canClone) onClone(asset);
              }}
              disabled={!canClone}
              sx={{
                bgcolor: canClone ? C.surface : "#f5f5f5",
                opacity: canClone ? 1 : 0.5,
              }}
            >
              <ContentCopy
                sx={{
                  fontSize: "0.9rem",
                  color: canClone ? C.text.secondary : C.text.disabled,
                }}
              />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onView(asset);
            }}
            sx={{ bgcolor: C.surface, "&:hover": { bgcolor: C.border } }}
          >
            <Visibility sx={{ fontSize: "0.9rem", color: C.text.secondary }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default function AssetManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [condition, setCondition] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [cloneName, setCloneName] = useState("");
  const [cloneAssetId, setCloneAssetId] = useState("");
  const [cloneTagNumber, setCloneTagNumber] = useState("");
  const [cloning, setCloning] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { assets, pagination, loading, getAllAssets, cloneAsset } = useAsset();
  const userRole = user?.role;
  const isAdminUser = userRole === "admin" || userRole === "super_admin";
  const isTeamUser = userRole === "team";

  const fetchAssets = useCallback(async () => {
    try {
      const filters = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: orderBy,
        sortOrder: order,
        assetCategory: category || undefined,
        status: status || undefined,
        assetCondition: condition || undefined,
        search: search || undefined,
      };
      await getAllAssets(filters);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to fetch assets",
        severity: "error",
      });
    }
  }, [
    getAllAssets,
    page,
    rowsPerPage,
    orderBy,
    order,
    category,
    status,
    condition,
    search,
  ]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleSearch = () => {
    setPage(0);
    fetchAssets();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // FIXED: Navigation functions with correct paths
  const handleViewAsset = (asset) => {
    navigate(`/admin/assets/view/${asset._id}`);
  };

  const handleAddAsset = () => {
    navigate("/admin/assets/add");
  };

  const handleAssetRequests = () => {
    navigate("/admin/asset-requests");
  };

  const handleCloneClick = (asset) => {
    if (asset.isClone) {
      setSnackbar({
        open: true,
        message: "Cannot clone an asset that is already a clone",
        severity: "warning",
      });
      return;
    }
    setSelectedAsset(asset);
    setCloneName(`${asset.assetName} (Clone)`);
    setCloneAssetId(`AST-CLONE-${Date.now()}`);
    setCloneTagNumber(`TAG-CLONE-${Date.now()}`);
    setCloneDialogOpen(true);
  };

  const handleCloneAsset = async () => {
    if (!selectedAsset) return;
    if (selectedAsset.isClone) {
      setSnackbar({
        open: true,
        message: "Cannot clone an asset that is already a clone",
        severity: "error",
      });
      setCloneDialogOpen(false);
      return;
    }

    setCloning(true);
    try {
      const cloneData = {
        assetName: cloneName.trim(),
        assetId: cloneAssetId.trim() || undefined,
        tagNumber: cloneTagNumber.trim() || undefined,
        status: "Active",
        description:
          selectedAsset.description || `Clone of ${selectedAsset.assetName}`,
        currentLocation: selectedAsset.currentLocation,
      };
      const result = await cloneAsset(selectedAsset._id, cloneData);
      if (result && (result.success !== false || result.data)) {
        setSnackbar({
          open: true,
          message: `"${selectedAsset.assetName}" cloned successfully!`,
          severity: "success",
        });
        setCloneDialogOpen(false);
        setSelectedAsset(null);
        setCloneName("");
        setCloneAssetId("");
        setCloneTagNumber("");
        await fetchAssets();
      } else {
        throw new Error(result?.message || "Failed to clone asset");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to clone asset",
        severity: "error",
      });
    } finally {
      setCloning(false);
    }
  };

  const handleExportToExcel = () => {
    try {
      const exportData = assets.map((asset) => ({
        "Asset ID": asset.assetId,
        "Asset Name": asset.assetName,
        Category: asset.assetCategory,
        Status: asset.status,
        Condition: asset.assetCondition,
        Location: asset.currentLocation,
        "Serial Number": asset.serialNumber,
        "Purchase Cost": asset.purchaseCost,
        "Health Score": asset.healthScore,
        "Is Clone": asset.isClone ? "Yes" : "No",
        "Created At": new Date(asset.createdAt).toLocaleDateString(),
      }));
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Assets");
      XLSX.writeFile(
        wb,
        `assets_export_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      setSnackbar({
        open: true,
        message: "Export completed successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to export assets",
        severity: "error",
      });
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const clearFilters = () => {
    setCategory("");
    setStatus("");
    setCondition("");
    setSearch("");
    setPage(0);
    setTimeout(() => fetchAssets(), 100);
  };

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        spacing={2}
      >
        <Box>
          <Typography
            fontWeight={700}
            fontSize={{ xs: "1.25rem", sm: "1.35rem" }}
            color={C.text.primary}
          >
            Asset Management
          </Typography>
          <Typography fontSize="0.75rem" color={C.text.secondary} mt={0.5}>
            Track and manage your assets and equipment • {pagination.total || 0}{" "}
            total assets
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1.5}
          flexWrap="wrap"
          sx={{ gap: { xs: 1, sm: 1.5 } }}
        >
          <Button
            variant="contained"
            startIcon={<ContentCopy />}
            onClick={() => navigate("/admin/assets/clone")}
            sx={{
              bgcolor: C.primary,
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              textTransform: "none",
              borderRadius: 2,
              py: 0.8,
            }}
          >
            {!isMobile ? "Clone Asset" : "Clone"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RateReview />}
            onClick={handleAssetRequests}
            sx={{
              borderColor: C.primary,
              color: C.primary,
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              textTransform: "none",
              borderRadius: 2,
              py: 0.8,
            }}
          >
            {!isMobile ? "Asset Requests" : "Requests"}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddAsset}
            sx={{
              bgcolor: C.primary,
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              textTransform: "none",
              borderRadius: 2,
              py: 0.8,
            }}
          >
            {!isMobile ? "Add New Asset" : "Add Asset"}
          </Button>
        </Stack>
      </Stack>

      {/* Info Banner */}
      <Fade in={true}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: C.infoBg,
            borderRadius: 2,
            p: 1.5,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Info sx={{ fontSize: 18, color: C.info }} />
          <Typography fontSize="0.75rem" color={C.info}>
            Note: Only original assets can be cloned. Cloned assets cannot be
            cloned again.
          </Typography>
        </Paper>
      </Fade>

      {/* Search & Filter Bar */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          p: 2,
          mb: 3,
          bgcolor: C.card,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search by asset name, ID, or serial number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ flex: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: "1rem", color: C.text.disabled }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <Close sx={{ fontSize: "0.9rem" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            size="small"
            sx={{ bgcolor: C.primary, minWidth: 80 }}
          >
            Search
          </Button>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 130 } }}>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Categories</MenuItem>
              {[
                "Equipment",
                "IT",
                "Vehicle",
                "Machinery",
                "Tool",
                "Furniture",
                "Electrical",
              ].map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 120 } }}>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Status</MenuItem>
              {Object.keys(statusConfig).map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 120 } }}>
            <Select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Conditions</MenuItem>
              {["Excellent", "Normal", "Critical", "Poor"].map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(category || status || condition || search) && (
            <Button
              size="small"
              onClick={clearFilters}
              startIcon={<ClearAll />}
            >
              Clear
            </Button>
          )}

          <Tooltip title="Export to Excel">
            <IconButton
              onClick={handleExportToExcel}
              size="small"
              sx={{ bgcolor: C.surface, borderRadius: 2 }}
            >
              <FileDownload
                sx={{ fontSize: "1rem", color: C.text.secondary }}
              />
            </IconButton>
          </Tooltip>

          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => setViewMode("grid")}
              sx={{
                bgcolor: viewMode === "grid" ? C.primary : "transparent",
                color: viewMode === "grid" ? "#fff" : C.text.secondary,
              }}
            >
              <GridView sx={{ fontSize: "1rem" }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode("list")}
              sx={{
                bgcolor: viewMode === "list" ? C.primary : "transparent",
                color: viewMode === "list" ? "#fff" : C.text.secondary,
              }}
            >
              <ViewList sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton
                variant="rounded"
                height={320}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Grid View */}
      {!loading && viewMode === "grid" && (
        <>
          <Grid container spacing={2.5}>
            {assets.map((asset) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={asset._id}>
                <AssetCard
                  asset={asset}
                  onView={handleViewAsset}
                  onClone={handleCloneClick}
                  isAdmin={isAdminUser}
                />
              </Grid>
            ))}
          </Grid>
          {assets.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography color={C.text.disabled}>
                No assets found matching your filters.
              </Typography>
              <Button onClick={clearFilters} sx={{ mt: 2, color: C.primary }}>
                Clear Filters
              </Button>
            </Box>
          )}
        </>
      )}

      {/* List View */}
      {!loading && viewMode === "list" && (
        <Paper
          sx={{
            width: "100%",
            overflow: "auto",
            borderRadius: 3,
            border: `1px solid ${C.border}`,
          }}
        >
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "assetName"}
                      direction={orderBy === "assetName" ? order : "asc"}
                      onClick={() => handleSort("assetName")}
                    >
                      Asset Name
                    </TableSortLabel>
                  </TableCell>
                  {!isMobile && <TableCell>Asset ID</TableCell>}
                  <TableCell>Category</TableCell>
                  {!isMobile && <TableCell>Location</TableCell>}
                  <TableCell>Status</TableCell>
                  <TableCell>Health</TableCell>
                  <TableCell>Clone</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => {
                  const canClone =
                    !asset.isClone && asset.canBeCloned !== false;
                  return (
                    <TableRow
                      hover
                      key={asset._id}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleViewAsset(asset)}
                    >
                      <TableCell>
                        <Typography fontWeight={600} fontSize="0.8rem">
                          {asset.assetName}
                        </Typography>
                        {asset.isClone && (
                          <Chip
                            label="Clone"
                            size="small"
                            sx={{ fontSize: "0.6rem", height: 18, mt: 0.5 }}
                          />
                        )}
                      </TableCell>
                      {!isMobile && <TableCell>{asset.assetId}</TableCell>}
                      <TableCell>
                        <Chip
                          label={asset.assetCategory}
                          size="small"
                          sx={{ fontSize: "0.65rem", height: 22 }}
                        />
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <LocationOn
                              sx={{ fontSize: 12, color: C.text.disabled }}
                            />
                            <Typography fontSize="0.7rem" noWrap>
                              {asset.currentLocation || "N/A"}
                            </Typography>
                          </Stack>
                        </TableCell>
                      )}
                      <TableCell>
                        <StatusChip status={asset.status} />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={asset.healthScore || 0}
                            sx={{ width: 40, height: 3 }}
                          />
                          <Typography fontSize="0.7rem">
                            {asset.healthScore || 0}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {asset.isClone ? (
                          <Chip
                            icon={<Block />}
                            label="Cannot Clone"
                            size="small"
                            sx={{ fontSize: "0.65rem", height: 22 }}
                          />
                        ) : (
                          <Chip
                            icon={<ContentCopy />}
                            label="Cloneable"
                            size="small"
                            sx={{ bgcolor: C.successBg, color: C.success }}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip
                          title={
                            canClone
                              ? "Clone Asset"
                              : "Cannot clone - Already a clone"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={() =>
                                canClone && handleCloneClick(asset)
                              }
                              disabled={!canClone}
                            >
                              <ContentCopy
                                sx={{
                                  fontSize: "0.9rem",
                                  color: canClone ? C.primary : C.text.disabled,
                                }}
                              />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={pagination.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
      )}

      {/* Pagination for Grid View */}
      {!loading && viewMode === "grid" && pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={page + 1}
            onChange={(e, value) => setPage(value - 1)}
            color="primary"
          />
        </Box>
      )}

      {/* Clone Dialog */}
      <Dialog
        open={cloneDialogOpen}
        onClose={() => !cloning && setCloneDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: C.text.primary }}>
          Clone Asset
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ fontSize: "0.8rem", color: C.text.secondary, mb: 2 }}
          >
            Are you sure you want to clone "{selectedAsset?.assetName}"? A new
            asset will be created with similar properties.
          </DialogContentText>
          <TextField
            fullWidth
            label="Clone Asset Name *"
            value={cloneName}
            onChange={(e) => setCloneName(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
            required
            error={!cloneName.trim()}
            helperText={!cloneName.trim() ? "Asset name is required" : ""}
          />
          <TextField
            fullWidth
            label="Clone Asset ID (Optional)"
            value={cloneAssetId}
            onChange={(e) => setCloneAssetId(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
            placeholder="Auto-generated if left empty"
          />
          <TextField
            fullWidth
            label="Clone Tag Number (Optional)"
            value={cloneTagNumber}
            onChange={(e) => setCloneTagNumber(e.target.value)}
            size="small"
            sx={{ mb: 1 }}
            placeholder="Auto-generated if left empty"
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              After cloning, the original asset cannot be cloned again.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCloneDialogOpen(false)} disabled={cloning}>
            Cancel
          </Button>
          <Button
            onClick={handleCloneAsset}
            variant="contained"
            disabled={cloning || !cloneName.trim()}
            sx={{ bgcolor: C.primary }}
          >
            {cloning ? <CircularProgress size={20} /> : "Confirm Clone"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
