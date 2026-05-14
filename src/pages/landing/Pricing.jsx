// components/Pricing.jsx - Fully Responsive for All Devices (320px - 1200px+)
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
  Switch,
  FormControlLabel,
  Grid,
  Tooltip,
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import RocketIcon from "@mui/icons-material/Rocket";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InfoIcon from "@mui/icons-material/Info";

const Pricing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [isAnnual, setIsAnnual] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const plans = [
    {
      name: "Starter",
      priceMonthly: 49,
      priceAnnual: 39,
      description: "Perfect for small teams getting started",
      features: [
        {
          name: "Up to 500 assets",
          included: true,
          tooltip: "Manage up to 500 assets simultaneously",
        },
        {
          name: "5 team members",
          included: true,
          tooltip: "Invite up to 5 team members",
        },
        {
          name: "Basic analytics",
          included: true,
          tooltip: "Essential metrics and reports",
        },
        {
          name: "Email support",
          included: true,
          tooltip: "48-hour response time",
        },
        {
          name: "API access",
          included: false,
          tooltip: "REST API for integrations",
        },
        {
          name: "Custom branding",
          included: false,
          tooltip: "Add your company logo and colors",
        },
      ],
      popular: false,
      color: "#3b82f6",
      buttonText: "Get Started",
      savings: 20,
    },
    {
      name: "Professional",
      priceMonthly: 99,
      priceAnnual: 79,
      description: "For growing businesses needing more power",
      features: [
        {
          name: "Up to 5,000 assets",
          included: true,
          tooltip: "Manage up to 5,000 assets",
        },
        {
          name: "15 team members",
          included: true,
          tooltip: "Invite up to 15 team members",
        },
        {
          name: "Advanced analytics",
          included: true,
          tooltip: "Detailed insights and custom reports",
        },
        {
          name: "Priority support",
          included: true,
          tooltip: "24-hour response time",
        },
        {
          name: "Full API access",
          included: true,
          tooltip: "Complete API integration",
        },
        {
          name: "Custom branding",
          included: false,
          tooltip: "White-label solution",
        },
      ],
      popular: true,
      color: "#8b5cf6",
      buttonText: "Start Free Trial",
      savings: 20,
    },
    {
      name: "Enterprise",
      priceMonthly: 249,
      priceAnnual: 199,
      description: "For large organizations with advanced needs",
      features: [
        {
          name: "Unlimited assets",
          included: true,
          tooltip: "No asset limits",
        },
        {
          name: "Unlimited team members",
          included: true,
          tooltip: "Unlimited user accounts",
        },
        {
          name: "Predictive analytics",
          included: true,
          tooltip: "AI-powered insights",
        },
        {
          name: "24/7 dedicated support",
          included: true,
          tooltip: "Round-the-clock support",
        },
        {
          name: "Full API + Webhooks",
          included: true,
          tooltip: "Advanced integrations",
        },
        {
          name: "Custom branding & SSO",
          included: true,
          tooltip: "Complete white-label + SSO",
        },
      ],
      popular: false,
      color: "#10b981",
      buttonText: "Contact Sales",
      savings: 20,
    },
  ];

  const getPrice = (plan) => {
    if (plan.name === "Enterprise") return "Custom";
    return isAnnual ? `${plan.priceAnnual}` : `${plan.priceMonthly}`;
  };

  const getPeriod = (plan) => {
    if (plan.name === "Enterprise") return "";
    return isAnnual ? "/mo" : "/mo";
  };

  const getAnnualSavings = (plan) => {
    if (plan.name === "Enterprise") return null;
    const monthlyTotal = plan.priceMonthly * 12;
    const annualTotal = plan.priceAnnual * 12;
    const savings = monthlyTotal - annualTotal;
    return `Save ${savings}/year`;
  };

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
      id="pricing"
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
          top: { xs: "5%", sm: "8%", md: "10%" },
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
          bottom: { xs: "5%", sm: "8%", md: "10%" },
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
              label="PRICING"
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
              Simple, Transparent Pricing
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
                  sm: "85%,",
                  md: "75%",
                  lg: "65%",
                  xl: "60%",
                },
                mx: "auto",
                lineHeight: 1.5,
                px: { xs: 1, sm: 0 },
              }}
            >
              Choose the plan that works best for your team. All plans include a
              14-day free trial.
            </Typography>
          </Box>
        </motion.div>

        {/* Billing Toggle - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 1.5, md: 2 }}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: { xs: 4, sm: 5, md: 6, lg: 7 } }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: {
                  xs: "0.65rem",
                  sm: "0.7rem",
                  md: "0.75rem",
                  lg: "0.8rem",
                },
                color: !isAnnual
                  ? theme.palette.primary.main
                  : "text.secondary",
                fontWeight: !isAnnual ? 700 : 500,
                transition: "all 0.2s ease",
              }}
            >
              Monthly
            </Typography>
            <Switch
              checked={isAnnual}
              onChange={(e) => setIsAnnual(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: theme.palette.primary.main,
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  bgcolor: alpha(theme.palette.primary.main, 0.5),
                },
              }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="caption"
                sx={{
                  fontSize: {
                    xs: "0.65rem",
                    sm: "0.7rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                  },
                  color: isAnnual
                    ? theme.palette.primary.main
                    : "text.secondary",
                  fontWeight: isAnnual ? 700 : 500,
                  transition: "all 0.2s ease",
                }}
              >
                Annual
              </Typography>
              <Chip
                label="Save 20%"
                size="small"
                sx={{
                  fontSize: { xs: "0.45rem", sm: "0.5rem", md: "0.55rem" },
                  height: { xs: 18, sm: 20, md: 22 },
                  bgcolor: alpha("#10b981", 0.12),
                  color: "#10b981",
                  fontWeight: 700,
                  borderRadius: "0.75rem",
                }}
              />
            </Stack>
          </Stack>
        </motion.div>

        {/* Pricing Cards - Fully Responsive Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.5 }}
            justifyContent="center"
            alignItems="stretch"
          >
            {plans.map((plan, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{
                  display: "flex",
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Card
                    elevation={0}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
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
                      width: { xs: "100%", sm: "350px", md: "360px" },
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      overflow: "hidden",
                      ...(plan.popular && {
                        borderColor: alpha(plan.color, 0.3),
                        boxShadow: `0 8px 24px ${alpha(plan.color, 0.12)}`,
                      }),
                      "&:hover": {
                        transform: isDesktop
                          ? "translateY(-8px)"
                          : "translateY(-4px)",
                        boxShadow: isDesktop
                          ? `0 24px 48px -12px ${alpha(plan.color, 0.25)}`
                          : `0 16px 32px -12px ${alpha(plan.color, 0.2)}`,
                      },
                    }}
                  >
                    {/* Popular Badge - Responsive */}
                    {plan.popular && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: { xs: 12, sm: 14, md: 16 },
                          right: { xs: 12, sm: 14, md: 16 },
                          zIndex: 1,
                        }}
                      >
                        <Chip
                          label="Most Popular"
                          size="small"
                          sx={{
                            fontSize: {
                              xs: "0.5rem",
                              sm: "0.55rem",
                              md: "0.6rem",
                            },
                            height: { xs: 22, sm: 24, md: 26 },
                            bgcolor: plan.color,
                            color: "white",
                            fontWeight: 700,
                            borderRadius: "0.75rem",
                            "& .MuiChip-label": {
                              px: { xs: 1, sm: 1.25 },
                            },
                          }}
                        />
                      </Box>
                    )}

                    {/* Gradient Top Border for Popular Plan */}
                    {plan.popular && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: { xs: "3px", sm: "4px" },
                          background: `linear-gradient(90deg, ${plan.color}, ${alpha(plan.color, 0.4)})`,
                        }}
                      />
                    )}

                    <CardContent
                      sx={{
                        p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Plan Name */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.9rem",
                            sm: "0.95rem",
                            md: "1rem",
                            lg: "1.1rem",
                          },
                          color: plan.color,
                          mb: 0.5,
                        }}
                      >
                        {plan.name}
                      </Typography>

                      {/* Price */}
                      <Stack
                        direction="row"
                        alignItems="baseline"
                        spacing={0.5}
                        sx={{ mb: 0.5 }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: {
                              xs: "1.6rem",
                              sm: "1.8rem",
                              md: "2rem",
                              lg: "2.2rem",
                              xl: "2.4rem",
                            },
                            fontWeight: 800,
                            color: "text.primary",
                          }}
                        >
                          {getPrice(plan)}
                        </Typography>
                        {getPeriod(plan) && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: {
                                xs: "0.6rem",
                                sm: "0.65rem",
                                md: "0.7rem",
                              },
                              color: "text.secondary",
                            }}
                          >
                            {getPeriod(plan)}
                          </Typography>
                        )}
                      </Stack>

                      {/* Annual Savings Note */}
                      {isAnnual && plan.name !== "Enterprise" && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: {
                              xs: "0.55rem",
                              sm: "0.6rem",
                              md: "0.65rem",
                            },
                            color: "#10b981",
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          {getAnnualSavings(plan)}
                        </Typography>
                      )}

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.75rem",
                            md: "0.8rem",
                          },
                          color: "text.secondary",
                          mb: 1.5,
                          lineHeight: 1.4,
                        }}
                      >
                        {plan.description}
                      </Typography>

                      {/* Divider */}
                      <Box
                        sx={{
                          height: "1px",
                          bgcolor: alpha(theme.palette.divider, 0.08),
                          my: 1.5,
                        }}
                      />

                      {/* Features List */}
                      <Stack spacing={1.25} sx={{ mb: 2.5, flex: 1 }}>
                        {plan.features.map((feature, idx) => (
                          <Stack
                            key={idx}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {feature.included ? (
                              <CheckCircleIcon
                                sx={{
                                  fontSize: { xs: 14, sm: 15, md: 16 },
                                  color: plan.color,
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <CloseIcon
                                sx={{
                                  fontSize: { xs: 12, sm: 13, md: 14 },
                                  color: alpha(
                                    theme.palette.text.disabled,
                                    0.5,
                                  ),
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: {
                                    xs: "0.65rem",
                                    sm: "0.7rem",
                                    md: "0.75rem",
                                  },
                                  color: feature.included
                                    ? "text.primary"
                                    : alpha(theme.palette.text.disabled, 0.7),
                                }}
                              >
                                {feature.name}
                              </Typography>
                              <Tooltip
                                title={feature.tooltip}
                                arrow
                                placement="top"
                              >
                                <InfoIcon
                                  sx={{
                                    fontSize: { xs: 10, sm: 11, md: 12 },
                                    color: alpha(
                                      theme.palette.text.secondary,
                                      0.5,
                                    ),
                                    cursor: "help",
                                  }}
                                />
                              </Tooltip>
                            </Stack>
                          </Stack>
                        ))}
                      </Stack>

                      {/* CTA Button - Responsive */}
                      <Button
                        fullWidth
                        variant={plan.popular ? "contained" : "outlined"}
                        size={isMobile ? "medium" : "large"}
                        sx={{
                          py: { xs: 0.875, sm: 1, md: 1.125 },
                          borderRadius: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            md: "1rem",
                          },
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.75rem",
                            md: "0.8rem",
                            lg: "0.85rem",
                          },
                          fontWeight: 700,
                          textTransform: "none",
                          ...(plan.popular
                            ? {
                                bgcolor: plan.color,
                                "&:hover": {
                                  bgcolor: alpha(plan.color, 0.85),
                                  transform: "translateY(-2px)",
                                },
                              }
                            : {
                                borderColor: alpha(plan.color, 0.3),
                                color: plan.color,
                                "&:hover": {
                                  borderColor: plan.color,
                                  bgcolor: alpha(plan.color, 0.04),
                                  transform: "translateY(-2px)",
                                },
                              }),
                          transition: "all 0.2s ease",
                          boxShadow: plan.popular
                            ? `0 4px 12px ${alpha(plan.color, 0.3)}`
                            : "none",
                          "&:hover": {
                            boxShadow: plan.popular
                              ? `0 6px 20px ${alpha(plan.color, 0.4)}`
                              : "none",
                          },
                        }}
                      >
                        {plan.buttonText}
                      </Button>

                      {/* Extra note for Enterprise */}
                      {plan.name === "Enterprise" && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: "center",
                            mt: 1.5,
                            fontSize: {
                              xs: "0.55rem",
                              sm: "0.6rem",
                              md: "0.65rem",
                            },
                            color: "text.secondary",
                          }}
                        >
                          Custom pricing based on your needs
                        </Typography>
                      )}
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

export default Pricing;
