// pages/Dashboard.jsx
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
  LinearProgress,
  Fade,
  Zoom,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  History as HistoryIcon,
  Bolt as BoltIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  AddCircle as AddCircleIcon,
  PersonAdd as PersonAddIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  ErrorOutline as ErrorIcon,
  Inventory as InventoryIcon,
  TaskAlt as TaskAltIcon,
  Engineering as EngineeringIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HourglassEmpty as HourglassIcon,
  BarChart as BarChartIcon,
  Warning as WarningIcon,
  Category as CategoryIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from "@mui/icons-material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContexts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  primary: "#002631",
  primaryLight: "#003d4d",
  primaryContainer: "#003d4d",
  accent: "#df8f00",
  accentLight: "#f5a623",
  secondary: "#516072",
  secondaryContainer: "#d2e1f7",
  onSecondaryContainer: "#556477",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  success: "#2e7d32",
  successLight: "#e8f5e9",
  surface: "#f4f6f8",
  surfaceContainerLow: "#eef1f4",
  surfaceVariant: "#e0e3e5",
  outline: "#71787c",
  outlineVariant: "#c0c8cc",
  white: "#ffffff",
};

const PIE_COLORS = [
  "#003d4d",
  "#df8f00",
  "#516072",
  "#79a8ba",
  "#c0c8cc",
  "#002631",
];

// ─── Shared Helpers ────────────────────────────────────────────────────────────
const fmt = (n) =>
  n === undefined || n === null ? "—" : Number(n).toLocaleString();
const pct = (n) => `${n ?? 0}%`;

const doCSV = (data, filename) => {
  const flat = (obj, pre = "") => {
    const r = {};
    for (const k in obj) {
      if (
        typeof obj[k] === "object" &&
        !Array.isArray(obj[k]) &&
        obj[k] !== null
      )
        Object.assign(r, flat(obj[k], `${pre}${k}_`));
      else
        r[`${pre}${k}`] = Array.isArray(obj[k])
          ? JSON.stringify(obj[k])
          : obj[k];
    }
    return r;
  };
  const fd = flat(data);
  const hdrs = Object.keys(fd);
  const rows = [
    hdrs.join(","),
    hdrs
      .map((h) => {
        const v = fd[h];
        return typeof v === "string" ? `"${v.replace(/"/g, '""')}"` : (v ?? "");
      })
      .join(","),
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const doPDF = async (overview, filename) => {
  const { default: html2pdf } = await import("html2pdf.js");
  const stamp = new Date().toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const el = document.createElement("div");
  el.style.cssText =
    "padding:36px 40px;font-family:Arial,sans-serif;max-width:860px;";
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;border-bottom:3px solid #002631">
      <div><h1 style="color:#002631;font-size:22px;font-weight:800;margin:0">Dashboard Report</h1>
      <p style="color:#516072;font-size:11px;margin:4px 0 0">Generated: ${stamp}</p></div>
      <div style="background:#003d4d;color:#fff;padding:5px 14px;border-radius:20px;font-size:10px;font-weight:600">CONFIDENTIAL</div>
    </div>
    <h2 style="color:#002631;font-size:13px;font-weight:700;margin:24px 0 12px">Overview Metrics</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead><tr><th style="background:#002631;color:#fff;padding:8px 12px;text-align:left">Metric</th>
      <th style="background:#002631;color:#fff;padding:8px 12px;text-align:left">Value</th></tr></thead>
      <tbody>${Object.entries(overview)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:7px 12px;border-bottom:1px solid #e0e3e5">${k.replace(/([A-Z])/g, " $1").trim()}</td>
        <td style="padding:7px 12px;border-bottom:1px solid #e0e3e5">${v}</td></tr>`,
        )
        .join("")}</tbody>
    </table>
    <p style="color:#71787c;font-size:10px;text-align:center;margin-top:36px;padding-top:12px;border-top:1px solid #e0e3e5">Confidential — Internal Use Only</p>`;
  document.body.appendChild(el);
  await html2pdf()
    .set({
      margin: 0.5,
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    })
    .from(el)
    .save();
  document.body.removeChild(el);
};

// ─── Reusable Components ───────────────────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  title,
  value,
  sub,
  accent,
  loading,
  onClick,
}) => (
  <Zoom in style={{ transitionDelay: "60ms" }}>
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: "100%",
        width:"270px",
        bgcolor: accent ? C.primaryLight : C.white,
        border: `1px solid ${alpha(accent ? C.primaryLight : C.outlineVariant, 0.6)}`,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 8px 24px ${alpha(C.primary, 0.1)}`,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1.5}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: accent ? alpha("#fff", 0.12) : C.surfaceContainerLow,
          }}
        >
          <Icon
            sx={{ fontSize: 20, color: accent ? "#fff" : C.primaryLight }}
          />
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "0.65rem",
          fontWeight: 700,
          color: accent ? alpha("#fff", 0.7) : C.secondary,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "1.55rem",
          color: accent ? "#fff" : C.primary,
          lineHeight: 1,
        }}
      >
        {loading ? <Skeleton width={60} /> : fmt(value)}
      </Typography>
      {sub && (
        <Typography
          sx={{
            fontSize: "0.65rem",
            color: accent ? alpha("#fff", 0.6) : C.outline,
            mt: 0.5,
          }}
        >
          {sub}
        </Typography>
      )}
    </Paper>
  </Zoom>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <Box display="flex" alignItems="center" gap={1} mb={2}>
    <Icon sx={{ color: C.primaryLight, fontSize: 20 }} />
    <Typography sx={{ fontWeight: 700, color: C.primary, fontSize: "0.95rem" }}>
      {title}
    </Typography>
  </Box>
);

const ChartCard = ({ title, children, minH = 280 }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 3,
      height: "100%",
      bgcolor: C.white,
      border: `1px solid ${alpha(C.outlineVariant, 0.5)}`,
      minHeight: minH,
    }}
  >
    <Typography
      sx={{ fontWeight: 700, color: C.primary, mb: 2, fontSize: "0.85rem" }}
    >
      {title}
    </Typography>
    {children}
  </Paper>
);

const EmptyChart = ({ msg = "No data available" }) => (
  <Box display="flex" alignItems="center" justifyContent="center" height={220}>
    <Typography sx={{ color: C.outline, fontSize: "0.8rem" }}>{msg}</Typography>
  </Box>
);

// ─── SUPER ADMIN VIEW ─────────────────────────────────────────────────────────
const SuperAdminDashboard = ({ data, loading }) => {
  const navigate = useNavigate();

  const clients = data?.clients || {};
  const revenue = data?.revenue || {};
  const checklists = data?.checklists || {};
  const assignments = data?.assignments || {};
  const requests = data?.requests || {};
  const activities = data?.recentActivities || [];

  // Revenue by plan for bar chart
  const revenueByPlan = useMemo(
    () =>
      Object.entries(revenue.byPlan || {}).map(([plan, v]) => ({
        plan: plan.charAt(0).toUpperCase() + plan.slice(1),
        clients: v.count,
        revenue: v.revenue,
        price: v.pricePerMonth,
      })),
    [revenue],
  );

  // Clients by plan for pie
  const clientsByPlan = useMemo(
    () =>
      Object.entries(clients.byPlan || {}).map(([name, value]) => ({
        name,
        value,
      })),
    [clients],
  );

  // Requests by urgency
  const requestByUrgency = useMemo(
    () =>
      Object.entries(requests.byUrgency || {}).map(([name, value]) => ({
        name,
        value,
      })),
    [requests],
  );

  const statCards = [
    {
      icon: PeopleIcon,
      title: "Total Clients",
      value: clients.total,
      sub: `${clients.active} active`,
    },
    {
      icon: CurrencyRupeeIcon,
      title: "Monthly Revenue",
      value: `${fmt(revenue.monthlyRecurring)}`,
      sub: `${fmt(revenue.annualEstimate)} / yr`,
      accent: true,
    },
    {
      icon: AssignmentIcon,
      title: "Checklists",
      value: checklists.total,
      sub: `${checklists.global} global · ${checklists.custom || 0} custom`,
    },
    {
      icon: TaskAltIcon,
      title: "Assignments",
      value: assignments.total,
      sub: `${assignments.pending} pending · ${assignments.overdue} overdue`,
    },
  ];

  const quickActions = [
    {
      icon: PeopleIcon,
      title: "Manage Clients",
      desc: "View all clients",
      path: "/admin/clients",
    },
    {
      icon: AssignmentIcon,
      title: "Checklists",
      desc: "View all checklists",
      path: "/admin/checklists",
    },
    {
      icon: AnalyticsIcon,
      title: "Reports",
      desc: "View analytics",
      path: "/admin/reports",
    },
  ];

  return (
    <Box>
      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((s, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Charts row 1 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8} sx={{width:"560px"}}>
          <ChartCard title="Revenue by Subscription Plan">
            {revenueByPlan.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueByPlan} barSize={36}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(C.outline, 0.15)}
                  />
                  <XAxis
                    dataKey="plan"
                    tick={{ fontSize: 11, fill: C.secondary }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: C.secondary }} />
                  <RTooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${C.outlineVariant}`,
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill={C.primaryLight}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="clients"
                    name="Clients"
                    fill={C.accent}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4} sx={{width:"555px"}}>
          <ChartCard title="Clients by Plan">
            {clientsByPlan.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={clientsByPlan}
                    cx="50%"
                    cy="50%"
                    innerRadius="52%"
                    outerRadius="75%"
                    dataKey="value"
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {clientsByPlan.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts row 2 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6} sx={{width:"560px"}}>
          <ChartCard title="Assignment Overview">
            {assignments.total > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={[
                    {
                      name: "Completed",
                      value: assignments.completed,
                      fill: C.success,
                    },
                    {
                      name: "Pending",
                      value: assignments.pending,
                      fill: C.accent,
                    },
                    {
                      name: "Overdue",
                      value: assignments.overdue,
                      fill: C.onErrorContainer,
                    },
                    {
                      name: "In Review",
                      value: assignments.pendingReview,
                      fill: C.secondary,
                    },
                  ]}
                  barSize={32}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(C.outline, 0.15)}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: C.secondary }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: C.secondary }} />
                  <RTooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                    {[C.success, C.accent, C.onErrorContainer, C.secondary].map(
                      (fill, i) => (
                        <Cell key={i} fill={fill} />
                      ),
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart msg="No assignment data" />
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6} sx={{width:"555px"}}>
          <ChartCard title="Requests by Urgency">
            {requestByUrgency.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={requestByUrgency}
                    cx="50%"
                    cy="50%"
                    outerRadius="72%"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {requestByUrgency.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart msg="No request data" />
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          mb: 3,
          border: `1px solid ${alpha(C.outlineVariant, 0.5)}`,
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: `1px solid ${alpha(C.outlineVariant, 0.3)}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <HistoryIcon sx={{ color: C.primaryLight, fontSize: 20 }} />
          <Typography
            sx={{ fontWeight: 700, color: C.primary, fontSize: "0.9rem" }}
          >
            Recent Activities
          </Typography>
          <Chip
            label={activities.length}
            size="small"
            sx={{
              ml: "auto",
              bgcolor: C.surfaceContainerLow,
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          />
        </Box>
        <TableContainer sx={{ maxHeight: 360 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {["Activity", "Detail", "Date"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 700,
                      color: C.secondary,
                      bgcolor: C.surfaceContainerLow,
                      fontSize: "0.72rem",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.length > 0 ? (
                activities.map((act, i) => (
                  <TableRow
                    key={i}
                    hover
                    sx={{ "&:hover": { bgcolor: C.surfaceContainerLow } }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          color: C.primary,
                        }}
                      >
                        {act.title}
                      </Typography>
                      <Chip
                        label={act.type?.replace(/_/g, " ")}
                        size="small"
                        sx={{
                          mt: 0.5,
                          height: 18,
                          fontSize: "0.6rem",
                          bgcolor: alpha(C.primaryLight, 0.08),
                          color: C.primaryLight,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: "0.72rem", color: C.secondary }}
                      >
                        {act.detail || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "0.7rem", color: C.outline }}>
                        {act.timestamp
                          ? new Date(act.timestamp).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: C.secondary, fontSize: "0.8rem" }}>
                      No recent activities
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quick Actions */}
      <SectionTitle icon={BoltIcon} title="Quick Actions" />
      <Grid container spacing={2}>
        {quickActions.map((act, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Button
              fullWidth
              onClick={() => navigate(act.path)}
              sx={{
                flexDirection: "column",
                width:"375px",
                alignItems: "flex-start",
                p: 2,
                bgcolor: C.primaryLight,
                borderRadius: 3,
                textTransform: "none",
                "&:hover": {
                  transform: "translateY(-3px)",
                  bgcolor: alpha(C.primaryLight, 0.9),
                },
              }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderRadius: 1.5,
                  mb: 1,
                }}
              >
                <act.icon sx={{ color: "#fff", fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  mb: 0.25,
                }}
              >
                {act.title}
              </Typography>
              <Typography
                sx={{ color: alpha("#fff", 0.65), fontSize: "0.67rem" }}
              >
                {act.desc}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// ─── ADMIN VIEW ───────────────────────────────────────────────────────────────
const AdminDashboard = ({ data, loading }) => {
  const navigate = useNavigate();
  const sm = useMediaQuery(useTheme().breakpoints.down("sm"));

  const team = data?.team || {};
  const assets = data?.assets || {};
  const checklists = data?.checklists || {};
  const inspections = data?.inspections || {};
  const activities = data?.recentActivities || [];

  // Asset by category pie
  const assetByCategory = useMemo(
    () =>
      Object.entries(assets.byCategory || {}).map(([name, value]) => ({
        name,
        value,
      })),
    [assets],
  );

  // Inspection daily trend — last 14 points
  const inspTrend = useMemo(
    () =>
      (inspections.dailyTrend || []).slice(-14).map((d) => ({
        ...d,
        date: d.date?.slice(5), // MM-DD
      })),
    [inspections],
  );

  // Team by role bar
  const teamByRole = useMemo(
    () =>
      Object.entries(team.byRole || {}).map(([role, count]) => ({
        role: role.replace(/_/g, " "),
        count,
      })),
    [team],
  );

  const statCards = [
    {
      icon: GroupIcon,
      title: "Team Members",
      value: team.total,
      sub: `${team.active} active`,
    },
    {
      icon: InventoryIcon,
      title: "Total Assets",
      value: assets.total,
      sub: `${assets.active} active · ${assets.inMaintenance || 0} maintenance`,
    },
    {
      icon: AssignmentIcon,
      title: "Checklists",
      value: checklists.total,
      sub: `${checklists.totalAssignments} assignments sent`,
    },
    {
      icon: TaskAltIcon,
      title: "Inspections",
      value: inspections.total,
      sub: `${inspections.pendingReview} pending review`,
      accent: true,
    },
  ];

  const quickActions = [
    {
      icon: AddCircleIcon,
      title: "New Checklist",
      desc: "Create form",
      path: "/admin/create-checklist/custom",
    },
    {
      icon: PersonAddIcon,
      title: "Add Team Member",
      desc: "Register member",
      path: "/admin/team",
    },
    {
      icon: InventoryIcon,
      title: "Add Asset",
      desc: "Register asset",
      path: "/admin/assets/add",
    },
    {
      icon: AnalyticsIcon,
      title: "Reports",
      desc: "View analytics",
      path: "/admin/reports",
    },
  ];

  return (
    <Box>
      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((s, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Charts row 1 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Inspection trend */}
        <Grid item xs={12} md={8} sx={{width:"580px"}}>
          <ChartCard title="Inspection Trend (Daily)">
            {inspTrend.some((d) => d.total > 0) ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={inspTrend}>
                  <defs>
                    <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={C.primaryLight}
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor={C.primaryLight}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(C.outline, 0.12)}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: C.secondary }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: C.secondary }}
                    allowDecimals={false}
                  />
                  <RTooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${C.outlineVariant}`,
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total"
                    stroke={C.primaryLight}
                    fill="url(#aG)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="approved"
                    name="Approved"
                    stroke={C.success}
                    fill="transparent"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                  />
                  <Area
                    type="monotone"
                    dataKey="rejected"
                    name="Rejected"
                    stroke={C.onErrorContainer}
                    fill="transparent"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart msg="No inspection data for this period" />
            )}
          </ChartCard>
        </Grid>

        {/* Asset distribution */}
        <Grid item xs={12} md={4} sx={{width:"570px"}}>
          <ChartCard title="Assets by Category">
            {assetByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={assetByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="73%"
                    dataKey="value"
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {assetByCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts row 2 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Team by role */}
        <Grid item xs={12} md={5} sx={{width:"580px"}}>
          <ChartCard title="Team Members by Role">
            {teamByRole.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={teamByRole} layout="vertical" barSize={18}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(C.outline, 0.12)}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: C.secondary }}
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="role"
                    type="category"
                    tick={{ fontSize: 10, fill: C.secondary }}
                    width={100}
                  />
                  <RTooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar
                    dataKey="count"
                    name="Members"
                    fill={C.primaryLight}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>
        </Grid>

        {/* Top performers */}
        <Grid item xs={12} md={7} sx={{width:"576px"}}>
          <ChartCard title="Top Performing Team Members">
            {(team.topPerformers || []).length > 0 ? (
              <Stack spacing={1.5}>
                {team.topPerformers.slice(0, 5).map((m, i) => (
                  <Box key={i} display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                      sx={{
                        bgcolor: PIE_COLORS[i % PIE_COLORS.length],
                        width: 34,
                        height: 34,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {m.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                    <Box flex={1}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={0.3}
                      >
                        <Typography
                          sx={{ fontWeight: 600, fontSize: "0.78rem" }}
                        >
                          {m.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            color: C.primaryLight,
                          }}
                        >
                          {m.completionRate}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 5,
                          borderRadius: 4,
                          bgcolor: C.surfaceVariant,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${m.completionRate}%`,
                            bgcolor: PIE_COLORS[i % PIE_COLORS.length],
                            borderRadius: 4,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{ fontSize: "0.62rem", color: C.outline, mt: 0.3 }}
                      >
                        {m.role} · {m.totalCompleted}/{m.totalAssigned} tasks
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyChart msg="No team performance data" />
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          mb: 3,
          border: `1px solid ${alpha(C.outlineVariant, 0.5)}`,
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: `1px solid ${alpha(C.outlineVariant, 0.3)}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <HistoryIcon sx={{ color: C.primaryLight, fontSize: 20 }} />
          <Typography
            sx={{ fontWeight: 700, color: C.primary, fontSize: "0.9rem" }}
          >
            Recent Activities
          </Typography>
          <Chip
            label={activities.length}
            size="small"
            sx={{
              ml: "auto",
              bgcolor: C.surfaceContainerLow,
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          />
        </Box>
        <TableContainer sx={{ maxHeight: 320 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {["Activity", "Detail", "Date"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 700,
                      color: C.secondary,
                      bgcolor: C.surfaceContainerLow,
                      fontSize: "0.72rem",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.length > 0 ? (
                activities.map((act, i) => (
                  <TableRow
                    key={i}
                    hover
                    sx={{ "&:hover": { bgcolor: C.surfaceContainerLow } }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          color: C.primary,
                        }}
                      >
                        {act.title}
                      </Typography>
                      <Chip
                        label={act.type?.replace(/_/g, " ")}
                        size="small"
                        sx={{
                          mt: 0.5,
                          height: 18,
                          fontSize: "0.6rem",
                          bgcolor: alpha(C.primaryLight, 0.08),
                          color: C.primaryLight,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: "0.72rem", color: C.secondary }}
                      >
                        {act.detail || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "0.7rem", color: C.outline }}>
                        {act.timestamp
                          ? new Date(act.timestamp).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: C.secondary, fontSize: "0.8rem" }}>
                      No recent activities
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quick Actions */}
      <SectionTitle icon={BoltIcon} title="Quick Actions" />
      <Grid container spacing={2}>
        {quickActions.map((act, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Button
              fullWidth
              onClick={() => navigate(act.path)}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                p: 2,
                bgcolor: C.primaryLight,
                borderRadius: 3,
                width:"250px",
                textTransform: "none",
                "&:hover": {
                  transform: "translateY(-3px)",
                  bgcolor: alpha(C.primaryLight, 0.9),
                },
              }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderRadius: 1.5,
                  mb: 1,
                }}
              >
                <act.icon sx={{ color: "#fff", fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  mb: 0.25,
                }}
              >
                {act.title}
              </Typography>
              <Typography
                sx={{ color: alpha("#fff", 0.65), fontSize: "0.67rem" }}
              >
                {act.desc}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// ─── TEAM VIEW ────────────────────────────────────────────────────────────────
const TeamDashboard = ({ data, loading }) => {
  const navigate = useNavigate();

  const overview = data?.overview || {};
  const member = data?.memberInfo || {};
  const upcoming = data?.upcomingTasks || [];
  const activities = data?.recentActivities || [];
  const weeklyTrend = data?.charts?.weeklyTrend || [];
  const dist = data?.charts?.taskDistribution || {};

  const distData = [
    { name: "Completed", value: dist.completed || 0, fill: C.success },
    { name: "In Progress", value: dist.inProgress || 0, fill: C.accent },
    { name: "Pending", value: dist.pending || 0, fill: C.secondary },
    { name: "Overdue", value: dist.overdue || 0, fill: C.onErrorContainer },
  ].filter((d) => d.value > 0);

  return (
    <Box>
      {/* Member info banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          mb: 3,
          bgcolor: C.primaryLight,
          border: "none",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              bgcolor: alpha("#fff", 0.15),
              color: "#fff",
              width: 50,
              height: 50,
              fontWeight: 800,
              fontSize: "1.2rem",
            }}
          >
            {member.initials || member.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography
              sx={{ fontWeight: 800, color: "#fff", fontSize: "1.1rem" }}
            >
              {member.name || "Team Member"}
            </Typography>
            <Typography sx={{ color: alpha("#fff", 0.7), fontSize: "0.75rem" }}>
              {member.role} {member.department ? `· ${member.department}` : ""}
            </Typography>
          </Box>
          <Box ml="auto" textAlign="right">
            <Typography
              sx={{ color: "#fff", fontWeight: 800, fontSize: "1.5rem" }}
            >
              {pct(overview.completionRate)}
            </Typography>
            <Typography
              sx={{ color: alpha("#fff", 0.65), fontSize: "0.65rem" }}
            >
              Completion Rate
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            icon: AssignmentIcon,
            title: "Total Tasks",
            value: overview.total,
            sub: `${overview.completed} completed`,
          },
          {
            icon: HourglassIcon,
            title: "In Progress",
            value: overview.inProgress,
            sub: `${overview.pending} pending`,
          },
          {
            icon: WarningIcon,
            title: "Overdue",
            value: overview.overdue,
            sub: "needs attention",
            accent: overview.overdue > 0,
          },
          {
            icon: TaskAltIcon,
            title: "On-Time Rate",
            value: pct(overview.onTimeRate),
            sub: `Score: ${overview.avgScore}%`,
          },
        ].map((s, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <ChartCard title="Weekly Activity (Last 7 Days)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyTrend} barSize={20}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={alpha(C.outline, 0.12)}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: C.secondary }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: C.secondary }}
                  allowDecimals={false}
                />
                <RTooltip contentStyle={{ borderRadius: 8 }} />
                <Legend />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill={C.primaryLight}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  name="Pending"
                  fill={C.accent}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <ChartCard title="Task Distribution">
            {distData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={distData}
                    cx="50%"
                    cy="50%"
                    innerRadius="48%"
                    outerRadius="70%"
                    dataKey="value"
                    paddingAngle={4}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {distData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart msg="No task data" />
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Upcoming Tasks */}
      {upcoming.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 3,
            border: `1px solid ${alpha(C.outlineVariant, 0.5)}`,
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderBottom: `1px solid ${alpha(C.outlineVariant, 0.3)}`,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <HourglassIcon sx={{ color: C.primaryLight, fontSize: 20 }} />
            <Typography
              sx={{ fontWeight: 700, color: C.primary, fontSize: "0.9rem" }}
            >
              Upcoming Tasks
            </Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Task", "Asset", "Due Date", "Days Left", "Priority"].map(
                    (h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: 700,
                          color: C.secondary,
                          bgcolor: C.surfaceContainerLow,
                          fontSize: "0.72rem",
                        }}
                      >
                        {h}
                      </TableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {upcoming.map((t, i) => (
                  <TableRow
                    key={i}
                    hover
                    sx={{ "&:hover": { bgcolor: C.surfaceContainerLow } }}
                  >
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                        {t.checklistName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: "0.72rem", color: C.secondary }}
                      >
                        {t.assetName || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "0.72rem" }}>
                        {t.dueDate
                          ? new Date(t.dueDate).toLocaleDateString("en-IN")
                          : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${t.daysRemaining}d`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          bgcolor:
                            t.daysRemaining <= 1
                              ? alpha(C.onErrorContainer, 0.12)
                              : t.daysRemaining <= 3
                                ? alpha(C.accent, 0.12)
                                : C.surfaceContainerLow,
                          color:
                            t.daysRemaining <= 1
                              ? C.onErrorContainer
                              : t.daysRemaining <= 3
                                ? C.accent
                                : C.secondary,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t.priority}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.62rem",
                          textTransform: "capitalize",
                          bgcolor:
                            t.priority === "critical"
                              ? alpha(C.onErrorContainer, 0.1)
                              : C.surfaceContainerLow,
                          color:
                            t.priority === "critical"
                              ? C.onErrorContainer
                              : C.secondary,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Quick Actions */}
      <SectionTitle icon={BoltIcon} title="Quick Actions" />
      <Grid container spacing={2}>
        {[
          {
            icon: AssignmentTurnedInIcon,
            title: "My Tasks",
            desc: "View all tasks",
            path: "/team",
          },
          {
            icon: HistoryIcon,
            title: "Inspection History",
            desc: "Past inspections",
            path: "/team/history",
          },
          {
            icon: AnalyticsIcon,
            title: "Reports",
            desc: "View reports",
            path: "/team/reports",
          },
        ].map((act, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Button
              fullWidth
              onClick={() => navigate(act.path)}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                p: 2,
                bgcolor: C.primaryLight,
                borderRadius: 3,
                textTransform: "none",
                "&:hover": {
                  transform: "translateY(-3px)",
                  bgcolor: alpha(C.primaryLight, 0.9),
                },
              }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderRadius: 1.5,
                  mb: 1,
                }}
              >
                <act.icon sx={{ color: "#fff", fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  mb: 0.25,
                }}
              >
                {act.title}
              </Typography>
              <Typography
                sx={{ color: alpha("#fff", 0.65), fontSize: "0.67rem" }}
              >
                {act.desc}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// ─── Root Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const { dashboardData, loading, error, loadDashboard, clearError, refresh } =
    useDashboard();
  const [anchorEl, setAnchorEl] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const toast$ = useCallback(
    (msg, sev = "success") =>
      setToast({ open: true, message: msg, severity: sev }),
    [],
  );
  const closeToast = useCallback(
    () => setToast((p) => ({ ...p, open: false })),
    [],
  );

  const handleRefresh = useCallback(() => {
    refresh();
    toast$("Refreshing dashboard…", "info");
  }, [refresh, toast$]);

  const handleExport = useCallback(
    async (type) => {
      setExporting(true);
      setAnchorEl(null);
      try {
        const name = `dashboard_${new Date().toISOString().split("T")[0]}`;
        if (type === "csv") {
          doCSV(dashboardData || {}, name);
          toast$("CSV exported");
        } else {
          // Build a flat overview for PDF from whatever role data is present
          const overview =
            dashboardData?.clients ||
            dashboardData?.team ||
            dashboardData?.overview ||
            {};
          await doPDF(overview, name);
          toast$("PDF exported");
        }
      } catch (e) {
        toast$(e.message || "Export failed", "error");
      } finally {
        setExporting(false);
      }
    },
    [dashboardData, toast$],
  );

  const role = user?.role;

  if (loading && !dashboardData) return <LoadingSkeleton />;
  if (error && !dashboardData)
    return (
      <ErrorDisplay
        message={error}
        onRetry={() => {
          clearError();
          loadDashboard();
        }}
      />
    );

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      {loading && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: 2,
          }}
        />
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              color: C.primary,
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            {role === "super_admin"
              ? "Platform Overview"
              : role === "admin"
                ? "Dashboard"
                : "My Dashboard"}
          </Typography>
          <Typography sx={{ color: C.secondary, fontSize: "0.72rem" }}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{ bgcolor: C.surfaceContainerLow }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              disabled={exporting || !dashboardData}
              sx={{ bgcolor: C.surfaceContainerLow }}
            >
              {exporting ? <CircularProgress size={20} /> : <DownloadIcon />}
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleExport("csv")}>
              <ListItemIcon>
                <CsvIcon />
              </ListItemIcon>
              <ListItemText primary="Export as CSV" />
            </MenuItem>
            <MenuItem onClick={() => handleExport("pdf")}>
              <ListItemIcon>
                <PdfIcon />
              </ListItemIcon>
              <ListItemText primary="Export as PDF" />
            </MenuItem>
          </Menu>
        </Stack>
      </Box>

      {/* Role-specific content */}
      {role === "super_admin" && (
        <SuperAdminDashboard data={dashboardData} loading={loading} />
      )}
      {role === "admin" && (
        <AdminDashboard data={dashboardData} loading={loading} />
      )}
      {role === "team" && (
        <TeamDashboard data={dashboardData} loading={loading} />
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const LoadingSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width={220} height={44} sx={{ mb: 2 }} />
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} sm={6} lg={3} key={i}>
          <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
        </Grid>
      ))}
    </Grid>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {[1, 2].map((i) => (
        <Grid item xs={12} md={6} key={i}>
          <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
        </Grid>
      ))}
    </Grid>
    <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
  </Box>
);

const ErrorDisplay = ({ message, onRetry }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
    }}
  >
    <ErrorIcon sx={{ fontSize: 56, color: C.onErrorContainer, mb: 2 }} />
    <Typography sx={{ fontWeight: 600, color: C.onErrorContainer, mb: 1 }}>
      Something went wrong
    </Typography>
    <Typography
      sx={{
        color: C.secondary,
        mb: 2.5,
        textAlign: "center",
        maxWidth: 340,
        fontSize: "0.85rem",
      }}
    >
      {message || "Failed to load dashboard data."}
    </Typography>
    <Button
      variant="contained"
      onClick={onRetry}
      startIcon={<RefreshIcon />}
      sx={{
        bgcolor: C.onErrorContainer,
        borderRadius: 2,
        textTransform: "none",
      }}
    >
      Retry
    </Button>
  </Box>
);
