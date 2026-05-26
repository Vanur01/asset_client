/* eslint-disable */
// pages/Dashboard.jsx
// Recharts bar + donut charts · PDF table export · exact screenshot design
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
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  History as HistoryIcon,
  Bolt as BoltIcon,
  Group as GroupIcon,
  Payments as PaymentsIcon,
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
import TaskIcon from "@mui/icons-material/Task";
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
} from "recharts";

// ─── palette ────────────────────────────────────────────────────────────────
const C = {
  primary: "#002631",
  primaryContainer: "#003d4d",
  onPrimaryContainer: "#79a8ba",
  secondary: "#516072",
  secondaryContainer: "#d2e1f7",
  onSecondaryContainer: "#556477",
  onTertiaryContainer: "#df8f00",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  success: "#2e7d32",
  surface: "#f7f9fb",
  surfaceContainerLow: "#f2f4f6",
  surfaceVariant: "#e0e3e5",
  outline: "#71787c",
  outlineVariant: "#c0c8cc",
};

const PIE_COLORS = ["#003d4d", "#df8f00", "#516072", "#c0c8cc"];

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtINR = (v) => {
  const n = Number(v);
  if (!n && n !== 0) return "₹0";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const safe = (v) => (v === undefined || v === null ? "—" : String(v));

// ─── CSV export ──────────────────────────────────────────────────────────────
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
        const val = fd[h];
        return typeof val === "string"
          ? `"${val.replace(/"/g, '""')}"`
          : (val ?? "");
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

// ─── PDF export — full table layout ──────────────────────────────────────────
const doPDF = async (payload, filename) => {
  const { default: html2pdf } = await import("html2pdf.js");

  const stamp = new Date().toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const tbl = (headers, rows, empty = "No data available") => {
    if (!rows.length)
      return `<p style="font-size:11px;color:#516072;margin:0 0 16px">${empty}</p>`;
    const ths = headers
      .map(
        (h) =>
          `<th style="background:#002631;color:#fff;padding:8px 12px;text-align:left;font-size:11px;font-weight:600;border:none">${h}</th>`,
      )
      .join("");
    const trs = rows
      .map(
        (row, i) =>
          `<tr style="background:${i % 2 === 0 ? "#ffffff" : "#f7f9fb"}">${row
            .map(
              (c) =>
                `<td style="padding:7px 12px;font-size:11px;color:#002631;border-bottom:1px solid #e0e3e5">${c}</td>`,
            )
            .join("")}</tr>`,
      )
      .join("");
    return `<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  };

  const sec = (title, content) =>
    `<h2 style="color:#002631;font-size:13px;font-weight:700;margin:28px 0 10px;padding-bottom:6px;border-bottom:2px solid #003d4d">${title}</h2>${content}`;

  // ── data ──
  const ov = payload.overview || {};
  const rev = payload.revenueTrend || payload.chartData?.revenueTrend || [];
  const sub =
    payload.subscriptionDistribution ||
    payload.chartData?.subscriptionDistribution ||
    [];
  const acts = payload.activities || [];

  const ovRows = [
    ["Total Customers", safe(ov.totalClients)],
    ["Active Customers", safe(ov.activeClients)],
    ["Total Revenue", fmtINR(ov.totalRevenue || 0)],
    ["Expiring Soon", safe(ov.expiringSoon)],
    ["Total Team Members", safe(ov.totalTeamMembers)],
    ["Active Team Members", safe(ov.activeTeamMembers)],
    ["Total Assets", safe(ov.totalAssets)],
    ["Total Inspections", safe(ov.totalInspections)],
    ["Total Tasks", safe(ov.totalTasks)],
    ["Completed Tasks", safe(ov.completedTasks)],
    ["Completion Rate", `${ov.completionRate || 0}%`],
    ["Performance Score", `${ov.performanceScore || 0}%`],
    ["Client Growth", `${ov.clientGrowth || 0}%`],
  ].filter(([, v]) => v !== "—");

  const revRows = rev.map((r) => [r.month || "—", fmtINR(r.revenue || 0)]);
  const subRows = sub.map((s) => [
    s.plan || "—",
    safe(s.count),
    fmtINR(s.potentialRevenue || 0),
  ]);
  const actRows = acts
    .slice(0, 20)
    .map((a) => [
      a.title || "—",
      a.details || "—",
      a.timestamp ? new Date(a.timestamp).toLocaleDateString("en-IN") : "—",
    ]);

  const el = document.createElement("div");
  el.style.cssText =
    "padding:36px 40px;font-family:Arial,sans-serif;max-width:860px;";
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:16px;border-bottom:3px solid #002631">
      <div>
        <h1 style="color:#002631;font-size:22px;font-weight:800;margin:0 0 4px">Dashboard Report</h1>
        <p style="color:#516072;font-size:11px;margin:0">Generated: ${stamp}</p>
      </div>
      <div style="background:#003d4d;color:#fff;padding:5px 14px;border-radius:20px;font-size:10px;font-weight:600">CONFIDENTIAL</div>
    </div>
    ${ovRows.length ? sec("Overview Metrics", tbl(["Metric", "Value"], ovRows, "No overview data")) : ""}
    ${revRows.length ? sec("Revenue Trend", tbl(["Month", "Revenue"], revRows, "No revenue data")) : ""}
    ${subRows.length ? sec("Subscription Distribution", tbl(["Plan", "Customers", "Potential Revenue/mo"], subRows, "No subscription data")) : ""}
    ${actRows.length ? sec("Recent Activity", tbl(["Activity", "Details", "Date"], actRows, "No activity data")) : ""}
    <p style="color:#71787c;font-size:10px;text-align:center;margin-top:36px;padding-top:12px;border-top:1px solid #e0e3e5">
      Confidential — Internal Use Only &nbsp;|&nbsp; ${stamp}
    </p>`;

  document.body.appendChild(el);
  await html2pdf()
    .set({
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    })
    .from(el)
    .save();
  document.body.removeChild(el);
};

// ─── Revenue tooltip ─────────────────────────────────────────────────────────
const RevTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: `1px solid ${alpha(C.outlineVariant, 0.6)}`,
        borderRadius: 1.5,
        px: 1.5,
        py: 1,
        boxShadow: `0 4px 16px ${alpha(C.primary, 0.1)}`,
      }}
    >
      <Typography
        sx={{ fontSize: "0.7rem", fontWeight: 700, color: C.primary, mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{ fontSize: "0.75rem", color: C.primaryContainer, fontWeight: 700 }}
      >
        {fmtINR(payload[0]?.value)}
      </Typography>
    </Box>
  );
};

// ─── Subscription tooltip ─────────────────────────────────────────────────────
const SubTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const it = payload[0];
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: `1px solid ${alpha(C.outlineVariant, 0.6)}`,
        borderRadius: 1.5,
        px: 1.5,
        py: 1,
        boxShadow: `0 4px 16px ${alpha(C.primary, 0.1)}`,
      }}
    >
      <Typography
        sx={{ fontSize: "0.7rem", fontWeight: 700, color: C.primary, mb: 0.25 }}
      >
        {it.name}
      </Typography>
      <Typography sx={{ fontSize: "0.72rem", color: C.secondary }}>
        {it.value} customers
      </Typography>
      <Typography sx={{ fontSize: "0.68rem", color: C.outline, mt: 0.25 }}>
        {fmtINR(it.payload?.potentialRevenue || 0)}/mo
      </Typography>
    </Box>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, description }) => (
  <Fade in>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 3, sm: 4 },
        px: 2,
        textAlign: "center",
      }}
    >
      {Icon && (
        <Icon
          sx={{
            fontSize: { xs: 40, sm: 48 },
            color: alpha(C.outline, 0.35),
            mb: 1.5,
          }}
        />
      )}
      <Typography
        sx={{
          fontWeight: 600,
          color: C.primary,
          mb: 0.5,
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: C.secondary,
          fontSize: { xs: "0.75rem", sm: "0.8rem" },
          lineHeight: 1.5,
          maxWidth: 320,
        }}
      >
        {description}
      </Typography>
    </Box>
  </Fade>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const DashSkeleton = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Skeleton variant="text" width={150} height={40} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton variant="circular" width={36} height={36} />
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Skeleton
              variant="rounded"
              height={sm ? 110 : 140}
              sx={{ borderRadius: 3 }}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <Skeleton
            variant="rounded"
            height={sm ? 220 : 280}
            sx={{ borderRadius: 3 }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Skeleton
            variant="rounded"
            height={sm ? 220 : 280}
            sx={{ borderRadius: 3 }}
          />
        </Grid>
      </Grid>
      <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
    </Box>
  );
};

// ─── Error display ────────────────────────────────────────────────────────────
const ErrDisplay = ({ message, onRetry }) => (
  <Fade in>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        px: 2,
      }}
    >
      <ErrorIcon sx={{ fontSize: 56, color: C.onErrorContainer, mb: 2 }} />
      <Typography
        sx={{
          fontWeight: 600,
          color: C.onErrorContainer,
          mb: 1,
          textAlign: "center",
        }}
      >
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
          "&:hover": { bgcolor: alpha(C.onErrorContainer, 0.85) },
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Retry
      </Button>
    </Box>
  </Fade>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendUp = true,
  bgColor,
  iconBg,
  loading,
}) => (
  <Zoom in style={{ transitionDelay: "80ms" }}>
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
        borderRadius: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: bgColor || "background.paper",
        border: "1px solid",
        width:"277px",
        borderColor: bgColor ? "transparent" : alpha(C.outlineVariant, 0.5),
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": bgColor
          ? { transform: "translateY(-4px)", boxShadow: 6 }
          : {
              borderColor: C.outlineVariant,
              transform: "translateY(-4px)",
              boxShadow: `0 8px 24px ${alpha(C.primary, 0.12)}`,
            },
        position: "relative",
        overflow: "hidden",
        height: "100%",
        minHeight: { xs: 110, sm: 130, md: 140 },
      }}
    >
      {bgColor && (
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: { xs: 70, md: 110 },
            height: { xs: 70, md: 110 },
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
      )}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: { xs: 1, sm: 1.5, md: 2 },
          }}
        >
          <Box
            sx={{
              p: { xs: 0.7, sm: 1, md: 1.2 },
              borderRadius: { xs: 1.5, sm: 2 },
              bgcolor:
                iconBg ||
                (bgColor ? "rgba(255,255,255,0.15)" : C.secondaryContainer),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              sx={{
                fontSize: { xs: 14, sm: 16, md: 18, lg: 20 },
                color: bgColor ? "white" : C.onSecondaryContainer,
              }}
            />
          </Box>
          {trend && (
            <Box
              sx={{
                px: { xs: 0.6, sm: 0.8 },
                py: 0.3,
                borderRadius: 1,
                bgcolor: bgColor
                  ? "rgba(255,255,255,0.15)"
                  : C.surfaceContainerLow,
                display: "flex",
                alignItems: "center",
                gap: 0.3,
              }}
            >
              {trendUp ? (
                <TrendingUpIcon
                  sx={{
                    fontSize: { xs: 9, md: 11 },
                    color: bgColor ? "white" : C.success,
                  }}
                />
              ) : (
                <TrendingDownIcon
                  sx={{
                    fontSize: { xs: 9, md: 11 },
                    color: bgColor ? "white" : C.onErrorContainer,
                  }}
                />
              )}
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.55rem", md: "0.65rem" },
                  color: bgColor
                    ? "white"
                    : trendUp
                      ? C.success
                      : C.onErrorContainer,
                }}
              >
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Typography
          sx={{
            fontWeight: 600,
            letterSpacing: "0.05em",
            color: bgColor ? alpha("#fff", 0.8) : C.secondary,
            textTransform: "uppercase",
            fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem" },
            mb: 0.5,
          }}
        >
          {loading ? <Skeleton width={70} /> : title}
        </Typography>
        <Typography
          sx={{
            fontWeight: 800,
            color: bgColor ? "white" : C.primary,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem", lg: "1.5rem" },
            lineHeight: 1.2,
            wordBreak: "break-word",
            mt: "auto",
          }}
        >
          {loading ? <Skeleton width={60} /> : (value ?? 0)}
        </Typography>
      </Box>
    </Paper>
  </Zoom>
);

// ─── Revenue Bar Chart ────────────────────────────────────────────────────────
const RevenueBarChart = ({ data, loading }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  if (loading)
    return (
      <Box
        sx={{
          height: { xs: 200, md: 260 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={28} sx={{ color: C.primaryContainer }} />
      </Box>
    );
  if (!data?.length)
    return (
      <EmptyState
        icon={AnalyticsIcon}
        title="No revenue data"
        description="Revenue trends will appear once data is available."
      />
    );
  return (
    <Box sx={{ width: "550px", height: { xs: 200, sm: 240, md: 260 } }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: sm ? 0 : 8, bottom: 4 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            vertical={false}
            stroke="rgba(112,120,124,0.12)"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: sm ? 10 : 11,
              fill: C.secondary,
              fontWeight: 500,
            }}
            interval={sm ? 1 : 0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: sm ? 9 : 10, fill: C.secondary }}
            tickFormatter={fmtINR}
            width={sm ? 44 : 58}
          />
          <RTooltip
            content={<RevTip />}
            cursor={{ fill: alpha(C.primaryContainer, 0.08), radius: 4 }}
          />
          <Bar
            dataKey="revenue"
            fill={C.primaryContainer}
            radius={[5, 5, 0, 0]}
            maxBarSize={sm ? 28 : 44}
            animationDuration={700}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ─── Subscription Donut Chart ─────────────────────────────────────────────────
const SubDonutChart = ({ data, loading }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  if (loading)
    return (
      <Stack spacing={1.5}>
        {[1, 2, 3].map((i) => (
          <Box key={i}>
            <Skeleton variant="text" width="50%" height={16} sx={{ mb: 0.5 }} />
            <Skeleton variant="rounded" height={8} sx={{ borderRadius: 4 }} />
          </Box>
        ))}
      </Stack>
    );
  if (!data?.length)
    return (
      <EmptyState
        icon={PaymentsIcon}
        title="No subscription data"
        description="Subscription distribution will appear here."
      />
    );

  const pieData = data.map((d) => ({
    name: d.plan || "Unknown",
    value: d.count || 0,
    potentialRevenue: d.potentialRevenue || 0,
  }));
  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        gap: { xs: 0, sm: 2 },
        width: "510px",
      }}
    >
      {/* donut */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", sm: "55%" },
          height: { xs: 190, sm: 210, md: 230 },
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.15rem", sm: "1.3rem" },
              fontWeight: 800,
              color: C.primary,
              lineHeight: 1,
            }}
          >
            {total}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.55rem",
              color: C.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mt: 0.25,
            }}
          >
            Total
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={sm ? "52%" : "55%"}
              outerRadius={sm ? "72%" : "78%"}
              dataKey="value"
              paddingAngle={3}
              animationDuration={700}
              animationEasing="ease-out"
            >
              {pieData.map((_, i) => (
                <Cell
                  key={i}
                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <RTooltip content={<SubTip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      {/* legend */}
      <Stack spacing={1} sx={{ mt: { xs: 0.5, sm: 0 }, minWidth: { sm: 120 } }}>
        {pieData.map((e, i) => (
          <Box
            key={i}
            sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: PIE_COLORS[i % PIE_COLORS.length],
                flexShrink: 0,
                mt: 0.3,
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: C.primary,
                  lineHeight: 1.2,
                }}
              >
                {e.name}
              </Typography>
              <Typography sx={{ fontSize: "0.6rem", color: C.secondary }}>
                {e.value} • {fmtINR(e.potentialRevenue)}/mo
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

// ─── Dashboard (default export) ───────────────────────────────────────────────
export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const xl = useMediaQuery(theme.breakpoints.up("xl"));

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

  const [anchorEl, setAnchorEl] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, [retry]);

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
    setRetry((p) => p + 1);
    toast$("Refreshing dashboard…", "info");
  }, [toast$]);
  const handleRetry = useCallback(() => {
    setRetry((p) => p + 1);
    clearError();
  }, [clearError]);

  const handleExport = useCallback(
    async (type) => {
      setExporting(true);
      setAnchorEl(null);
      try {
        const blob = await exportDashboardReport();
        if (!blob) throw new Error("No data received");
        let parsed;
        try {
          parsed = JSON.parse(await blob.text());
        } catch {
          parsed = {};
        }

        // enrich with local context
        const payload = {
          ...parsed,
          overview:
            parsed.overview ||
            statsData?.overview ||
            dashboardData?.overview ||
            {},
          revenueTrend: parsed.revenueTrend || chartData?.revenueTrend || [],
          subscriptionDistribution:
            parsed.subscriptionDistribution ||
            chartData?.subscriptionDistribution ||
            [],
          activities: parsed.activities || activities || [],
        };

        const name = `dashboard_report_${new Date().toISOString().split("T")[0]}`;
        if (type === "csv") {
          doCSV(payload, name);
          toast$("CSV exported successfully");
        } else {
          await doPDF(payload, name);
          toast$("PDF exported successfully");
        }
      } catch (e) {
        console.error(e);
        toast$(e.message || "Export failed", "error");
      } finally {
        setExporting(false);
      }
    },
    [
      exportDashboardReport,
      statsData,
      dashboardData,
      chartData,
      activities,
      toast$,
    ],
  );

  const overview = useMemo(() => {
    if (statsData?.overview && Object.keys(statsData.overview).length)
      return statsData.overview;
    if (dashboardData?.overview && Object.keys(dashboardData.overview).length)
      return dashboardData.overview;
    return {
      totalClients: 0,
      activeClients: 0,
      totalRevenue: 0,
      expiringSoon: 0,
      totalTeamMembers: 0,
      activeTeamMembers: 0,
      totalAssets: 0,
      totalInspections: 0,
      totalTasks: 0,
      completedTasks: 0,
      completionRate: 0,
      performanceScore: 0,
      clientGrowth: 0,
    };
  }, [statsData, dashboardData]);

  const isAdminRole = user?.role === "super_admin" || user?.role === "admin";

  const stats = useMemo(
    () =>
      isAdminRole
        ? [
            {
              icon: GroupIcon,
              title: "Total Customers",
              value: overview.totalClients,
              trend: `${overview.clientGrowth || 0}%`,
              trendUp: (overview.clientGrowth || 0) >= 0,
              bgColor: C.primaryContainer,
            },
            {
              icon: CheckCircleIcon,
              title: "Active Customers",
              value: overview.activeClients,
              trend: "8.2%",
              trendUp: true,
              iconBg: C.secondaryContainer,
            },
            {
              icon: PaymentsIcon,
              title: "Total Revenue",
              value: fmtINR(overview.totalRevenue || 0),
              trend: "15.3%",
              trendUp: true,
            },
            {
              icon: WarningIcon,
              title: "Expiring Soon",
              value: overview.expiringSoon || 0,
              trend: "3.1%",
              trendUp: false,
              iconBg: C.errorContainer,
            },
          ]
        : [
            {
              icon: TaskIcon,
              title: "Total Tasks",
              value: overview.totalTasks,
              bgColor: C.primaryContainer,
            },
            {
              icon: CheckCircleIcon,
              title: "Completed",
              value: overview.completedTasks,
              iconBg: C.secondaryContainer,
            },
            {
              icon: AnalyticsIcon,
              title: "Completion %",
              value: `${overview.completionRate || 0}%`,
            },
            {
              icon: TrendingUpIcon,
              title: "Performance",
              value: `${overview.performanceScore || 0}%`,
              iconBg: C.errorContainer,
            },
          ],
    [isAdminRole, overview],
  );

  const revenueTrend = useMemo(
    () => chartData?.revenueTrend || [],
    [chartData],
  );
  const subDist = useMemo(
    () => chartData?.subscriptionDistribution || [],
    [chartData],
  );

  const quickActions = useMemo(() => {
    const a = [];
    if (isAdminRole)
      a.push({
        icon: AddCircleIcon,
        title: "New Checklist",
        desc: "Create inspection form",
        path: "/admin/checklists",
      });
    if (user?.role === "super_admin")
      a.push({
        icon: PersonAddIcon,
        title: "Add Client",
        desc: "Register new client",
        path: "/admin/clients",
      });
    a.push({
      icon: AnalyticsIcon,
      title: "Reports",
      desc: "View analytics",
      path: "/admin/reports",
    });
    return a;
  }, [isAdminRole, user?.role]);

  const actLimit = sm ? 3 : md ? 4 : lg ? 6 : 5;
  const gap = sm ? 1.25 : md ? 1.75 : 2.25;
  const pad = sm ? 1.25 : md ? 1.75 : lg ? 3.5 : 2.5;

  if (loading && !dashboardData && !statsData) return <DashSkeleton />;
  if (error && !dashboardData && !statsData)
    return <ErrDisplay message={error} onRetry={handleRetry} />;

  return (
    <Box
      sx={{
        bgcolor: C.surface,
        minHeight: "100%",
        p: pad,
        position: "relative",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* top progress bar */}
      {loading && (
        <Box
          sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}
        >
          <LinearProgress sx={{ height: 2 }} />
        </Box>
      )}

      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: { xs: 2, sm: 2.5, md: 3 },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 1 },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: C.primary,
              fontSize: {
                xs: "1.2rem",
                sm: "1.35rem",
                md: "1.5rem",
                lg: "1.65rem",
              },
              lineHeight: 1.2,
            }}
          >
            Dashboard
          </Typography>
          <Typography
            sx={{
              color: C.secondary,
              fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
              display: "block",
              mt: 0.25,
            }}
          >
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={{ xs: 0.75, sm: 1 }}
          alignItems="center"
        >
          <Tooltip title="Refresh">
            <span>
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                size={sm ? "small" : "medium"}
                sx={{
                  bgcolor: C.surfaceContainerLow,
                  "&:hover": { bgcolor: C.surfaceVariant },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <RefreshIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Export report">
            <span>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={exporting || loading}
                size={sm ? "small" : "medium"}
                sx={{
                  bgcolor: C.surfaceContainerLow,
                  "&:hover": { bgcolor: C.surfaceVariant },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                {exporting ? (
                  <CircularProgress size={sm ? 14 : 16} />
                ) : (
                  <DownloadIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: `0 4px 20px ${alpha(C.primary, 0.12)}`,
                border: `1px solid ${alpha(C.outlineVariant, 0.5)}`,
                minWidth: 170,
              },
            }}
          >
            <MenuItem onClick={() => handleExport("csv")} disabled={exporting}>
              <ListItemIcon>
                <CsvIcon fontSize="small" sx={{ color: C.secondary }} />
              </ListItemIcon>
              <ListItemText
                primary="Export as CSV"
                primaryTypographyProps={{ fontSize: "0.8rem" }}
              />
            </MenuItem>
            <MenuItem onClick={() => handleExport("pdf")} disabled={exporting}>
              <ListItemIcon>
                <PdfIcon fontSize="small" sx={{ color: C.secondary }} />
              </ListItemIcon>
              <ListItemText
                primary="Export as PDF"
                primaryTypographyProps={{ fontSize: "0.8rem" }}
              />
            </MenuItem>
          </Menu>
        </Stack>
      </Box>

      {/* error banner */}
      {error && (
        <Fade in>
          <Alert
            severity="error"
            onClose={clearError}
            sx={{ mb: 2.5, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* ── Stat cards ── */}
      <Grid container spacing={gap} sx={{ mb: { xs: 2.5, sm: 3, md: 3.5 } }}>
        {stats.map((s, i) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={i}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* ── Charts ── */}
      {isAdminRole && (
        <Grid container spacing={gap} sx={{ mb: { xs: 2.5, sm: 3, md: 3.5 } }}>
          {/* Revenue Trend */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2, md: 2.5 },
                borderRadius: { xs: 2, sm: 3 },
                height: "100%",
                bgcolor: "background.paper",
                border: `1px solid ${alpha(C.outlineVariant, 0.5)}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: C.primary,
                    fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                  }}
                >
                  Revenue Trend (₹)
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "2px",
                      bgcolor: C.primaryContainer,
                    }}
                  />
                  <Typography sx={{ fontSize: "0.62rem", color: C.secondary }}>
                    Monthly revenue (₹)
                  </Typography>
                </Box>
              </Box>
              <RevenueBarChart data={revenueTrend} loading={loading} />
            </Paper>
          </Grid>

          {/* Subscription Distribution */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2, md: 2.5 },
                borderRadius: { xs: 2, sm: 3 },
                height: "100%",
                bgcolor: "background.paper",
                border: `1px solid ${alpha(C.outlineVariant, 0.5)}`,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: C.primary,
                  fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                Subscription Distribution
              </Typography>
              <SubDonutChart data={subDist} loading={loading} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ── Recent Activity ── */}
      <Box sx={{ mb: { xs: 2.5, sm: 3, md: 3.5 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            overflow: "hidden",
            bgcolor: "background.paper",
            border: `1px solid ${alpha(C.outlineVariant, 0.5)}`,
          }}
        >
          <Box
            sx={{
              px: { xs: 1.5, sm: 2, md: 2.5 },
              py: { xs: 1.25, sm: 1.5 },
              borderBottom: `1px solid ${alpha(C.outlineVariant, 0.3)}`,
              display: "flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <HistoryIcon
              sx={{ color: C.primaryContainer, fontSize: { xs: 16, sm: 20 } }}
            />
            <Typography
              sx={{
                fontWeight: 700,
                color: C.primary,
                fontSize: { xs: "0.85rem", sm: "1rem" },
              }}
            >
              Recent Activity
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Skeleton variant="circular" width={28} height={28} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="55%" height={16} />
                    <Skeleton variant="text" width="38%" height={12} />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : !activities.length ? (
            <EmptyState
              icon={HistoryIcon}
              title="No recent activity"
              description="Your recent activities will appear here."
            />
          ) : (
            <TableContainer sx={{ maxHeight: { xs: 260, sm: 300, md: 380 } }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Activity", "Details", !sm && "Date"]
                      .filter(Boolean)
                      .map((h) => (
                        <TableCell
                          key={h}
                          sx={{
                            fontWeight: 700,
                            color: C.secondary,
                            fontSize: { xs: "0.58rem", md: "0.65rem" },
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            bgcolor: alpha(C.surfaceContainerLow, 0.8),
                            py: { xs: 0.75, sm: 1 },
                            ...(h === "Date" ? { width: 110 } : {}),
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activities.slice(0, actLimit).map((a, i) => (
                    <TableRow
                      key={i}
                      hover
                      sx={{ "&:last-child td": { border: 0 } }}
                    >
                      <TableCell sx={{ py: { xs: 0.9, sm: 1 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 0.75, sm: 1 },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: { xs: 22, md: 28 },
                              height: { xs: 22, md: 28 },
                              bgcolor: alpha(C.primary, 0.08),
                              fontSize: { xs: 10, md: 13 },
                            }}
                          >
                            {a.icon || "📋"}
                          </Avatar>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: C.primary,
                              fontSize: { xs: "0.6rem", md: "0.72rem" },
                              lineHeight: 1.3,
                            }}
                          >
                            {a.title || "Activity"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 0.9, sm: 1 } }}>
                        <Typography
                          sx={{
                            color: C.secondary,
                            fontSize: { xs: "0.58rem", md: "0.65rem" },
                            lineHeight: 1.4,
                          }}
                        >
                          {a.details || "No details"}
                        </Typography>
                      </TableCell>
                      {!sm && (
                        <TableCell sx={{ py: { xs: 0.9, sm: 1 } }}>
                          <Typography
                            sx={{
                              color: C.outline,
                              fontSize: { xs: "0.58rem", md: "0.65rem" },
                              whiteSpace: "nowrap",
                            }}
                          >
                            {a.timestamp
                              ? new Date(a.timestamp).toLocaleDateString(
                                  "en-IN",
                                )
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

      {/* ── Quick Actions ── */}
      {quickActions.length > 0 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            <BoltIcon
              sx={{
                color: C.onTertiaryContainer,
                fontSize: { xs: 16, sm: 20 },
              }}
            />
            <Typography
              sx={{
                fontWeight: 700,
                color: C.primary,
                fontSize: { xs: "0.85rem", sm: "1rem" },
              }}
            >
              Quick Actions
            </Typography>
          </Box>
          <Grid container spacing={gap}>
            {quickActions.map((act, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Button
                  fullWidth
                  onClick={() => navigate(act.path)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width:"377px",
                    p: { xs: 1.5, sm: 2, lg: 2.5 },
                    bgcolor: C.primaryContainer,
                    borderRadius: { xs: 2, sm: 3 },
                    textTransform: "none",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    height: "100%",
                    minHeight: { xs: 90, sm: 110 },
                    "&:hover": {
                      transform: "translateY(-4px)",
                      bgcolor: alpha(C.primaryContainer, 0.88),
                      boxShadow: `0 8px 24px ${alpha(C.primary, 0.2)}`,
                    },
                    boxShadow: `0 2px 8px ${alpha(C.primary, 0.1)}`,
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 0.7, sm: 0.9 },
                      bgcolor: "rgba(255,255,255,0.13)",
                      borderRadius: 1.5,
                      mb: { xs: 0.75, sm: 1 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <act.icon
                      sx={{ color: "white", fontSize: { xs: 14, sm: 18 } }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: { xs: "0.75rem", sm: "0.85rem" },
                      mb: 0.25,
                      lineHeight: 1.2,
                    }}
                  >
                    {act.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: C.onPrimaryContainer,
                      fontSize: { xs: 10, sm: "0.65rem" },
                      lineHeight: 1.4,
                    }}
                  >
                    {act.desc}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ── Toast ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: sm ? "center" : "right",
        }}
        sx={{ bottom: { xs: 70, sm: 80, md: 24 } }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            borderRadius: 2,
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            boxShadow: 4,
            width: { xs: "90vw", sm: "auto" },
            maxWidth: { xs: "90vw", sm: 400 },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
