// pages/CloneAssetList.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Divider,
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAsset } from "../context/AssetContext";
import {
  ArrowBack,
  Search,
  LocationOn,
  KeyboardArrowDown,
} from "@mui/icons-material";

// ── Status chip — matches screenshot colors exactly ──────────────────────────
const getStatusStyle = (status) => {
  const s = (status || "").toLowerCase().replace(/\s+/g, "");
  if (s === "active" || s === "operational")
    return { bg: "#e8f5e9", color: "#2e7d32" };
  if (s === "underinspection" || s === "inspection")
    return { bg: "#e3f2fd", color: "#0277bd" };
  if (s === "underreview" || s === "review")
    return { bg: "#fff8e1", color: "#f59e0b" };
  if (s === "maintenance" || s === "inmaintenance")
    return { bg: "#fce4ec", color: "#e91e63" };
  if (s === "retired")
    return { bg: "#ffebee", color: "#d32f2f" };
  if (s === "intransit" || s === "transit")
    return { bg: "#e3f2fd", color: "#0288d1" };
  if (s === "reserved")
    return { bg: "#f3e5f5", color: "#7b1fa2" };
  return { bg: "#f5f5f5", color: "#666" };
};

const StatusChip = ({ label }) => {
  const { bg, color } = getStatusStyle(label);
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        borderRadius: "20px",
        fontWeight: 600,
        fontSize: "12px",
        height: 26,
        bgcolor: bg,
        color,
        flexShrink: 0,
      }}
    />
  );
};

// ── Info row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography sx={{ fontSize: 13, color: "#9e9e9e" }}>{label}</Typography>
    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>
      {value || "N/A"}
    </Typography>
  </Stack>
);

// ── Asset Card ────────────────────────────────────────────────────────────────
const AssetCard = ({ asset, onClone }) => {
  const lastInspection = (() => {
    const histories = [
      ...(asset.inspectionSystems?.amcInspection?.inspectionHistory || []),
      ...(asset.inspectionSystems?.camcInspection?.inspectionHistory || []),
    ];
    if (!histories.length) return null;
    const sorted = histories.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted[0]?.date ? sorted[0].date.split("T")[0] : null;
  })();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #ececec",
        height: "100%",
        display: "flex",
        width:"360px",
        flexDirection: "column",
        bgcolor: "#fff",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
      }}
    >
      <CardContent sx={{ p: 3, pb: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title + Status */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1a1a2e",
              flex: 1,
              pr: 1,
              lineHeight: 1.3,
            }}
          >
            {asset.assetName}
          </Typography>
          <StatusChip label={asset.status} />
        </Stack>

        {/* Location */}
        <Stack direction="row" alignItems="center" spacing={0.5} mb={2.5}>
          <LocationOn sx={{ fontSize: 15, color: "#9e9e9e" }} />
          <Typography sx={{ fontSize: 13, color: "#9e9e9e" }}>
            {asset.currentLocation || "No location"}
          </Typography>
        </Stack>

        {/* Info rows */}
        <Stack spacing={1.2} flex={1}>
          <InfoRow label="Asset ID:" value={asset.assetId} />
          <InfoRow label="Category:" value={asset.assetCategory} />
          <InfoRow label="Last Inspection:" value={lastInspection} />
        </Stack>

        {/* Divider + Clone Button */}
        <Divider sx={{ mt: 2.5, mb: 2 }} />
        <Button
          fullWidth
          variant="outlined"
          onClick={() => onClone(asset)}
          sx={{
            borderRadius: "10px",
            border: "1px solid #e0e0e0",
            color: "#1a1a2e",
            bgcolor: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
            py: 1.2,
            "&:hover": { bgcolor: "#f5f5f5", borderColor: "#bdbdbd" },
          }}
        >
          Clone Asset
        </Button>
      </CardContent>
    </Card>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function CloneAssets() {
  const navigate = useNavigate();
  const { assets, getAllAssets, cloneAsset, loading } = useAsset();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [cloning, setCloning] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      await getAllAssets({ limit: 100 });
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const categories = [
    "All Categories",
    ...new Set(assets.map((a) => a.assetCategory).filter(Boolean)),
  ];

  const filteredAssets = assets.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      a.assetName?.toLowerCase().includes(q) ||
      a.assetId?.toLowerCase().includes(q) ||
      a.currentLocation?.toLowerCase().includes(q);
    const matchCat =
      category === "All Categories" || a.assetCategory === category;
    return matchSearch && matchCat;
  });

  const handleCloneClick = (asset) => {
    setSelectedAsset(asset);
    setCloneDialogOpen(true);
  };

  const handleCloneConfirm = async () => {
    if (!selectedAsset) return;
    setCloning(true);
    try {
      const result = await cloneAsset(selectedAsset._id);
      if (result.success) {
        setSnackbar({
          open: true,
          message: `"${selectedAsset.assetName}" cloned successfully!`,
          severity: "success",
        });
        setCloneDialogOpen(false);
        setSelectedAsset(null);
        fetchAssets();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to clone asset",
        severity: "error",
      });
    } finally {
      setCloning(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fc", p: { xs: 2, md: 4 } }}>
      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
        <IconButton
          onClick={() => navigate("/admin/assets")}
          sx={{
            bgcolor: "#fff",
            border: "1px solid #eee",
            borderRadius: 2,
            width: 36,
            height: 36,
          }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2 }}>
            Clone Assets
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#9e9e9e", mt: 0.3 }}>
            Select an asset to clone with all its details
          </Typography>
        </Box>
      </Stack>

      {/* ── Search + Filter ── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={4}
        sx={{
          bgcolor: "#fff",
          border: "1px solid #eee",
          borderRadius: 3,
          p: 1.5,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search assets by name, ID, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#bdbdbd", fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "8px",
              bgcolor: "transparent",
              "& fieldset": { border: "none" },
              fontSize: 14,
            },
          }}
        />
        <FormControl sx={{ minWidth: 180, flexShrink: 0 }}>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            IconComponent={KeyboardArrowDown}
            size="small"
            sx={{
              borderRadius: "8px",
              bgcolor: "#f7f8fc",
              fontSize: 14,
              "& fieldset": { border: "1px solid #eee" },
            }}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c} sx={{ fontSize: 14 }}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* ── Skeleton Loading ── */}
      {loading && (
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={240} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Asset Grid ── */}
      {!loading && filteredAssets.length > 0 && (
        <Grid container spacing={2.5}>
          {filteredAssets.map((asset) => (
            <Grid item xs={12} sm={6} md={4} key={asset._id}>
              <AssetCard asset={asset} onClone={handleCloneClick} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Empty State ── */}
      {!loading && filteredAssets.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            color: "#bdbdbd",
          }}
        >
          <Typography fontSize={15}>No assets found matching your search.</Typography>
        </Box>
      )}

      {/* ── Clone Confirmation Dialog ── */}
      <Dialog
        open={cloneDialogOpen}
        onClose={() => !cloning && setCloneDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16, pb: 1 }}>
          Confirm Clone
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14 }}>
            Are you sure you want to clone{" "}
            <strong>"{selectedAsset?.assetName}"</strong>? A new asset will be
            created with similar properties.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setCloneDialogOpen(false)}
            disabled={cloning}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCloneConfirm}
            variant="contained"
            disabled={cloning}
            sx={{
              bgcolor: "#1a3a4a",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              minWidth: 100,
              "&:hover": { bgcolor: "#0f2836" },
            }}
          >
            {cloning ? (
              <CircularProgress size={18} sx={{ color: "#fff" }} />
            ) : (
              "Clone"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}