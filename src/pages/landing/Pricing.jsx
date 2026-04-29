// components/Pricing.jsx - Fully Responsive with Same Row Layout
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const plans = [
  {
    name: "Core",
    price: "₹999",
    period: "/mo",
    description: null,
    features: ["Up to 100 Assets", "5 Team Members", "Standard Dashboard"],
    popular: false,
    buttonText: "Start Plan",
  },
  {
    name: "Enterprise",
    price: "₹1999",
    period: "/mo",
    description: null,
    features: [
      "Unlimited Assets",
      "25 Team Members",
      "Dynamic Checklist Builder",
      "Full API Access",
    ],
    popular: true,
    buttonText: "Select Enterprise",
  },
  {
    name: "Custom",
    price: "Quote",
    period: "",
    description: "For multi-national organizations requiring localized compliance and custom ERP integrations.",
    features: ["White-labeling", "24/7 Priority Support"],
    popular: false,
    buttonText: "Contact Sales",
  },
];

const Pricing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

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
      id="pricing"
      component="section"
      sx={{
        py: { xs: 6, sm: 8, md: 10, lg: 12, xl: 14 },
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: { xs: "80%", sm: "60%", md: "50%", lg: "40%" },
          height: { xs: "50%", sm: "60%", md: "50%", lg: "40%" },
          background: "radial-gradient(circle, rgba(26,74,107,0.03) 0%, rgba(26,74,107,0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "-10%",
          width: { xs: "80%", sm: "60%", md: "50%", lg: "40%" },
          height: { xs: "50%", sm: "60%", md: "50%", lg: "40%" },
          background: "radial-gradient(circle, rgba(26,74,107,0.03) 0%, rgba(26,74,107,0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Container 
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section Header with Animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            textAlign: "center", 
            mb: { xs: 5, sm: 6, md: 7, lg: 8, xl: 10 }
          }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { 
                  xs: "1.8rem", 
                  sm: "2rem", 
                  md: "2.2rem", 
                  lg: "2.4rem", 
                  xl: "2.8rem" 
                },
                fontWeight: 700,
                mb: { xs: 1, sm: 1.5, md: 2 },
                letterSpacing: "-0.02em",
                color: "#0f172a",
              }}
            >
              Transparent Scaling
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem", lg: "1.05rem" },
                maxWidth: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
                mx: "auto",
              }}
            >
              Infrastructure-grade solutions at predictable price points.
            </Typography>
          </Box>
        </motion.div>

        {/* Pricing Cards in Same Row - Fully Responsive */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2.5, sm: 3, md: 3.5, lg: 4, xl: 5 },
              justifyContent: "center",
              alignItems: { xs: "center", md: "stretch" },
              maxWidth: "1400px",
              mx: "auto",
            }}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  flex: 1,
                  width: "100%",
                  minWidth: { xs: "100%", sm: "100%", md: "auto" },
                  maxWidth: { xs: "100%", sm: "500px", md: "none" },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                    borderRadius: { xs: "1.5rem", sm: "1.75rem", md: "2rem", lg: "2.25rem" },
                    border: "1px solid",
                    borderColor: alpha("#0f172a", 0.08),
                    ...(plan.popular && {
                      background: "linear-gradient(135deg, #1a4a6b 0%, #003350 100%)",
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)",
                        pointerEvents: "none",
                      },
                    }),
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: { xs: "translateY(-4px)", md: "translateY(-8px)" },
                      boxShadow: "0 20px 35px -12px rgba(0,0,0,0.15)",
                      ...(plan.popular && {
                        boxShadow: "0 25px 40px -12px rgba(26,74,107,0.4)",
                        transform: { xs: "translateY(-4px)", md: "translateY(-8px)" },
                      }),
                    },
                  }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        px: { xs: 1.5, sm: 2, md: 2.5 },
                        py: { xs: 0.5, sm: 0.75, md: 1 },
                        bgcolor: "white",
                        color: "#1a4a6b",
                        borderRadius: "full",
                        fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        whiteSpace: "nowrap",
                        zIndex: 1,
                      }}
                    >
                      ⭐ Most Popular
                    </Box>
                  )}

                  {/* Plan Name */}
                  <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3, lg: 3.5 } }}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{
                        fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.4rem" },
                        mb: { xs: 0.75, sm: 1, md: 1.25 },
                        ...(plan.popular && { opacity: 0.95 }),
                        color: plan.popular ? "white" : "#0f172a",
                      }}
                    >
                      {plan.name}
                    </Typography>
                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                      <Typography
                        variant="h2"
                        fontWeight={800}
                        sx={{
                          fontSize: { 
                            xs: plan.price === "Quote" ? "1.5rem" : "2rem", 
                            sm: plan.price === "Quote" ? "1.8rem" : "2.2rem", 
                            md: plan.price === "Quote" ? "2rem" : "2.5rem",
                            lg: plan.price === "Quote" ? "2.2rem" : "2.8rem"
                          },
                          color: plan.popular ? "white" : "#1a4a6b",
                        }}
                      >
                        {plan.price}
                      </Typography>
                      {plan.period && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                            ...(plan.popular && { opacity: 0.8, color: "white" }),
                            color: plan.popular ? "white" : "#64748b",
                          }}
                        >
                          {plan.period}
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  {/* Description */}
                  {plan.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        mb: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                        fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                        ...(plan.popular && { opacity: 0.9, color: "white" }),
                        color: plan.popular ? "white" : "#64748b",
                        lineHeight: 1.5,
                      }}
                    >
                      {plan.description}
                    </Typography>
                  )}

                  {/* Features List */}
                  <Box sx={{ flex: 1, mb: { xs: 3, sm: 3.5, md: 4, lg: 5 } }}>
                    {plan.features.map((feature, i) => (
                      <Stack
                        direction="row"
                        spacing={{ xs: 1, sm: 1.25, md: 1.5 }}
                        alignItems="center"
                        key={i}
                        sx={{ mb: { xs: 1, sm: 1.25, md: 1.5 } }}
                      >
                        <CheckCircleIcon
                          sx={{
                            fontSize: { xs: 16, sm: 17, md: 18, lg: 20 },
                            ...(plan.popular ? { color: "white" } : { color: "#1a4a6b" }),
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem", lg: "0.85rem" },
                            ...(plan.popular && { color: "white", opacity: 0.92 }),
                            color: plan.popular ? "white" : "#334155",
                          }}
                        >
                          {feature}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>

                  {/* CTA Button */}
                  <Button
                    variant={plan.popular ? "contained" : "outlined"}
                    fullWidth
                    sx={{
                      py: { xs: 1.25, sm: 1.5, md: 1.75 },
                      px: { xs: 2, sm: 2.5 },
                      borderRadius: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                      fontWeight: 700,
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "0.95rem" },
                      textTransform: "none",
                      ...(plan.popular
                        ? {
                            bgcolor: "white",
                            color: "#1a4a6b",
                            "&:hover": {
                              bgcolor: "#f8fafc",
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            },
                          }
                        : {
                            borderColor: alpha("#1a4a6b", 0.3),
                            color: "#1a4a6b",
                            "&:hover": {
                              borderColor: "#1a4a6b",
                              bgcolor: alpha("#1a4a6b", 0.04),
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                            },
                          }),
                      transition: "all 0.3s ease",
                    }}
                  >
                    {plan.buttonText}
                  </Button>

                  {/* Additional small text for Custom plan */}
                  {plan.name === "Custom" && (
                    <Typography
                      variant="caption"
                      sx={{
                        textAlign: "center",
                        display: "block",
                        mt: 1.5,
                        fontSize: { xs: "0.6rem", sm: "0.65rem" },
                        color: plan.popular ? alpha("white", 0.7) : "#64748b",
                      }}
                    >
                      Custom pricing based on needs
                    </Typography>
                  )}
                </Paper>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Additional Trust Badge with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ 
            textAlign: "center", 
            mt: { xs: 5, sm: 6, md: 7, lg: 8, xl: 10 }
          }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 3 }}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#94a3b8",
                  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                ⭐ Trusted by 500+ companies
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#94a3b8",
                  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                💳 No credit card required
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#94a3b8",
                  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                🔄 Cancel anytime
              </Typography>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Pricing;