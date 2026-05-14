// pages/Reports.jsx - Fully Responsive for All Devices
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
  Avatar,
  useMediaQuery,
  Stack,
  Grid,
  Paper,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Tab,
  Tabs,
  Badge,
  Skeleton,
  useTheme as useMuiTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import DownloadIcon from "@mui/icons-material/Download";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import DateRangeIcon from "@mui/icons-material/DateRange";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useReport } from "../context/ReportContext";
import { useAuth } from "../context/AuthContexts";

// ─────────────────────────────────────────────
// Custom Color Palette
// ─────────────────────────────────────────────
const colors = {
  primary: "#1a4a6b",
  primaryLight: "#2e7d9e",
  primaryDark: "#0d2f45",
  secondary: "#64748b",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  purple: "#a855f7",
  orange: "#f97316",
  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  textDisabled: "#94a3b8",
};

// ─────────────────────────────────────────────
// Loading Skeleton Component
// ─────────────────────────────────────────────
const ReportSkeleton = () => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexDirection: isMobile ? "column" : "row", gap: 2 }}>
        <Box>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={150} height={20} />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="rounded" width={120} height={36} />
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton variant="rounded" width={80} height={36} />
        </Box>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 2, mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" height={isMobile ? 100 : 120} sx={{ borderRadius: 3 }} />
        ))}
      </Box>
      <Skeleton variant="rounded" height={40} sx={{ mb: 3 }} />
      <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "7fr 5fr", gap: 2 }}>
        <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────
// Error State Component
// ─────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
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
    <ErrorOutlineIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: colors.error, mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, color: colors.textPrimary, mb: 1, textAlign: "center" }}
    >
      Failed to Load Reports
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: colors.textSecondary, mb: 3, textAlign: "center", maxWidth: 400 }}
    >
      {message || "An error occurred while loading reports. Please try again."}
    </Typography>
    <Button
      variant="contained"
      onClick={onRetry}
      startIcon={<RefreshIcon />}
      sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primaryDark } }}
    >
      Retry
    </Button>
  </Box>
);

// ─────────────────────────────────────────────
// Empty State Component
// ─────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, description }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: { xs: 4, sm: 6 },
      px: 2,
      textAlign: "center",
    }}
  >
    {Icon && <Icon sx={{ fontSize: { xs: 40, sm: 48 }, color: colors.textDisabled, mb: 2 }} />}
    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="caption" sx={{ color: colors.textSecondary, maxWidth: 300 }}>
      {description}
    </Typography>
  </Box>
);

// ─────────────────────────────────────────────
// Custom Tooltip for Charts
// ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, valuePrefix = "", valueSuffix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 2,
          p: 1.5,
          boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
        }}
      >
        <Typography variant="caption" sx={{ color: colors.textSecondary, mb: 0.5, display: "block" }}>
          {label || payload[0]?.name}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.textPrimary }}>
          {valuePrefix}{payload[0]?.value?.toLocaleString()}{valueSuffix}
        </Typography>
      </Box>
    );
  }
  return null;
};

// ─────────────────────────────────────────────
// Stat Card Component
// ─────────────────────────────────────────────
function StatCard({ icon, label, value, sub, bg, loading, error }) {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (error) {
    return (
      <Box
        sx={{
          borderRadius: 3,
          background: `linear-gradient(135deg, ${colors.error} 0%, #dc2626 100%)`,
          p: { xs: 1.5, sm: 2 },
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 18 }} />
        <Typography variant="caption">Failed to load</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ borderRadius: 3, background: bg, p: { xs: 1.5, sm: 2 } }}>
        <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 1 }} />
        <Skeleton variant="text" width="60%" sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
        <Skeleton variant="text" width="40%" height={30} sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: { xs: 2, sm: 3 },
        background: bg,
        p: { xs: 1.5, sm: 2, md: 2.5 },
        color: "#fff",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
        "&:hover": { 
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 0.75 }, mb: { xs: 0.75, sm: 1 } }}>
        {icon}
        <Typography
          variant="caption"
          sx={{ 
            color: "rgba(255,255,255,0.85)", 
            fontWeight: 500,
            fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" }
          }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        variant="h5"
        fontWeight={800}
        sx={{
          color: "#fff",
          lineHeight: 1.1,
          mb: 0.5,
          fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem", lg: "1.375rem" },
        }}
      >
        {value ?? 0}
      </Typography>
      <Typography
        variant="caption"
        sx={{ 
          color: "rgba(255,255,255,0.75)", 
          fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.625rem" }
        }}
      >
        {sub}
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────
// Main Reports Page Component
// ─────────────────────────────────────────────
export default function ReportsPage() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  
  const { user } = useAuth();
  const {
    loading,
    initialLoading,
    exporting,
    error,
    analyticsData,
    reportData,
    getDashboardAnalytics,
    getClientReport,
    getAssetReport,
    getTeamReport,
    getInspectionReport,
    getFinancialReport,
    getComplianceReport,
    exportBulkReports,
    clearError,
  } = useReport();

  const isAdmin = user?.role === "admin" || user?.role === "super_admin" || user?.role === "superadmin";

  const [dateRange, setDateRange] = useState(30);
  const [tabValue, setTabValue] = useState(0);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [reportType, setReportType] = useState("all");
  const [reportFilters, setReportFilters] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback((msg, sev = "success") => {
    setToast({ open: true, message: msg, severity: sev });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = useCallback(async () => {
    try {
      await getDashboardAnalytics(dateRange);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      showToast("Failed to load analytics data", "error");
    }
  }, [dateRange, getDashboardAnalytics, showToast]);

  const handleExport = useCallback(async (format) => {
    setExportAnchorEl(null);
    
    const dateRangeObj = {
      startDate: new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    };

    let reportTypes = [];
    if (reportType === "all") {
      reportTypes = isAdmin
        ? ["clients", "assets", "team", "inspections", "financial", "compliance"]
        : ["clients", "inspections", "financial"];
    } else {
      reportTypes = [reportType];
    }

    try {
      const blob = await exportBulkReports(reportTypes, dateRangeObj, format);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reports_export_${Date.now()}.${format === "excel" ? "xlsx" : "pdf"}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast(`Reports exported as ${format.toUpperCase()}`, "success");
      } else {
        showToast("Failed to export reports", "error");
      }
    } catch (err) {
      console.error("Export error:", err);
      showToast("Failed to export reports", "error");
    }
  }, [dateRange, reportType, isAdmin, exportBulkReports, showToast]);

  const handleGenerateReport = useCallback(async () => {
    try {
      let result = null;
      if (reportType === "clients") {
        result = await getClientReport(reportFilters);
      } else if (reportType === "assets" && isAdmin) {
        result = await getAssetReport(reportFilters);
      } else if (reportType === "team" && isAdmin) {
        result = await getTeamReport(reportFilters);
      } else if (reportType === "inspections") {
        result = await getInspectionReport(reportFilters);
      } else if (reportType === "financial") {
        result = await getFinancialReport(reportFilters);
      } else if (reportType === "compliance" && isAdmin) {
        result = await getComplianceReport(reportFilters);
      }

      if (result) {
        setFilterDialogOpen(false);
        showToast(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated`, "success");
      }
    } catch (err) {
      console.error("Report generation error:", err);
      showToast("Failed to generate report", "error");
    }
  }, [reportType, isAdmin, reportFilters, getClientReport, getAssetReport, getTeamReport, getInspectionReport, getFinancialReport, getComplianceReport, showToast]);

  // Memoized chart data
  const revenueTrend = useMemo(() => {
    if (!analyticsData?.revenueTrend) return [];
    return [
      { name: "Current", value: analyticsData.revenueTrend.current || 0, fill: colors.primary },
      { name: "Previous", value: analyticsData.revenueTrend.previous || 0, fill: colors.secondary },
      { name: "Projected", value: analyticsData.revenueTrend.projected || 0, fill: colors.success },
    ];
  }, [analyticsData]);

  const clientGrowthData = useMemo(() => {
    if (!analyticsData?.clientGrowth) return [];
    return [
      { name: "Total", value: analyticsData.clientGrowth.total || 0 },
      { name: "New", value: analyticsData.clientGrowth.new || 0 },
      { name: "Prev Period", value: analyticsData.clientGrowth.previous || 0 },
    ];
  }, [analyticsData]);

  const pieData = useMemo(() => [
    { name: "Safety", value: 35, color: colors.primary },
    { name: "Equipment", value: 25, color: colors.primaryLight },
    { name: "Quality", value: 20, color: colors.warning },
    { name: "Maintenance", value: 15, color: colors.purple },
    { name: "Other", value: 5, color: colors.textDisabled },
  ], []);

  const statCards = useMemo(() => [
    {
      icon: <BusinessIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />,
      label: "Total Clients",
      value: analyticsData?.clientGrowth?.total || 0,
      sub: `${analyticsData?.clientGrowth?.new || 0} new`,
      bg: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />,
      label: "Active Checklists",
      value: analyticsData?.checklistUsage?.active || 0,
      sub: `${analyticsData?.checklistUsage?.activeRate || 0}% active`,
      bg: `linear-gradient(135deg, ${colors.purple} 0%, #9333ea 100%)`,
    },
    {
      icon: <PeopleOutlineIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />,
      label: "Team Members",
      value: analyticsData?.teamPerformance?.total || 0,
      sub: `${analyticsData?.teamPerformance?.active || 0} active`,
      bg: `linear-gradient(135deg, ${colors.warning} 0%, ${colors.orange} 100%)`,
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />,
      label: "Revenue Growth",
      value: `${analyticsData?.revenueTrend?.growth || 0}%`,
      sub: (analyticsData?.revenueTrend?.growth || 0) > 10 ? "Above target" : "Below target",
      bg: (analyticsData?.revenueTrend?.growth || 0) > 10
        ? `linear-gradient(135deg, ${colors.success} 0%, #16a34a 100%)`
        : `linear-gradient(135deg, ${colors.error} 0%, #dc2626 100%)`,
    },
  ], [analyticsData]);

  const insights = useMemo(() => analyticsData?.insights || [], [analyticsData]);

  // Show loading skeleton on initial load
  if (initialLoading && !analyticsData) {
    return <ReportSkeleton />;
  }

  // Show error state
  if (error && !analyticsData) {
    return <ErrorState message={error} onRetry={loadAnalytics} />;
  }

  return (
    <Box
      sx={{ 
        bgcolor: colors.background, 
        minHeight: "100%", 
        p: { xs: 1.5, sm: 2, md: 3, lg: 3.5 },
        maxWidth: { xl: 1400 },
        mx: "auto",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 2 },
          mb: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              color: colors.textPrimary,
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem", lg: "1.375rem" },
            }}
          >
            Reports & Analytics
          </Typography>
          <Typography
            variant="caption"
            sx={{ 
              color: colors.textSecondary, 
              mt: 0.3, 
              display: "block",
              fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" }
            }}
          >
            View analytics and export reports for your organization
          </Typography>
        </Box>

        {/* Controls */}
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={1}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {/* Date Range Toggle */}
          <ToggleButtonGroup
            size="small"
            value={dateRange}
            exclusive
            onChange={(e, val) => val && setDateRange(val)}
            sx={{
              "& .MuiToggleButton-root": {
                px: { xs: 1, sm: 1.5 },
                py: 0.5,
                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                border: `1px solid ${colors.border}`,
                "&.Mui-selected": {
                  bgcolor: alpha(colors.primary, 0.08),
                  color: colors.primary,
                },
              },
            }}
          >
            <ToggleButton value={7}>7d</ToggleButton>
            <ToggleButton value={30}>30d</ToggleButton>
            <ToggleButton value={90}>90d</ToggleButton>
          </ToggleButtonGroup>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: { xs: "flex-end", sm: "flex-start" } }}>
            <IconButton
              onClick={loadAnalytics}
              disabled={loading}
              size="small"
              sx={{ 
                bgcolor: colors.surface, 
                border: `1px solid ${colors.border}`,
                "&:hover": { bgcolor: alpha(colors.primary, 0.04) }
              }}
            >
              {loading ? (
                <CircularProgress size={16} />
              ) : (
                <RefreshIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: colors.textSecondary }} />
              )}
            </IconButton>
            <IconButton
              onClick={() => setFilterDialogOpen(true)}
              size="small"
              sx={{ 
                bgcolor: colors.surface, 
                border: `1px solid ${colors.border}`,
                "&:hover": { bgcolor: alpha(colors.primary, 0.04) }
              }}
            >
              <FilterListIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: colors.textSecondary }} />
            </IconButton>
            <Button
              variant="contained"
              startIcon={exporting ? <CircularProgress size={14} color="inherit" /> : <DownloadIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
              onClick={(e) => setExportAnchorEl(e.currentTarget)}
              disabled={exporting}
              sx={{ 
                bgcolor: colors.primary, 
                "&:hover": { bgcolor: colors.primaryDark },
                fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                px: { xs: 1.5, sm: 2 },
              }}
            >
              {isMobile ? "" : "Export"}
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={clearError}
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={loadAnalytics}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ height: 2, bgcolor: alpha(colors.primary, 0.1), borderRadius: 1, overflow: "hidden" }}>
            <Box
              sx={{
                height: "100%",
                width: "30%",
                bgcolor: colors.primary,
                borderRadius: 1,
                animation: "loading 1.5s infinite ease-in-out",
                "@keyframes loading": {
                  "0%": { transform: "translateX(-100%)" },
                  "100%": { transform: "translateX(400%)" },
                },
              }}
            />
          </Box>
        </Box>
      )}

      {/* Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 1, sm: 1.5, md: 2 },
          mb: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} loading={loading} />
        ))}
      </Box>

      {/* Tabs */}
      <Paper 
        sx={{ 
          mb: { xs: 2, sm: 2.5 }, 
          borderRadius: 2, 
          overflow: "hidden",
          border: `1px solid ${colors.border}`,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            minHeight: { xs: 36, sm: 40, md: 44 },
            "& .MuiTab-root": { 
              fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
              minHeight: { xs: 36, sm: 40, md: 44 },
              px: { xs: 1.5, sm: 2, md: 2.5 },
              textTransform: "none",
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              bgcolor: colors.primary,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Clients" />
          <Tab label="Performance" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
        {/* Overview Tab */}
        {tabValue === 0 && (
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {/* Revenue Comparison Chart */}
            <Grid item xs={12} lg={7}>
              <Card sx={{ height: "100%", width:"600px", border: `1px solid ${colors.border}` }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ 
                      color: colors.textPrimary, 
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" }, 
                      mb: { xs: 1.5, sm: 2 } 
                    }}
                  >
                    Revenue Comparison ({dateRange} days)
                  </Typography>
                  {revenueTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={isMobile ? 220 : isTablet ? 260 : 300}>
                      <BarChart
                        data={revenueTrend}
                        margin={{ top: 10, right: 10, left: isMobile ? -10 : 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(colors.border, 0.5)} vertical={false} />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: colors.textDisabled, fontSize: isMobile ? 10 : 11 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: colors.textDisabled, fontSize: isMobile ? 10 : 11 }}
                        />
                        <Tooltip content={<CustomTooltip valuePrefix="$" />} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                          {revenueTrend.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState icon={ShowChartIcon} title="No revenue data" description="Revenue data will appear here" />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Checklist Distribution Pie Chart */}
            <Grid item xs={12} lg={5}>
              <Card sx={{ height: "100%", width:"500px", border: `1px solid ${colors.border}` }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ 
                      color: colors.textPrimary, 
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" }, 
                      mb: { xs: 1.5, sm: 2 } 
                    }}
                  >
                    Checklist Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={isMobile ? 220 : isTablet ? 260 : 300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 45 : 55}
                        outerRadius={isMobile ? 65 : 80}
                        dataKey="value"
                        paddingAngle={2}
                        label={({ name, percent }) =>
                          isMobile
                            ? `${(percent * 100).toFixed(0)}%`
                            : `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={!isMobile}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip valueSuffix="%" />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend for mobile */}
                  {isMobile && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mt: 1 }}>
                      {pieData.map((item, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
                          <Typography variant="caption" sx={{ fontSize: "0.6rem", color: colors.textSecondary }}>
                            {item.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Clients Tab */}
        {tabValue === 1 && (
          <Card sx={{ border: `1px solid ${colors.border}` }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ 
                  color: colors.textPrimary, 
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" }, 
                  mb: { xs: 1.5, sm: 2 } 
                }}
              >
                Client Growth
              </Typography>
              {clientGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <BarChart
                    data={clientGrowthData}
                    margin={{ top: 10, right: 10, left: isMobile ? -10 : 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(colors.border, 0.5)} vertical={false} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: colors.textDisabled, fontSize: isMobile ? 10 : 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: colors.textDisabled, fontSize: isMobile ? 10 : 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={colors.primary} radius={[4, 4, 0, 0]} maxBarSize={80} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={PeopleOutlineIcon} title="No client data" description="Client growth data will appear here" />
              )}
            </CardContent>
          </Card>
        )}

        {/* Performance Tab */}
        {tabValue === 2 && (
          <Card sx={{ border: `1px solid ${colors.border}` }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ 
                  color: colors.textPrimary, 
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" }, 
                  mb: { xs: 1.5, sm: 2 } 
                }}
              >
                Key Insights
              </Typography>
              {insights.length > 0 ? (
                <Stack spacing={{ xs: 1, sm: 1.5 }}>
                  {insights.map((insight, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: { xs: 1, sm: 1.5 },
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: alpha(colors.primary, 0.04),
                        borderRadius: 2,
                        transition: "transform 0.2s",
                        "&:hover": { transform: "translateX(4px)" },
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: colors.primary, mt: 0.2 }} />
                      <Typography
                        variant="body2"
                        sx={{ 
                          fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }, 
                          color: colors.textPrimary, 
                          flex: 1,
                          lineHeight: 1.5,
                        }}
                      >
                        {insight}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <EmptyState icon={AssessmentIcon} title="No insights available" description="Performance insights will appear here" />
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={() => setExportAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleExport("excel")} disabled={exporting}>
          <ListItemIcon>
            <TableChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Export as Excel" primaryTypographyProps={{ fontSize: "0.8rem" }} />
        </MenuItem>
        <MenuItem onClick={() => handleExport("pdf")} disabled={exporting}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Export as PDF" primaryTypographyProps={{ fontSize: "0.8rem" }} />
        </MenuItem>
      </Menu>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
              Generate Report
            </Typography>
            <IconButton size="small" onClick={() => setFilterDialogOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
              >
                <MenuItem value="all">All Reports</MenuItem>
                <MenuItem value="clients">Client Report</MenuItem>
                {isAdmin && <MenuItem value="assets">Asset Report</MenuItem>}
                {isAdmin && <MenuItem value="team">Team Report</MenuItem>}
                <MenuItem value="inspections">Inspection Report</MenuItem>
                <MenuItem value="financial">Financial Report</MenuItem>
                {isAdmin && <MenuItem value="compliance">Compliance Report</MenuItem>}
              </Select>
            </FormControl>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
              sx={{ "& input": { fontSize: { xs: "0.75rem", sm: "0.8rem" } } }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
              sx={{ "& input": { fontSize: { xs: "0.75rem", sm: "0.8rem" } } }}
            />
            
            {/* Conditional Filters */}
            {reportType === "clients" && (
              <FormControl fullWidth size="small">
                <InputLabel>Membership Plan</InputLabel>
                <Select
                  value={reportFilters.membershipPlan || ""}
                  onChange={(e) => setReportFilters({ ...reportFilters, membershipPlan: e.target.value })}
                  label="Membership Plan"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                >
                  <MenuItem value="">All Plans</MenuItem>
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            )}
            {reportType === "team" && isAdmin && (
              <FormControl fullWidth size="small">
                <InputLabel>Team Role</InputLabel>
                <Select
                  value={reportFilters.teamRole || ""}
                  onChange={(e) => setReportFilters({ ...reportFilters, teamRole: e.target.value })}
                  label="Team Role"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="inspector">Inspector</MenuItem>
                  <MenuItem value="senior_inspector">Senior Inspector</MenuItem>
                  <MenuItem value="lead_inspector">Lead Inspector</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                </Select>
              </FormControl>
            )}
            {reportType === "assets" && isAdmin && (
              <FormControl fullWidth size="small">
                <InputLabel>Asset Status</InputLabel>
                <Select
                  value={reportFilters.status || ""}
                  onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
                  label="Asset Status"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="In Maintenance">In Maintenance</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button onClick={() => setFilterDialogOpen(false)} sx={{ color: colors.textSecondary }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerateReport}
            disabled={loading}
            sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primaryDark } }}
          >
            {loading ? <CircularProgress size={20} /> : "Generate Report"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Preview */}
      {reportData?.data?.length > 0 && (
        <Card sx={{ mt: { xs: 2, sm: 2.5, md: 3 }, border: `1px solid ${colors.border}` }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ 
                color: colors.textPrimary, 
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" }, 
                mb: { xs: 1, sm: 1.5 } 
              }}
            >
              Report Preview: {reportData.reportType}
            </Typography>
            <Box sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <Box sx={{ minWidth: { xs: 500, sm: 600 } }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: alpha(colors.primary, 0.04) }}>
                      {Object.keys(reportData.data[0]).slice(0, 6).map((key) => (
                        <th
                          key={key}
                          style={{
                            padding: "10px 12px",
                            textAlign: "left",
                            borderBottom: `1px solid ${colors.border}`,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            color: colors.textPrimary,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).slice(0, 6).map((val, i) => (
                          <td
                            key={i}
                            style={{
                              padding: "10px 12px",
                              borderBottom: `1px solid ${colors.border}`,
                              fontSize: "0.7rem",
                              color: colors.textSecondary,
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {typeof val === "object" ? JSON.stringify(val).substring(0, 50) : String(val).substring(0, 50)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
              {reportData.data.length > 5 && (
                <Typography
                  variant="caption"
                  sx={{ display: "block", textAlign: "center", mt: 1.5, color: colors.textSecondary }}
                >
                  + {reportData.data.length - 5} more records
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ bottom: { xs: 72, sm: 80, md: 24 } }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ 
            borderRadius: 2, 
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
            boxShadow: 3,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}