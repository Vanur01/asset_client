// AssetManagement.jsx (Updated - Role-based Asset Request Navigation)
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
  Assignment,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAsset } from "../context/AssetContext";
import { useAuth } from "../context/AuthContexts";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const theme = createTheme({
  palette: {
    primary: { main: "#1a5c6b" },
    secondary: { main: "#2e7d32" },
    background: { default: "#f0f2f5" },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontSize: 13,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 20 },
      },
    },
  },
});

const statusConfig = {
  Active: {
    bg: "#1a3a4a",
    color: "#fff",
    icon: <CheckCircle sx={{ fontSize: 12 }} />,
  },
  "In Maintenance": {
    bg: "#b8d8e8",
    color: "#1a3a4a",
    icon: <Settings sx={{ fontSize: 12 }} />,
  },
  Retired: {
    bg: "#4a4a5a",
    color: "#fff",
    icon: <Cancel sx={{ fontSize: 12 }} />,
  },
  "In Transit": {
    bg: "#e67e22",
    color: "#fff",
    icon: <Schedule sx={{ fontSize: 12 }} />,
  },
  Reserved: {
    bg: "#3498db",
    color: "#fff",
    icon: <AssignmentTurnedIn sx={{ fontSize: 12 }} />,
  },
  "Under Repair": {
    bg: "#c0392b",
    color: "#fff",
    icon: <Warning sx={{ fontSize: 12 }} />,
  },
};

const StatusChip = ({ status }) => {
  const cfg = statusConfig[status] || { bg: "#eee", color: "#333", icon: null };
  return (
    <Chip
      label={status}
      size="small"
      icon={cfg.icon}
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 600,
        fontSize: 11.5,
        height: 28,
        borderRadius: "20px",
        px: 0.5,
        "& .MuiChip-icon": { fontSize: 14, color: cfg.color },
      }}
    />
  );
};

const AssetCard = ({ asset, onView, onClone }) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #e8eaed",
      borderRadius: 4,
      p: 3,
      height: "100%",
      width: "365px",
      bgcolor: "#fff",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        transform: "translateY(-2px)",
      },
      cursor: "pointer",
      position: "relative",
    }}
    onClick={() => onView(asset)}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      mb={0.5}
    >
      <Typography
        fontWeight={700}
        fontSize={15.5}
        color="#1a1a2e"
        sx={{ lineHeight: 1.3, flex: 1, mr: 1 }}
      >
        {asset.assetName}
      </Typography>
      <StatusChip status={asset.status} />
    </Stack>

    <Typography fontSize={11} color="#999" mb={1}>
      ID: {asset.assetId}
    </Typography>

    <Stack direction="row" alignItems="center" spacing={0.3} mb={2}>
      <LocationOn sx={{ fontSize: 14, color: "#aaa" }} />
      <Typography fontSize={12.5} color="#888" noWrap>
        {asset.currentLocation || "No location specified"}
      </Typography>
    </Stack>

    <Divider sx={{ mb: 2, borderColor: "#f0f2f5" }} />

    <Stack spacing={1.2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize={12.5} color="#999">
          Category:
        </Typography>
        <Typography fontSize={12.5} fontWeight={600} color="#1a1a2e">
          {asset.assetCategory}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize={12.5} color="#999">
          Condition:
        </Typography>
        <Typography fontSize={12.5} fontWeight={600} color="#1a1a2e">
          {asset.assetCondition || "N/A"}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize={12.5} color="#999">
          Purchase Cost:
        </Typography>
        <Typography fontSize={12.5} fontWeight={600} color="#1a5c6b">
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
          <Typography fontSize={12.5} color="#999">
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
            <Typography fontSize={12.5} fontWeight={600}>
              {asset.healthScore}%
            </Typography>
          </Box>
        </Stack>
      )}
    </Stack>

    <Stack
      direction="row"
      spacing={1}
      sx={{ mt: 2, pt: 1, borderTop: "1px solid #f0f2f5" }}
    >
      <Tooltip title="Clone Asset">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onClone(asset);
          }}
          sx={{ bgcolor: "#f5f5f5", "&:hover": { bgcolor: "#e0e0e0" } }}
        >
          <ContentCopy fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="View Details">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onView(asset);
          }}
          sx={{ bgcolor: "#f5f5f5", "&:hover": { bgcolor: "#e0e0e0" } }}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      <Box sx={{ flex: 1 }} />
      <Typography fontSize={11} color="#ccc" sx={{ alignSelf: "center" }}>
        Click to view
      </Typography>
    </Stack>
  </Paper>
);

export default function AssetManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { assets, pagination, getAllAssets, cloneAsset } = useAsset();

  // Role-based navigation for asset requests
  const handleAssetRequests = () => {
    const userRole = user?.role;
    if (userRole === "admin") {
      navigate("/admin/asset-requests");
    } else if (userRole === "team") {
      navigate("/admin/my-requests");
    } else {
      // Default to admin view if role is not recognized
      navigate("/admin/asset-requests");
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [page, rowsPerPage, orderBy, order, category, status, condition]);

  const fetchAssets = async () => {
    setLoading(true);
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
        message: "Failed to fetch assets",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchAssets();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCloneAsset = async () => {
    if (!selectedAsset) return;
    setLoading(true);
    try {
      const cloneData = {
        assetName: `${selectedAsset.assetName} (Clone)`,
        description: selectedAsset.description,
        currentLocation: selectedAsset.currentLocation,
        status: "Active",
      };

      const result = await cloneAsset(selectedAsset._id, cloneData);

      if (result && result.success) {
        setSnackbar({
          open: true,
          message: "Asset cloned successfully",
          severity: "success",
        });
        await fetchAssets();
        setCloneDialogOpen(false);
        setSelectedAsset(null);
      } else {
        throw new Error(result?.message || "Failed to clone asset");
      }
    } catch (error) {
      console.error("Clone error:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to clone asset",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCloneDialog = (asset) => {
    setSelectedAsset(asset);
    setCloneDialogOpen(true);
  };

  const handleViewAsset = (asset) => {
    const userRole = user?.role;
    if (userRole === "team") {
      navigate(`/team/assets/view/${asset._id}`);
    } else {
      navigate(`/admin/assets/view/${asset._id}`);
    }
  };

  const handleAddAsset = () => {
    const userRole = user?.role;
    if (userRole === "team") {
      navigate("/team/assets/add");
    } else {
      navigate("/admin/assets/add");
    }
  };

  const handleClonePage = () => {
    const userRole = user?.role;
    if (userRole === "team") {
      navigate("/team/assets/clone");
    } else {
      navigate("/admin/assets/clone");
    }
  };

  const handleExportToExcel = () => {
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

  // Check if user has access to asset management
  const userRole = user?.role;
  const isTeamUser = userRole === "team";
  const isAdminUser = userRole === "admin" || userRole === "super_admin";

  // Team users should not see certain buttons or have limited access
  const showAssetRequests = isAdminUser || isTeamUser;

  return (
    <ThemeProvider theme={theme}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Box sx={{ minHeight: "100vh", p: { xs: 2, sm: 3 } }}>
        {/* Page Header */}
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
              fontSize={{ xs: 20, sm: 22 }}
              color="#1a1a2e"
            >
              Asset Management
            </Typography>
            <Typography fontSize={13} color="#888" mt={0.3}>
              Track and manage your assets and equipment •{" "}
              {pagination.total || 0} total assets
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            {showAssetRequests && (
              <Button
                variant="contained"
                startIcon={<Assignment />}
                onClick={handleAssetRequests}
                sx={{ bgcolor: "#1e3d67", borderRadius: 3, px: 2.5, py: 1 }}
              >
                Asset Requests
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<ContentCopy />}
              onClick={handleClonePage}
              sx={{
                bgcolor: "#6c757d",
                "&:hover": { bgcolor: "#5a6268" },
                borderRadius: 3,
                px: 2.5,
                py: 1,
              }}
            >
              Clone Asset
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddAsset}
              sx={{
                bgcolor: "#1a3a4a",
                "&:hover": { bgcolor: "#0f2530" },
                borderRadius: 3,
                px: 2.5,
                py: 1,
              }}
            >
              Add Asset
            </Button>
          </Stack>
        </Stack>

        {/* Search & Filter Bar */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e8eaed",
            borderRadius: 3,
            p: 2,
            mb: 3,
            bgcolor: "#fff",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            flexWrap="wrap"
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search by asset name, ID, or serial number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ flex: 2, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: "#bbb" }} />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch("")}>
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: "#fafbfc" },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              size="small"
              sx={{ minWidth: 100 }}
            >
              Search
            </Button>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" } }}
            />
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", md: 130 } }}
            >
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
                renderValue={(v) => v || "All Categories"}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Equipment">Equipment</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Vehicle">Vehicle</MenuItem>
                <MenuItem value="Machinery">Machinery</MenuItem>
                <MenuItem value="Tool">Tool</MenuItem>
                <MenuItem value="Furniture">Furniture</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", md: 120 } }}
            >
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                displayEmpty
                renderValue={(v) => v || "All Status"}
              >
                <MenuItem value="">All Status</MenuItem>
                {Object.keys(statusConfig).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", md: 120 } }}
            >
              <Select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                displayEmpty
                renderValue={(v) => v || "All Conditions"}
              >
                <MenuItem value="">All Conditions</MenuItem>
                <MenuItem value="Excellent">Excellent</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="Poor">Poor</MenuItem>
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
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" } }}
            />
            <Tooltip title="Export to Excel">
              <IconButton
                onClick={handleExportToExcel}
                size="small"
                sx={{ bgcolor: "#f5f5f5", borderRadius: 2 }}
              >
                <FileDownload fontSize="small" />
              </IconButton>
            </Tooltip>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" } }}
            />
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Grid View">
                <IconButton
                  size="small"
                  onClick={() => setViewMode("grid")}
                  sx={{
                    bgcolor: viewMode === "grid" ? "#1a3a4a" : "transparent",
                    color: viewMode === "grid" ? "#fff" : "#888",
                    borderRadius: 2,
                  }}
                >
                  <GridView fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="List View">
                <IconButton
                  size="small"
                  onClick={() => setViewMode("list")}
                  sx={{
                    bgcolor: viewMode === "list" ? "#1a3a4a" : "transparent",
                    color: viewMode === "list" ? "#fff" : "#888",
                    borderRadius: 2,
                  }}
                >
                  <ViewList fontSize="small" />
                </IconButton>
              </Tooltip>
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
                  height={350}
                  sx={{ borderRadius: 4 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Asset Display - Grid View */}
        {!loading && viewMode === "grid" && (
          <>
            <Grid container spacing={2.5}>
              {assets.map((asset) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={asset._id}>
                  <AssetCard
                    asset={asset}
                    onView={handleViewAsset}
                    onClone={openCloneDialog}
                  />
                </Grid>
              ))}
            </Grid>
            {assets.length === 0 && (
              <Box textAlign="center" py={8}>
                <Typography color="#bbb" fontSize={14}>
                  No assets found matching your filters.
                </Typography>
                <Button onClick={clearFilters} sx={{ mt: 2 }}>
                  Clear Filters
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Asset Display - List View */}
        {!loading && viewMode === "list" && (
          <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3 }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
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
                    <TableCell>Asset ID</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Health Score</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow
                      hover
                      key={asset._id}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleViewAsset(asset)}
                    >
                      <TableCell>
                        <Typography fontWeight={600} fontSize={13}>
                          {asset.assetName}
                        </Typography>
                        <Typography fontSize={11} color="#999">
                          {asset.serialNumber || "No SN"}
                        </Typography>
                      </TableCell>
                      <TableCell>{asset.assetId}</TableCell>
                      <TableCell>
                        <Chip
                          label={asset.assetCategory}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <LocationOn sx={{ fontSize: 12, color: "#aaa" }} />
                          <Typography
                            fontSize={12}
                            noWrap
                            sx={{ maxWidth: 150 }}
                          >
                            {asset.currentLocation || "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={asset.status} />
                      </TableCell>
                      <TableCell>{asset.assetCondition || "N/A"}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={asset.healthScore || 0}
                            sx={{ width: 50, height: 4, borderRadius: 2 }}
                          />
                          <Typography fontSize={12}>
                            {asset.healthScore || 0}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip title="Clone">
                          <IconButton
                            size="small"
                            onClick={() => openCloneDialog(asset)}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
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
              size="large"
            />
          </Box>
        )}

        {/* Clone Confirmation Dialog */}
        <Dialog
          open={cloneDialogOpen}
          onClose={() => setCloneDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Confirm Clone</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to clone "{selectedAsset?.assetName}"? A new
              asset will be created with similar properties.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCloneDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCloneAsset}
              variant="contained"
              sx={{ bgcolor: "#1a3a4a" }}
            >
              Clone
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}