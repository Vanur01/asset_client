// components/Analytics.jsx - Fully Responsive with Centered Cards
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import MonitoringIcon from "@mui/icons-material/MonitorHeart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const Analytics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const assetData = [40, 65, 95, 50, 80];
  const maxHeight = isMobile ? 80 : isTablet ? 100 : 120;

  const alerts = [
    {
      title: "HVAC Unit B-4",
      status: "Critical Fault Detected",
      type: "urgent",
      icon: <WarningIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />,
      color: "#ea580c",
      bgColor: "#fff7ed",
      badgeBg: "#fed7aa",
      badge: "URGENT",
    },
    {
      title: "Main Server Rack",
      status: "System Operating Normally",
      type: "safe",
      icon: <CheckCircleIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />,
      color: "#059669",
      bgColor: "#f0fdf4",
      badgeBg: "#a7f3d0",
      badge: "SAFE",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
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
      id="analytics"
      component="section"
      sx={{
        py: { xs: 6, sm: 8, md: 10, lg: 12 },
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          backgroundImage: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: "center", mb: { xs: 5, sm: 6, md: 8, lg: 10 } }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                letterSpacing: "0.1em",
                mb: 1,
                display: "block",
              }}
            >
              REAL-TIME INSIGHTS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: "1.75rem",
                  sm: "2rem",
                  md: "2.25rem",
                  lg: "2.5rem",
                },
                fontWeight: 700,
                mb: { xs: 1.5, sm: 2 },
                letterSpacing: "-0.02em",
                color: "text.primary",
              }}
            >
              Actionable Intelligence
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
                mx: "auto",
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.05rem" },
                lineHeight: 1.6,
              }}
            >
              Monitor every heartbeat of your operation through refined, real-time data visualization.
            </Typography>
          </Box>
        </motion.div>

        {/* Cards Grid - Centered with responsive column adjustments */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 2.5, md: 3, lg: 4 }}
            justifyContent="center"
            alignItems="stretch"
          >
            {/* Asset Health Card */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                width:"360px"
              }}
            >
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                style={{ width: "100%", maxWidth: "500px" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                    borderRadius: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    border: "1px solid",
                    borderColor: alpha(theme.palette.divider, 0.08),
                    bgcolor: "background.paper",
                    transition: "all 0.3s ease",
                    height: "100%",
                    width: "100%",
                    "&:hover": {
                      transform: { xs: "none", sm: "translateY(-4px)" },
                      boxShadow: `0 12px 24px -12px ${alpha(theme.palette.common.black, 0.12)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.15),
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                        color: "text.primary",
                      }}
                    >
                      Asset Health
                    </Typography>
                    <Box
                      sx={{
                        width: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        borderRadius: "0.75rem",
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MonitoringIcon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: { xs: 18, sm: 20, md: 22 },
                        }}
                      />
                    </Box>
                  </Stack>

                  {/* Chart Bars */}
                  <Box
                    sx={{
                      height: maxHeight,
                      display: "flex",
                      alignItems: "flex-end",
                      gap: { xs: 0.75, sm: 1, md: 1.25 },
                      mb: { xs: 2, sm: 2.5, md: 3 },
                    }}
                  >
                    {assetData.map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${(height / 100) * maxHeight}px` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        style={{ flex: 1 }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            bgcolor:
                              i === 2
                                ? theme.palette.primary.main
                                : alpha(theme.palette.primary.main, 0.2 + i * 0.08),
                            height: "100%",
                            borderRadius: "0.5rem",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor:
                                i === 2
                                  ? theme.palette.primary.dark
                                  : alpha(theme.palette.primary.main, 0.5),
                            },
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>

                  {/* Stats Footer */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      pt: { xs: 1.5, sm: 2 },
                      borderTop: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.08),
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                        fontWeight: 500,
                      }}
                    >
                      Utilization Rate
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <TrendingUpIcon sx={{ fontSize: { xs: 12, sm: 14, md: 16 }, color: "#10b981" }} />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: "#10b981",
                          fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                        }}
                      >
                        +12.4%
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>

            {/* Live Reports Card */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                width:"360px"
              }}
            >
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ width: "100%", maxWidth: "500px" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                    borderRadius: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    border: "1px solid",
                    borderColor: alpha(theme.palette.divider, 0.08),
                    bgcolor: "background.paper",
                    transition: "all 0.3s ease",
                    height: "100%",
                    width: "100%",
                    "&:hover": {
                      transform: { xs: "none", sm: "translateY(-4px)" },
                      boxShadow: `0 12px 24px -12px ${alpha(theme.palette.common.black, 0.12)}`,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                        color: "text.primary",
                      }}
                    >
                      Live Reports
                    </Typography>
                    <Box
                      sx={{
                        width: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        borderRadius: "0.75rem",
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AssignmentIcon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: { xs: 18, sm: 20, md: 22 },
                        }}
                      />
                    </Box>
                  </Stack>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
                    {alerts.map((alert, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                      >
                        <Stack
                          direction="row"
                          spacing={{ xs: 1, sm: 1.5 }}
                          alignItems="center"
                          sx={{
                            p: { xs: 1, sm: 1.25, md: 1.5 },
                            bgcolor: alert.bgColor,
                            borderRadius: "1rem",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            "&:hover": {
                              transform: { xs: "none", sm: "translateX(6px)" },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 32, sm: 36, md: 40 },
                              height: { xs: 32, sm: 36, md: 40 },
                              borderRadius: "0.75rem",
                              bgcolor: alert.badgeBg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {alert.icon}
                          </Box>
                          <Box flex={1}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                                color: "text.primary",
                                mb: 0.25,
                              }}
                            >
                              {alert.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                                display: "block",
                              }}
                            >
                              {alert.status}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            sx={{
                              color: alert.color,
                              fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem" },
                              letterSpacing: "0.03em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {alert.badge}
                          </Typography>
                        </Stack>
                      </motion.div>
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            {/* Team Performance Card */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                width:"360px"
              }}
            >
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ width: "100%", maxWidth: "500px" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                    borderRadius: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    border: "1px solid",
                    borderColor: alpha(theme.palette.divider, 0.08),
                    bgcolor: "background.paper",
                    transition: "all 0.3s ease",
                    height: "100%",
                    width: "100%",
                    "&:hover": {
                      transform: { xs: "none", sm: "translateY(-4px)" },
                      boxShadow: `0 12px 24px -12px ${alpha(theme.palette.common.black, 0.12)}`,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                        color: "text.primary",
                      }}
                    >
                      Team Performance
                    </Typography>
                    <Box
                      sx={{
                        width: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        borderRadius: "0.75rem",
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <GroupsIcon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: { xs: 18, sm: 20, md: 22 },
                        }}
                      />
                    </Box>
                  </Stack>

                  {/* Circular Progress */}
                  <Box sx={{ display: "flex", justifyContent: "center", py: { xs: 2, sm: 2.5, md: 3 } }}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: { xs: 100, sm: 120, md: 140, lg: 150 },
                          height: { xs: 100, sm: 120, md: 140, lg: 150 },
                        }}
                      >
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke={alpha(theme.palette.primary.main, 0.1)}
                            strokeWidth="8"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke={theme.palette.primary.main}
                            strokeWidth="8"
                            strokeDasharray="263.89"
                            initial={{ strokeDashoffset: 263.89 }}
                            animate={{ strokeDashoffset: 39.58 }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                            color: theme.palette.primary.main,
                          }}
                        >
                          85%
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: "center",
                      display: "block",
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      mb: { xs: 2, sm: 2.5, md: 3 },
                    }}
                  >
                    Active Fleet Capacity
                  </Typography>

                  {/* Mini Stats */}
                  <Stack
                    direction="row"
                    spacing={{ xs: 1, sm: 1.5 }}
                    justifyContent="center"
                    sx={{
                      pt: { xs: 1.5, sm: 2, md: 2.5 },
                      borderTop: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.08),
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Box component="span" sx={{ fontSize: "1rem" }}>⚡</Box>
                      24 Active Technicians
                    </Typography>
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Quick Stats Row - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Grid
            container
            spacing={{ xs: 1, sm: 1.5, md: 2 }}
            sx={{ mt: { xs: 3, sm: 4, md: 5, lg: 6 } }}
            justifyContent="center"
          >
            {[
              { value: "1,284", label: "Assets" },
              { value: "98.5%", label: "Uptime" },
              { value: "156", label: "Inspections" },
            ].map((stat, index) => (
              <Grid
                item
                xs={4}
                sm={4}
                md={3}
                lg={2}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    p: { xs: 1, sm: 1.25, md: 1.5 },
                    borderRadius: "1rem",
                    transition: "all 0.2s ease",
                    width: "100%",
                    maxWidth: "180px",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem", lg: "1.6rem" },
                      color: theme.palette.primary.main,
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                      color: "text.secondary",
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Analytics;