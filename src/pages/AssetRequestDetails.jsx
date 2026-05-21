// pages/AssetRequestDetails.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Avatar,
  IconButton,
  alpha,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ShareIcon from "@mui/icons-material/Share";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useAssetRequest } from "../context/AssetRequestContext";
import { useAuth } from "../context/AuthContexts";
import { useNavigate, useParams } from "react-router-dom";

const C = {
  navy: "#0f4c61",
  navyDark: "#0a3547",
  ink: "#1a2e3b",
  muted: "#64748b",
  ghost: "#94a3b8",
  border: "#e8edf2",
  white: "#ffffff",
  surface: "#f8fafc",
  green: "#16a34a",
  red: "#ef4444",
  amber: "#f59e0b",
  purple: "#7c3aed",
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "#fef3c7",
    color: "#d97706",
    border: "#fde68a",
  },
  approved: {
    label: "Approved",
    bg: "#dcfce7",
    color: "#16a34a",
    border: "#bbf7d0",
  },
  rejected: {
    label: "Rejected",
    bg: "#fee2e2",
    color: "#dc2626",
    border: "#fecaca",
  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 700,
        fontSize: "0.78rem",
        height: 28,
        borderRadius: "20px",
        border: `1px solid ${s.border}`,
        px: 1,
      }}
    />
  );
};

// Read-only display field
const InfoField = ({ label, value, fullWidth }) => (
  <Box sx={{ mb: 0 }}>
    <Typography
      sx={{ fontSize: "0.72rem", color: C.muted, fontWeight: 500, mb: 0.5 }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        bgcolor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 1.5,
        px: 1.5,
        py: 1,
        minHeight: 36,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontSize: "0.83rem", color: C.ink, fontWeight: 500 }}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

// Section wrapper matching screenshot style
const SectionCard = ({ title, icon, children, accentColor = C.navy }) => (
  <Paper
    elevation={0}
    sx={{
      border: `1px solid ${C.border}`,
      borderRadius: 2.5,
      overflow: "hidden",
      mb: 2,
    }}
  >
    <Box
      sx={{
        px: 2.5,
        py: 1.5,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {icon && <Box sx={{ color: accentColor, display: "flex" }}>{icon}</Box>}
      <Typography
        sx={{ fontSize: "0.88rem", fontWeight: 700, color: accentColor }}
      >
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 2.5 }}>{children}</Box>
  </Paper>
);

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRequesterName = (createdBy) => {
  if (!createdBy) return "Unknown";
  if (createdBy.firstName) {
    return `${createdBy.firstName} ${createdBy.lastName || ""}`.trim();
  }
  return createdBy.email?.split("@")[0] || "Unknown";
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const AssetRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRequestById, reviewRequest } = useAssetRequest();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadRequest = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRequestById(id);
      setRequest(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load request details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [id, getRequestById]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await reviewRequest(id, "approve");
      setSnackbar({
        open: true,
        message: "Request approved successfully!",
        severity: "success",
      });
      await loadRequest();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to approve",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      setSnackbar({
        open: true,
        message: "Please provide a rejection reason",
        severity: "error",
      });
      return;
    }
    setActionLoading(true);
    try {
      await reviewRequest(id, "reject", rejectionReason);
      setSnackbar({
        open: true,
        message: "Request rejected",
        severity: "success",
      });
      await loadRequest();
      setRejectDialogOpen(false);
      setRejectionReason("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to reject",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: C.navy }} />
      </Box>
    );
  }

  if (!request) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h6" color="text.secondary">
          Request not found
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const requesterName = getRequesterName(request.createdBy);
  const isParent = request.requestType === "parent";
  const isPending = request.requestStatus === "pending";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: C.surface }}>
      {/* Top Bar — matches screenshot */}
      <Box
        sx={{
          bgcolor: C.white,
          borderBottom: `1px solid ${C.border}`,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          width:"857px",
          ml:22,
          top: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            onClick={handleBack}
            sx={{ color: C.ink, "&:hover": { bgcolor: alpha(C.navy, 0.06) } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: 700, color: C.ink }}
            >
              {request.assetName}
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: C.muted }}>
              Asset details, classification, and category filters
            </Typography>
          </Box>
        </Box>
        <StatusBadge status={request.requestStatus} />
      </Box>

      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        {/* Requester Info Card — matches screenshot */}
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${C.border}`,
            borderRadius: 2.5,
            p: 2.5,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: isParent ? C.navy : C.purple,
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            {getInitials(requesterName)}
          </Avatar>
          <Box>
            <Typography
              sx={{ fontSize: "0.75rem", color: C.muted, fontWeight: 500 }}
            >
              Requested by
            </Typography>
            <Typography
              sx={{ fontSize: "0.95rem", fontWeight: 700, color: C.ink }}
            >
              {requesterName}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}
            >
              <Typography sx={{ fontSize: "0.7rem", color: C.muted }}>
                {request.createdByModel || "Team Member"}
              </Typography>
              <Box sx={{ color: C.border }}>•</Box>
              <Typography sx={{ fontSize: "0.7rem", color: C.muted }}>
                {formatDateTime(request.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Chip
              label={isParent ? "Parent Asset" : "Child Asset"}
              size="small"
              icon={
                isParent ? (
                  <AccountTreeIcon sx={{ fontSize: 13 }} />
                ) : (
                  <ShareIcon sx={{ fontSize: 13 }} />
                )
              }
              sx={{
                bgcolor: isParent ? alpha(C.navy, 0.08) : alpha(C.purple, 0.08),
                color: isParent ? C.navy : C.purple,
                fontWeight: 600,
                fontSize: "0.72rem",
              }}
            />
          </Box>
        </Paper>

        {/* Parent Asset reference for child requests */}
        {!isParent && request.parentAsset && (
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${alpha(C.purple, 0.25)}`,
              bgcolor: alpha(C.purple, 0.03),
              borderRadius: 2,
              px: 2,
              py: 1.25,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AccountTreeIcon sx={{ fontSize: 16, color: C.purple }} />
            <Typography
              sx={{ fontSize: "0.8rem", color: C.purple, fontWeight: 600 }}
            >
              Parent Asset:&nbsp;
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: C.ink }}>
              {request.parentAsset.assetName}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: C.muted, ml: 0.5 }}>
              ({request.parentAsset.assetId})
            </Typography>
          </Paper>
        )}

        {/* Core Identification — matches screenshot */}
        <SectionCard title="Core Identification">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InfoField
                label="Asset ID / Tag Number"
                value={request.assetId || request.tagNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{width:"270px"}}>
              <InfoField
                label="Asset Name / Description"
                value={request.assetName}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{width:"270px"}}>
              <InfoField label="Serial Number" value={request.serialNumber} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{width:"270px"}}>
              <InfoField label="Asset Category" value={request.assetCategory} />
            </Grid>
            {request.customAssetCategory && (
              <Grid item xs={12} sm={6} sx={{width:"270px"}}>
                <InfoField
                  label="Custom Category"
                  value={request.customAssetCategory}
                />
              </Grid>
            )}
            {request.manufacturer && (
              <Grid item xs={12} sm={6} sx={{width:"270px"}}>
                <InfoField label="Manufacturer" value={request.manufacturer} />
              </Grid>
            )}
            {request.model && (
              <Grid item xs={12} sm={6}sx={{width:"270px"}}>
                <InfoField label="Model" value={request.model} />
              </Grid>
            )}
          </Grid>
        </SectionCard>

        {/* Primary Filters + MHE Filters — side by side like screenshot */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${C.border}`,
                borderRadius: 2.5,
                overflow: "hidden",
                height: "100%",
              }}
            >
              <Box
                sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${C.border}` }}
              >
                <Typography
                  sx={{ fontSize: "0.88rem", fontWeight: 700, color: C.navy }}
                >
                  Primary Filters
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  width:"415px",
                  gap: 2,
                }}
              >
                <InfoField
                  label="Current Location"
                  value={request.currentLocation}
                />
                <InfoField label="Status" value={request.status} />
                {request.assignedUsers?.primaryUser && (
                  <InfoField
                    label="Assigned User / Custodian"
                    value={
                      request.assignedUsers.primaryUser.firstName
                        ? `${request.assignedUsers.primaryUser.firstName} ${request.assignedUsers.primaryUser.lastName || ""}`.trim()
                        : request.assignedUsers.primaryUser.email
                    }
                  />
                )}
                <InfoField
                  label="Asset Condition"
                  value={request.assetCondition}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${C.border}`,
                borderRadius: 2.5,
                overflow: "hidden",
                height: "100%",
                width:"415px",
              }}
            >
              <Box
                sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${C.border}` }}
              >
                <Typography
                  sx={{ fontSize: "0.88rem", fontWeight: 700, color: C.navy }}
                >
                  Material Handling Equipment Filters
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <InfoField
                  label="MHE Utilization Status"
                  value={request.mhe?.utilizationStatus}
                />
                <InfoField
                  label="MHE Engine Status / Runtime (Hours)"
                  value={
                    request.mhe?.engineRuntimeHours != null
                      ? `${request.mhe.engineRuntimeHours} hours`
                      : request.mhe?.engineStatus
                  }
                />
                {/* MHE Safety Certification toggle */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      color: C.muted,
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    MHE Safety Certification
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 22,
                        borderRadius: 11,
                        bgcolor: request.mhe?.safetyCertification
                          ? C.navy
                          : C.ghost,
                        position: "relative",
                        transition: "background 0.2s",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 3,
                          left: request.mhe?.safetyCertification ? 20 : 3,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: C.white,
                          transition: "left 0.2s",
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: "0.8rem", color: C.ink }}>
                      {request.mhe?.safetyCertification || "—"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Transportation (if relevant) */}
        {request.transportation?.vehicleType &&
          request.transportation.vehicleType !== "Not Applicable" && (
            <SectionCard
              title="Transportation"
              icon={<DirectionsCarOutlinedIcon sx={{ fontSize: 18 }} />}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    label="Vehicle Type"
                    value={request.transportation.vehicleType}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    label="Load Status"
                    value={`${request.transportation.loadStatus}%`}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    label="Fuel Level"
                    value={`${request.transportation.fuelLevel}%`}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    label="Odometer"
                    value={`${request.transportation.odometer || 0} km`}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          )}

        {/* Rotating Machinery */}
        {request.rotatingMachinery?.healthStatusIndex && (
          <SectionCard
            title="Rotating Machinery"
            icon={<BuildOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: C.muted,
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Health Status Index
                </Typography>
                <Chip
                  label={request.rotatingMachinery.healthStatusIndex}
                  size="small"
                  sx={{
                    bgcolor:
                      request.rotatingMachinery.healthStatusIndex === "Green"
                        ? "#dcfce7"
                        : request.rotatingMachinery.healthStatusIndex ===
                            "Yellow"
                          ? "#fef3c7"
                          : "#fee2e2",
                    color:
                      request.rotatingMachinery.healthStatusIndex === "Green"
                        ? "#16a34a"
                        : request.rotatingMachinery.healthStatusIndex ===
                            "Yellow"
                          ? "#d97706"
                          : "#dc2626",
                    fontWeight: 700,
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: C.muted,
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Vibration Alert
                </Typography>
                <Chip
                  label={
                    request.rotatingMachinery.vibrationAlert ? "Active" : "None"
                  }
                  size="small"
                  sx={{
                    bgcolor: request.rotatingMachinery.vibrationAlert
                      ? "#fee2e2"
                      : C.surface,
                    color: request.rotatingMachinery.vibrationAlert
                      ? C.red
                      : C.muted,
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: C.muted,
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Temperature Alert
                </Typography>
                <Chip
                  label={
                    request.rotatingMachinery.temperatureAlert
                      ? "Active"
                      : "None"
                  }
                  size="small"
                  sx={{
                    bgcolor: request.rotatingMachinery.temperatureAlert
                      ? "#fee2e2"
                      : C.surface,
                    color: request.rotatingMachinery.temperatureAlert
                      ? C.red
                      : C.muted,
                  }}
                />
              </Grid>
              {request.rotatingMachinery.faultType?.length > 0 && (
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      color: C.muted,
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    Fault Types
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                    {request.rotatingMachinery.faultType.map((f) => (
                      <Chip
                        key={f}
                        label={f}
                        size="small"
                        sx={{ bgcolor: C.surface, color: C.ink }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </SectionCard>
        )}

        {/* Garbage Management */}
        {request.garbageManagement?.containerTypeSize && (
          <SectionCard
            title="Garbage Management"
            icon={<DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="Container Type / Size"
                  value={request.garbageManagement.containerTypeSize}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="IoT Fill Level"
                  value={`${request.garbageManagement.smartStatusIoTFillLevel}%`}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="Collection Status"
                  value={request.garbageManagement.collectionStatus}
                />
              </Grid>
            </Grid>
          </SectionCard>
        )}

        {/* IT Assets */}
        {request.itAssets?.osPlatform?.length > 0 && (
          <SectionCard
            title="IT Assets"
            icon={<ComputerOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: C.muted,
                    fontWeight: 500,
                    mb: 0.75,
                  }}
                >
                  OS Platform
                </Typography>
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {request.itAssets.osPlatform.map((os) => (
                    <Chip
                      key={os}
                      label={os}
                      size="small"
                      sx={{
                        bgcolor: alpha(C.navy, 0.08),
                        color: C.navy,
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="Software Name"
                  value={request.itAssets.softwareName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="Software Version"
                  value={request.itAssets.softwareVersion}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="License Status"
                  value={request.itAssets.licenseStatus}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="Usage Hours"
                  value={
                    request.itAssets.usageHours != null
                      ? `${request.itAssets.usageHours} hrs`
                      : null
                  }
                />
              </Grid>
            </Grid>
          </SectionCard>
        )}

        {/* Facility Management */}
        {request.facilityManagement?.pmStatus && (
          <SectionCard
            title="Facility Management"
            icon={<ApartmentOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="PM Status"
                  value={request.facilityManagement.pmStatus}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="Maintenance Priority"
                  value={request.facilityManagement.maintenancePriority}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="Safety Compliance"
                  value={request.facilityManagement.safetyCompliance}
                />
              </Grid>
            </Grid>
          </SectionCard>
        )}

        {/* Inspection Systems — matches screenshot */}
        {request.inspectionSystems && (
          <SectionCard title="Inspection Systems">
            {/* Active inspection badges */}
            <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
              {request.inspectionSystems.amcInspection?.enabled && (
                <Chip
                  label="AMC Inspection"
                  size="small"
                  sx={{
                    bgcolor: C.navy,
                    color: C.white,
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    borderRadius: "20px",
                    height: 26,
                  }}
                />
              )}
              {request.inspectionSystems.camcInspection?.enabled && (
                <Chip
                  label="CAMC Inspection"
                  size="small"
                  sx={{
                    bgcolor: C.navy,
                    color: C.white,
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    borderRadius: "20px",
                    height: 26,
                  }}
                />
              )}
              {!request.inspectionSystems.amcInspection?.enabled &&
                !request.inspectionSystems.camcInspection?.enabled && (
                  <Typography sx={{ fontSize: "0.82rem", color: C.ghost }}>
                    No inspection systems enabled
                  </Typography>
                )}
            </Box>

            {/* Schedule cards — side by side like screenshot */}
            <Grid container spacing={2}>
              {request.inspectionSystems.amcInspection?.enabled && (
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: C.ink,
                        mb: 1.5,
                      }}
                    >
                      AMC Inspection Schedule
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                      {(Array.isArray(
                        request.inspectionSystems.amcInspection.schedule,
                      )
                        ? request.inspectionSystems.amcInspection.schedule
                        : [request.inspectionSystems.amcInspection.schedule]
                      )
                        .filter(Boolean)
                        .map((s) => (
                          <Chip
                            key={s}
                            label={s}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: "20px",
                              fontWeight: 600,
                              fontSize: "0.72rem",
                            }}
                          />
                        ))}
                    </Box>
                  </Paper>
                </Grid>
              )}
              {request.inspectionSystems.camcInspection?.enabled && (
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: C.ink,
                        mb: 1.5,
                      }}
                    >
                      CAMC Inspection Schedule
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                      {(Array.isArray(
                        request.inspectionSystems.camcInspection.schedule,
                      )
                        ? request.inspectionSystems.camcInspection.schedule
                        : [request.inspectionSystems.camcInspection.schedule]
                      )
                        .filter(Boolean)
                        .map((s) => (
                          <Chip
                            key={s}
                            label={s}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: "20px",
                              fontWeight: 600,
                              fontSize: "0.72rem",
                            }}
                          />
                        ))}
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </SectionCard>
        )}

        {/* Rejection reason if rejected */}
        {request.requestStatus === "rejected" && request.rejectionReason && (
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${alpha(C.red, 0.3)}`,
              bgcolor: alpha(C.red, 0.04),
              borderRadius: 2.5,
              p: 2.5,
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: C.red,
                mb: 0.5,
              }}
            >
              Rejection Reason
            </Typography>
            <Typography sx={{ fontSize: "0.83rem", color: C.ink }}>
              {request.rejectionReason}
            </Typography>
          </Paper>
        )}

        {/* Footer Buttons — matches screenshot */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            py: 3,
            position: "relative",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: C.border,
              color: C.ink,
              px: 3,
              "&:hover": { borderColor: C.navy, bgcolor: alpha(C.navy, 0.04) },
            }}
          >
            Back to List
          </Button>

          {/* Admin-only approve/reject — only for pending requests */}
          {isAdmin && isPending && (
            <>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => setRejectDialogOpen(true)}
                disabled={actionLoading}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: C.red,
                  color: C.red,
                  px: 3,
                  "&:hover": {
                    borderColor: C.red,
                    bgcolor: alpha(C.red, 0.05),
                  },
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                startIcon={
                  actionLoading ? (
                    <CircularProgress size={16} sx={{ color: C.white }} />
                  ) : (
                    <CheckIcon />
                  )
                }
                onClick={handleApprove}
                disabled={actionLoading}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: C.green,
                  px: 3,
                  fontWeight: 700,
                  "&:hover": { bgcolor: alpha(C.green, 0.85) },
                }}
              >
                Approve Asset
              </Button>
            </>
          )}

          {/* Show approved/rejected status for non-pending */}
          {!isPending && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor:
                  request.requestStatus === "approved"
                    ? alpha(C.green, 0.08)
                    : alpha(C.red, 0.08),
                border: `1px solid ${
                  request.requestStatus === "approved"
                    ? alpha(C.green, 0.25)
                    : alpha(C.red, 0.25)
                }`,
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              {request.requestStatus === "approved" ? (
                <CheckIcon sx={{ fontSize: 18, color: C.green }} />
              ) : (
                <CloseIcon sx={{ fontSize: 18, color: C.red }} />
              )}
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: request.requestStatus === "approved" ? C.green : C.red,
                }}
              >
                {request.requestStatus === "approved"
                  ? `Approved ${request.approvedAt ? "on " + formatDate(request.approvedAt) : ""}`
                  : "Rejected"}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle
          sx={{ fontSize: "1.05rem", fontWeight: 700, color: C.red }}
        >
          Reject Asset Request
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Rejecting <strong>{request.assetName}</strong>. Please provide a
            reason — this will be visible to the requester.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: C.border },
                "&:hover fieldset": { borderColor: C.red },
                "&.Mui-focused fieldset": { borderColor: C.red },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button
            onClick={() => setRejectDialogOpen(false)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            startIcon={
              actionLoading ? (
                <CircularProgress size={16} sx={{ color: C.white }} />
              ) : (
                <CloseIcon />
              )
            }
            disabled={actionLoading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              bgcolor: C.red,
              "&:hover": { bgcolor: alpha(C.red, 0.85) },
            }}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssetRequestDetails;
