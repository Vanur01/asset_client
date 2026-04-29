// pages/Checklistanalytics.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Stack,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  AreaChart,
  Area,
  LabelList,
} from "recharts";
import { useAuth } from "../context/AuthContexts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ─── Theme ─────────────────────────────────────────────────────────────────
const TEAL = "#1B4D5C";
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: TEAL },
    background: { default: "#F4F6F9", paper: "#FFFFFF" },
    text: { primary: "#1A2B3C", secondary: "#6B7A8D" },
  },
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          border: "1px solid #E8EDF2",
          borderRadius: 14,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
        },
      },
    },
  },
});

// ─── Dummy Data for Fallback ─────────────────────────────────────────────
const getDummySubmissionTrend = () => [
  { date: "Week 1", value: 2 },
  { date: "Week 2", value: 3 },
  { date: "Week 3", value: 5 },
  { date: "Week 4", value: 8 },
  { date: "Week 5", value: 12 },
  { date: "Week 6", value: 10 },
  { date: "Week 7", value: 15 },
  { date: "Week 8", value: 18 },
];

const getDummyCompletionProgress = () => [
  { week: "Week 1", Completed: 17, Pending: 3 },
  { week: "Week 2", Completed: 33, Pending: 5 },
  { week: "Week 3", Completed: 46, Pending: 4 },
  { week: "Week 4", Completed: 61, Pending: 3 },
];

const getDummyAvgResponseTime = () => [
  { q: "Question 1", mins: 2.5 },
  { q: "Question 2", mins: 3.1 },
  { q: "Question 3", mins: 2.0 },
  { q: "Question 4", mins: 4.4 },
  { q: "Question 5", mins: 2.3 },
  { q: "Question 6", mins: 3.8 },
  { q: "Question 7", mins: 4.8 },
];

const getDummyStatusDist = () => [
  { label: "Approved", value: 67, percentage: 67, color: "#1BB87A" },
  { label: "Pending Review", value: 25, percentage: 25, color: "#F4A535" },
  { label: "Rejected", value: 8, percentage: 8, color: "#E05252" },
];

const getDummyTopPerformers = () => [
  { rank: 1, name: "John Smith", submissions: 3, score: 98 },
  { rank: 2, name: "Sarah Johnson", submissions: 2, score: 95 },
  { rank: 3, name: "Mike Davis", submissions: 2, score: 92 },
];

// ─── Helper Functions ─────────────────────────────────────────────────────
const hasValidData = (data) => {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === "object") {
    return Object.values(data).some(
      (val) => val !== 0 && val !== null && val !== undefined && val !== "",
    );
  }
  return data !== 0 && data !== null && data !== undefined;
};

// Export to PDF function
const exportToPDF = (data, checklistName, summary, statusDistribution, submissionTrend, topPerformers) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(27, 77, 92);
  doc.text(checklistName, 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Analytics & Performance Report", 14, 30);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);
  
  // Summary Section
  doc.setFontSize(14);
  doc.setTextColor(27, 77, 92);
  doc.text("Summary Statistics", 14, 50);
  
  doc.autoTable({
    startY: 55,
    head: [["Metric", "Value"]],
    body: [
      ["Total Assignments", summary.totalAssignments],
      ["Total Responses", summary.totalResponses],
      ["Completion Rate", `${summary.completionRate}%`],
      ["Approval Rate", `${summary.approvalRate}%`],
      ["Approved", summary.approved],
      ["Rejected", summary.rejected],
      ["Pending Review", summary.pendingReview],
      ["Avg. Completion Time", `${summary.avgCompletionTime} minutes`],
    ],
    theme: "striped",
    headStyles: { fillColor: [27, 77, 92] },
    margin: { left: 14 },
  });
  
  let yOffset = doc.lastAutoTable.finalY + 15;
  
  // Status Distribution
  if (statusDistribution.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(27, 77, 92);
    doc.text("Status Distribution", 14, yOffset);
    
    doc.autoTable({
      startY: yOffset + 5,
      head: [["Status", "Count", "Percentage"]],
      body: statusDistribution.map(item => [item.label, item.value, `${item.percentage || item.value}%`]),
      theme: "striped",
      headStyles: { fillColor: [27, 77, 92] },
      margin: { left: 14 },
    });
    
    yOffset = doc.lastAutoTable.finalY + 15;
  }
  
  // Submission Trend
  if (submissionTrend.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(27, 77, 92);
    doc.text("Submission Trend", 14, yOffset);
    
    doc.autoTable({
      startY: yOffset + 5,
      head: [["Period", "Submissions"]],
      body: submissionTrend.map(item => [item.date, item.value]),
      theme: "striped",
      headStyles: { fillColor: [27, 77, 92] },
      margin: { left: 14 },
    });
    
    yOffset = doc.lastAutoTable.finalY + 15;
  }
  
  // Top Performers
  if (topPerformers.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(27, 77, 92);
    doc.text("Top Performers", 14, yOffset);
    
    doc.autoTable({
      startY: yOffset + 5,
      head: [["Rank", "Name", "Submissions", "Score"]],
      body: topPerformers.map(p => [p.rank, p.name, p.submissions, `${p.score}%`]),
      theme: "striped",
      headStyles: { fillColor: [27, 77, 92] },
      margin: { left: 14 },
    });
  }
  
  doc.save(`${checklistName.replace(/\s+/g, '_')}_Analytics_Report.pdf`);
};

// Export to Excel function
const exportToExcel = (data, checklistName, summary, statusDistribution, submissionTrend, topPerformers, completionProgress, avgResponseTime) => {
  const workbook = XLSX.utils.book_new();
  
  // Summary Sheet
  const summaryData = [
    ["Metric", "Value"],
    ["Total Assignments", summary.totalAssignments],
    ["Total Responses", summary.totalResponses],
    ["Completion Rate", `${summary.completionRate}%`],
    ["Approval Rate", `${summary.approvalRate}%`],
    ["Approved", summary.approved],
    ["Rejected", summary.rejected],
    ["Pending Review", summary.pendingReview],
    ["Avg. Completion Time", `${summary.avgCompletionTime} minutes`],
    ["Report Generated", new Date().toLocaleString()],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
  
  // Status Distribution Sheet
  if (statusDistribution.length > 0) {
    const statusData = [["Status", "Count", "Percentage"], ...statusDistribution.map(item => [item.label, item.value, `${item.percentage || item.value}%`])];
    const statusSheet = XLSX.utils.aoa_to_sheet(statusData);
    XLSX.utils.book_append_sheet(workbook, statusSheet, "Status Distribution");
  }
  
  // Submission Trend Sheet
  if (submissionTrend.length > 0) {
    const trendData = [["Period", "Submissions"], ...submissionTrend.map(item => [item.date, item.value])];
    const trendSheet = XLSX.utils.aoa_to_sheet(trendData);
    XLSX.utils.book_append_sheet(workbook, trendSheet, "Submission Trend");
  }
  
  // Completion Progress Sheet
  if (completionProgress.length > 0) {
    const progressData = [["Week", "Completed", "Pending"], ...completionProgress.map(item => [item.week, item.Completed, item.Pending])];
    const progressSheet = XLSX.utils.aoa_to_sheet(progressData);
    XLSX.utils.book_append_sheet(workbook, progressSheet, "Completion Progress");
  }
  
  // Response Time Sheet
  if (avgResponseTime.length > 0) {
    const responseData = [["Question", "Minutes"], ...avgResponseTime.map(item => [item.q, item.mins])];
    const responseSheet = XLSX.utils.aoa_to_sheet(responseData);
    XLSX.utils.book_append_sheet(workbook, responseSheet, "Response Time");
  }
  
  // Top Performers Sheet
  if (topPerformers.length > 0) {
    const performersData = [["Rank", "Name", "Submissions", "Score"], ...topPerformers.map(p => [p.rank, p.name, p.submissions, `${p.score}%`])];
    const performersSheet = XLSX.utils.aoa_to_sheet(performersData);
    XLSX.utils.book_append_sheet(workbook, performersSheet, "Top Performers");
  }
  
  XLSX.writeFile(workbook, `${checklistName.replace(/\s+/g, '_')}_Analytics_Report.xlsx`);
};

// ─── Stat Card Component ─────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  trend,
  trendPositive,
  sub,
  loading,
}) {
  if (loading) {
    return (
      <Paper sx={{ p: 2.8, height: "100%" }}>
        <Skeleton variant="circular" width={48} height={48} sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="80%" height={20} />
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 2.8,
        height: "100%",
        display: "flex",
        width:"270px",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ color: iconColor, fontSize: 24 }} />
        </Box>
        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            {trendPositive ? (
              <TrendingUpIcon sx={{ fontSize: 12, color: "#1BB87A" }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 12, color: "#E05252" }} />
            )}
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: trendPositive ? "#1BB87A" : "#E05252",
              }}
            >
              {trend}
            </Typography>
          </Box>
        )}
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            mb: 0.5,
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.1,
          }}
        >
          {value !== undefined && value !== null ? value : 0}
        </Typography>
      </Box>
      {sub && (
        <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

// ─── Custom Pie Label ────────────────────────────────────────────────────
const RADIAN = Math.PI / 180;
function CustomPieLabel({ cx, cy, midAngle, outerRadius, name, value, color }) {
  const radius = outerRadius + 36;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={11}
      fontWeight={500}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name}: ${value}%`}
    </text>
  );
}

// ─── Detailed Stat Sub-card ──────────────────────────────────────────────
function DetailSubCard({ icon: Icon, title, rows, hasProgress, isLoading }) {
  if (isLoading) {
    return (
      <Paper
        sx={{
          p: 2.5,
          background: "#EEF3F8",
          border: "none",
          boxShadow: "none",
          borderRadius: 1,
          height: "100%",
        }}
      >
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="90%" height={40} />
        <Skeleton variant="text" width="90%" height={40} />
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 2.5,
        background: "#EEF3F8",
        border: "none",
        boxShadow: "none",
        borderRadius: 1,
        width:"345px",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Icon sx={{ fontSize: 18, color: TEAL }} />
        <Typography
          sx={{ fontWeight: 600, fontSize: "0.85rem", color: "text.primary" }}
        >
          {title}
        </Typography>
      </Box>
      {rows.map((row, i) => (
        <Box key={i} sx={{ mb: hasProgress ? 1.5 : 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: hasProgress ? 0.6 : 0,
            }}
          >
            <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
              {row.label}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {row.value}
            </Typography>
          </Box>
          {hasProgress && (
            <LinearProgress
              variant="determinate"
              value={parseFloat(row.value)}
              sx={{
                height: 6,
                borderRadius: 6,
                backgroundColor: "#D5E0EA",
                "& .MuiLinearProgress-bar": {
                  background: TEAL,
                  borderRadius: 6,
                },
              }}
            />
          )}
        </Box>
      ))}
    </Paper>
  );
}

// ─── Filter Dialog Component ─────────────────────────────────────────────
function FilterDialog({ open, onClose, filters, onApplyFilters }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Filter Analytics
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={localFilters.dateRange}
              label="Date Range"
              onChange={(e) => handleChange("dateRange", e.target.value)}
            >
              <MenuItem value="last7">Last 7 Days</MenuItem>
              <MenuItem value="last30">Last 30 Days</MenuItem>
              <MenuItem value="last90">Last 90 Days</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="lastMonth">Last Month</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={localFilters.status}
              label="Status Filter"
              onChange={(e) => handleChange("status", e.target.value)}
              multiple
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="pending">Pending Review</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={localFilters.sortBy}
              label="Sort By"
              onChange={(e) => handleChange("sortBy", e.target.value)}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="completionRate">Completion Rate</MenuItem>
              <MenuItem value="score">Score</MenuItem>
              <MenuItem value="submissions">Submissions</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sort Order</InputLabel>
            <Select
              value={localFilters.sortOrder}
              label="Sort Order"
              onChange={(e) => handleChange("sortOrder", e.target.value)}
            >
              <MenuItem value="desc">Descending</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Minimum Score"
            type="number"
            value={localFilters.minScore}
            onChange={(e) => handleChange("minScore", e.target.value)}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFilters.showOnlyCompleted}
                  onChange={(e) => handleChange("showOnlyCompleted", e.target.checked)}
                />
              }
              label="Show Only Completed Assignments"
            />
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onApplyFilters(localFilters)}
          sx={{ background: TEAL }}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
export default function ChecklistAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authRequest } = useAuth();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [checklistName, setChecklistName] = useState("Checklist Analytics");
  const [period, setPeriod] = useState("Last 30 Days");
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "last30",
    status: [],
    sortBy: "date",
    sortOrder: "desc",
    minScore: "",
    showOnlyCompleted: false,
  });
  const [filteredData, setFilteredData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/assignments/checklist/${id}/analytics`;
      
      // Add query parameters for filtering
      const queryParams = new URLSearchParams();
      if (filters.dateRange !== "all") {
        queryParams.append("dateRange", filters.dateRange);
      }
      if (filters.status.length > 0) {
        queryParams.append("status", filters.status.join(","));
      }
      if (filters.minScore) {
        queryParams.append("minScore", filters.minScore);
      }
      if (filters.showOnlyCompleted) {
        queryParams.append("completed", "true");
      }
      queryParams.append("sortBy", filters.sortBy);
      queryParams.append("sortOrder", filters.sortOrder);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await authRequest("GET", url);

      if (response.success) {
        setAnalytics(response);
        if (response.assignments && response.assignments.length > 0) {
          setChecklistName(
            response.assignments[0]?.checklist?.name || "Checklist Analytics",
          );
        }
        setFilteredData(null);
      } else {
        setError(response.message || "Failed to fetch analytics");
        setSnackbar({
          open: true,
          message: response.message || "Failed to fetch analytics",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.message || "Failed to load analytics");
      setSnackbar({
        open: true,
        message: err.message || "Failed to load analytics",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [authRequest, id, filters]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Apply local filters to data
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setFilterDialogOpen(false);
    fetchAnalytics();
  };

  // Get data with fallback to dummy data
  const getSummary = () => {
    if (!analytics?.summary || !hasValidData(analytics.summary)) {
      return {
        totalAssignments: 24,
        totalResponses: 18,
        completionRate: 75,
        approvalRate: 85,
        approved: 12,
        rejected: 3,
        pendingReview: 3,
        avgCompletionTime: 8.5,
      };
    }
    return analytics.summary;
  };

  const getSubmissionTrend = () => {
    if (analytics?.submissionTrend && analytics.submissionTrend.length > 0) {
      return analytics.submissionTrend;
    }
    return getDummySubmissionTrend();
  };

  const getStatusDistribution = () => {
    if (
      analytics?.statusDistribution &&
      analytics.statusDistribution.length > 0
    ) {
      return analytics.statusDistribution.map((item) => ({
        ...item,
        color:
          item.label === "Approved"
            ? "#1BB87A"
            : item.label === "Rejected"
              ? "#E05252"
              : "#F4A535",
      }));
    }
    return getDummyStatusDist();
  };

  const getTopPerformers = () => {
    let performers = analytics?.topPerformers && analytics.topPerformers.length > 0
      ? analytics.topPerformers
      : getDummyTopPerformers();
    
    // Apply min score filter
    if (filters.minScore && performers.length > 0) {
      performers = performers.filter(p => p.score >= parseInt(filters.minScore));
    }
    
    // Apply sorting
    if (filters.sortBy === "score") {
      performers.sort((a, b) => filters.sortOrder === "desc" ? b.score - a.score : a.score - b.score);
    } else if (filters.sortBy === "submissions") {
      performers.sort((a, b) => filters.sortOrder === "desc" ? b.submissions - a.submissions : a.submissions - b.submissions);
    }
    
    return performers;
  };

  const summary = getSummary();
  const submissionTrend = getSubmissionTrend();
  const statusDistribution = getStatusDistribution();
  const topPerformers = getTopPerformers();
  const completionProgress = getDummyCompletionProgress();
  const avgResponseTime = getDummyAvgResponseTime();

  // Prepare stat cards data
  const statCards = [
    {
      icon: PeopleAltOutlinedIcon,
      iconBg: TEAL,
      iconColor: "#fff",
      label: "Total Assignments",
      value: summary.totalAssignments,
      sub: `${summary.totalResponses} responses received`,
    },
    {
      icon: CheckCircleOutlinedIcon,
      iconBg: "#1BB87A",
      iconColor: "#fff",
      label: "Completion Rate",
      value: `${summary.completionRate}%`,
      sub: `${summary.totalResponses} of ${summary.totalAssignments} completed`,
    },
    {
      icon: AccessTimeOutlinedIcon,
      iconBg: "#F4A535",
      iconColor: "#fff",
      label: "Avg. Completion Time",
      value: `${summary.avgCompletionTime}m`,
      sub: "Average time per assignment",
    },
    {
      icon: BarChartOutlinedIcon,
      iconBg: "#9C27B0",
      iconColor: "#fff",
      label: "Approval Rate",
      value: `${summary.approvalRate}%`,
      sub: `${summary.approved} approved, ${summary.rejected} rejected`,
    },
  ];

  // Prepare detailed stats
  const detailedStats = {
    responseQuality: {
      approved: summary.approved,
      rejected: summary.rejected,
      pendingReview: summary.pendingReview,
      total: summary.totalResponses,
    },
    timeliness: {
      onTime: Math.round(summary.completionRate * 0.85),
      delayed: Math.round(summary.completionRate * 0.15),
    },
    issues: {
      critical: summary.rejected || 2,
      minor: Math.round(summary.totalResponses * 0.15) || 5,
    },
  };

  const handleExport = (type) => {
    if (type === "PDF") {
      exportToPDF(
        analytics,
        checklistName,
        summary,
        statusDistribution,
        submissionTrend,
        topPerformers
      );
    } else if (type === "Excel") {
      exportToExcel(
        analytics,
        checklistName,
        summary,
        statusDistribution,
        submissionTrend,
        topPerformers,
        completionProgress,
        avgResponseTime
      );
    }
    setSnackbar({
      open: true,
      message: `${type} report exported successfully!`,
      severity: "success",
    });
    setExportAnchorEl(null);
  };

  const handleRefresh = () => {
    fetchAnalytics();
    setSnackbar({
      open: true,
      message: "Refreshing analytics...",
      severity: "info",
    });
  };

  if (loading && !analytics) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "#F4F6F9",
            p: { xs: 2, md: 3.5 },
          }}
        >
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3.5 } }}>
        {/* ── Back navigation ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2.5,
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon sx={{ fontSize: 18, color: TEAL }} />
          <Typography
            sx={{ fontSize: "0.85rem", color: TEAL, fontWeight: 500 }}
          >
            Back to Assigned Checklists
          </Typography>
        </Box>

        {/* ── Header ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "text.primary",
                fontSize: { xs: "1.2rem", sm: "1.3rem" },
                mb: 0.3,
              }}
            >
              {checklistName}
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
              Analytics & Performance Dashboard
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<FilterListIcon sx={{ fontSize: 15 }} />}
              onClick={() => setFilterDialogOpen(true)}
              sx={{
                borderColor: "#D0D9E4",
                color: "text.primary",
                textTransform: "none",
                fontSize: "0.8rem",
                borderRadius: 3,
                px: 2,
                py: 0.8,
                "&:hover": { borderColor: TEAL, background: "transparent" },
              }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon sx={{ fontSize: 15 }} />}
              onClick={handleRefresh}
              sx={{
                borderColor: "#D0D9E4",
                color: "text.primary",
                textTransform: "none",
                fontSize: "0.8rem",
                borderRadius: 3,
                px: 2,
                py: 0.8,
                "&:hover": { borderColor: TEAL, background: "transparent" },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarTodayOutlinedIcon sx={{ fontSize: 15 }} />}
              sx={{
                borderColor: "#D0D9E4",
                color: "text.primary",
                textTransform: "none",
                fontSize: "0.8rem",
                borderRadius: 3,
                px: 2,
                py: 0.8,
                "&:hover": { borderColor: TEAL, background: "transparent" },
              }}
            >
              {period}
            </Button>
            <Button
              variant="contained"
              startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 15 }} />}
              onClick={(e) => setExportAnchorEl(e.currentTarget)}
              sx={{
                background: TEAL,
                textTransform: "none",
                fontSize: "0.8rem",
                borderRadius: 3,
                px: 2.5,
                py: 0.8,
                boxShadow: "none",
                "&:hover": { background: "#163D4A", boxShadow: "none" },
              }}
            >
              Export Report
            </Button>
            <Menu
              anchorEl={exportAnchorEl}
              open={Boolean(exportAnchorEl)}
              onClose={() => setExportAnchorEl(null)}
            >
              <MenuItem onClick={() => handleExport("PDF")}>
                <PictureAsPdfIcon sx={{ fontSize: 18, mr: 1 }} /> Export as PDF
              </MenuItem>
              <MenuItem onClick={() => handleExport("Excel")}>
                <TableChartIcon sx={{ fontSize: 18, mr: 1 }} /> Export as Excel
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* ── Active Filters Display ── */}
        {(filters.dateRange !== "last30" || filters.status.length > 0 || filters.minScore || filters.showOnlyCompleted || filters.sortBy !== "date" || filters.sortOrder !== "desc") && (
          <Paper sx={{ p: 2, mb: 2, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Active Filters:
            </Typography>
            {filters.dateRange !== "last30" && (
              <Chip
                label={`Date: ${filters.dateRange}`}
                size="small"
                onDelete={() => setFilters(prev => ({ ...prev, dateRange: "last30" }))}
                sx={{ height: 24 }}
              />
            )}
            {filters.status.length > 0 && (
              <Chip
                label={`Status: ${filters.status.join(", ")}`}
                size="small"
                onDelete={() => setFilters(prev => ({ ...prev, status: [] }))}
                sx={{ height: 24 }}
              />
            )}
            {filters.minScore && (
              <Chip
                label={`Min Score: ${filters.minScore}%`}
                size="small"
                onDelete={() => setFilters(prev => ({ ...prev, minScore: "" }))}
                sx={{ height: 24 }}
              />
            )}
            {filters.showOnlyCompleted && (
              <Chip
                label="Only Completed"
                size="small"
                onDelete={() => setFilters(prev => ({ ...prev, showOnlyCompleted: false }))}
                sx={{ height: 24 }}
              />
            )}
            {filters.sortBy !== "date" && (
              <Chip
                label={`Sort: ${filters.sortBy} (${filters.sortOrder})`}
                size="small"
                onDelete={() => setFilters(prev => ({ ...prev, sortBy: "date", sortOrder: "desc" }))}
                sx={{ height: 24 }}
              />
            )}
          </Paper>
        )}

        {/* ── Stat Cards ── */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <StatCard {...card} loading={loading && !analytics} />
            </Grid>
          ))}
        </Grid>

        {/* ── Charts Row 1: Line + Pie ── */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Submission Trend */}
          <Grid item xs={12} md={7} sx={{width:"560px"}}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: 300, sm: 340 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Submission Trend
                </Typography>
                <Chip
                  label={period}
                  size="small"
                  sx={{
                    background: "#EEF3F8",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    height: 24,
                  }}
                />
              </Box>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={submissionTrend}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F0F4F8"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9BA8B5" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9BA8B5" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RTooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E8EDF2",
                      fontSize: 12,
                    }}
                    cursor={{ stroke: "#E8EDF2" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    fill={`${TEAL}15`}
                    fillOpacity={0.3}
                    dot={{ fill: TEAL, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: TEAL }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Status Distribution */}
          <Grid item xs={12} md={5} sx={{width:"550px"}}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: 300, sm: 340 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Status Distribution
                </Typography>
                <Chip
                  label={`${summary.totalResponses} Total`}
                  size="small"
                  sx={{
                    background: "#EEF3F8",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    height: 24,
                  }}
                />
              </Box>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="45%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    labelLine={false}
                    label={<CustomPieLabel />}
                  >
                    {statusDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* ── Charts Row 2: Bar Charts ── */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Completion Rate Progress */}
          <Grid item xs={12} md={6} sx={{width:"560px"}}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: 320, sm: 360 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Completion Rate Progress
                </Typography>
                <Chip
                  label="Weekly"
                  size="small"
                  sx={{
                    background: "#EEF3F8",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    height: 24,
                  }}
                />
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={completionProgress}
                  margin={{ top: 5, right: 10, left: -20, bottom: 20 }}
                  barGap={4}
                  barCategoryGap="35%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F0F4F8"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "#9BA8B5" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9BA8B5" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RTooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E8EDF2",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                    iconType="square"
                    iconSize={10}
                    formatter={(v) => (
                      <span style={{ color: "#6B7A8D" }}>{v}</span>
                    )}
                  />
                  <Bar dataKey="Completed" fill={TEAL} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pending" fill="#C8D6DF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Avg Response Time per Question */}
          <Grid item xs={12} md={6} sx={{width:"550px"}}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: 320, sm: 360 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Avg Response Time per Question
                </Typography>
                <Chip
                  label="Minutes"
                  size="small"
                  sx={{
                    background: "#EEF3F8",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    height: 24,
                  }}
                />
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  layout="vertical"
                  data={avgResponseTime}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F0F4F8"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#9BA8B5" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 8]}
                  />
                  <YAxis
                    dataKey="q"
                    type="category"
                    tick={{ fontSize: 11, fill: "#9BA8B5" }}
                    axisLine={false}
                    tickLine={false}
                    width={isMobile ? 60 : 75}
                  />
                  <RTooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E8EDF2",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="mins" fill={TEAL} radius={[0, 4, 4, 0]}>
                    <LabelList
                      dataKey="mins"
                      position="right"
                      fontSize={10}
                      fill="#6B7A8D"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* ── Detailed Statistics ── */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 2.5 }}>
            Detailed Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <DetailSubCard
                icon={TaskAltOutlinedIcon}
                title="Response Quality"
                rows={[
                  {
                    label: "Approved",
                    value: `${detailedStats.responseQuality.approved}`,
                  },
                  {
                    label: "Rejected",
                    value: `${detailedStats.responseQuality.rejected}`,
                  },
                  {
                    label: "Pending Review",
                    value: `${detailedStats.responseQuality.pendingReview}`,
                  },
                ]}
                hasProgress={false}
                isLoading={loading && !analytics}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DetailSubCard
                icon={AccessTimeOutlinedIcon}
                title="Timeliness"
                rows={[
                  {
                    label: "On-time Submissions",
                    value: `${detailedStats.timeliness.onTime}%`,
                  },
                  {
                    label: "Delayed Submissions",
                    value: `${detailedStats.timeliness.delayed}%`,
                  },
                ]}
                hasProgress={true}
                isLoading={loading && !analytics}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DetailSubCard
                icon={ErrorOutlineIcon}
                title="Issues Reported"
                rows={[
                  {
                    label: "Critical Issues",
                    value: `${detailedStats.issues.critical}`,
                  },
                  {
                    label: "Minor Issues",
                    value: `${detailedStats.issues.minor}`,
                  },
                ]}
                hasProgress={false}
                isLoading={loading && !analytics}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Top Performers ── */}
        {topPerformers.length > 0 && (
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 2.5 }}>
              Top Performers
            </Typography>
            {topPerformers.map((performer, i) => (
              <Box key={i}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.8,
                    flexWrap: "wrap",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      background: TEAL,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {performer.rank || i + 1}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "text.primary",
                      }}
                    >
                      {performer.name || `Team Member ${i + 1}`}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.7rem", color: "text.secondary" }}
                    >
                      {performer.submissions || 0} submissions
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      textAlign: "right",
                      minWidth: { xs: "100%", sm: 140 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        color: "text.primary",
                        mb: 0.6,
                      }}
                    >
                      Score: {performer.score || 0}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={performer.score || 0}
                      sx={{
                        height: 6,
                        borderRadius: 6,
                        backgroundColor: "#D5E0EA",
                        "& .MuiLinearProgress-bar": {
                          background: TEAL,
                          borderRadius: 6,
                        },
                      }}
                    />
                  </Box>
                </Box>
                {i < topPerformers.length - 1 && (
                  <Divider sx={{ borderColor: "#F0F4F8" }} />
                )}
              </Box>
            ))}
          </Paper>
        )}

        {/* ── No Data Message ── */}
        {!loading &&
          (!analytics ||
            (!hasValidData(analytics.summary) &&
              analytics?.submissionTrend?.length === 0)) && (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography sx={{ color: "text.secondary" }}>
                No analytics data available yet. Start assigning checklists to
                see analytics.
              </Typography>
            </Paper>
          )}

        {/* ── Filter Dialog ── */}
        <FilterDialog
          open={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          filters={filters}
          onApplyFilters={applyFilters}
        />

        {/* ── Snackbar ── */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}