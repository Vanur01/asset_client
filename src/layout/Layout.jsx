// layout/Layout.jsx - Fully Responsive Dashboard Layout
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopBar";

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Close mobile drawer on window resize to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f8fafc",
      }}
    >
      {/* Sidebar - Desktop only */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        onDrawerToggle={handleDrawerToggle} 
      />
      
      {/* Main Content Area */}
      <Box 
        sx={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          overflow: "hidden",
          minWidth: 0, // Prevent flex overflow
          width: { xs: "100%", md: "auto" },
        }}
      >
        {/* Top Header - Desktop only (mobile header is in Sidebar) */}
        {!isMobile && (
          <TopHeader onMenuToggle={handleDrawerToggle} />
        )}
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: "auto",
            bgcolor: "#f8fafc",
            p: { 
              xs: 2, 
              sm: 2.5, 
              md: 3, 
              lg: 3.5, 
              xl: 4 
            },
            // Add padding for mobile header and bottom nav
            ...(isMobile && {
              pt: { xs: '72px', sm: '80px' }, // Account for mobile header
              pb: { xs: '72px', sm: '80px' }, // Account for bottom nav
            }),
            // Custom scrollbar
            "&::-webkit-scrollbar": {
              width: { xs: 4, sm: 6 },
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.divider,
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: theme.palette.text.disabled,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}