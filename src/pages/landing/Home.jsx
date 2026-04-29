// components/Hero.jsx - Fully Responsive for All Devices
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import VerifiedIcon from "@mui/icons-material/Verified";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupsIcon from "@mui/icons-material/Groups";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Hero = ({ scrollToSection }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  const features = [
    { icon: <VerifiedIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />, label: "Real-time Tracking" },
    { icon: <FactCheckIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />, label: "Smart Inspections" },
    { icon: <GroupsIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />, label: "Team Sync" },
    { icon: <AnalyticsIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />, label: "AI Analytics" },
  ];

  const stats = [
    { value: "500+", label: "Enterprise Clients" },
    { value: "50K+", label: "Assets Managed" },
    { value: "99.9%", label: "Uptime SLA" },
  ];

  const getPrimaryColor = () => theme.palette.primary.main;
  const getPrimaryGradient = () =>
    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;

  return (
    <Box
      id="home"
      component="section"
      sx={{
        position: "relative",
        minHeight: { xs: "auto", md: "100vh" },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "background.default",
        pt: { xs: 10, sm: 10, md: 12, lg: 14 },
        pb: { xs: 8, sm: 8, md: 10, lg: 12 },
      }}
    >
      {/* Background Gradient Effects */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: { xs: "-30%", sm: "-20%", md: "-10%" },
          width: { xs: "120%", sm: "100%", md: "50%" },
          height: { xs: "70%", sm: "70%", md: "70%" },
          background: `radial-gradient(circle, ${alpha(getPrimaryColor(), isDarkMode ? 0.08 : 0.05)} 0%, ${alpha(getPrimaryColor(), 0)} 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: { xs: "-30%", sm: "-20%", md: "-5%" },
          width: { xs: "120%", sm: "100%", md: "40%" },
          height: { xs: "60%", sm: "60%", md: "50%" },
          background: `radial-gradient(circle, ${alpha(getPrimaryColor(), isDarkMode ? 0.06 : 0.03)} 0%, ${alpha(getPrimaryColor(), 0)} 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 } }}
      >
        {/* ── Main Content with Image in Same Row ── */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 5, sm: 5, md: 6, lg: 8 }}
          alignItems="center"
          justifyContent="center"
        >
          {/* ── Left: Text Content ── */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ width: "100%" }}
            >
              {/* Status Badge */}
              <Chip
                label="✨ NEW PLATFORM LAUNCH"
                sx={{
                  backgroundColor: alpha(getPrimaryColor(), isDarkMode ? 0.12 : 0.08),
                  color: getPrimaryColor(),
                  fontWeight: 600,
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                  letterSpacing: "0.02em",
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  height: { xs: 24, sm: 26, md: 28 },
                  "& .MuiChip-label": { px: { xs: 1.5, sm: 1.5, md: 2 } },
                }}
              />

              {/* Main Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "1.75rem",
                    sm: "2.2rem",
                    md: "2.5rem",
                    lg: "3rem",
                    xl: "3.5rem",
                  },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: { xs: 1.5, sm: 2 },
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                }}
              >
                Transform Your
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    background: getPrimaryGradient(),
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    mt: { xs: 0.5, sm: 1 },
                  }}
                >
                  Asset Management
                </Box>
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.05rem", lg: "1.1rem" },
                  lineHeight: 1.6,
                  mb: { xs: 3, sm: 4, md: 5 },
                  maxWidth: { xs: "100%", md: "90%" },
                }}
              >
                The intelligent platform that gives you complete visibility and control over your
                assets, from acquisition to retirement. Trusted by industry leaders worldwide.
              </Typography>

              {/* CTA Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 2 }}
                sx={{ mb: { xs: 4, sm: 5, md: 6 } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollToSection("pricing")}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                  sx={{
                    px: { xs: 2.5, sm: 3, md: 4 },
                    py: { xs: 1, sm: 1.2, md: 1.3 },
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    fontWeight: 600,
                    background: getPrimaryGradient(),
                    borderRadius: "1rem",
                    boxShadow: `0 4px 14px ${alpha(getPrimaryColor(), 0.25)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 20px ${alpha(getPrimaryColor(), 0.35)}`,
                    },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                  sx={{
                    px: { xs: 2.5, sm: 3, md: 4 },
                    py: { xs: 1, sm: 1.2, md: 1.3 },
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    fontWeight: 600,
                    borderColor: alpha(getPrimaryColor(), 0.3),
                    color: getPrimaryColor(),
                    borderRadius: "1rem",
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      borderColor: getPrimaryColor(),
                      backgroundColor: alpha(getPrimaryColor(), 0.04),
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>

              {/* Stats */}
              <Stack
                direction="row"
                sx={{
                  mb: { xs: 3, sm: 4, md: 5 },
                  flexWrap: "wrap",
                  gap: { xs: 2, sm: 3, md: 4 },
                  justifyContent: { xs: "space-around", sm: "flex-start" },
                }}
              >
                {stats.map((stat, index) => (
                  <Box key={index} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: getPrimaryColor(),
                        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                        fontWeight: 500,
                        display: "block",
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* Feature List */}
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {features.map((feature, index) => (
                  <Grid item xs={6} sm={6} key={index}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                          borderRadius: "0.75rem",
                          bgcolor: alpha(getPrimaryColor(), 0.08),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: getPrimaryColor(),
                          flexShrink: 0,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.primary",
                          fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                        }}
                      >
                        {feature.label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Box>

          {/* ── Right: Image / Visual ── */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ width: "100%" }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  px: { xs: 2, sm: 3, md: 4, lg: 2 },
                  py: { xs: 4, sm: 5, md: 6 },
                }}
              >
                {/* Floating Badge – Top Left */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", zIndex: 2, left: 0, top: 0 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 0.75, sm: 1, md: 1.25 },
                      borderRadius: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                      bgcolor: "background.paper",
                      boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.75, sm: 1 },
                      whiteSpace: "nowrap",
                      transform: { xs: "translate(-20%, -20%)", sm: "translate(-30%, -30%)", md: "translate(-40%, -40%)" },
                    }}
                  >
                    <CheckCircleIcon sx={{ color: "#10b981", fontSize: { xs: 14, sm: 16, md: 18 } }} />
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" }, color: "text.primary" }}
                    >
                      Real-time sync
                    </Typography>
                  </Paper>
                </motion.div>

                {/* Floating Badge – Bottom Right */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  style={{ position: "absolute", zIndex: 2, right: 0, bottom: 0 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 0.75, sm: 1, md: 1.25 },
                      borderRadius: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                      bgcolor: "background.paper",
                      boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.75, sm: 1 },
                      whiteSpace: "nowrap",
                      transform: { xs: "translate(20%, 20%)", sm: "translate(30%, 30%)", md: "translate(40%, 40%)" },
                    }}
                  >
                    <AnalyticsIcon sx={{ color: getPrimaryColor(), fontSize: { xs: 14, sm: 16, md: 18 } }} />
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" }, color: "text.primary" }}
                    >
                      +32% efficiency
                    </Typography>
                  </Paper>
                </motion.div>

                {/* Main Image Card */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: { xs: "100%", sm: 400, md: 450, lg: 500 },
                    mx: "auto",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at 30% 40%, ${alpha(getPrimaryColor(), 0.1)}, transparent 70%)`,
                      borderRadius: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                      filter: "blur(40px)",
                    }}
                  />
                  <Paper
                    elevation={0}
                    sx={{
                      position: "relative",
                      bgcolor: "background.paper",
                      borderRadius: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                      overflow: "hidden",
                      boxShadow: `0 20px 40px -12px ${alpha(theme.palette.common.black, 0.15)}`,
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: { xs: "none", sm: "scale(1.02)" },
                      },
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                      alt="Asset Management Dashboard"
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "30%",
                        background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.05)}, transparent)`,
                        pointerEvents: "none",
                      }}
                    />
                  </Paper>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Stack>

        {/* Scroll Indicator */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Stack
              alignItems="center"
              spacing={1}
              sx={{ cursor: "pointer", "&:hover": { opacity: 0.7 } }}
              onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                  letterSpacing: "0.1em",
                }}
              >
                SCROLL
              </Typography>
              <Box
                sx={{
                  width: 2,
                  height: { xs: 24, sm: 30, md: 36 },
                  bgcolor: alpha(getPrimaryColor(), 0.3),
                  borderRadius: 1,
                }}
              />
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default Hero;