// components/Navbar.jsx - Fully Responsive with Dark/Light Mode Support
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Drawer,
  Container,
  Stack,
  alpha,
  Divider,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = ({
  activeSection,
  scrollToSection,
  toggleTheme,
  isDarkMode,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    if (scrollToSection) {
      scrollToSection(sectionId);
    }
    setDrawerOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
    setDrawerOpen(false);
  };

  // Helper for theme-aware colors
  const getPrimaryColor = () => theme.palette.primary.main;
  const getPrimaryGradient = () =>
    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;
  const getTextColor = () => theme.palette.text.primary;
  const getSecondaryTextColor = () => theme.palette.text.secondary;
  const getBackgroundColor = () => theme.palette.background.default;
  const getPaperBackground = () => theme.palette.background.paper;

  const navItems = [
    { id: "home", label: "Home" },
    { id: "analytics", label: "Analytics" },
    { id: "features", label: "Features" },
    { id: "services", label: "Services" },
    { id: "roles", label: "Solutions" },
    { id: "pricing", label: "Pricing" },
    { id: "contact", label: "Contact" },
  ];

  // Animation variants
  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    tap: { scale: 0.95 },
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  const drawerItemVariants = {
    initial: { opacity: 0, x: 30 },
    animate: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled ? alpha(getBackgroundColor(), 0.95) : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
            : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          height: {
            xs: 56,
            sm: 60,
            md: 64,
            lg: 70,
          },
          justifyContent: "center",
          boxShadow: scrolled
            ? `0 4px 20px ${alpha(theme.palette.common.black, 0.03)}`
            : "none",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: {
              xs: 1.5,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 6,
            },
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              py: 0,
              minHeight: "auto",
              height: "100%",
              position: "relative",
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* Logo - Left Side */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileTap="tap"
              style={{ flexShrink: 0 }}
            >
              <Box
                onClick={handleLogoClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { opacity: 0.85 },
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 28, sm: 32, md: 36, lg: 38 },
                    height: { xs: 28, sm: 32, md: 36, lg: 38 },
                    background: getPrimaryGradient(),
                    borderRadius: {
                      xs: "0.625rem",
                      sm: "0.75rem",
                      md: "0.875rem",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: { xs: 1, sm: 1.5 },
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: `0 6px 16px ${alpha(getPrimaryColor(), 0.2)}`,
                    },
                    boxShadow: scrolled
                      ? `0 2px 8px ${alpha(getPrimaryColor(), 0.1)}`
                      : `0 4px 12px ${alpha(getPrimaryColor(), 0.15)}`,
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.8rem",
                        sm: "0.9rem",
                        md: "1rem",
                        lg: "1.1rem",
                      },
                      fontFamily: '"Inter", sans-serif',
                      letterSpacing: "-0.02em",
                    }}
                  >
                    AF
                  </Typography>
                </Box>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      background: getPrimaryGradient(),
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      fontSize: {
                        xs: "0.9rem",
                        sm: "1rem",
                        md: "1.1rem",
                        lg: "1.2rem",
                      },
                      lineHeight: 1.2,
                    }}
                  >
                    AssetFlow
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.5rem", sm: "0.55rem", md: "0.6rem" },
                      color: getSecondaryTextColor(),
                      fontWeight: 500,
                      display: { xs: "none", md: "block" },
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Smart Asset Management
                  </Typography>
                </Box>
                {/* Mobile logo text */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    background: getPrimaryGradient(),
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    lineHeight: 1.2,
                    display: { xs: "block", sm: "none" },
                  }}
                >
                  AssetFlow
                </Typography>
              </Box>
            </motion.div>

            {/* Desktop Navigation - Perfectly Centered */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <Stack
                direction="row"
                spacing={{ md: 0.5, lg: 1, xl: 1.5 }}
                alignItems="center"
                sx={{
                  bgcolor: scrolled
                    ? alpha(getPaperBackground(), 0.5)
                    : "transparent",
                  borderRadius: 10,
                  p: 0.5,
                }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    custom={index}
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <Button
                      onClick={() => handleNavClick(item.id)}
                      sx={{
                        color:
                          activeSection === item.id
                            ? getPrimaryColor()
                            : getSecondaryTextColor(),
                        fontWeight: activeSection === item.id ? 600 : 500,
                        fontSize: {
                          md: "0.75rem",
                          lg: "0.85rem",
                          xl: "0.9rem",
                        },
                        textTransform: "none",
                        px: { md: 1.5, lg: 2, xl: 2.5 },
                        py: 0.75,
                        borderRadius: 10,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: alpha(getPrimaryColor(), 0.06),
                          color: getPrimaryColor(),
                        },
                        position: "relative",
                        "&::after":
                          activeSection === item.id
                            ? {
                                content: '""',
                                position: "absolute",
                                bottom: 2,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "16px",
                                height: "2px",
                                background: getPrimaryGradient(),
                                borderRadius: "2px",
                              }
                            : {},
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </Stack>
            </Box>

            {/* Desktop CTA Buttons - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{ flexShrink: 0 }}
            >
              <Stack
                direction="row"
                spacing={{ xs: 0.5, sm: 1, md: 1.5 }}
                alignItems="center"
              >

                <Button
                  onClick={() => navigate("/login")}
                  variant="text"
                  startIcon={
                    <LoginIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }} />
                  }
                  sx={{
                    display: { xs: "none", md: "flex" },
                    color: getPrimaryColor(),
                    fontSize: { md: "0.75rem", lg: "0.8rem", xl: "0.85rem" },
                    fontWeight: 600,
                    borderRadius: 100,
                    px: { md: 1.5, lg: 2, xl: 2.5 },
                    py: 0.75,
                    "&:hover": {
                      backgroundColor: alpha(getPrimaryColor(), 0.06),
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </motion.div>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: getPrimaryColor(),
                "&:hover": {
                  bgcolor: alpha(getPrimaryColor(), 0.06),
                },
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer - Enhanced Design with Theme Support */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "85%", sm: "70%", md: "60%" },
            maxWidth: { xs: 320, sm: 360, md: 400 },
            bgcolor: getPaperBackground(),
            boxShadow: `-4px 0 24px ${alpha(theme.palette.common.black, 0.1)}`,
            borderRadius: { xs: 0, sm: "20px 0 0 20px" },
          },
        }}
      >
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Drawer Header */}
              <Box
                sx={{
                  background: getPrimaryGradient(),
                  p: { xs: 2, sm: 2.5 },
                  color: "white",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    onClick={handleLogoClick}
                    sx={{ cursor: "pointer" }}
                  >
                    <Box
                      sx={{
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        bgcolor: "rgba(255,255,255,0.15)",
                        borderRadius: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontWeight: 700,
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                      >
                        AF
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          color: "white",
                        }}
                      >
                        AssetFlow
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.55rem", sm: "0.6rem" },
                          opacity: 0.7,
                          mt: 0.25,
                        }}
                      >
                        Smart Asset Management
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.2)",
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Navigation Links */}
              <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 2, sm: 2.5 } }}>
                <List sx={{ p: 0 }}>
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      variants={drawerItemVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => handleNavClick(item.id)}
                          sx={{
                            mb: 0.5,
                            py: { xs: 1, sm: 1.2 },
                            "&:hover": {
                              backgroundColor: alpha(getPrimaryColor(), 0.05),
                            },
                          }}
                        >
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontWeight: activeSection === item.id ? 600 : 500,
                              fontSize: { xs: "0.85rem", sm: "0.9rem" },
                              color:
                                activeSection === item.id
                                  ? getPrimaryColor()
                                  : getTextColor(),
                            }}
                          />
                          {activeSection === item.id && (
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                bgcolor: getPrimaryColor(),
                                borderRadius: "50%",
                              }}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>

                <Divider sx={{ my: { xs: 2, sm: 2.5 } }} />

                {/* Mobile CTA Section */}
                <Stack spacing={1.5}>
                  {/* Theme Toggle for Mobile */}
                  <Button
                    onClick={() => {
                      toggleTheme();
                    }}
                    variant="outlined"
                    fullWidth
                    startIcon={
                      isDarkMode ? <LightModeIcon /> : <DarkModeIcon />
                    }
                    sx={{
                      borderColor: alpha(getPrimaryColor(), 0.3),
                      color: getPrimaryColor(),
                      fontWeight: 600,
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      textTransform: "none",
                      py: { xs: 0.9, sm: 1 },
                      borderRadius: 1.5,
                      justifyContent: "center",
                      "&:hover": {
                        borderColor: getPrimaryColor(),
                        backgroundColor: alpha(getPrimaryColor(), 0.04),
                      },
                    }}
                  >
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </Button>

                  <Button
                    onClick={() => {
                      navigate("/login");
                      setDrawerOpen(false);
                    }}
                    variant="contained"
                    fullWidth
                    startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      background: getPrimaryGradient(),
                      color: "white",
                      fontWeight: 600,
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      textTransform: "none",
                      py: { xs: 0.9, sm: 1 },
                      borderRadius: 1.5,
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: `0 4px 12px ${alpha(getPrimaryColor(), 0.3)}`,
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>
    </>
  );
};

export default Navbar;
