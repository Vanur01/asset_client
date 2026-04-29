// pages/Dashboard.jsx - Fully Responsive with Error Handling
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Skeleton,
  alpha,
  Divider,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
  Bolt as BoltIcon,
  Group as GroupIcon,
  Payments as PaymentsIcon,
  EventBusy as EventBusyIcon,
  AddCircle as AddCircleIcon,
  PersonAdd as PersonAddIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  ErrorOutline as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContexts";
import Inventory2Icon from '@mui/icons-material/Inventory2';

// Custom color palette
const colors = {
  primary: "#002631",
  primaryContainer: "#003d4d",
  onPrimaryContainer: "#79a8ba",
  secondary: "#516072",
  secondaryContainer: "#d2e1f7",
  onSecondaryContainer: "#556477",
  tertiary: "#331d00",
  tertiaryContainer: "#503000",
  onTertiaryContainer: "#df8f00",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  success: "#2e7d32",
  warning: "#ed6c02",
  surface: "#f7f9fb",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainerLowest: "#ffffff",
  surfaceVariant: "#e0e3e5",
  outline: "#71787c",
  outlineVariant: "#c0c8cc",
};

// ─────────────────────────────────────────────
// Stat Card Component with Loading & Error States
// ─────────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendUp = true,
  bgColor,
  iconBg,
  trendColor,
  loading,
  error,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 2 : 3,
          borderRadius: 3,
          bgcolor: colors.errorContainer,
          border: `1px solid ${alpha(colors.onErrorContainer, 0.2)}`,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ErrorIcon sx={{ color: colors.onErrorContainer, fontSize: 20 }} />
        <Typography variant="caption" sx={{ color: colors.onErrorContainer }}>
          Failed to load {title}
        </Typography>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: isMobile ? 2 : 3, borderRadius: 3 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={32} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: { xs: 2, sm: 3 },
        bgcolor: bgColor || "background.paper",
        border: "1px solid",
        borderColor: bgColor ? "transparent" : alpha(colors.outlineVariant, 0.5),
        transition: "all 0.2s",
        "&:hover": bgColor
          ? { transform: "translateY(-2px)", boxShadow: 3 }
          : { 
              borderColor: colors.outlineVariant,
              transform: "translateY(-2px)",
              boxShadow: `0 4px 12px ${alpha(colors.primary, 0.08)}`
            },
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {bgColor && (
        <Box
          sx={{
            position: "absolute",
            top: -16,
            right: -16,
            width: { xs: 80, sm: 96 },
            height: { xs: 80, sm: 96 },
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        />
      )}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width:"215px",
            mb: { xs: 1.5, sm: 2 },
          }}
        >
          <Box
            sx={{
              p: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              bgcolor:
                iconBg ||
                (bgColor
                  ? "rgba(255,255,255,0.15)"
                  : colors.secondaryContainer),
              color: bgColor ? "white" : colors.onSecondaryContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
          </Box>
          {trend && (
            <Box
              sx={{
                px: { xs: 0.75, sm: 1 },
                py: 0.5,
                borderRadius: 1,
                bgcolor: bgColor
                  ? "rgba(255,255,255,0.15)"
                  : colors.surfaceContainerLow,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {trendUp ? (
                <TrendingUpIcon
                  sx={{
                    fontSize: { xs: 10, sm: 12 },
                    color: bgColor ? "white" : colors.success,
                  }}
                />
              ) : (
                <TrendingDownIcon
                  sx={{
                    fontSize: { xs: 10, sm: 12 },
                    color: bgColor ? "white" : colors.onErrorContainer,
                  }}
                />
              )}
              <Typography
                variant="caption"
                sx={{ 
                  fontWeight: 700, 
                  color: bgColor ? "white" : "inherit",
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" }
                }}
              >
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            letterSpacing: "0.05em",
            color: bgColor ? alpha("#fff", 0.8) : colors.secondary,
            textTransform: "uppercase",
            fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: bgColor ? "white" : colors.primary,
            fontSize: { xs: "0.9rem", sm: "0.925rem", md: "1rem", lg: "1.2rem" },
            lineHeight: 1.2,
          }}
        >
          {value ?? 0}
        </Typography>
      </Box>
    </Paper>
  );
};

// ─────────────────────────────────────────────
// Loading Skeleton Component
// ─────────────────────────────────────────────
const DashboardSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Skeleton variant="text" width={150} height={40} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton variant="circular" width={36} height={36} />
        </Box>
      </Box>
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Skeleton variant="rounded" height={isMobile ? 120 : 140} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
      <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
    </Box>
  );
};

// ─────────────────────────────────────────────
// Empty State Component
// ─────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: { xs: 4, sm: 6, md: 8 },
      px: 2,
      textAlign: "center",
    }}
  >
    {Icon && (
      <Icon
        sx={{
          fontSize: { xs: 48, sm: 64 },
          color: alpha(colors.outline, 0.5),
          mb: 2,
        }}
      />
    )}
    <Typography
      variant="h6"
      sx={{
        color: colors.primary,
        fontWeight: 600,
        mb: 1,
        fontSize: { xs: "1rem", sm: "1.1rem" },
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: colors.secondary,
        mb: 3,
        maxWidth: 400,
        fontSize: { xs: "0.8rem", sm: "0.85rem" },
      }}
    >
      {description}
    </Typography>
    {action && action}
  </Box>
);

// ─────────────────────────────────────────────
// Error Boundary Component
// ─────────────────────────────────────────────
const ErrorDisplay = ({ message, onRetry }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: { xs: 6, sm: 8 },
      px: 2,
    }}
  >
    <ErrorIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: colors.onErrorContainer, mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, color: colors.onErrorContainer, mb: 1 }}
    >
      Something went wrong
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: colors.secondary, mb: 3, textAlign: "center", maxWidth: 400 }}
    >
      {message || "Failed to load dashboard data. Please try again."}
    </Typography>
    <Button
      variant="contained"
      onClick={onRetry}
      startIcon={<RefreshIcon />}
      sx={{
        bgcolor: colors.onErrorContainer,
        "&:hover": { bgcolor: alpha(colors.onErrorContainer, 0.9) },
      }}
    >
      Retry
    </Button>
  </Box>
);

// ─────────────────────────────────────────────
// Export Helper Functions
// ─────────────────────────────────────────────
const exportToCSV = (data, filename) => {
  try {
    if (!data) return;

    const flattenData = (obj, prefix = "") => {
      const result = {};
      for (const key in obj) {
        if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          Object.assign(result, flattenData(obj[key], `${prefix}${key}_`));
        } else if (Array.isArray(obj[key])) {
          result[`${prefix}${key}`] = JSON.stringify(obj[key]);
        } else {
          result[`${prefix}${key}`] = obj[key];
        }
      }
      return result;
    };

    const flatData = flattenData(data);
    const headers = Object.keys(flatData);
    const csvRows = [headers.join(",")];
    const values = headers.map((header) => {
      const value = flatData[header];
      const escaped =
        typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
      return escaped;
    });
    csvRows.push(values.join(","));

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV export error:", error);
    throw new Error("Failed to export CSV");
  }
};

const exportToPDF = async (data, filename) => {
  try {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "Arial, sans-serif";
    element.innerHTML = `
      <h1 style="color: #002631; text-align: center;">Dashboard Report</h1>
      <p style="text-align: center; color: #666;">Generated on ${new Date().toLocaleString()}</p>
      <pre style="background: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
    `;

    document.body.appendChild(element);
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    await html2pdf().set(opt).from(element).save();
    document.body.removeChild(element);
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("Failed to export PDF");
  }
};

// ─────────────────────────────────────────────
// Main Dashboard Component
// ─────────────────────────────────────────────
const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { user } = useAuth();
  const {
    dashboardData,
    statsData,
    chartData,
    activities,
    loading,
    error,
    loadDashboard,
    exportDashboardReport,
    clearError,
  } = useDashboard();

  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, [retryCount]);

  // Toast notification handlers
  const showToast = useCallback((msg, sev = "success") => {
    setToast({ open: true, message: msg, severity: sev });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    showToast("Refreshing dashboard...", "info");
  }, [showToast]);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    clearError();
  }, [clearError]);

  // Handle export
  const handleExport = useCallback(async (type) => {
    setExporting(true);
    setExportAnchorEl(null);

    try {
      const exportBlob = await exportDashboardReport();
      if (!exportBlob) {
        throw new Error("No data received");
      }

      const text = await exportBlob.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      const filename = `dashboard_report_${new Date().toISOString().split("T")[0]}`;

      if (type === "csv") {
        exportToCSV(data, filename);
        showToast("CSV exported successfully", "success");
      } else if (type === "pdf") {
        await exportToPDF(data, filename);
        showToast("PDF exported successfully", "success");
      }
    } catch (err) {
      console.error("Export error:", err);
      showToast(err.message || "Failed to export dashboard", "error");
    } finally {
      setExporting(false);
    }
  }, [exportDashboardReport, showToast]);

  // Get role-specific overview data with memoization
  const overview = useMemo(() => {
    if (user?.role === "super_admin") {
      return dashboardData?.overview || {};
    } else if (user?.role === "admin") {
      return dashboardData?.overview || {};
    } else {
      return statsData?.overview || {};
    }
  }, [user?.role, dashboardData, statsData]);

  // Stats configuration with memoization
  const statsToShow = useMemo(() => {
    if (user?.role === "super_admin") {
      return [
        {
          icon: GroupIcon,
          title: "Total Customers",
          value: overview.totalClients,
          trend: `${overview.clientGrowth || 0}%`,
          trendUp: (overview.clientGrowth || 0) >= 0,
          bgColor: colors.primaryContainer,
        },
        {
          icon: CheckCircleIcon,
          title: "Active Customers",
          value: overview.activeClients,
          trend: "8.2%",
          trendUp: true,
          iconBg: colors.secondaryContainer,
        },
        {
          icon: PaymentsIcon,
          title: "Total Revenue",
          value: `$${(overview.totalRevenue || 0).toLocaleString()}`,
          trend: "15.3%",
          trendUp: true,
        },
        {
          icon: WarningIcon,
          title: "Expiring Soon",
          value: overview.expiringSoon || 0,
          trend: "3.1%",
          trendUp: false,
          iconBg: colors.errorContainer,
          trendColor: colors.onErrorContainer,
        },
      ];
    } else if (user?.role === "admin") {
      return [
        {
          icon: GroupIcon,
          title: "Team Members",
          value: overview.totalTeamMembers,
          bgColor: colors.primaryContainer,
        },
        {
          icon: CheckCircleIcon,
          title: "Active Team",
          value: overview.activeTeamMembers,
          iconBg: colors.secondaryContainer,
        },
        {
          icon: Inventory2Icon,
          title: "Total Assets",
          value: overview.totalAssets,
        },
        {
          icon: WarningIcon,
          title: "Inspections",
          value: overview.totalInspections,
          iconBg: colors.errorContainer,
        },
      ];
    } else {
      return [
        {
          icon: TaskIcon,
          title: "Total Tasks",
          value: overview.totalTasks,
          bgColor: colors.primaryContainer,
        },
        {
          icon: CheckCircleIcon,
          title: "Completed",
          value: overview.completedTasks,
          iconBg: colors.secondaryContainer,
        },
        {
          icon: AnalyticsIcon,
          title: "Completion Rate",
          value: `${overview.completionRate || 0}%`,
        },
        {
          icon: TrendingUpIcon,
          title: "Performance",
          value: `${overview.performanceScore || 0}%`,
          iconBg: colors.errorContainer,
        },
      ];
    }
  }, [user?.role, overview]);

  // Chart data with memoization
  const revenueTrend = useMemo(() => chartData?.revenueTrend || [], [chartData]);
  const subscriptionDistribution = useMemo(() => chartData?.subscriptionDistribution || [], [chartData]);

  // Quick actions based on role
  const quickActions = useMemo(() => {
    const actions = [];
    if (user?.role === "super_admin" || user?.role === "admin") {
      actions.push({
        icon: AddCircleIcon,
        title: "New Checklist",
        desc: "Create inspection form",
        path: "/admin/checklists/custom-builder",
      });
    }
    if (user?.role === "super_admin") {
      actions.push({
        icon: PersonAddIcon,
        title: "Add Client",
        desc: "Register new client",
        path: "/admin/clients",
      });
    }
    actions.push({
      icon: AnalyticsIcon,
      title: "Reports",
      desc: "View analytics",
      path: user?.role === "team" ? "/team/history" : "/admin/reports",
    });
    return actions;
  }, [user?.role]);

  // Show loading skeleton on initial load
  if (loading && !dashboardData && !statsData) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error && !dashboardData && !statsData) {
    return <ErrorDisplay message={error} onRetry={handleRetry} />;
  }

  return (
    <Box
      sx={{
        bgcolor: colors.surface,
        minHeight: "100%",
        p: { xs: 1.5, sm: 2, md: 3, lg: 3.5 },
        position: "relative",
      }}
    >
      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <LinearProgress sx={{ height: 2 }} />
        </Box>
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 2, sm: 2.5, md: 3 },
          flexWrap: "wrap",
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: colors.primary,
              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
            }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: colors.secondary, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} alignItems="center">
          <Tooltip title="Refresh data">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                bgcolor: colors.surfaceContainerLow,
                "&:hover": { bgcolor: colors.surfaceVariant }
              }}
            >
              <RefreshIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export report">
            <IconButton
              onClick={(e) => setExportAnchorEl(e.currentTarget)}
              disabled={exporting || loading}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                bgcolor: colors.surfaceContainerLow,
                "&:hover": { bgcolor: colors.surfaceVariant }
              }}
            >
              {exporting ? (
                <CircularProgress size={18} />
              ) : (
                <DownloadIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              )}
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={() => setExportAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => handleExport("csv")} disabled={exporting}>
              <ListItemIcon>
                <CsvIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Export as CSV" />
            </MenuItem>
            <MenuItem onClick={() => handleExport("pdf")} disabled={exporting}>
              <ListItemIcon>
                <PdfIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Export as PDF" />
            </MenuItem>
          </Menu>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={clearError}
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      {statsToShow.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          {statsToShow.map((stat, idx) => (
            <Grid item xs={12} sm={6} lg={3} key={idx}>
              <StatCard {...stat} loading={loading} />
            </Grid>
          ))}
        </Grid>
      ) : (
        !loading && (
          <EmptyState
            icon={InfoIcon}
            title="No stats available"
            description="Dashboard statistics will appear here once data is available."
          />
        )
      )}

      {/* Charts Section */}
      {(user?.role === "super_admin" || user?.role === "admin") && (
        <Grid
          container
          spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          {/* Revenue Trend Chart */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: { xs: 2, sm: 3 },
                height: "100%",
                width:"600px",
                bgcolor: "background.paper",
                border: `1px solid ${alpha(colors.outlineVariant, 0.5)}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: colors.primary,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                Revenue Trend
              </Typography>

              {loading ? (
                <Box sx={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CircularProgress size={32} />
                </Box>
              ) : revenueTrend.length > 0 ? (
                <Box sx={{ height: { xs: 180, sm: 200 }, overflowX: "auto" }}>
                  <Box sx={{ minWidth: { xs: 400, sm: 500 }, height: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: { xs: 0.5, sm: 1 },
                        height: { xs: 140, sm: 160 },
                        px: 1,
                      }}
                    >
                      {revenueTrend.map((item, idx) => {
                        const maxRevenue = Math.max(...revenueTrend.map((r) => r.revenue || 0));
                        const heightPercent = maxRevenue > 0 ? ((item.revenue || 0) / maxRevenue) * 100 : 0;
                        return (
                          <Box
                            key={idx}
                            sx={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              minWidth: 30,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                mb: 0.5,
                                fontSize: { xs: "0.5rem", sm: "0.55rem" },
                                color: colors.outline,
                              }}
                            >
                              ${((item.revenue || 0) / 1000).toFixed(0)}k
                            </Typography>
                            <Box
                              sx={{
                                width: "100%",
                                maxWidth: 40,
                                bgcolor: colors.primaryContainer,
                                height: `${heightPercent}%`,
                                borderRadius: "4px 4px 0 0",
                                transition: "height 0.5s ease",
                                "&:hover": {
                                  bgcolor: colors.primary,
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 1,
                                fontSize: { xs: "0.5rem", sm: "0.55rem" },
                                color: colors.outline,
                                transform: { xs: "rotate(-45deg)", sm: "none" },
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.month}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <EmptyState
                  icon={AnalyticsIcon}
                  title="No revenue data"
                  description="Revenue trends will appear here."
                />
              )}
            </Paper>
          </Grid>

          {/* Subscription Distribution */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: { xs: 2, sm: 3 },
                height: "100%",
                width:"500px",
                bgcolor: "background.paper",
                border: `1px solid ${alpha(colors.outlineVariant, 0.5)}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: colors.primary,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                Subscription Distribution
              </Typography>

              {loading ? (
                <Box sx={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CircularProgress size={32} />
                </Box>
              ) : subscriptionDistribution.length > 0 ? (
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                  {subscriptionDistribution.map((item, idx) => {
                    const colorsList = [
                      colors.primaryContainer,
                      colors.onTertiaryContainer,
                      colors.tertiaryContainer,
                      colors.secondary,
                    ];
                    const maxCount = Math.max(...subscriptionDistribution.map((s) => s.count || 0));
                    const percentage = maxCount > 0 ? ((item.count || 0) / maxCount) * 100 : 0;
                    
                    return (
                      <Box key={idx}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                width: { xs: 10, sm: 12 },
                                height: { xs: 10, sm: 12 },
                                borderRadius: "50%",
                                bgcolor: colorsList[idx % colorsList.length],
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
                            >
                              {item.plan || "Unknown"}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600, fontSize: { xs: "0.6rem", sm: "0.65rem" } }}
                          >
                            {item.count || 0} customers
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: { xs: 6, sm: 8 },
                            borderRadius: 4,
                            bgcolor: alpha(colors.primary, 0.08),
                            "& .MuiLinearProgress-bar": {
                              bgcolor: colorsList[idx % colorsList.length],
                              borderRadius: 4,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.outline,
                            fontSize: { xs: "0.55rem", sm: "0.6rem" },
                            mt: 0.25,
                            display: "block",
                          }}
                        >
                          ${(item.potentialRevenue || 0).toLocaleString()}/mo
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <EmptyState
                  icon={PaymentsIcon}
                  title="No subscription data"
                  description="Subscription distribution will appear here."
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Recent Activity Table */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            overflow: "hidden",
            bgcolor: "background.paper",
            border: `1px solid ${alpha(colors.outlineVariant, 0.5)}`,
          }}
        >
          <Box
            sx={{
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 1.5, sm: 2 },
              borderBottom: `1px solid ${alpha(colors.outlineVariant, 0.3)}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: colors.primary,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
              }}
            >
              <HistoryIcon
                sx={{ color: colors.primaryContainer, fontSize: { xs: 18, sm: 20 } }}
              />
              Recent Activity
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ p: 3 }}>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : activities.length === 0 ? (
            <EmptyState
              icon={HistoryIcon}
              title="No recent activity"
              description="Your recent activities will appear here."
            />
          ) : (
            <TableContainer sx={{ maxHeight: { xs: 300, sm: 350, md: 400 } }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(colors.surfaceContainerLow, 0.5) }}>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                        fontWeight: 700,
                        color: colors.secondary,
                        py: { xs: 1, sm: 1.5 },
                      }}
                    >
                      Activity
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                        fontWeight: 700,
                        color: colors.secondary,
                        py: { xs: 1, sm: 1.5 },
                      }}
                    >
                      Details
                    </TableCell>
                    {!isMobile && (
                      <TableCell
                        sx={{
                          fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                          fontWeight: 700,
                          color: colors.secondary,
                          py: { xs: 1, sm: 1.5 },
                        }}
                      >
                        Date
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activities.slice(0, isMobile ? 3 : 5).map((activity, idx) => (
                    <TableRow
                      key={idx}
                      hover
                      sx={{ "&:last-child td": { border: 0 } }}
                    >
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
                          <Avatar
                            sx={{
                              width: { xs: 24, sm: 28 },
                              height: { xs: 24, sm: 28 },
                              bgcolor: alpha(colors.primary, 0.1),
                              fontSize: { xs: 12, sm: 14 },
                            }}
                          >
                            {activity.icon || "📋"}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: colors.primary,
                              fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                            }}
                          >
                            {activity.title || "Activity"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.secondary,
                            fontSize: { xs: "0.6rem", sm: "0.65rem" },
                          }}
                        >
                          {activity.details || "No details"}
                        </Typography>
                      </TableCell>
                      {!isMobile && (
                        <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.outline,
                              fontSize: { xs: "0.6rem", sm: "0.65rem" },
                              whiteSpace: "nowrap",
                            }}
                          >
                            {activity.timestamp
                              ? new Date(activity.timestamp).toLocaleDateString()
                              : "N/A"}
                          </Typography>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.primary,
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
            }}
          >
            <BoltIcon
              sx={{ color: colors.onTertiaryContainer, fontSize: { xs: 18, sm: 20 } }}
            />
            Quick Actions
          </Typography>
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {quickActions.map((action, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx} sx={{width:"360px"}}>
                <Button
                  fullWidth
                  onClick={() => navigate(action.path)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    p: { xs: 2, sm: 2.5, md: 3 },
                    bgcolor: colors.primaryContainer,
                    borderRadius: { xs: 2, sm: 3 },
                    textTransform: "none",
                    transition: "all 0.3s",
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      bgcolor: alpha(colors.primaryContainer, 0.9),
                      boxShadow: `0 4px 16px ${alpha(colors.primary, 0.15)}`,
                    },
                    boxShadow: `0 2px 8px ${alpha(colors.primary, 0.08)}`,
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 0.75, sm: 1 },
                      bgcolor: "rgba(255,255,255,0.12)",
                      borderRadius: 1.5,
                      mb: { xs: 1, sm: 1.5 },
                    }}
                  >
                    <action.icon sx={{ color: "white", fontSize: { xs: 16, sm: 18, md: 20 } }} />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                      mb: 0.25,
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.onPrimaryContainer,
                      textAlign: "left",
                      fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                      lineHeight: 1.4,
                    }}
                  >
                    {action.desc}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ 
          bottom: { xs: 72, sm: 80, md: 24 } // Account for bottom nav on mobile
        }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          sx={{
            borderRadius: 2,
            fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
            boxShadow: 3,
          }}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;