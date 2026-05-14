// components/Hero.jsx - Fully Responsive for All Devices (320px - 1200px+)
import React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
  alpha,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import VerifiedIcon from "@mui/icons-material/Verified";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupsIcon from "@mui/icons-material/Groups";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

const Hero = ({ scrollToSection }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isDarkMode = theme.palette.mode === "dark";

  const features = [
    { icon: <VerifiedIcon />, label: "Real-time Tracking", color: "#3b82f6" },
    { icon: <FactCheckIcon />, label: "Smart Inspections", color: "#10b981" },
    { icon: <GroupsIcon />, label: "Team Sync", color: "#8b5cf6" },
    { icon: <AnalyticsIcon />, label: "AI Analytics", color: "#f59e0b" },
  ];

  const stats = [
    { value: "500+", label: "Enterprise Clients" },
    { value: "50K+", label: "Assets Managed" },
    { value: "99.9%", label: "Uptime SLA" },
  ];

  return (
    <Box
      id="home"
      component="section"
      sx={{
        position: "relative",
        minHeight: { xs: "auto", sm: "90vh", md: "100vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundImage: `url('https://t3.ftcdn.net/jpg/05/01/45/40/360_F_501454093_29sFKROmzh6ZQvX6JUiFv4SrJzI63Byv.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: { xs: "70% center", sm: "center" },
        backgroundAttachment: { xs: "initial", sm: "fixed", md: "fixed" },
        backgroundRepeat: "no-repeat",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.86) 100%)"
            : "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.92) 100%)",
          zIndex: 1,
        },
        pt: { xs: 8, sm: 10, md: 12, lg: 14, xl: 16 },
        pb: { xs: 6, sm: 8, md: 10, lg: 12, xl: 14 },
      }}
    >
      {/* Animated Gradient Overlay - Optimized for performance */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, ${alpha(
            theme.palette.primary.main,
            0.08,
          )} 0%, transparent 70%)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Decorative Orb Elements - Responsive sizing */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "10%", sm: "15%", md: "20%" },
          left: { xs: "-10%", sm: "-5%", md: "5%" },
          width: { xs: 120, sm: 160, md: 200, lg: 250, xl: 300 },
          height: { xs: 120, sm: 160, md: 200, lg: 250, xl: 300 },
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary?.main || "#8b5cf6",
            0.08,
          )} 0%, transparent 70%)`,
          borderRadius: "50%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "10%", sm: "15%", md: "20%" },
          right: { xs: "-10%", sm: "-5%", md: "5%" },
          width: { xs: 120, sm: 160, md: 200, lg: 250, xl: 300 },
          height: { xs: 120, sm: 160, md: 200, lg: 250, xl: 300 },
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.08,
          )} 0%, transparent 70%)`,
          borderRadius: "50%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          position: "relative",
          zIndex: 3,
        }}
      >
        <Stack
          spacing={{ xs: 2.5, sm: 3.5, md: 4.5, lg: 5.5, xl: 6.5 }}
          alignItems="center"
          textAlign="center"
        >
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ width: "100%" }}
          >
            {/* Status Badge - Responsive */}
            <Chip
              icon={
                <TrendingUpIcon
                  sx={{ fontSize: { xs: 10, sm: 11, md: 12, lg: 13 } }}
                />
              }
              label="AI-POWERED PLATFORM"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.light,
                fontWeight: 700,
                fontSize: {
                  xs: "0.45rem",
                  sm: "0.5rem",
                  md: "0.55rem",
                  lg: "0.6rem",
                  xl: "0.65rem",
                },
                letterSpacing: "0.08em",
                mb: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
                height: { xs: 20, sm: 22, md: 24, lg: 26, xl: 28 },
                backdropFilter: { xs: "none", sm: "blur(8px)" },
                "& .MuiChip-label": {
                  px: { xs: 0.75, sm: 1, md: 1.25, lg: 1.5, xl: 1.75 },
                  fontSize: {
                    xs: "0.45rem",
                    sm: "0.5rem",
                    md: "0.55rem",
                    lg: "0.6rem",
                    xl: "0.65rem",
                  },
                },
              }}
            />

            {/* Main Heading - Ultra Responsive Font Sizes */}
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.8rem",
                  md: "2.5rem",
                  lg: "3rem",
                  xl: "3.5rem",
                },
                fontWeight: 800,
                lineHeight: { xs: 1.3, sm: 1.25, md: 1.2 },
                mb: { xs: 1, sm: 1.25, md: 1.5, lg: 1.75 },
                letterSpacing: "-0.02em",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                px: { xs: 1, sm: 2, md: 0 },
              }}
            >
              Transform Your
              <Box
                component="span"
                sx={{
                  display: "block",
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary?.light || "#a78bfa"} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mt: { xs: 0.5, sm: 0.75, md: 1 },
                }}
              >
                Asset Management
              </Box>
            </Typography>

            {/* Description - Responsive */}
            <Typography
              variant="body1"
              sx={{
                color: alpha("#fff", 0.85),
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                },
                lineHeight: { xs: 1.5, sm: 1.55, md: 1.6, lg: 1.65 },
                mb: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
                maxWidth: {
                  xs: "100%",
                  sm: "90%",
                  md: "85%",
                  lg: "80%",
                  xl: "75%",
                },
                mx: "auto",
                px: { xs: 1, sm: 2, md: 3 },
              }}
            >
              The intelligent platform that gives you complete visibility and
              control over your assets, from acquisition to retirement. Trusted
              by industry leaders worldwide.
            </Typography>

            {/* CTA Buttons - Responsive */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: { xs: 3, sm: 4, md: 5, lg: 6 } }}
            >
              <Button
                variant="contained"
                size={isMobile ? "small" : "medium"}
                endIcon={
                  <ArrowForwardIcon
                    sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}
                  />
                }
                sx={{
                  px: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                  py: { xs: 0.75, sm: 0.875, md: 1, lg: 1.125 },
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.8rem",
                    lg: "0.85rem",
                  },
                  fontWeight: 700,
                  borderRadius: { xs: "0.75rem", sm: "1rem" },
                  textTransform: "none",
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                startIcon={
                  <PlayCircleIcon
                    sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}
                  />
                }
                sx={{
                  px: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                  py: { xs: 0.75, sm: 0.875, md: 1, lg: 1.125 },
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.8rem",
                    lg: "0.85rem",
                  },
                  fontWeight: 700,
                  borderRadius: { xs: "0.75rem", sm: "1rem" },
                  textTransform: "none",
                  borderColor: alpha("#fff", 0.3),
                  color: "white",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Watch Demo
              </Button>
            </Stack>

            {/* Stats Section - Responsive Grid Layout */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 2, md: 3, lg: 4, xl: 5 }}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: { xs: 2.5, sm: 3, md: 4, lg: 5 } }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  style={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Box sx={{ textAlign: "center", px: { xs: 2, sm: 0 } }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.light,
                        fontSize: {
                          xs: "1rem",
                          sm: "1.2rem",
                          md: "1.4rem",
                          lg: "1.6rem",
                          xl: "1.8rem",
                        },
                        mb: 0.25,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha("#fff", 0.7),
                        fontSize: {
                          xs: "0.5rem",
                          sm: "0.55rem",
                          md: "0.6rem",
                          lg: "0.65rem",
                          xl: "0.7rem",
                        },
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>

            {/* Rating Badge - Responsive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.75, sm: 1, md: 1.5 }}
                alignItems="center"
                justifyContent="center"
                sx={{ mb: { xs: 2, sm: 2.5, md: 3, lg: 3.5 } }}
              >
                <Stack direction="row" spacing={0.5}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      sx={{
                        fontSize: { xs: 11, sm: 12, md: 13, lg: 14, xl: 15 },
                        color: "#fbbf24",
                      }}
                    />
                  ))}
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha("#fff", 0.7),
                    fontSize: {
                      xs: "0.55rem",
                      sm: "0.6rem",
                      md: "0.65rem",
                      lg: "0.7rem",
                    },
                    mt: { xs: 0.5, sm: 0 },
                  }}
                >
                  Trusted by 500+ enterprise clients
                </Typography>
              </Stack>
            </motion.div>

            {/* Features Grid - Fully Responsive */}
            <Grid
              container
              spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3 }}
              justifyContent="center"
              sx={{
                maxWidth: {
                  xs: "100%",
                  sm: "90%",
                  md: "85%",
                  lg: "80%",
                  xl: "75%",
                },
                mx: "auto",
              }}
            >
              {features.map((feature, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 0.75, sm: 1, md: 1.25 }}
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        textAlign: { xs: "center", sm: "left" },
                        p: { xs: 0.75, sm: 1 },
                        borderRadius: "1rem",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: alpha(feature.color, 0.08),
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 26, sm: 28, md: 32, lg: 36, xl: 40 },
                          height: { xs: 26, sm: 28, md: 32, lg: 36, xl: 40 },
                          borderRadius: {
                            xs: "0.625rem",
                            sm: "0.75rem",
                            md: "0.875rem",
                          },
                          background: alpha(feature.color, 0.15),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: feature.color,
                          mb: { xs: 0.5, sm: 0 },
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          sx: {
                            fontSize: {
                              xs: 14,
                              sm: 15,
                              md: 16,
                              lg: 18,
                              xl: 20,
                            },
                          },
                        })}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "white",
                          fontSize: {
                            xs: "0.6rem",
                            sm: "0.65rem",
                            md: "0.7rem",
                            lg: "0.75rem",
                            xl: "0.8rem",
                          },
                        }}
                      >
                        {feature.label}
                      </Typography>
                    </Stack>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Trust Badge - Responsive */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 1.5 }}
                alignItems="center"
                justifyContent="center"
                sx={{
                  mt: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                  pt: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                  borderTop: `1px solid ${alpha("#fff", 0.08)}`,
                }}
              >
                <SecurityIcon
                  sx={{
                    fontSize: { xs: 12, sm: 13, md: 14, lg: 15 },
                    color: alpha("#fff", 0.5),
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha("#fff", 0.6),
                    fontSize: {
                      xs: "0.5rem",
                      sm: "0.55rem",
                      md: "0.6rem",
                      lg: "0.65rem",
                    },
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  Enterprise-grade security & GDPR compliant
                </Typography>
              </Stack>
            </motion.div>
          </motion.div>
        </Stack>

        {/* Scroll Indicator - Responsive visibility */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{
              position: "absolute",
              bottom: { sm: 16, md: 20, lg: 24, xl: 32 },
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "pointer",
              zIndex: 3,
            }}
            onClick={() =>
              window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            <Stack alignItems="center" spacing={0.5}>
              <Typography
                variant="caption"
                sx={{
                  color: alpha("#fff", 0.6),
                  fontSize: { sm: "0.5rem", md: "0.55rem", lg: "0.6rem" },
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                }}
              >
                SCROLL
              </Typography>
              <Box
                sx={{
                  width: 2,
                  height: { sm: 24, md: 28, lg: 32, xl: 36 },
                  bgcolor: alpha("#fff", 0.3),
                  borderRadius: 2,
                  animation: "scrollPulse 2s ease-in-out infinite",
                  "@keyframes scrollPulse": {
                    "0%, 100%": {
                      opacity: 0.3,
                      height: { sm: 24, md: 28, lg: 32, xl: 36 },
                    },
                    "50%": {
                      opacity: 0.8,
                      height: { sm: 32, md: 36, lg: 42, xl: 48 },
                    },
                  },
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
