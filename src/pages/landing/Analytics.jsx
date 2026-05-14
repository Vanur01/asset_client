// components/Analytics.jsx - Fully Responsive for All Devices (320px - 1200px+)
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Avatar,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Speed,
  Assignment,
  CheckCircle,
  Warning,
  Devices,
  People,
  Analytics as AnalyticsIcon,
  ArrowUpward,
  MoreHoriz,
  Refresh,
} from "@mui/icons-material";

const Analytics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const metrics = [
    {
      title: "Total Assets",
      value: "1,284",
      change: "+12.5%",
      trend: "up",
      icon: <Devices sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />,
      color: "#3b82f6",
      bgColor: alpha("#3b82f6", 0.1),
    },
    {
      title: "Active Alerts",
      value: "23",
      change: "-8.2%",
      trend: "down",
      icon: <Warning sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />,
      color: "#ef4444",
      bgColor: alpha("#ef4444", 0.1),
    },
    {
      title: "Uptime Rate",
      value: "99.9%",
      change: "+2.1%",
      trend: "up",
      icon: <Speed sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />,
      color: "#10b981",
      bgColor: alpha("#10b981", 0.1),
    },
    {
      title: "Completed Tasks",
      value: "1,562",
      change: "+23.1%",
      trend: "up",
      icon: <Assignment sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />,
      color: "#8b5cf6",
      bgColor: alpha("#8b5cf6", 0.1),
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      title: "Server Maintenance Required",
      priority: "High",
      status: "pending",
      time: "2 min ago",
      icon: <Warning sx={{ fontSize: 14 }} />,
    },
    {
      id: 2,
      title: "Backup Completed Successfully",
      priority: "Low",
      status: "completed",
      time: "15 min ago",
      icon: <CheckCircle sx={{ fontSize: 14 }} />,
    },
    {
      id: 3,
      title: "Security Update Available",
      priority: "Medium",
      status: "pending",
      time: "1 hour ago",
      icon: <Warning sx={{ fontSize: 14 }} />,
    },
    {
      id: 4,
      title: "New Device Connected",
      priority: "Low",
      status: "completed",
      time: "3 hours ago",
      icon: <Devices sx={{ fontSize: 14 }} />,
    },
  ];

  const assetCategories = [
    { name: "IT Equipment", percentage: 85, count: 342, color: "#3b82f6" },
    { name: "Vehicles", percentage: 65, count: 128, color: "#10b981" },
    { name: "Machinery", percentage: 92, count: 456, color: "#8b5cf6" },
    { name: "Facilities", percentage: 78, count: 234, color: "#f59e0b" },
  ];

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
      transition: { staggerChildren: 0.08 },
    },
  };

  return (
    <Box
      id="analytics"
      component="section"
      sx={{
        py: { xs: 5, sm: 6, md: 8, lg: 10, xl: 12 },
        px: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 5 },
        bgcolor: "background.default",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Background Decoration */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: { xs: "80%", sm: "60%", md: "40%", lg: "30%" },
          height: { xs: "80%", sm: "60%", md: "40%", lg: "30%" },
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "-10%",
          width: { xs: "80%", sm: "60%", md: "40%", lg: "30%" },
          height: { xs: "80%", sm: "60%", md: "40%", lg: "30%" },
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.02)} 0%, transparent 70%)`,
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
        {/* Section Header - Centered & Responsive */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          style={{ width: "100%" }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 },
            }}
          >
            <Chip
              label="ANALYTICS DASHBOARD"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: {
                  xs: "0.55rem",
                  sm: "0.6rem",
                  md: "0.65rem",
                  lg: "0.7rem",
                },
                letterSpacing: "0.08em",
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
              Performance Overview
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
              Real-time insights and analytics for your entire asset ecosystem
            </Typography>
          </Box>
        </motion.div>

        {/* Metrics Grid - Fully Responsive Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          style={{ width: "100%" }}
        >
          <Grid
            container
            spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3 }}
            sx={{ mb: { xs: 3, sm: 4, md: 5, lg: 6 } }}
            justifyContent="center"
          >
            {metrics.map((metric, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
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
                      width: { xs: "100%", sm: "320px", md: "250px" },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      "&:hover": {
                        transform: isDesktop
                          ? "translateY(-4px)"
                          : "translateY(-2px)",
                        boxShadow: `0 12px 24px -12px ${alpha(theme.palette.common.black, 0.15)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1.5}
                      >
                        <Avatar
                          sx={{
                            bgcolor: metric.bgColor,
                            width: { xs: 32, sm: 36, md: 40 },
                            height: { xs: 32, sm: 36, md: 40 },
                            borderRadius: {
                              xs: "0.75rem",
                              sm: "0.875rem",
                              md: "1rem",
                            },
                          }}
                        >
                          {metric.icon}
                        </Avatar>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          {metric.trend === "up" ? (
                            <TrendingUp
                              sx={{
                                fontSize: { xs: 12, sm: 13, md: 14 },
                                color: "#10b981",
                              }}
                            />
                          ) : (
                            <TrendingDown
                              sx={{
                                fontSize: { xs: 12, sm: 13, md: 14 },
                                color: "#ef4444",
                              }}
                            />
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: {
                                xs: "0.6rem",
                                sm: "0.65rem",
                                md: "0.7rem",
                              },
                              color:
                                metric.trend === "up" ? "#10b981" : "#ef4444",
                              fontWeight: 600,
                            }}
                          >
                            {metric.change}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: {
                            xs: "1.25rem",
                            sm: "1.4rem",
                            md: "1.5rem",
                            lg: "1.6rem",
                          },
                          fontWeight: 800,
                          color: "text.primary",
                          mb: 0.5,
                        }}
                      >
                        {metric.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: {
                            xs: "0.6rem",
                            sm: "0.65rem",
                            md: "0.7rem",
                          },
                          color: "text.secondary",
                          fontWeight: 500,
                        }}
                      >
                        {metric.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Main Content Grid - Fully Responsive */}
        <Grid
          container
          spacing={{ xs: 2, sm: 2.5, md: 3, lg: 4 }}
          sx={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          {/* Asset Health Chart */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
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
                  height: "100%",
                  width:{ xs: "100%", sm: "400px", md: "500px" },
                  minHeight: { xs: "auto", sm: 400, md: 420, lg: 450 },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 12px 24px -12px ${alpha(theme.palette.common.black, 0.1)}`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2.5}
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        fontSize: {
                          xs: "0.85rem",
                          sm: "0.9rem",
                          md: "0.95rem",
                          lg: "1rem",
                        },
                      }}
                    >
                      Asset Health Distribution
                    </Typography>
                    <Chip
                      label="Last 30 days"
                      size="small"
                      sx={{
                        fontSize: { xs: "0.55rem", sm: "0.6rem" },
                        height: { xs: 22, sm: 24 },
                        borderRadius: "0.75rem",
                      }}
                    />
                  </Stack>

                  <Stack spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                    {assetCategories.map((category, idx) => (
                      <Box key={idx}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={0.75}
                          flexWrap="wrap"
                          gap={0.5}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: {
                                xs: "0.7rem",
                                sm: "0.75rem",
                                md: "0.8rem",
                              },
                              color: "text.primary",
                            }}
                          >
                            {category.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: {
                                xs: "0.6rem",
                                sm: "0.65rem",
                                md: "0.7rem",
                              },
                              color: category.color,
                              fontWeight: 700,
                            }}
                          >
                            {category.percentage}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={category.percentage}
                          sx={{
                            height: { xs: 6, sm: 7, md: 8 },
                            borderRadius: 4,
                            bgcolor: alpha(category.color, 0.1),
                            "& .MuiLinearProgress-bar": {
                              bgcolor: category.color,
                              borderRadius: 4,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: {
                              xs: "0.5rem",
                              sm: "0.55rem",
                              md: "0.6rem",
                            },
                            color: "text.secondary",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {category.count} assets
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mt: { xs: 2.5, sm: 3, md: 3.5 },
                      pt: { xs: 2, sm: 2.5, md: 3 },
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    }}
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: {
                          xs: "0.55rem",
                          sm: "0.6rem",
                          md: "0.65rem",
                        },
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      Overall Health Score
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          fontSize: {
                            xs: "1rem",
                            sm: "1.1rem",
                            md: "1.2rem",
                            lg: "1.3rem",
                          },
                          color: theme.palette.primary.main,
                        }}
                      >
                        84.6%
                      </Typography>
                      <ArrowUpward
                        sx={{
                          fontSize: { xs: 12, sm: 13, md: 14 },
                          color: "#10b981",
                        }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Alerts */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
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
                  height: "100%",
                  width: { xs: "100%", sm: "400px", md: "500px" },
                  minHeight: { xs: "auto", sm: 400, md: 420, lg: 450 },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 12px 24px -12px ${alpha(theme.palette.common.black, 0.1)}`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2.5}
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        fontSize: {
                          xs: "0.85rem",
                          sm: "0.9rem",
                          md: "0.95rem",
                          lg: "1rem",
                        },
                      }}
                    >
                      Recent Activity
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label="Live Updates"
                        size="small"
                        sx={{
                          fontSize: { xs: "0.5rem", sm: "0.55rem" },
                          height: { xs: 20, sm: 22 },
                          bgcolor: alpha("#ef4444", 0.1),
                          color: "#ef4444",
                          borderRadius: "0.75rem",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          width: { xs: 24, sm: 26, md: 28 },
                          height: { xs: 24, sm: 26, md: 28 },
                          bgcolor: alpha(theme.palette.divider, 0.05),
                        }}
                      >
                        <Refresh
                          sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }}
                        />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Stack spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                    {recentAlerts.map((alert, idx) => (
                      <Box
                        key={alert.id}
                        sx={{
                          p: { xs: 1, sm: 1.25, md: 1.5 },
                          borderRadius: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            md: "1rem",
                          },
                          bgcolor: alpha(theme.palette.divider, 0.03),
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={{ xs: 1.5, sm: 2 }}
                          alignItems="center"
                          sx={{
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: { xs: 28, sm: 32, md: 36 },
                              height: { xs: 28, sm: 32, md: 36 },
                              bgcolor:
                                alert.status === "pending"
                                  ? alpha("#ef4444", 0.1)
                                  : alpha("#10b981", 0.1),
                              color:
                                alert.status === "pending"
                                  ? "#ef4444"
                                  : "#10b981",
                            }}
                          >
                            {alert.icon}
                          </Avatar>
                          <Box
                            flex={1}
                            sx={{ width: { xs: "100%", sm: "auto" } }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                fontSize: {
                                  xs: "0.7rem",
                                  sm: "0.75rem",
                                  md: "0.8rem",
                                },
                                color: "text.primary",
                                mb: 0.25,
                              }}
                            >
                              {alert.title}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              flexWrap="wrap"
                              sx={{ gap: { xs: 0.5, sm: 0 } }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: {
                                    xs: "0.5rem",
                                    sm: "0.55rem",
                                    md: "0.6rem",
                                  },
                                  color:
                                    alert.priority === "High"
                                      ? "#ef4444"
                                      : "text.secondary",
                                  fontWeight: 700,
                                }}
                              >
                                {alert.priority}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: { xs: "0.45rem", sm: "0.5rem" },
                                  color: "text.secondary",
                                }}
                              >
                                •
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: {
                                    xs: "0.45rem",
                                    sm: "0.5rem",
                                    md: "0.55rem",
                                  },
                                  color: "text.secondary",
                                }}
                              >
                                {alert.time}
                              </Typography>
                            </Stack>
                          </Box>
                          {alert.status === "pending" && (
                            <Chip
                              label="Action Required"
                              size="small"
                              sx={{
                                fontSize: {
                                  xs: "0.45rem",
                                  sm: "0.5rem",
                                  md: "0.55rem",
                                },
                                height: { xs: 18, sm: 20, md: 22 },
                                bgcolor: alpha("#ef4444", 0.1),
                                color: "#ef4444",
                                borderRadius: "0.625rem",
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>

                  <Button
                    fullWidth
                    variant="text"
                    size="small"
                    endIcon={<MoreHoriz sx={{ fontSize: 14 }} />}
                    sx={{
                      mt: { xs: 2, sm: 2.5, md: 3 },
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                      fontWeight: 600,
                      color: "text.secondary",
                      textTransform: "none",
                      "&:hover": {
                        color: theme.palette.primary.main,
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    View All Activities
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Analytics;
