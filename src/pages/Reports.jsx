// pages/Reports.jsx - Updated with Role-Based Report Access + Proper Excel Export

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  MenuItem,
  CardContent,
  IconButton,
  useMediaQuery,
  Stack,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tab,
  Tabs,
  Skeleton,
  useTheme as useMuiTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import TableChartIcon from "@mui/icons-material/TableChart";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import { useReport } from "../context/ReportContext";
import { useAuth } from "../context/AuthContexts";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import * as XLSX from "xlsx";

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
// Excel Column Definitions per Report Type
// ─────────────────────────────────────────────

// Super Admin sees: Client Report columns
const CLIENT_REPORT_COLUMNS = [
  { key: "name", header: "Client Name" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
  { key: "membershipPlan", header: "Membership Plan" },
  { key: "status", header: "Status" },
  { key: "daysRemaining", header: "Days Remaining" },
  { key: "licenseLimit", header: "License Limit" },
  { key: "usersUsed", header: "Users Used" },
  { key: "usagePercentage", header: "Usage %" },
  { key: "website", header: "Website" },
  { key: "address", header: "Address" },
  { key: "createdAt", header: "Joined Date" },
];

// Admin sees: Team Member Report columns
const TEAM_REPORT_COLUMNS = [
  { key: "fullName", header: "Full Name" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
  { key: "department", header: "Department" },
  { key: "teamRole", header: "Role" },
  { key: "location", header: "Location" },
  { key: "status", header: "Status" },
  { key: "assignedCount", header: "Assigned Tasks" },
  { key: "completedCount", header: "Completed Tasks" },
  { key: "completionRate", header: "Completion Rate %" },
  { key: "createdAt", header: "Joined Date" },
];

// Asset Report columns (Admin only)
const ASSET_REPORT_COLUMNS = [
  { key: "assetName", header: "Asset Name" },
  { key: "assetCode", header: "Asset Code" },
  { key: "category", header: "Category" },
  { key: "status", header: "Status" },
  { key: "location", header: "Location" },
  { key: "assignedTo", header: "Assigned To" },
  { key: "purchaseDate", header: "Purchase Date" },
  { key: "purchaseValue", header: "Purchase Value" },
  { key: "currentValue", header: "Current Value" },
  { key: "lastInspection", header: "Last Inspection" },
  { key: "nextInspection", header: "Next Inspection" },
];

// Inspection Report columns
const INSPECTION_REPORT_COLUMNS = [
  { key: "checklistName", header: "Checklist Name" },
  { key: "assignedTo", header: "Assigned To" },
  { key: "assignedBy", header: "Assigned By" },
  { key: "status", header: "Status" },
  { key: "dueDate", header: "Due Date" },
  { key: "completedAt", header: "Completed Date" },
  { key: "score", header: "Score" },
  { key: "location", header: "Location" },
  { key: "notes", header: "Notes" },
];

// Financial Report columns
const FINANCIAL_REPORT_COLUMNS = [
  { key: "clientName", header: "Client Name" },
  { key: "plan", header: "Plan" },
  { key: "amount", header: "Amount (₹)" },
  { key: "paymentDate", header: "Payment Date" },
  { key: "dueDate", header: "Due Date" },
  { key: "status", header: "Payment Status" },
  { key: "invoiceNo", header: "Invoice No" },
  { key: "period", header: "Billing Period" },
];

const REPORT_COLUMNS_MAP = {
  clients: CLIENT_REPORT_COLUMNS,
  team: TEAM_REPORT_COLUMNS,
  assets: ASSET_REPORT_COLUMNS,
  inspections: INSPECTION_REPORT_COLUMNS,
  financial: FINANCIAL_REPORT_COLUMNS,
};

// ─────────────────────────────────────────────
// Excel Export — properly structured rows/cols
// ─────────────────────────────────────────────
const exportToExcel = (data, reportType, dateRange, filters = {}, userRole) => {
  if (!data || !data.data || data.data.length === 0) {
    console.error("No data to export");
    return false;
  }

  try {
    const wb = XLSX.utils.book_new();

    // ── 1. Determine columns based on report type ──────────────────────
    const columns = REPORT_COLUMNS_MAP[reportType] || [];

    // If we have a column map, use it; otherwise auto-generate from keys
    let headers, rows;

    if (columns.length > 0) {
      headers = columns.map((c) => c.header);

      rows = data.data.map((row) =>
        columns.map(({ key }) => {
          const val = row[key];
          if (val === null || val === undefined) return "—";
          if (typeof val === "boolean") return val ? "Yes" : "No";
          if (typeof val === "object") {
            // Handle nested objects like address, stats, etc.
            if (key === "address" && typeof val === "object") {
              return [val.street, val.city, val.state, val.country]
                .filter(Boolean)
                .join(", ");
            }
            return JSON.stringify(val);
          }
          // Format dates
          if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
            return new Date(val).toLocaleDateString("en-IN");
          }
          return val;
        }),
      );
    } else {
      // Fallback: auto columns from data keys
      const keys = Object.keys(data.data[0]);
      headers = keys.map((k) =>
        k.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      );
      rows = data.data.map((row) =>
        keys.map((k) => {
          const val = row[k];
          if (val === null || val === undefined) return "—";
          if (typeof val === "boolean") return val ? "Yes" : "No";
          if (typeof val === "object") return JSON.stringify(val);
          return val;
        }),
      );
    }

    // ── 2. Build Metadata block ────────────────────────────────────────
    const reportLabel =
      reportType.charAt(0).toUpperCase() + reportType.slice(1);

    const metaRows = [
      ["Report Type", reportLabel],
      ["Generated By", userRole || "User"],
      ["Generated Date", new Date().toLocaleString("en-IN")],
      ["Date Range", dateRange ? `Last ${dateRange} days` : "Custom"],
      ["Start Date", filters.startDate || "N/A"],
      ["End Date", filters.endDate || "N/A"],
      ["Total Records", data.data.length],
      [], // blank separator row
    ];

    // ── 3. Combine: metadata + header row + data rows ──────────────────
    const allRows = [...metaRows, headers, ...rows];

    const ws = XLSX.utils.aoa_to_sheet(allRows);

    // ── 4. Column widths ───────────────────────────────────────────────
    const colWidths = headers.map((h) => ({
      wch: Math.max(h.length + 4, 18),
    }));
    ws["!cols"] = colWidths;

    // ── 5. Freeze the header row (row index = metaRows.length + 1) ─────
    ws["!freeze"] = { xSplit: 0, ySplit: metaRows.length + 1 };

    // ── 6. Append sheet & write file ──────────────────────────────────
    const sheetName = reportLabel.substring(0, 31); // Excel sheet name max 31 chars
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const fileName = `${reportType}_report_${Date.now()}.xlsx`;
    XLSX.writeFile(wb, fileName);
    return true;
  } catch (error) {
    console.error("Excel Export Error:", error);
    return false;
  }
};

// ─── Loading Skeleton ─────────────────────────────────────────────
const ReportSkeleton = () => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
        }}
      >
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={isMobile ? 100 : 120}
            sx={{ borderRadius: 3 }}
          />
        ))}
      </Box>
      <Skeleton variant="rounded" height={40} sx={{ mb: 3 }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "7fr 5fr",
          gap: 2,
        }}
      >
        <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    </Box>
  );
};

// ─── Error State ─────────────────────────────────────────────
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
    <ErrorOutlineIcon
      sx={{ fontSize: { xs: 48, sm: 64 }, color: colors.error, mb: 2 }}
    />
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        color: colors.textPrimary,
        mb: 1,
        textAlign: "center",
      }}
    >
      Failed to Load Reports
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: colors.textSecondary,
        mb: 3,
        textAlign: "center",
        maxWidth: 400,
      }}
    >
      {message || "An error occurred while loading reports. Please try again."}
    </Typography>
    <Button
      variant="contained"
      onClick={onRetry}
      startIcon={<RefreshIcon />}
      sx={{ bgcolor: colors.primary }}
    >
      Retry
    </Button>
  </Box>
);

// ─── Empty State ─────────────────────────────────────────────
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
    {Icon && (
      <Icon
        sx={{ fontSize: { xs: 40, sm: 48 }, color: colors.textDisabled, mb: 2 }}
      />
    )}
    <Typography
      variant="subtitle1"
      sx={{ fontWeight: 600, color: colors.textPrimary, mb: 1 }}
    >
      {title}
    </Typography>
    <Typography
      variant="caption"
      sx={{ color: colors.textSecondary, maxWidth: 300 }}
    >
      {description}
    </Typography>
  </Box>
);

// ─── Custom Tooltip ─────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
  valuePrefix = "",
  valueSuffix = "",
}) => {
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
        <Typography
          variant="caption"
          sx={{ color: colors.textSecondary, mb: 0.5, display: "block" }}
        >
          {label || payload[0]?.name}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: colors.textPrimary }}
        >
          {valuePrefix}
          {payload[0]?.value?.toLocaleString()}
          {valueSuffix}
        </Typography>
      </Box>
    );
  }
  return null;
};

// ─── Stat Card ─────────────────────────────────────────────
function StatCard({ icon, label, value, sub, bg, loading }) {
  if (loading) {
    return (
      <Box sx={{ borderRadius: 3, background: bg, p: { xs: 1.5, sm: 2 } }}>
        <Skeleton
          variant="circular"
          width={24}
          height={24}
          sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 1 }}
        />
        <Skeleton
          variant="text"
          width="60%"
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={30}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
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
        transition: "transform 0.2s",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 0.75 },
          mb: { xs: 0.75, sm: 1 },
        }}
      >
        {icon}
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
            fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
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
          fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
        }}
      >
        {value ?? 0}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "rgba(255,255,255,0.75)",
          fontSize: { xs: "0.55rem", sm: "0.6rem" },
        }}
      >
        {sub}
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Role-specific Table Components
// ─────────────────────────────────────────────────────────────────────────────

// ── Client Report Table (Super Admin view) ────────────────────────────────────
function ClientReportTable({ data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data || !data.data || data.data.length === 0) {
    return (
      <EmptyState
        icon={BusinessIcon}
        title="No Client Data"
        description="No client records found for the selected filters"
      />
    );
  }

  const rows = data.data;
  const paginated = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const statusColor = (s) => {
    if (!s) return colors.textDisabled;
    const sl = s.toLowerCase();
    if (sl === "active") return colors.success;
    if (sl === "inactive" || sl === "suspended") return colors.error;
    if (sl === "trial") return colors.warning;
    return colors.textSecondary;
  };

  const planColor = (plan) => {
    if (!plan) return alpha(colors.textDisabled, 0.15);
    const p = plan.toLowerCase();
    if (p === "enterprise") return alpha(colors.purple, 0.12);
    if (p === "premium") return alpha(colors.primary, 0.12);
    if (p === "standard") return alpha(colors.primaryLight, 0.12);
    return alpha(colors.textDisabled, 0.1);
  };

  return (
    <Box>
      <TableContainer sx={{ maxHeight: 480, overflowX: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {CLIENT_REPORT_COLUMNS.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    bgcolor: alpha(colors.primary, 0.05),
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    color: colors.textPrimary,
                    whiteSpace: "nowrap",
                    borderBottom: `2px solid ${colors.border}`,
                  }}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row, idx) => (
              <TableRow
                key={idx}
                hover
                sx={{ "&:hover": { bgcolor: alpha(colors.primary, 0.02) } }}
              >
                <TableCell
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: colors.textPrimary,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.6rem",
                        bgcolor: colors.primary,
                      }}
                    >
                      {(row.name || row.customerName || "?")[0]?.toUpperCase()}
                    </Avatar>
                    {row.name || row.customerName || "—"}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                >
                  {row.email || "—"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                >
                  {row.phone || "—"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.membershipPlan || "—"}
                    size="small"
                    sx={{
                      bgcolor: planColor(row.membershipPlan),
                      fontSize: "0.62rem",
                      height: 20,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status || "Active"}
                    size="small"
                    sx={{
                      bgcolor: alpha(statusColor(row.status), 0.12),
                      color: statusColor(row.status),
                      fontSize: "0.62rem",
                      height: 20,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                >
                  {row.daysRemaining ?? "—"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                >
                  {row.licenseLimit ?? "—"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                >
                  {row.usersUsed ?? "—"}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: colors.border,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min(row.usagePercentage || 0, 100)}%`,
                          height: "100%",
                          bgcolor:
                            (row.usagePercentage || 0) > 80
                              ? colors.error
                              : colors.success,
                          borderRadius: 3,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{ fontSize: "0.65rem", color: colors.textSecondary }}
                    >
                      {row.usagePercentage || 0}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.7rem",
                    color: colors.textSecondary,
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.website || "—"}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.7rem",
                    color: colors.textSecondary,
                    maxWidth: 150,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {typeof row.address === "object"
                    ? [row.address?.city, row.address?.state]
                        .filter(Boolean)
                        .join(", ")
                    : row.address || "—"}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.7rem",
                    color: colors.textSecondary,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("en-IN")
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          "& .MuiTablePagination-toolbar": { fontSize: "0.7rem" },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            { fontSize: "0.7rem" },
        }}
      />
    </Box>
  );
}

// ── Team Report Table (Admin view) ────────────────────────────────────────────
function TeamReportTable({ data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data || !data.data || data.data.length === 0) {
    return (
      <EmptyState
        icon={GroupsIcon}
        title="No Team Data"
        description="No team member records found for the selected filters"
      />
    );
  }

  const rows = data.data;
  const paginated = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const statusIcon = (s) => {
    if (!s)
      return <PendingIcon sx={{ fontSize: 14, color: colors.textDisabled }} />;
    if (s.toLowerCase() === "active")
      return <CheckCircleIcon sx={{ fontSize: 14, color: colors.success }} />;
    if (s.toLowerCase() === "inactive")
      return <CancelIcon sx={{ fontSize: 14, color: colors.error }} />;
    return <PendingIcon sx={{ fontSize: 14, color: colors.warning }} />;
  };

  const roleLabel = (role) => {
    const map = {
      inspector: "Inspector",
      senior_inspector: "Sr. Inspector",
      lead_inspector: "Lead Inspector",
      supervisor: "Supervisor",
      manager: "Manager",
    };
    return map[role] || role || "—";
  };

  return (
    <Box>
      <TableContainer sx={{ maxHeight: 480, overflowX: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {TEAM_REPORT_COLUMNS.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    bgcolor: alpha(colors.primary, 0.05),
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    color: colors.textPrimary,
                    whiteSpace: "nowrap",
                    borderBottom: `2px solid ${colors.border}`,
                  }}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row, idx) => (
              <TableRow
                key={idx}
                hover
                sx={{ "&:hover": { bgcolor: alpha(colors.primary, 0.02) } }}
              >
                <TableCell
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: colors.textPrimary,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.6rem",
                        bgcolor: colors.purple,
                      }}
                    >
                      {(row.fullName || row.firstName || "?")[0]?.toUpperCase()}
                    </Avatar>
                    {row.fullName ||
                      `${row.firstName || ""} ${row.lastName || ""}`.trim() ||
                      "—"}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                >
                  {row.email || "—"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                >
                  {row.phone || "—"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                >
                  {row.department || "—"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={roleLabel(row.teamRole)}
                    size="small"
                    sx={{
                      bgcolor: alpha(colors.purple, 0.1),
                      color: colors.purple,
                      fontSize: "0.62rem",
                      height: 20,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                >
                  {row.location || "—"}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {statusIcon(row.status)}
                    <Typography
                      sx={{ fontSize: "0.7rem", color: colors.textSecondary }}
                    >
                      {row.status || "Active"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.7rem",
                    color: colors.textSecondary,
                    textAlign: "center",
                  }}
                >
                  {row.assignedCount ?? row.stats?.assigned ?? "—"}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.7rem",
                    color: colors.textSecondary,
                    textAlign: "center",
                  }}
                >
                  {row.completedCount ?? row.stats?.completed ?? "—"}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: colors.border,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min(row.completionRate ?? row.stats?.completionRate ?? 0, 100)}%`,
                          height: "100%",
                          bgcolor:
                            (row.completionRate ??
                              row.stats?.completionRate ??
                              0) >= 70
                              ? colors.success
                              : colors.warning,
                          borderRadius: 3,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{ fontSize: "0.65rem", color: colors.textSecondary }}
                    >
                      {row.completionRate ?? row.stats?.completionRate ?? 0}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.7rem",
                    color: colors.textSecondary,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("en-IN")
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          "& .MuiTablePagination-toolbar": { fontSize: "0.7rem" },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            { fontSize: "0.7rem" },
        }}
      />
    </Box>
  );
}

// ── Generic Report Table (Asset / Inspection / Financial) ─────────────────────
function GenericReportTable({ data, reportType }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data || !data.data || data.data.length === 0) {
    return (
      <EmptyState
        icon={AssessmentIcon}
        title="No Data"
        description="No records found for this report"
      />
    );
  }

  const columns = REPORT_COLUMNS_MAP[reportType] || [];
  const rows = data.data;
  const paginated = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const formatCell = (key, val) => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (key === "address" && typeof val === "object")
      return [val?.street, val?.city, val?.state].filter(Boolean).join(", ");
    if (typeof val === "object") return JSON.stringify(val).substring(0, 60);
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val))
      return new Date(val).toLocaleDateString("en-IN");
    return String(val).substring(0, 60);
  };

  const isStatus = (key) => key === "status";

  const statusStyle = (val) => {
    if (!val) return {};
    const v = String(val).toLowerCase();
    if (["active", "completed", "paid"].includes(v))
      return { bgcolor: alpha(colors.success, 0.1), color: colors.success };
    if (["inactive", "overdue", "failed"].includes(v))
      return { bgcolor: alpha(colors.error, 0.1), color: colors.error };
    if (["pending", "in progress", "trial"].includes(v))
      return { bgcolor: alpha(colors.warning, 0.1), color: colors.warning };
    return {
      bgcolor: alpha(colors.textDisabled, 0.1),
      color: colors.textSecondary,
    };
  };

  return (
    <Box>
      <TableContainer sx={{ maxHeight: 480, overflowX: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    bgcolor: alpha(colors.primary, 0.05),
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    color: colors.textPrimary,
                    whiteSpace: "nowrap",
                    borderBottom: `2px solid ${colors.border}`,
                  }}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row, idx) => (
              <TableRow
                key={idx}
                hover
                sx={{ "&:hover": { bgcolor: alpha(colors.primary, 0.02) } }}
              >
                {columns.map(({ key }) => (
                  <TableCell
                    key={key}
                    sx={{
                      fontSize: "0.7rem",
                      color: colors.textSecondary,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isStatus(key) ? (
                      <Chip
                        label={row[key] || "—"}
                        size="small"
                        sx={{
                          ...statusStyle(row[key]),
                          fontSize: "0.62rem",
                          height: 20,
                          fontWeight: 600,
                        }}
                      />
                    ) : (
                      formatCell(key, row[key])
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          "& .MuiTablePagination-toolbar": { fontSize: "0.7rem" },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            { fontSize: "0.7rem" },
        }}
      />
    </Box>
  );
}

// ── Smart Report Table Router ─────────────────────────────────────────────────
function ReportTablePreview({ data, reportType, isSuperAdmin, isAdmin }) {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <EmptyState
        icon={AssessmentIcon}
        title="No Report Data"
        description="Generate a report using the filter button above"
      />
    );
  }

  // Super Admin dashboard → always shows Client report table
  if (isSuperAdmin && reportType === "clients") {
    return <ClientReportTable data={data} />;
  }

  // Admin → Team report table
  if (isAdmin && reportType === "team") {
    return <TeamReportTable data={data} />;
  }

  // Default for asset, inspection, financial, compliance
  return <GenericReportTable data={data} reportType={reportType} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Reports Page
// ─────────────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { user } = useAuth();
  const {
    loading,
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
    clearError,
    isAdmin,
    isSuperAdmin,
  } = useReport();

  const [dateRange, setDateRange] = useState(30);
  const [tabValue, setTabValue] = useState(0);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [reportType, setReportType] = useState(() =>
    isSuperAdmin ? "clients" : "team",
  );
  const [reportFilters, setReportFilters] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [excelExporting, setExcelExporting] = useState(false);

  const showToast = useCallback(
    (msg, sev = "success") =>
      setToast({ open: true, message: msg, severity: sev }),
    [],
  );
  const closeToast = useCallback(
    () => setToast((prev) => ({ ...prev, open: false })),
    [],
  );

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  // Set default reportType based on role
  useEffect(() => {
    if (isSuperAdmin) setReportType("clients");
    else if (isAdmin) setReportType("team");
  }, [isSuperAdmin, isAdmin]);

  const loadAnalytics = useCallback(async () => {
    try {
      await getDashboardAnalytics(dateRange);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      showToast("Failed to load analytics data", "error");
    }
  }, [dateRange, getDashboardAnalytics, showToast]);

  // ── Available report types by role ────────────────────────────────────────
  const getAvailableReportTypes = useCallback(() => {
    if (isSuperAdmin) {
      // Super Admin: clients + financial
      return [
        {
          value: "clients",
          label: "Client Report",
          icon: <BusinessIcon sx={{ fontSize: 16 }} />,
        },
        {
          value: "financial",
          label: "Financial Report",
          icon: <CurrencyRupeeIcon sx={{ fontSize: 16 }} />,
        },
        {
          value: "inspections",
          label: "Inspection Report",
          icon: <AssignmentIcon sx={{ fontSize: 16 }} />,
        },
      ];
    }
    if (isAdmin) {
      // Admin: team, assets, inspections, financial
      return [
        {
          value: "team",
          label: "Team Report",
          icon: <GroupsIcon sx={{ fontSize: 16 }} />,
        },
        {
          value: "assets",
          label: "Asset Report",
          icon: <InventoryIcon sx={{ fontSize: 16 }} />,
        },
        {
          value: "inspections",
          label: "Inspection Report",
          icon: <AssignmentIcon sx={{ fontSize: 16 }} />,
        },
        {
          value: "financial",
          label: "Financial Report",
          icon: <AttachMoneyIcon sx={{ fontSize: 16 }} />,
        },
      ];
    }
    // Team member (read-only)
    return [
      {
        value: "inspections",
        label: "Inspection Report",
        icon: <AssignmentIcon sx={{ fontSize: 16 }} />,
      },
    ];
  }, [isAdmin, isSuperAdmin]);

  // ── Generate Report ───────────────────────────────────────────────────────
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
      } else if (reportType === "financial" && (isAdmin || isSuperAdmin)) {
        result = await getFinancialReport(reportFilters);
      } else if (reportType === "compliance") {
        result = await getComplianceReport(reportFilters);
      }

      if (result) {
        setFilterDialogOpen(false);
        showToast(
          `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated with ${result.data?.length || 0} records`,
          "success",
        );
      }
    } catch (err) {
      console.error("Report generation error:", err);
      showToast("Failed to generate report", "error");
    }
  }, [
    reportType,
    isAdmin,
    isSuperAdmin,
    reportFilters,
    getClientReport,
    getAssetReport,
    getTeamReport,
    getInspectionReport,
    getFinancialReport,
    getComplianceReport,
    showToast,
  ]);

  // ── Excel Export ──────────────────────────────────────────────────────────
  const handleExcelExport = useCallback(async () => {
    setExcelExporting(true);
    try {
      let exportData = reportData;

      if (!exportData || !exportData.data || exportData.data.length === 0) {
        showToast("Fetching report data for export...", "info");
        let result = null;
        if (reportType === "clients")
          result = await getClientReport(reportFilters);
        else if (reportType === "assets" && isAdmin)
          result = await getAssetReport(reportFilters);
        else if (reportType === "team" && isAdmin)
          result = await getTeamReport(reportFilters);
        else if (reportType === "inspections")
          result = await getInspectionReport(reportFilters);
        else if (reportType === "financial" && (isAdmin || isSuperAdmin))
          result = await getFinancialReport(reportFilters);
        else if (reportType === "compliance")
          result = await getComplianceReport(reportFilters);

        if (result?.data) exportData = result;
      }

      if (exportData?.data?.length > 0) {
        const userRole = isSuperAdmin
          ? "Super Admin"
          : isAdmin
            ? "Admin"
            : "Team Member";
        const success = exportToExcel(
          exportData,
          reportType,
          dateRange,
          reportFilters,
          userRole,
        );
        if (success) {
          showToast(
            `Excel exported! (${exportData.data.length} records, ${REPORT_COLUMNS_MAP[reportType]?.length || 0} columns)`,
            "success",
          );
        } else {
          showToast("Failed to generate Excel", "error");
        }
      } else {
        showToast(
          "No data available to export. Generate a report first.",
          "warning",
        );
      }
    } catch (err) {
      console.error("Excel Export error:", err);
      showToast("Failed to export Excel", "error");
    } finally {
      setExcelExporting(false);
    }
  }, [
    reportData,
    reportType,
    isAdmin,
    isSuperAdmin,
    reportFilters,
    dateRange,
    getClientReport,
    getAssetReport,
    getTeamReport,
    getInspectionReport,
    getFinancialReport,
    getComplianceReport,
    showToast,
  ]);

  // ── Chart Data ────────────────────────────────────────────────────────────
  const revenueTrend = useMemo(() => {
    if (!analyticsData?.revenueTrend) return [];
    return [
      {
        name: "Current",
        value: analyticsData.revenueTrend.current || 0,
        fill: colors.primary,
      },
      {
        name: "Previous",
        value: analyticsData.revenueTrend.previous || 0,
        fill: colors.secondary,
      },
      {
        name: "Projected",
        value: analyticsData.revenueTrend.projected || 0,
        fill: colors.success,
      },
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

  const pieData = [
    { name: "Safety", value: 35, color: colors.primary },
    { name: "Equipment", value: 25, color: colors.primaryLight },
    { name: "Quality", value: 20, color: colors.warning },
    { name: "Maintenance", value: 15, color: colors.purple },
    { name: "Other", value: 5, color: colors.textDisabled },
  ];

  const statCards = [
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
      icon: <CurrencyRupeeIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />,
      label: "Total Revenue",
      value: `₹${(analyticsData?.revenueTrend?.current || 0).toLocaleString("en-IN")}`,
      sub: "Current period",
      bg: `linear-gradient(135deg, #062c66 0%, #1e3a8a 100%)`,
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />,
      label: "Revenue Growth",
      value: `${analyticsData?.revenueTrend?.growth || 0}%`,
      sub:
        (analyticsData?.revenueTrend?.growth || 0) > 10
          ? "Above target"
          : "Below target",
      bg:
        (analyticsData?.revenueTrend?.growth || 0) > 10
          ? `linear-gradient(135deg, ${colors.success} 0%, #16a34a 100%)`
          : `linear-gradient(135deg, ${colors.error} 0%, #dc2626 100%)`,
    },
  ];

  if (!analyticsData) return <ReportSkeleton />;
  if (error) return <ErrorState message={error} onRetry={loadAnalytics} />;

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
      {/* ── Header ─────────────────────────────────────────────── */}
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
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              color: colors.textPrimary,
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
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
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
            }}
          >
            {isSuperAdmin
              ? "Client & financial reports for your organization"
              : isAdmin
                ? "Team, asset & inspection reports for your account"
                : "Your inspection and assignment reports"}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <ToggleButtonGroup
            size="small"
            value={dateRange}
            exclusive
            onChange={(e, val) => val && setDateRange(val)}
            sx={{
              "& .MuiToggleButton-root": {
                px: { xs: 1, sm: 1.5 },
                py: 0.5,
                fontSize: { xs: "0.6rem", sm: "0.65rem" },
                border: `1px solid ${colors.border}`,
              },
            }}
          >
            <ToggleButton value={7}>7d</ToggleButton>
            <ToggleButton value={30}>30d</ToggleButton>
            <ToggleButton value={90}>90d</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              onClick={loadAnalytics}
              disabled={loading}
              size="small"
              sx={{
                bgcolor: colors.surface,
                border: `1px solid ${colors.border}`,
              }}
            >
              {loading ? (
                <CircularProgress size={16} />
              ) : (
                <RefreshIcon
                  sx={{
                    fontSize: { xs: 16, sm: 18 },
                    color: colors.textSecondary,
                  }}
                />
              )}
            </IconButton>
            <IconButton
              onClick={() => setFilterDialogOpen(true)}
              size="small"
              sx={{
                bgcolor: colors.surface,
                border: `1px solid ${colors.border}`,
              }}
            >
              <FilterListIcon
                sx={{
                  fontSize: { xs: 16, sm: 18 },
                  color: colors.textSecondary,
                }}
              />
            </IconButton>
            <Button
              variant="contained"
              startIcon={
                excelExporting ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <DownloadIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                )
              }
              onClick={handleExcelExport}
              disabled={excelExporting}
              sx={{
                bgcolor: colors.primary,
                fontSize: { xs: "0.65rem", sm: "0.7rem" },
                px: { xs: 1.5, sm: 2 },
              }}
            >
              {isMobile ? "Excel" : "Export Excel"}
            </Button>
          </Box>
        </Stack>
      </Box>

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

      {/* ── Stat Cards ─────────────────────────────────────────── */}
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

      {/* ── Tabs ───────────────────────────────────────────────── */}
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
          sx={{
            minHeight: { xs: 36, sm: 40 },
            "& .MuiTab-root": {
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              minHeight: { xs: 36, sm: 40 },
              px: { xs: 1.5, sm: 2 },
              textTransform: "none",
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": { bgcolor: colors.primary },
          }}
        >
          <Tab label="Overview" />
          <Tab label={isSuperAdmin ? "Clients" : "Team"} />
          <Tab label="Performance" />
        </Tabs>
      </Paper>

      {/* ── Tab Content ─────────────────────────────────────────── */}
      <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
        {/* Overview Tab */}
        {tabValue === 0 && (
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid item xs={12} lg={7}>
              <Card
                sx={{ height: "100%", width:"580px", border: `1px solid ${colors.border}` }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{
                      color: colors.textPrimary,
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      mb: { xs: 1.5, sm: 2 },
                    }}
                  >
                    Revenue Comparison ({dateRange} days)
                  </Typography>
                  {revenueTrend.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height={isMobile ? 220 : isTablet ? 260 : 300}
                    >
                      <BarChart
                        data={revenueTrend}
                        margin={{
                          top: 10,
                          right: 10,
                          left: isMobile ? -10 : 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={alpha(colors.border, 0.5)}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: colors.textDisabled,
                            fontSize: isMobile ? 10 : 11,
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: colors.textDisabled,
                            fontSize: isMobile ? 10 : 11,
                          }}
                        />
                        <Tooltip content={<CustomTooltip valuePrefix="₹" />} />
                        <Bar
                          dataKey="value"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={60}
                        >
                          {revenueTrend.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState
                      icon={ShowChartIcon}
                      title="No revenue data"
                      description="Revenue data will appear here"
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Card sx={{ width:"570px", border: `1px solid ${colors.border}` }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{
                      color: colors.textPrimary,
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      mb: { xs: 1.5, sm: 2 },
                    }}
                  >
                    Checklist Distribution
                  </Typography>
                  <ResponsiveContainer
                    width="100%"
                    height={isMobile ? 220 : isTablet ? 260 : 300}
                  >
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Clients / Team Tab */}
        {tabValue === 1 && (
          <Card sx={{ border: `1px solid ${colors.border}` }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{
                  color: colors.textPrimary,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                {isSuperAdmin ? "Client Growth" : "Team Performance"}
              </Typography>
              {clientGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <BarChart
                    data={clientGrowthData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: isMobile ? -10 : 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={alpha(colors.border, 0.5)}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: colors.textDisabled,
                        fontSize: isMobile ? 10 : 11,
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: colors.textDisabled,
                        fontSize: isMobile ? 10 : 11,
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      fill={colors.primary}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={80}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  icon={isSuperAdmin ? PeopleOutlineIcon : GroupsIcon}
                  title={isSuperAdmin ? "No client data" : "No team data"}
                  description="Data will appear here after generating a report"
                />
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
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                Key Insights
              </Typography>
              <Stack spacing={{ xs: 1, sm: 1.5 }}>
                {[
                  {
                    icon: (
                      <TrendingUpIcon
                        sx={{
                          fontSize: { xs: 16, sm: 18 },
                          color: colors.primary,
                        }}
                      />
                    ),
                    text: `Revenue has ${(analyticsData?.revenueTrend?.growth || 0) >= 0 ? "increased" : "decreased"} by ${Math.abs(analyticsData?.revenueTrend?.growth || 0)}% compared to the previous period.`,
                  },
                  {
                    icon: (
                      <PeopleOutlineIcon
                        sx={{
                          fontSize: { xs: 16, sm: 18 },
                          color: colors.primary,
                        }}
                      />
                    ),
                    text: `Client base grew by ${analyticsData?.clientGrowth?.new || 0} new customers in the last ${dateRange} days.`,
                  },
                  {
                    icon: (
                      <AssignmentIcon
                        sx={{
                          fontSize: { xs: 16, sm: 18 },
                          color: colors.primary,
                        }}
                      />
                    ),
                    text: `Checklist completion rate is at ${analyticsData?.checklistUsage?.activeRate || 0}%.`,
                  },
                ].map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: { xs: 1, sm: 1.5 },
                      p: { xs: 1.5, sm: 2 },
                      bgcolor: alpha(colors.primary, 0.04),
                      borderRadius: 2,
                    }}
                  >
                    {item.icon}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        color: colors.textPrimary,
                        flex: 1,
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* ── Report Preview Table ────────────────────────────────── */}
      {reportData?.data?.length > 0 && (
        <Card
          sx={{
            mt: { xs: 2, sm: 2.5, md: 3 },
            border: `1px solid ${colors.border}`,
          }}
        >
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 1.5, sm: 2 },
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{
                    color: colors.textPrimary,
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  }}
                >
                  Report Preview:{" "}
                  {reportType.charAt(0).toUpperCase() + reportType.slice(1)}{" "}
                  Report
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: colors.textSecondary, fontSize: "0.65rem" }}
                >
                  {REPORT_COLUMNS_MAP[reportType]?.length || 0} columns ·{" "}
                  {reportData.data.length} records
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip
                  label={`${reportData.data.length} records`}
                  size="small"
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    fontSize: "0.7rem",
                  }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                  onClick={handleExcelExport}
                  disabled={excelExporting}
                  sx={{
                    fontSize: "0.65rem",
                    borderColor: colors.primary,
                    color: colors.primary,
                  }}
                >
                  Export
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <ReportTablePreview
              data={reportData}
              reportType={reportType}
              isSuperAdmin={isSuperAdmin}
              isAdmin={isAdmin}
            />
          </CardContent>
        </Card>
      )}

      {/* ── Filter / Generate Dialog ─────────────────────────────── */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
            >
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
                {getAvailableReportTypes().map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                setReportFilters({
                  ...reportFilters,
                  startDate: e.target.value,
                })
              }
              sx={{ "& input": { fontSize: { xs: "0.75rem", sm: "0.8rem" } } }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                setReportFilters({ ...reportFilters, endDate: e.target.value })
              }
              sx={{ "& input": { fontSize: { xs: "0.75rem", sm: "0.8rem" } } }}
            />

            {/* Conditional filters per report type */}
            {reportType === "clients" && (
              <FormControl fullWidth size="small">
                <InputLabel>Membership Plan</InputLabel>
                <Select
                  value={reportFilters.membershipPlan || ""}
                  onChange={(e) =>
                    setReportFilters({
                      ...reportFilters,
                      membershipPlan: e.target.value,
                    })
                  }
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
            {reportType === "assets" && isAdmin && (
              <FormControl fullWidth size="small">
                <InputLabel>Asset Status</InputLabel>
                <Select
                  value={reportFilters.status || ""}
                  onChange={(e) =>
                    setReportFilters({
                      ...reportFilters,
                      status: e.target.value,
                    })
                  }
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
            {reportType === "team" && isAdmin && (
              <FormControl fullWidth size="small">
                <InputLabel>Team Role</InputLabel>
                <Select
                  value={reportFilters.teamRole || ""}
                  onChange={(e) =>
                    setReportFilters({
                      ...reportFilters,
                      teamRole: e.target.value,
                    })
                  }
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
            {reportType === "financial" && (
              <FormControl fullWidth size="small">
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={reportFilters.paymentStatus || ""}
                  onChange={(e) =>
                    setReportFilters({
                      ...reportFilters,
                      paymentStatus: e.target.value,
                    })
                  }
                  label="Payment Status"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button
            onClick={() => setFilterDialogOpen(false)}
            sx={{ color: colors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerateReport}
            disabled={loading}
            sx={{ bgcolor: colors.primary }}
          >
            {loading ? <CircularProgress size={20} /> : "Generate Report"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Toast ──────────────────────────────────────────────── */}
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
          sx={{ borderRadius: 2, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
