// layout/Layout.jsx - Updated with NotificationProvider
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isMobile, mobileOpen]);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "#f8fafc" }}>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar onMenuToggle={handleDrawerToggle} />
        
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: "auto",
            bgcolor: "#f8fafc",
            p: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3.5 },
            "&::-webkit-scrollbar": { width: { xs: 4, sm: 6, md: 8 } },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: theme.palette.divider, borderRadius: 10 },
            "&::-webkit-scrollbar-thumb:hover": { background: theme.palette.text.disabled },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}