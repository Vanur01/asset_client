// components/UserRoles.jsx - Fully Responsive for All Devices (320px - 1200px+)
import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import EngineeringIcon from "@mui/icons-material/Engineering";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpeedIcon from "@mui/icons-material/Speed";
import ShieldIcon from "@mui/icons-material/Shield";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const roles = [
  {
    title: "Executive",
    description:
      "Full system governance. Global oversight, multi-tenant billing, and strategic data exports.",
    icon: (
      <SettingsSuggestIcon
        sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }}
      />
    ),
    focus: "Governance",
    color: "#3b82f6",
    bgLight: alpha("#3b82f6", 0.08),
    features: ["Analytics", "Compliance", "Multi-tenant"],
  },
  {
    title: "Manager",
    description:
      "Operational excellence. Regional asset management, team leading, and performance tracking.",
    icon: (
      <EngineeringIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />
    ),
    focus: "Operations",
    color: "#10b981",
    bgLight: alpha("#10b981", 0.08),
    features: ["Team Mgmt", "Reporting", "Performance"],
  },
  {
    title: "Technician",
    description:
      "Execution focus. Direct field inspections, issue reporting, and real-time task completion.",
    icon: (
      <TouchAppIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />
    ),
    focus: "Field Work",
    color: "#f59e0b",
    bgLight: alpha("#f59e0b", 0.08),
    features: ["Inspections", "Tasks", "Offline Mode"],
  },
];

const UserRoles = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
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
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Box
      id="roles"
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
      {/* Background Decorations - Responsive */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "10%", sm: "12%", md: "15%" },
          right: { xs: "-15%", sm: "-10%", md: "-5%" },
          width: { xs: "70%", sm: "50%", md: "40%", lg: "30%", xl: "25%" },
          height: { xs: "70%", sm: "50%", md: "40%", lg: "30%", xl: "25%" },
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.04)} 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "10%", sm: "12%", md: "15%" },
          left: { xs: "-15%", sm: "-10%", md: "-5%" },
          width: { xs: "70%", sm: "50%", md: "40%", lg: "30%", xl: "25%" },
          height: { xs: "70%", sm: "50%", md: "40%", lg: "30%", xl: "25%" },
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
        {/* Section Header - Fully Responsive */}
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
              label="USER ROLES"
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
              Designed for Every Role
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
              Tailored experiences for every tier of your organization
            </Typography>
          </Box>
        </motion.div>

        {/* Cards Row - Fully Responsive Design */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <Stack
            direction={{ xs: "column", sm: "column", md: "row" }}
            spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.5 }}
            justifyContent="center"
            alignItems={{ xs: "center", md: "stretch" }}
            sx={{
              maxWidth: {
                xs: "100%",
                sm: "90%",
                md: "100%",
                lg: "1100px",
                xl: "1200px",
              },
              mx: "auto",
              width: "100%",
            }}
          >
            {roles.map((role, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                style={{
                  flex: 1,
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "400px", md: "none" },
                }}
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
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": {
                      transform: isDesktop
                        ? "translateY(-6px)"
                        : "translateY(-3px)",
                      boxShadow: isDesktop
                        ? `0 20px 40px -12px ${alpha(role.color, 0.25)}`
                        : `0 12px 24px -12px ${alpha(role.color, 0.2)}`,
                      borderColor: alpha(role.color, 0.3),
                    },
                  }}
                >
                  {/* Top Accent Bar - Responsive */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: { xs: "3px", sm: "4px" },
                      background: `linear-gradient(90deg, ${role.color}, ${alpha(role.color, 0.6)})`,
                    }}
                  />

                  <CardContent sx={{ p: { xs: 1.75, sm: 2, md: 2.5, lg: 3 } }}>
                    {/* Icon and Title Row */}
                    <Stack
                      direction="row"
                      spacing={{ xs: 1.5, sm: 1.75, md: 2 }}
                      alignItems="center"
                      sx={{ mb: { xs: 1.5, sm: 1.75, md: 2 } }}
                    >
                      <Box
                        sx={{
                          width: { xs: 44, sm: 48, md: 52, lg: 56, xl: 60 },
                          height: { xs: 44, sm: 48, md: 52, lg: 56, xl: 60 },
                          borderRadius: {
                            xs: "0.875rem",
                            sm: "1rem",
                            md: "1.125rem",
                            lg: "1.25rem",
                          },
                          bgcolor: role.bgLight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: role.color,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            backgroundColor: alpha(role.color, 0.15),
                          },
                        }}
                      >
                        {role.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.95rem",
                            sm: "1rem",
                            md: "1.05rem",
                            lg: "1.1rem",
                            xl: "1.2rem",
                          },
                          color: "text.primary",
                        }}
                      >
                        {role.title}
                      </Typography>
                    </Stack>

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
                        mb: { xs: 1.5, sm: 1.75, md: 2 },
                      }}
                    >
                      {role.description}
                    </Typography>

                    {/* Features Chips - Responsive */}
                    <Stack
                      direction="row"
                      spacing={0.75}
                      flexWrap="wrap"
                      sx={{ gap: 0.75, mb: { xs: 1.5, sm: 1.75, md: 2 } }}
                    >
                      {role.features.map((feature, idx) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size="small"
                          sx={{
                            fontSize: {
                              xs: "0.5rem",
                              sm: "0.55rem",
                              md: "0.6rem",
                            },
                            height: { xs: 20, sm: 22, md: 24 },
                            bgcolor: role.bgLight,
                            color: role.color,
                            borderRadius: "100px",
                            fontWeight: 600,
                            "& .MuiChip-label": {
                              px: { xs: 0.75, sm: 1 },
                            },
                          }}
                        />
                      ))}
                    </Stack>

                    {/* Focus Badge - Responsive */}
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: { xs: 1.25, sm: 1.5, md: 1.75 },
                        py: { xs: 0.5, sm: 0.6, md: 0.75 },
                        bgcolor: role.bgLight,
                        borderRadius: "2rem",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: alpha(role.color, 0.15),
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: {
                            xs: "0.55rem",
                            sm: "0.6rem",
                            md: "0.65rem",
                          },
                          fontWeight: 600,
                          color: role.color,
                          letterSpacing: "0.02em",
                        }}
                      >
                        Focus: {role.focus}
                      </Typography>
                      <ArrowForwardIcon
                        sx={{
                          fontSize: { xs: 12, sm: 13, md: 14 },
                          color: role.color,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UserRoles;
