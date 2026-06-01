// components/TopHeader.jsx - Premium Redesign
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Fade,
  alpha,
  Tooltip,
  SwipeableDrawer,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "../context/AuthContexts";
import { useNotifications } from "../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";

/* ─── Animated badge with pulse ring ─── */
function PulsingBadge({ count, children }) {
  const hasNew = count > 0;
  // Badge width grows: single digit = 18px, double = 22px, "99+" = 26px
  const label = count > 99 ? "99+" : String(count);
  const badgeMinW = count > 99 ? 26 : count >= 10 ? 22 : 18;

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      {children}
      {hasNew && (
        <>
          {/* Pulse ring — sits behind the badge */}
          <Box
            sx={{
              position: "absolute",
              top: -2,
              right: -2,
              width: badgeMinW,
              height: 18,
              borderRadius: 99,
              bgcolor: "transparent",
              border: "2px solid #ef4444",
              animation: "pulseRing 1.6s ease-out infinite",
              pointerEvents: "none",
              "@keyframes pulseRing": {
                "0%":   { transform: "scale(1)",   opacity: 0.8 },
                "100%": { transform: "scale(2.2)", opacity: 0   },
              },
            }}
          />
          {/* Count badge */}
          <Box
            sx={{
              position: "absolute",
              top: -4,
              right: -5,
              minWidth: badgeMinW,
              height: 18,
              borderRadius: 99,
              bgcolor: "#ef4444",
              color: "#fff",
              fontSize: count >= 10 ? 9 : 10,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: "3px",
              lineHeight: 1,
              // White outline ring — clean separation from any bg
              boxShadow: "0 0 0 2px #ffffff",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: 0,
              transition: "min-width 0.15s ease",
            }}
          >
            {label}
          </Box>
        </>
      )}
    </Box>
  );
}

/* ─── Bell icon with shake animation ─── */
function BellIcon({ active }) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: active ? alpha("#1a5c6b", 0.1) : "transparent",
        border: active ? `1.5px solid ${alpha("#1a5c6b", 0.25)}` : "1.5px solid transparent",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: alpha("#1a5c6b", 0.08),
          border: `1.5px solid ${alpha("#1a5c6b", 0.2)}`,
        },
        "& svg": {
          animation: active ? "bellShake 0.6s ease" : "none",
          "@keyframes bellShake": {
            "0%,100%": { transform: "rotate(0deg)" },
            "20%": { transform: "rotate(-12deg)" },
            "40%": { transform: "rotate(12deg)" },
            "60%": { transform: "rotate(-8deg)" },
            "80%": { transform: "rotate(8deg)" },
          },
        },
      }}
    >
      <NotificationsNoneIcon
        sx={{
          fontSize: 20,
          color: active ? "#1a5c6b" : "#64748b",
        }}
      />
    </Box>
  );
}

/* ─── Priority stripe ─── */
const PRIORITY_CONFIG = {
  urgent: { color: "#ef4444", label: "Urgent", dot: "#ef4444" },
  high:   { color: "#f59e0b", label: "High",   dot: "#f59e0b" },
  medium: { color: "#10b981", label: "Medium",  dot: "#10b981" },
  low:    { color: "#94a3b8", label: "Low",     dot: "#94a3b8" },
};

const TYPE_ICONS = {
  client_created:      { emoji: "🏢", bg: "#eff6ff" },
  client_deactivated:  { emoji: "🔒", bg: "#fef2f2" },
  team_created:        { emoji: "👥", bg: "#f0fdf4" },
  team_deactivated:    { emoji: "⚠️", bg: "#fffbeb" },
  subscription_expiring: { emoji: "⏳", bg: "#faf5ff" },
  inactivity_reminder: { emoji: "⏰", bg: "#fff7ed" },
  contact_inquiry:     { emoji: "📧", bg: "#f0f9ff" },
  default:             { emoji: "🔔", bg: "#f8fafc" },
};

function NotificationItem({ item, onRead, onDelete, formatTime }) {
  const priority = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.low;
  const typeConfig = TYPE_ICONS[item.type] || TYPE_ICONS.default;
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !item.isRead && onRead(item._id)}
      sx={{
        display: "flex",
        gap: 1.5,
        px: 2,
        py: 1.5,
        position: "relative",
        cursor: item.isRead ? "default" : "pointer",
        bgcolor: item.isRead ? "transparent" : alpha("#1a5c6b", 0.03),
        borderLeft: `3px solid ${item.isRead ? "transparent" : priority.color}`,
        transition: "all 0.18s ease",
        "&:hover": {
          bgcolor: alpha("#1a5c6b", 0.05),
        },
      }}
    >
      {/* Type icon */}
      <Box
        sx={{
          flexShrink: 0,
          width: 38,
          height: 38,
          borderRadius: "12px",
          bgcolor: typeConfig.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          mt: 0.25,
        }}
      >
        {typeConfig.emoji}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
          <Typography
            variant="body2"
            fontWeight={item.isRead ? 400 : 600}
            color="#0f172a"
            fontSize={13}
            sx={{ lineHeight: 1.4 }}
          >
            {item.title}
          </Typography>
          {/* Unread dot */}
          {!item.isRead && (
            <Box
              sx={{
                flexShrink: 0,
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: priority.color,
                mt: 0.5,
              }}
            />
          )}
        </Box>

        <Typography
          variant="caption"
          color="#64748b"
          fontSize={11.5}
          sx={{ display: "block", mt: 0.3, mb: 0.5, lineHeight: 1.4 }}
        >
          {item.message}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" color="#94a3b8" fontSize={10.5}>
            {formatTime(item.createdAt)}
          </Typography>
          {item.priority !== "low" && (
            <Chip
              label={priority.label}
              size="small"
              sx={{
                height: 16,
                fontSize: 9.5,
                fontWeight: 600,
                bgcolor: alpha(priority.color, 0.1),
                color: priority.color,
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
        </Box>
      </Box>

      {/* Delete */}
      <IconButton
        size="small"
        onClick={(e) => onDelete(item._id, e)}
        sx={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.18s",
          alignSelf: "flex-start",
          mt: -0.25,
          p: 0.5,
          color: "#94a3b8",
          "&:hover": { color: "#ef4444", bgcolor: alpha("#ef4444", 0.08) },
        }}
      >
        <DeleteOutlineIcon sx={{ fontSize: 15 }} />
      </IconButton>
    </Box>
  );
}

/* ─── Notification Panel ─── */
function NotificationPanel({
  notifications,
  unreadCount,
  loading,
  pagination,
  onRead,
  onDelete,
  onMarkAll,
  onRefresh,
  onLoadMore,
  loadingMore,
  onClose,
  isMobile,
  formatTime,
}) {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: 400, md: 420 },
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f1f5f9",
          bgcolor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1a5c6b 0%, #1a5c6b 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 16, color: "#fff" }} />
          </Box>
          <Typography
            fontWeight={700}
            fontSize={15}
            color="#0f172a"
            fontFamily="'DM Sans', sans-serif"
          >
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Box
              sx={{
                px: 1,
                py: 0.15,
                borderRadius: 99,
                background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              {unreadCount}
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Refresh">
            <IconButton
              size="small"
              onClick={onRefresh}
              sx={{ color: "#94a3b8", "&:hover": { color: "#1a5c6b", bgcolor: alpha("#1a5c6b", 0.06) } }}
            >
              <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton
                size="small"
                onClick={onMarkAll}
                sx={{ color: "#94a3b8", "&:hover": { color: "#10b981", bgcolor: alpha("#10b981", 0.06) } }}
              >
                <DoneAllIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          {isMobile && (
            <IconButton
              size="small"
              onClick={onClose}
              sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444", bgcolor: alpha("#ef4444", 0.06) } }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Unread summary strip */}
      {unreadCount > 0 && (
        <Box
          sx={{
            px: 2.5,
            py: 0.75,
            background: "linear-gradient(90deg, #f0f0ff 0%, #fafafa 100%)",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontSize={11.5} color="#1a5c6b" fontWeight={600}>
            {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </Typography>
          <Button
            size="small"
            onClick={onMarkAll}
            sx={{
              fontSize: 11,
              color: "#1a5c6b",
              fontWeight: 600,
              p: 0,
              minWidth: 0,
              textTransform: "none",
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            Mark all read
          </Button>
        </Box>
      )}

      {/* List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading && notifications.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={32} sx={{ color: "#1a5c6b" }} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "20px",
                bgcolor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
              }}
            >
              <NotificationsActiveIcon sx={{ fontSize: 28, color: "#cbd5e1" }} />
            </Box>
            <Typography fontSize={14} fontWeight={600} color="#64748b">
              You're all caught up!
            </Typography>
            <Typography fontSize={12} color="#94a3b8" mt={0.5}>
              No new notifications right now.
            </Typography>
          </Box>
        ) : (
          <>
            {notifications.map((item, idx) => (
              <React.Fragment key={item._id}>
                <NotificationItem
                  item={item}
                  onRead={onRead}
                  onDelete={onDelete}
                  formatTime={formatTime}
                />
                {idx < notifications.length - 1 && (
                  <Box sx={{ mx: 2, borderBottom: "1px solid #f8fafc" }} />
                )}
              </React.Fragment>
            ))}

            {pagination && notifications.length < pagination.total && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2.5 }}>
                <Button
                  size="small"
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1a5c6b",
                    textTransform: "none",
                    borderRadius: "10px",
                    px: 2,
                    py: 0.75,
                    bgcolor: alpha("#1a5c6b", 0.06),
                    "&:hover": { bgcolor: alpha("#1a5c6b", 0.12) },
                  }}
                >
                  {loadingMore ? <CircularProgress size={16} sx={{ color: "#1a5c6b" }} /> : "Load more"}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

/* ─── Main TopHeader ─── */
export default function TopHeader({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchUnreadCount,
  } = useNotifications();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [notificationPage, setNotificationPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const prevUnreadRef = useRef(unreadCount);
  const [bellActive, setBellActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (notificationAnchor) {
      fetchNotifications(1, 20);
      setNotificationPage(1);
    }
  }, [notificationAnchor]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!notificationAnchor) fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [notificationAnchor]);

  // Trigger bell shake when unread count increases
  useEffect(() => {
    if (unreadCount > prevUnreadRef.current) {
      setBellActive(true);
      setTimeout(() => setBellActive(false), 800);
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.name || user.email?.split("@")[0] || "User";
  };

  const getUserInitials = () =>
    getUserDisplayName()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getUserRole = () => {
    const role = user?.role || "member";
    return role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "Team Member";
  };

  const getRoleConfig = () => {
    const role = user?.role;
    if (role === "super_admin") return { color: "#ef4444", bg: "#fef2f2" };
    if (role === "admin") return { color: "#f59e0b", bg: "#fffbeb" };
    return { color: "#10b981", bg: "#f0fdf4" };
  };

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const handleNotificationOpen = (e) => {
    setNotificationAnchor(e.currentTarget);
    setNotificationPage(1);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
    setNotificationPage(1);
  };

  const handleMarkNotificationRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (id, event) => {
    event.stopPropagation();
    await deleteNotification(id);
  };

  const handleRefresh = async () => {
    await fetchNotifications(1, 20);
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const next = notificationPage + 1;
    await fetchNotifications(next, 20);
    setNotificationPage(next);
    setLoadingMore(false);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleUserMenuOpen = (e) => setUserMenuAnchor(e.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const roleConfig = getRoleConfig();

  const notifPanelProps = {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    pagination,
    onRead: handleMarkNotificationRead,
    onDelete: handleDeleteNotification,
    onMarkAll: handleMarkAllRead,
    onRefresh: handleRefresh,
    onLoadMore: handleLoadMore,
    loadingMore,
    onClose: handleNotificationClose,
    isMobile,
    formatTime: formatTimeAgo,
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          height: { xs: 56, sm: 60, md: 64, lg: 68 },
          bgcolor: scrolled ? "rgba(255,255,255,0.92)" : "#ffffff",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: "1px solid",
          borderColor: scrolled ? alpha("#1a5c6b", 0.08) : "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          position: "sticky",
          top: 0,
          zIndex: 1100,
          width: "100%",
          boxSizing: "border-box",
          transition: "all 0.25s ease",
          boxShadow: scrolled ? "0 1px 20px rgba(99,102,241,0.06)" : "none",
        }}
      >
        {/* Left: Menu toggle */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {(isMobile || isTablet) && (
            <IconButton
              onClick={onMenuToggle}
              size="small"
              sx={{
                color: "#64748b",
                width: 36,
                height: 36,
                borderRadius: "10px",
                "&:hover": { bgcolor: alpha("#115160", 0.06), color: "#115c6d" },
              }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1, md: 1.5 } }}>
          {/* Notification bell */}
          <Box
            onClick={handleNotificationOpen}
            sx={{ cursor: "pointer" }}
          >
            <PulsingBadge count={unreadCount}>
              <BellIcon active={Boolean(notificationAnchor) || bellActive} />
            </PulsingBadge>
          </Box>

          {/* User menu trigger */}
          <Box
            onClick={handleUserMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.75, sm: 1, md: 1.25 },
              cursor: "pointer",
              pl: { xs: 0.5, sm: 0.75, md: 1 },
              pr: { xs: 0.5, sm: 0.75, md: 1.25 },
              py: 0.5,
              borderRadius: "14px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: alpha("#1a5c6b", 0.05),
              },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                alt={getUserDisplayName()}
                sx={{
                  width: { xs: 32, sm: 36, md: 38 },
                  height: { xs: 32, sm: 36, md: 38 },
                  background: "linear-gradient(135deg, #1a5c6b 0%, #0a4f5e 100%)",
                  fontSize: { xs: 12, sm: 13, md: 14 },
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
                }}
              >
                {getUserInitials()}
              </Avatar>
              {/* Online indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  bgcolor: "#10b981",
                  border: "2px solid #fff",
                }}
              />
            </Box>

            {!isMobile && !isTablet && (
              <>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0f172a",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {getUserDisplayName()}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: roleConfig.color,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 10.5,
                        color: "#94a3b8",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {getUserRole()}
                    </Typography>
                  </Box>
                </Box>
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: 16,
                    color: "#94a3b8",
                    transform: Boolean(userMenuAnchor) ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* ─── User menu ─── */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 280,
            mt: 1,
            borderRadius: "18px",
            boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
            border: "1px solid #f1f5f9",
            overflow: "hidden",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Profile card */}
        <Box
          sx={{
            px: 2.5,
            py: 2.5,
            background: "linear-gradient(135deg, #f8f8ff 0%, #f0f0ff 100%)",
            borderBottom: "1px solid #ededff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #1a5c6b 0%, #0d4d5c 100%)",
                fontSize: 16,
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Box>
              <Typography
                fontWeight={700}
                fontSize={14}
                color="#0f172a"
                fontFamily="'DM Sans', sans-serif"
              >
                {getUserDisplayName()}
              </Typography>
              <Typography
                fontSize={11.5}
                color="#64748b"
                fontFamily="'DM Sans', sans-serif"
                display="block"
                mt={0.2}
              >
                {user?.email || "user@example.com"}
              </Typography>
              <Chip
                label={getUserRole()}
                size="small"
                sx={{
                  mt: 0.75,
                  height: 18,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: roleConfig.bg,
                  color: roleConfig.color,
                  fontFamily: "'DM Sans', sans-serif",
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2.5,
            gap: 1.5,
            "&:hover": { bgcolor: alpha("#ef4444", 0.04) },
          }}
        >
          <ListItemIcon sx={{ minWidth: "unset" }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "9px",
                bgcolor: alpha("#ef4444", 0.08),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LogoutIcon sx={{ fontSize: 15, color: "#ef4444" }} />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 13,
              fontWeight: 600,
              color: "#ef4444",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </MenuItem>
      </Menu>

      {/* ─── Notification dropdown (desktop) ─── */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor) && !isMobile}
        onClose={handleNotificationClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            borderRadius: "20px",
            boxShadow: "0 16px 48px rgba(15,23,42,0.12)",
            border: "1px solid #f1f5f9",
            overflow: "hidden",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <NotificationPanel {...notifPanelProps} />
      </Menu>

      {/* ─── Notification drawer (mobile) ─── */}
      <SwipeableDrawer
        anchor="bottom"
        open={Boolean(notificationAnchor) && isMobile}
        onClose={handleNotificationClose}
        onOpen={() => {}}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            bgcolor: "#fff",
            maxHeight: "82vh",
          },
        }}
      >
        {/* Drag handle */}
        <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 0.5 }}>
          <Box sx={{ width: 36, height: 4, borderRadius: 99, bgcolor: "#e2e8f0" }} />
        </Box>
        <NotificationPanel {...notifPanelProps} />
      </SwipeableDrawer>
    </>
  );
}