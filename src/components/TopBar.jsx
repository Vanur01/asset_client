// components/TopHeader.jsx - Fully Responsive
import React, { useState } from "react";
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
  InputBase,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAuth } from "../context/AuthContexts";

export default function TopHeader({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.name || user.email?.split("@")[0] || "User";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserRole = () => user?.role || "member";

  const handleNotificationOpen = (event) =>
    setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Box
      component="header"
      sx={{
        height: { xs: 56, sm: 64, md: 70 },
        bgcolor: "#ffffff",
        borderBottom: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.1),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
        position: "sticky",
        top: 0,
        zIndex: 1100,
        width: "100%",
        boxSizing: "border-box",
        gap: { xs: 1, sm: 2 },
      }}
    >
      {/* Left Section */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 2 } }}
      >
        {isMobile && (
          <IconButton
            onClick={onMenuToggle}
            sx={{
              color: "#5f6368",
              p: { xs: 0.5, sm: 1 },
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
            }}
            size="small"
          >
            <MenuIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
          </IconButton>
        )}

        {/* Page Title for mobile */}
        {isMobile && (
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              fontWeight: 600,
              color: "#202124",
              display: { sm: "none" },
            }}
          >
            Dashboard
          </Typography>
        )}
      </Box>

      {/* Center — Search Bar */}
      {isDesktop && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: searchFocused ? "#ffffff" : "#f1f3f4",
            border: searchFocused
              ? `2px solid ${theme.palette.primary.main}`
              : "2px solid transparent",
            borderRadius: "24px",
            px: 2,
            height: { md: 42, lg: 46 },
            width: { md: 280, lg: 360, xl: 480 },
            maxWidth: "100%",
            mx: "auto",
            transition: "all 0.2s ease",
            "&:hover": { bgcolor: "#e8eaed" },
          }}
        >
          <SearchIcon
            sx={{ color: "#5f6368", fontSize: 20, mr: 1, flexShrink: 0 }}
          />
          <InputBase
            placeholder="Search assets, checklists, team members..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            sx={{
              flex: 1,
              fontSize: { md: "13px", lg: "14px" },
              color: "#202124",
              "& input::placeholder": {
                color: "#5f6368",
                opacity: 1,
              },
            }}
          />
        </Box>
      )}

      {/* Right Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1, md: 1.5 },
        }}
      >
        {/* Mobile/Tablet Search Icon */}
        {!isDesktop && (
          <IconButton
            sx={{
              color: "#5f6368",
              p: { xs: 0.5, sm: 1 },
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
            }}
            size="small"
          >
            <SearchIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
          </IconButton>
        )}

        {/* Notifications Bell */}
        <IconButton
          onClick={handleNotificationOpen}
          sx={{
            color: "#5f6368",
            p: { xs: 0.5, sm: 1 },
            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
          }}
          size="small"
        >
          <Badge
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: "#ea4335",
                width: { xs: 6, sm: 8 },
                height: { xs: 6, sm: 8 },
                borderRadius: "50%",
                top: 2,
                right: 2,
              },
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
          </Badge>
        </IconButton>

        {/* User Avatar + Name */}
        <Box
          onClick={handleUserMenuOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            cursor: "pointer",
            p: 0.5,
            borderRadius: "32px",
            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
          }}
        >
          <Avatar
            alt={getUserDisplayName()}
            sx={{
              width: { xs: 28, sm: 32, md: 36 },
              height: { xs: 28, sm: 32, md: 36 },
              bgcolor: theme.palette.primary.main,
              fontSize: { xs: 12, sm: 13, md: 14 },
              fontWeight: 500,
            }}
          >
            {getUserInitials()}
          </Avatar>

          {!isMobile && (
            <>
              <Box sx={{ display: { xs: "none", sm: "block" }, ml: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: { sm: 13, md: 14 },
                    fontWeight: 500,
                    color: "#202124",
                    lineHeight: 1.3,
                  }}
                >
                  {getUserDisplayName()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { sm: 11, md: 12 },
                    color: "#5f6368",
                    lineHeight: 1.2,
                  }}
                >
                  {getUserRole()}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon
                sx={{ color: "#5f6368", fontSize: { sm: 16, md: 18 } }}
              />
            </>
          )}
        </Box>

        {/* ── Notifications Menu ── */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 2,
            sx: {
              width: { xs: 280, sm: 300 },
              mt: 1.5,
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} color="#202124">
              Notifications
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.primary.main, cursor: "pointer" }}
            >
              Mark all read
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "#f0f0f0" }} />
          {[1, 2, 3].map((item) => (
            <MenuItem
              key={item}
              onClick={handleNotificationClose}
              sx={{ py: 2, px: 2 }}
            >
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="#202124"
                  sx={{ mb: 0.5 }}
                >
                  New checklist assigned #{item}
                </Typography>
                <Typography variant="caption" color="#5f6368">
                  {item * 2} hours ago
                </Typography>
              </Box>
            </MenuItem>
          ))}
          <Divider sx={{ borderColor: "#f0f0f0" }} />
          <Box sx={{ p: 1, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.primary.main, cursor: "pointer" }}
            >
              View all notifications
            </Typography>
          </Box>
        </Menu>

        {/* ── User Menu ── */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 2,
            sx: {
              width: { xs: 220, sm: 240 },
              mt: 1,
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="#202124">
              {getUserDisplayName()}
            </Typography>
            <Typography variant="caption" color="#5f6368">
              {user?.email || "user@example.com"}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "#f0f0f0" }} />
          <MenuItem
            onClick={handleUserMenuClose}
            sx={{ py: 1.5, px: 2, color: "#202124" }}
          >
            <Typography variant="body2">Profile Settings</Typography>
          </MenuItem>
          <MenuItem
            onClick={handleUserMenuClose}
            sx={{ py: 1.5, px: 2, color: "#202124" }}
          >
            <Typography variant="body2">Account Settings</Typography>
          </MenuItem>
          <MenuItem
            onClick={handleUserMenuClose}
            sx={{ py: 1.5, px: 2, color: "#202124" }}
          >
            <Typography variant="body2">Help & Support</Typography>
          </MenuItem>
          <Divider sx={{ borderColor: "#f0f0f0" }} />
          <MenuItem
            onClick={handleLogout}
            sx={{ py: 1.5, px: 2, color: "#d93025" }}
          >
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
