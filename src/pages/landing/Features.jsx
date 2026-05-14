// components/Features.jsx - Fully Responsive for All Devices (320px - 1200px+)
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import InventoryIcon from "@mui/icons-material/Inventory";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const features = [
  {
    icon: (
      <InventoryIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />
    ),
    title: "Lifecycle Tracking",
    description:
      "Centralize your asset registry with granular lifecycle data and real-time status updates.",
    badge: "Core",
    color: "#3b82f6",
  },
  {
    icon: (
      <FactCheckIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />
    ),
    title: "Smart Checklists",
    description:
      "Design dynamic, conditional logic checklists that standardize procedures.",
    badge: "Popular",
    color: "#10b981",
  },
  {
    icon: (
      <QrCodeScannerIcon
        sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }}
      />
    ),
    title: "Mobile Inspections",
    description:
      "Execute thorough field audits using offline-first mobile tools.",
    badge: "New",
    color: "#f59e0b",
  },
  {
    icon: <BadgeIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
    title: "Workforce Orchestration",
    description:
      "Optimize field technician schedules and automate task assignments.",
    badge: "Advanced",
    color: "#8b5cf6",
  },
  {
    icon: (
      <BusinessIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />
    ),
    title: "Client Portal",
    description:
      "Provide stakeholders with secure, read-only transparency into asset health.",
    badge: "Secure",
    color: "#ec4899",
  },
  {
    icon: (
      <BarChartIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />
    ),
    title: "Predictive Analytics",
    description:
      "Leverage historical data to predict maintenance needs before failures.",
    badge: "AI-Powered",
    color: "#06b6d4",
  },
];

const Features = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <Box
      id="features"
      component="section"
      sx={{
        py: { xs: 5, sm: 6, md: 8, lg: 10, xl: 12 },
        px: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 5 },
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Background Decorative Elements - Responsive */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "3%", sm: "5%", md: "8%" },
          right: { xs: "-15%", sm: "-10%", md: "-5%" },
          width: { xs: "80%", sm: "60%", md: "50%", lg: "40%", xl: "35%" },
          height: { xs: "80%", sm: "60%", md: "50%", lg: "40%", xl: "35%" },
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.04)} 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "3%", sm: "5%", md: "8%" },
          left: { xs: "-15%", sm: "-10%", md: "-5%" },
          width: { xs: "80%", sm: "60%", md: "50%", lg: "40%", xl: "35%" },
          height: { xs: "80%", sm: "60%", md: "50%", lg: "40%", xl: "35%" },
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.03)} 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 },
          position: "relative",
          zIndex: 1,
          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "90%",
            lg: "1200px",
            xl: "1400px",
          },
        }}
      >
        {/* Header - Compact & Centered & Responsive */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 },
            }}
          >
            <Chip
              label="FEATURES"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: {
                  xs: "0.55rem",
                  sm: "0.6rem",
                  md: "0.65rem",
                  lg: "0.7rem",
                },
                letterSpacing: "0.1em",
                mb: { xs: 1.5, sm: 2, md: 2.5 },
                height: { xs: 22, sm: 24, md: 26, lg: 28 },
                borderRadius: "100px",
                px: { xs: 1, sm: 1.2, md: 1.5 },
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: "1.6rem",
                  sm: "1.9rem",
                  md: "2.2rem",
                  lg: "2.5rem",
                  xl: "2.8rem",
                },
                fontWeight: 800,
                mb: { xs: 1, sm: 1.25, md: 1.5 },
                letterSpacing: "-0.02em",
                color: "text.primary",
                lineHeight: 1.2,
              }}
            >
              Everything you need
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.8rem",
                  md: "0.85rem",
                  lg: "0.9rem",
                  xl: "1rem",
                },
                maxWidth: {
                  xs: "95%",
                  sm: "85%",
                  md: "75%",
                  lg: "65%",
                  xl: "60%",
                },
                mx: "auto",
                lineHeight: 1.5,
                px: { xs: 1, sm: 0 },
              }}
            >
              Powerful features to streamline your asset management workflow
            </Typography>
          </Box>
        </motion.div>

        {/* Features Grid - Fully Responsive Card Design */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <Grid
            container
            spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3.5 }}
            justifyContent="center"
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                key={index}
                sx={{
                  display: "flex",
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: {
                        xs: "1rem",
                        sm: "1.125rem",
                        md: "1.25rem",
                        lg: "1.375rem",
                      },
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      bgcolor: "background.paper",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      height: "100%",
                      width: { xs: "100%", sm: "300px", md: "350px" },
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      cursor: "pointer",
                      "&:hover": {
                        transform: isDesktop
                          ? "translateY(-6px)"
                          : "translateY(-3px)",
                        boxShadow: isDesktop
                          ? `0 20px 40px -12px ${alpha(theme.palette.common.black, 0.15)}`
                          : `0 12px 24px -12px ${alpha(theme.palette.common.black, 0.1)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    {/* Badge on top right corner - Responsive */}
                    <Chip
                      label={feature.badge}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: { xs: 8, sm: 10, md: 12 },
                        right: { xs: 8, sm: 10, md: 12 },
                        fontSize: {
                          xs: "0.45rem",
                          sm: "0.5rem",
                          md: "0.55rem",
                        },
                        height: { xs: 18, sm: 20, md: 22 },
                        bgcolor: alpha(feature.color, 0.12),
                        color: feature.color,
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                        borderRadius: "0.75rem",
                        "& .MuiChip-label": {
                          px: { xs: 0.75, sm: 1 },
                        },
                      }}
                    />

                    <CardContent
                      sx={{
                        p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Icon Section - Responsive */}
                      <Box
                        sx={{
                          width: { xs: 36, sm: 40, md: 44, lg: 48, xl: 52 },
                          height: { xs: 36, sm: 40, md: 44, lg: 48, xl: 52 },
                          borderRadius: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            md: "1rem",
                            lg: "1.125rem",
                          },
                          bgcolor: alpha(feature.color, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: { xs: 1.5, sm: 1.75, md: 2 },
                          color: feature.color,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            bgcolor: alpha(feature.color, 0.15),
                          },
                        }}
                      >
                        {feature.icon}
                      </Box>

                      {/* Title - Responsive */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.85rem",
                            sm: "0.9rem",
                            md: "0.95rem",
                            lg: "1rem",
                            xl: "1.1rem",
                          },
                          mb: 0.75,
                          color: "text.primary",
                          lineHeight: 1.3,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      {/* Description - Responsive */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.75rem",
                            md: "0.8rem",
                            lg: "0.85rem",
                          },
                          lineHeight: 1.5,
                          flex: 1,
                          mb: 1.5,
                        }}
                      >
                        {feature.description}
                      </Typography>

                      {/* Learn More Link - Responsive */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{
                          mt: "auto",
                          cursor: "pointer",
                          display: "inline-flex",
                          width: "fit-content",
                          "&:hover": {
                            gap: 1,
                          },
                          transition: "gap 0.2s ease",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: {
                              xs: "0.6rem",
                              sm: "0.65rem",
                              md: "0.7rem",
                            },
                            fontWeight: 600,
                            color: feature.color,
                            letterSpacing: "0.02em",
                          }}
                        >
                          Learn more
                        </Typography>
                        <ArrowForwardIcon
                          sx={{
                            fontSize: { xs: 12, sm: 13, md: 14 },
                            color: feature.color,
                            transition: "transform 0.2s ease",
                          }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Features;
