import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Stack,
  IconButton,
  Skeleton,
  Alert,
  Tooltip,
  Dialog,
  DialogContent,
  Pagination,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ViewListIcon from "@mui/icons-material/ViewList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import BusinessIcon from "@mui/icons-material/Business";
import { useAssignment } from "../context/TeamAssignmentcontext";

/* ═══════════════════════════════ THEME ═════════════════════════════════════ */
export const theme = createTheme({
  palette: {
    primary: { main: "#0d3d52" },
    background: { default: "#f5f6f8", paper: "#ffffff" },
    text: { primary: "#111827", secondary: "#6b7280" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    body2: { fontSize: "0.82rem" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          border: "1.5px solid #e9eaec",
          borderRadius: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10, background: "#fff", fontSize: "0.82rem" },
        notchedOutline: { borderColor: "#e5e7eb" },
      },
    },
  },
});

/* ═══════════════ CALENDAR STATIC DATA ═══════════════════════════════════ */
const LEGEND = [
  { color: "#f472b6", label: "Extremely Critical" },
  { color: "#ef4444", label: "High Priority" },
  { color: "#f97316", label: "Medium Priority" },
  { color: "#3b82f6", label: "Low Priority" },
  { color: "#22c55e", label: "In Progress" },
  { color: "#9ca3af", label: "Pending" },
];

const DAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ═══════════════════════════ HELPERS ═══════════════════════════════════════ */
const Badge = ({ bg, color, children, ml = 0, small = false }) => (
  <Box
    sx={{
      background: bg,
      color,
      borderRadius: "20px",
      px: small ? 1 : 1.4,
      py: small ? 0.3 : 0.4,
      fontSize: small ? "0.67rem" : "0.71rem",
      fontWeight: 700,
      display: "inline-block",
      whiteSpace: "nowrap",
      ml,
    }}
  >
    {children}
  </Box>
);

const MetaRow = ({ Icon, text }) => (
  <Box display="flex" alignItems="center" gap={0.9}>
    <Icon sx={{ fontSize: 13, color: "#6b7280", flexShrink: 0 }} />
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontSize: "0.8rem" }}
    >
      {text}
    </Typography>
  </Box>
);

/* ═══════════════════════════ SHARED HEADER ═════════════════════════════════ */
const Header = ({ view, setView, onRefresh, loading }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      px: { xs: 2, md: 4 },
      pt: 3,
      pb: 0.5,
    }}
  >
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1.1rem", md: "1.35rem" },
          color: "#0d3d52",
        }}
      >
        My Tasks
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={0.2}>
        Your assigned inspection tasks
      </Typography>
    </Box>
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton
        size="small"
        onClick={onRefresh}
        disabled={loading}
        sx={{
          border: "1.5px solid #e5e7eb",
          borderRadius: "8px",
          width: 34,
          height: 34,
          color: "#6b7280",
        }}
      >
        <RefreshIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          border: "1.5px solid #e5e7eb",
          borderRadius: "12px",
          background: "#fff",
          p: "4px",
          gap: "2px",
        }}
      >
        {[
          {
            val: "list",
            icon: <ViewListIcon sx={{ fontSize: 15 }} />,
            label: "List View",
          },
          {
            val: "calendar",
            icon: <CalendarMonthIcon sx={{ fontSize: 15 }} />,
            label: "Calendar View",
          },
        ].map(({ val, icon, label }) => (
          <Button
            key={val}
            onClick={() => setView(val)}
            startIcon={icon}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: { xs: "0.75rem", md: "0.82rem" },
              borderRadius: "9px",
              px: { xs: 1, md: 1.8 },
              py: 0.85,
              minWidth: 0,
              border: "none",
              color: view === val ? "#111827" : "#6b7280",
              background: view === val ? "#fff" : "transparent",
              boxShadow: view === val ? "0 1px 5px rgba(0,0,0,.10)" : "none",
              "&:hover": { background: view === val ? "#fff" : "#f9fafb" },
              display: { xs: val === "calendar" ? "none" : "flex", sm: "flex" },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  </Box>
);

/* ═══════════════════════════ FILTERS BAR ═══════════════════════════════════ */
const FiltersBar = ({ showMore = true, onFilter, filters }) => {
  const [status, setStatus] = useState(filters.status || "");
  const [priority, setPriority] = useState(filters.priority || "");
  const [date, setDate] = useState("");

  const apply = (newStatus, newPriority) => {
    onFilter({ status: newStatus, priority: newPriority });
  };

  return (
    <Box
      sx={{
        mx: { xs: 2, md: 4 },
        mb: 2.5,
        mt: 1.5,
        border: "1.5px solid #e9eaec",
        borderRadius: "14px",
        background: "#fff",
        px: 2,
        py: 1.5,
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            apply(e.target.value, priority);
          }}
          displayEmpty
          sx={{
            fontSize: "0.82rem",
            borderRadius: "10px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
          }}
        >
          <MenuItem value="">All Tasks</MenuItem>
          {[
            "pending",
            "assigned",
            "in_progress",
            "submitted",
            "completed",
            "approved",
            "rejected",
            "overdue",
          ].map((s) => (
            <MenuItem
              key={s}
              value={s}
              sx={{ fontSize: "0.82rem", textTransform: "capitalize" }}
            >
              {s.replace("_", " ")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            apply(status, e.target.value);
          }}
          displayEmpty
          sx={{
            fontSize: "0.82rem",
            borderRadius: "10px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
          }}
        >
          <MenuItem value="">Priority</MenuItem>
          {["high", "medium", "low", "critical"].map((p) => (
            <MenuItem
              key={p}
              value={p}
              sx={{ fontSize: "0.82rem", textTransform: "capitalize" }}
            >
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            fontSize: "0.82rem",
          },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
        }}
      />

      {showMore && (
        <Button
          startIcon={<FilterListIcon sx={{ fontSize: 15 }} />}
          onClick={() => apply(status, priority)}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.82rem",
            color: "#111827",
            border: "1.5px solid #e5e7eb",
            borderRadius: "10px",
            px: 2,
            py: 0.85,
            background: "#fff",
            "&:hover": { background: "#f9fafb" },
          }}
        >
          Apply Filters
        </Button>
      )}
    </Box>
  );
};

/* ═══════════════════════════ STAT CARDS ════════════════════════════════════ */
const StatCard = ({ label, value, loading }) => (
  <Card sx={{ flex: 1, minWidth: { xs: "calc(50% - 8px)", sm: 0 } }}>
    <CardContent sx={{ px: "18px !important", py: "16px !important" }}>
      <Typography
        variant="body2"
        color="text.secondary"
        mb={0.8}
        sx={{ fontSize: "0.78rem" }}
      >
        {label}
      </Typography>
      {loading ? (
        <Skeleton width={40} height={36} />
      ) : (
        <Typography
          sx={{
            fontSize: { xs: "1.5rem", md: "1.85rem" },
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
      )}
    </CardContent>
  </Card>
);

/* ═══════════════════════════ TASK CARD ═════════════════════════════════════ */
const TaskCard = ({ task, onStart }) => (
  <Card sx={{ height: "100%", borderRadius: "18px" }}>
    <CardContent
      sx={{
        p: "20px !important",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1.6}
        gap={1}
        flexWrap="wrap"
      >
        <Badge bg={task.priorityBg} color={task.priorityColor}>
          {task.priority}
        </Badge>
        <Badge bg={task.statusBg} color={task.statusColor}>
          {task.status}
        </Badge>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1.6}
        gap={1}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.98rem",
            color: "#111827",
            flex: 1,
          }}
        >
          {task.title}
        </Typography>
        {task.critical && (
          <Badge bg="#ef4444" color="#fff" small>
            Critical
          </Badge>
        )}
      </Box>

      <Stack gap={0.8} mb={2.5}>
        <MetaRow Icon={DescriptionOutlinedIcon} text={task.type} />
        <MetaRow Icon={LocationOnOutlinedIcon} text={task.location} />
        <MetaRow Icon={BusinessIcon} text={task.customerName} />
        <MetaRow Icon={CalendarTodayOutlinedIcon} text={`Due: ${task.due}`} />
      </Stack>

      {task.isDraft && (
        <Box mb={1.5}>
          <Badge bg="#fef3c7" color="#92400e">
            Draft saved
          </Badge>
        </Box>
      )}

      <Box mt="auto">
        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrowIcon sx={{ fontSize: 14 }} />}
          onClick={() => onStart(task)}
          sx={{
            background: "linear-gradient(135deg,#0d3d52 0%,#1a5a78 100%)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "10px",
            py: 1.2,
            boxShadow: "0 2px 8px rgba(13,61,82,.28)",
            "&:hover": { boxShadow: "0 4px 14px rgba(13,61,82,.38)" },
          }}
        >
          {task.btn}
          {task.dot && (
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#ef4444",
                ml: 0.5,
              }}
            />
          )}
        </Button>
      </Box>
    </CardContent>
  </Card>
);

/* ═══════════════════════ TASK CARD SKELETON ════════════════════════════════ */
const TaskCardSkeleton = () => (
  <Card sx={{ height: "100%", borderRadius: "18px" }}>
    <CardContent sx={{ p: "20px !important" }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Skeleton width={100} height={24} sx={{ borderRadius: "20px" }} />
        <Skeleton width={80} height={24} sx={{ borderRadius: "20px" }} />
      </Box>
      <Skeleton width="70%" height={28} sx={{ mb: 1.5 }} />
      <Skeleton width="90%" height={18} sx={{ mb: 0.8 }} />
      <Skeleton width="75%" height={18} sx={{ mb: 0.8 }} />
      <Skeleton width="60%" height={18} sx={{ mb: 3 }} />
      <Skeleton width="100%" height={44} sx={{ borderRadius: "10px" }} />
    </CardContent>
  </Card>
);

/* ═══════════════════════ CALENDAR HELPERS ══════════════════════════════════ */
const buildCalendarData = (assignments) => {
  const dotsByDay = {};
  assignments.forEach((a) => {
    if (!a.due || a.due === "—") return;
    const day = parseInt(a.due.split("-")[2], 10);
    if (!dotsByDay[day]) dotsByDay[day] = [];
    dotsByDay[day].push({ color: a.priorityBg, id: a.id, task: a });
  });
  return dotsByDay;
};

const buildCalendarWeeks = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ d: daysInPrev - i, o: true });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ d, today: isCurrentMonth && d === today.getDate() });
  while (cells.length % 7 !== 0)
    cells.push({ d: cells.length - daysInMonth - firstDay + 1, o: true });

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

/* ═══════════════════════ DAY MODAL ═════════════════════════════════════════ */
const DayModal = ({ open, day, month, year, tasks, onClose, onStart }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: { borderRadius: "20px", maxWidth: 560, width: "100%", m: 2 },
    }}
  >
    <DialogContent sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2.2,
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              background: "#0d3d52",
              borderRadius: "10px",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarMonthIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}
            >
              {day} {MONTHS[month]} {year}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""} scheduled
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {tasks.map((t) => (
          <Card
            key={t.id}
            sx={{
              borderRadius: "14px",
              border: "1.5px solid #e9eaec",
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Box display="flex">
              <Box sx={{ width: 4, background: t.priorityBg, flexShrink: 0 }} />
              <CardContent sx={{ p: "16px 18px !important", flex: 1 }}>
                <Box display="flex" alignItems="flex-start" gap={1} mb={0.5}>
                  <Typography sx={{ fontSize: 16 }}>📋</Typography>
                  <Box flex={1}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "#111827",
                      }}
                    >
                      {t.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.3}>
                      {t.assetName}
                    </Typography>
                  </Box>
                </Box>

                <Stack gap={0.6} mb={1.5} mt={1}>
                  <MetaRow Icon={DescriptionOutlinedIcon} text={t.type} />
                  <MetaRow Icon={LocationOnOutlinedIcon} text={t.location} />
                </Stack>

                <Box display="flex" gap={1} mb={1.8} flexWrap="wrap">
                  <Badge bg={t.priorityBg} color={t.priorityColor} small>
                    {t.priority}
                  </Badge>
                  <Badge bg={t.statusBg} color={t.statusColor} small>
                    {t.status}
                  </Badge>
                  {t.critical && (
                    <Badge bg="#fee2e2" color="#dc2626" small>
                      Critical Asset
                    </Badge>
                  )}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayArrowIcon sx={{ fontSize: 13 }} />}
                  onClick={() => {
                    onClose();
                    onStart(t);
                  }}
                  sx={{
                    background:
                      "linear-gradient(135deg,#0d3d52 0%,#1a5a78 100%)",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.83rem",
                    borderRadius: "10px",
                    py: 1,
                  }}
                >
                  {t.btn}
                </Button>
              </CardContent>
            </Box>
          </Card>
        ))}
        {tasks.length === 0 && (
          <Typography color="text.secondary" textAlign="center" py={3}>
            No tasks on this day
          </Typography>
        )}
      </Box>
    </DialogContent>
  </Dialog>
);

/* ═══════════════════════ LIST VIEW ═════════════════════════════════════════ */
const ListView = ({ view, setView, onStart }) => {
  const {
    assignments,
    stats,
    loading,
    error,
    filters,
    fetchAssignments,
    applyFilters,
    pagination,
    changePage,
  } = useAssignment();

  return (
    <>
      <Header
        view={view}
        setView={setView}
        onRefresh={() => fetchAssignments({}, true)}
        loading={loading}
      />
      <FiltersBar showMore filters={filters} onFilter={applyFilters} />

      {error && (
        <Box px={4} mb={2}>
          <Alert severity="error" onClose={() => {}}>
            {error}
          </Alert>
        </Box>
      )}

      <Box px={{ xs: 2, md: 4 }} mb={3}>
        <Stack direction="row" gap={2} flexWrap="wrap">
          <StatCard
            label="Total Tasks"
            value={stats?.total}
            loading={loading}
          />
          <StatCard label="Pending" value={stats?.pending} loading={loading} />
          <StatCard
            label="In Progress"
            value={stats?.inProgress}
            loading={loading}
          />
          <StatCard label="Overdue" value={stats?.overdue} loading={loading} />
        </Stack>
      </Box>

      <Box px={{ xs: 2, md: 4 }}>
        <Grid container spacing={2.5}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <TaskCardSkeleton />
              </Grid>
            ))
          ) : assignments.length > 0 ? (
            assignments.map((t) => (
              <Grid item xs={12} sm={6} md={4} key={t.id}>
                <TaskCard task={t} onStart={onStart} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box textAlign="center" py={8} color="text.secondary">
                <Typography variant="h6" mb={1}>
                  No assignments found
                </Typography>
                <Typography variant="body2">
                  Try changing your filters or check back later.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {pagination.totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4} pb={4}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={(_, p) => changePage(p)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Box>
    </>
  );
};

/* ═══════════════════════ CALENDAR VIEW ═════════════════════════════════════ */
const CalendarView = ({ view, setView, onStart }) => {
  const { assignments, loading, fetchAssignments, filters, applyFilters } =
    useAssignment();
  const now = new Date();
  const [curYear, setCurYear] = useState(now.getFullYear());
  const [curMonth, setCurMonth] = useState(now.getMonth());
  const [calSub, setCalSub] = useState("Month");
  const [modalDay, setModalDay] = useState(null);

  const weeks = buildCalendarWeeks(curYear, curMonth);
  const dotsByDay = buildCalendarData(
    assignments.filter((a) => {
      if (!a.due || a.due === "—") return false;
      const d = new Date(a.due);
      return d.getFullYear() === curYear && d.getMonth() === curMonth;
    }),
  );

  const prevMonth = () => {
    if (curMonth === 0) {
      setCurYear((y) => y - 1);
      setCurMonth(11);
    } else {
      setCurMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (curMonth === 11) {
      setCurYear((y) => y + 1);
      setCurMonth(0);
    } else {
      setCurMonth((m) => m + 1);
    }
  };

  const modalTasks = modalDay
    ? (dotsByDay[modalDay] || []).map((d) => d.task).filter(Boolean)
    : [];

  return (
    <>
      <Header
        view={view}
        setView={setView}
        onRefresh={() => fetchAssignments({}, true)}
        loading={loading}
      />
      <FiltersBar showMore={false} filters={filters} onFilter={applyFilters} />

      <Box px={{ xs: 2, md: 4 }} pb={4}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          flexWrap="wrap"
          gap={1}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <IconButton
              size="small"
              onClick={prevMonth}
              sx={{
                border: "1.5px solid #e5e7eb",
                borderRadius: "8px",
                width: 32,
                height: 32,
                color: "#6b7280",
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.05rem",
                minWidth: { xs: 140, md: 160 },
                textAlign: "center",
              }}
            >
              {MONTHS[curMonth]} {curYear}
            </Typography>
            <IconButton
              size="small"
              onClick={nextMonth}
              sx={{
                border: "1.5px solid #e5e7eb",
                borderRadius: "8px",
                width: 32,
                height: 32,
                color: "#6b7280",
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              border: "1.5px solid #e5e7eb",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            {["Month", "Week", "Day"].map((v) => (
              <Button
                key={v}
                onClick={() => setCalSub(v)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.82rem",
                  px: { xs: 1.5, md: 2.2 },
                  py: 0.8,
                  borderRadius: 0,
                  minWidth: 0,
                  color: calSub === v ? "#111827" : "#6b7280",
                  background: calSub === v ? "#f3f4f6" : "transparent",
                  borderRight: v !== "Day" ? "1.5px solid #e5e7eb" : "none",
                  "&:hover": { background: "#f9fafb" },
                }}
              >
                {v}
              </Button>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            border: "1.5px solid #e5e7eb",
            borderRadius: "14px",
            overflow: "hidden",
            background: "#fff",
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(7,1fr)",
              md: "repeat(7,1fr) 160px",
            },
          }}
        >
          {DAY_HEADERS.map((d) => (
            <Box
              key={d}
              sx={{
                py: 1.2,
                textAlign: "center",
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "#6b7280",
                borderBottom: "1.5px solid #e9eaec",
                background: "#fafafa",
                letterSpacing: "0.04em",
              }}
            >
              {d}
            </Box>
          ))}

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              py: 1.2,
              px: 2,
              textAlign: "right",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#6b7280",
              borderBottom: "1.5px solid #e9eaec",
              borderLeft: "1.5px solid #e9eaec",
              background: "#fafafa",
            }}
          >
            Legend
          </Box>

          {weeks.map((week, wi) =>
            week.map(({ d, o, today }, ci) => {
              const dots = !o && dotsByDay[d];
              const isClick = !o && dots && dots.length > 0;
              return (
                <Tooltip
                  key={`${wi}-${ci}`}
                  title={isClick ? `${dots.length} task(s)` : ""}
                  arrow
                >
                  <Box
                    onClick={() => isClick && setModalDay(d)}
                    sx={{
                      minHeight: { xs: 60, md: 88 },
                      p: 1,
                      border: "0.5px solid #e9eaec",
                      background: o ? "#f8f9fa" : "#fff",
                      outline: today ? "2px solid #0d3d52" : "none",
                      outlineOffset: "-2px",
                      cursor: isClick ? "pointer" : "default",
                      transition: "background .15s",
                      "&:hover": isClick ? { background: "#f0f9ff" } : {},
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        color: o ? "#c4c4c4" : today ? "#0d3d52" : "#374151",
                        fontWeight: today ? 700 : 400,
                        mb: 0.6,
                        lineHeight: 1,
                      }}
                    >
                      {d}
                    </Typography>
                    {dots && (
                      <Box display="flex" gap="3px" flexWrap="wrap">
                        {dots.slice(0, 3).map((dot, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: dot.color,
                            }}
                          />
                        ))}
                        {dots.length > 3 && (
                          <Typography
                            sx={{
                              fontSize: "0.6rem",
                              color: "#6b7280",
                              lineHeight: "7px",
                            }}
                          >
                            +{dots.length - 3}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              );
            }),
          )}

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gridColumn: "8",
              gridRow: `2/${weeks.length + 2}`,
              borderLeft: "1.5px solid #e9eaec",
              p: 2,
              flexDirection: "column",
              gap: 1.4,
            }}
          >
            {LEGEND.map(({ color, label }) => (
              <Box key={label} display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ fontSize: "0.72rem", color: "#374151" }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexWrap: "wrap",
            gap: 1.5,
            mt: 2,
            px: 0.5,
          }}
        >
          {LEGEND.map(({ color, label }) => (
            <Box key={label} display="flex" alignItems="center" gap={0.7}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: "0.7rem", color: "#374151" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <DayModal
        open={!!modalDay}
        day={modalDay}
        month={curMonth}
        year={curYear}
        tasks={modalTasks}
        onClose={() => setModalDay(null)}
        onStart={onStart}
      />
    </>
  );
};

/* ═══════════════════════ MAIN EXPORT ═══════════════════════════════════════ */
export default function MyTasks() {
  const navigate = useNavigate();
  const [view, setView] = useState("list");

  const handleStart = useCallback(
    (task) => {
      navigate(`/task-details/${task.id}`, { state: { task } });
    },
    [navigate],
  );

  return (
    <ThemeProvider theme={theme}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Box sx={{ minHeight: "100vh" }}>
        {view === "list" ? (
          <ListView view={view} setView={setView} onStart={handleStart} />
        ) : (
          <CalendarView view={view} setView={setView} onStart={handleStart} />
        )}
      </Box>
    </ThemeProvider>
  );
}
