// components/Features.jsx - Fully Responsive Card Style
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
} from "@mui/material";
import { motion } from "framer-motion";
import InventoryIcon from "@mui/icons-material/Inventory";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import BarChartIcon from "@mui/icons-material/BarChart";

const features = [
  {
    icon: <InventoryIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24, lg: 26 } }} />,
    title: "Lifecycle Tracking",
    description:
      "Centralize your asset registry with granular lifecycle data and real-time status updates.",
  },
  {
    icon: <FactCheckIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24, lg: 26 } }} />,
    title: "Smart Checklists",
    description:
      "Design dynamic, conditional logic checklists that standardize procedures.",
  },
  {
    icon: <QrCodeScannerIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24, lg: 26 } }} />,
    title: "Mobile Inspections",
    description:
      "Execute thorough field audits using offline-first mobile tools.",
  },
  {
    icon: <BadgeIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24, lg: 26 } }} />,
    title: "Workforce Orchestration",
    description:
      "Optimize field technician schedules and automate task assignments.",
  },
  {
    icon: <BusinessIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24, lg: 26 } }} />,
    title: "Client Portal",
    description:
      "Provide stakeholders with secure, read-only transparency into asset health.",
  },
  {
    icon: <BarChartIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24, lg: 26 } }} />,
    title: "Predictive Analytics",
    description:
      "Leverage historical data to predict maintenance needs before failures.",
  },
];

const Features = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
      id="features"
      component="section"
      sx={{
        py: { xs: 6, sm: 8, md: 10, lg: 12, xl: 14 },
        bgcolor: "#fafbfc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "-5%",
          width: { xs: "60%", sm: "50%", md: "40%", lg: "35%" },
          height: { xs: "60%", sm: "50%", md: "40%", lg: "35%" },
          background: "radial-gradient(circle, rgba(26,74,107,0.02) 0%, rgba(26,74,107,0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: { xs: "60%", sm: "50%", md: "40%", lg: "35%" },
          height: { xs: "60%", sm: "50%", md: "40%", lg: "35%" },
          background: "radial-gradient(circle, rgba(26,74,107,0.02) 0%, rgba(26,74,107,0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Container 
        maxWidth="xl" 
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header with Animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            textAlign: "center", 
            mb: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 }
          }}>
            <Typography
              variant="overline"
              sx={{
                color: "#1a4a6b",
                fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem", lg: "0.7rem" },
                fontWeight: 600,
                letterSpacing: "0.1em",
                mb: { xs: 1, sm: 1.25, md: 1.5 },
                display: "block",
                textTransform: "uppercase",
              }}
            >
              WHY CHOOSE US
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: { 
                  xs: "1.5rem", 
                  sm: "1.8rem", 
                  md: "2rem", 
                  lg: "2.2rem", 
                  xl: "2.5rem" 
                },
                fontWeight: 700,
                color: "#0f172a",
                mb: { xs: 1, sm: 1.25, md: 1.5 },
                letterSpacing: "-0.02em",
                px: { xs: 2, sm: 0 },
              }}
            >
              Powerful Features for Modern Asset Management
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                maxWidth: { xs: "100%", sm: "85%", md: "75%", lg: "650px", xl: "700px" },
                mx: "auto",
                lineHeight: 1.6,
                px: { xs: 2, sm: 0 },
              }}
            >
              Everything you need to manage, track, and optimize your assets efficiently
            </Typography>
          </Box>
        </motion.div>

        {/* Features Grid with Animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <Grid 
            container 
            spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 }}
            justifyContent="center"
            alignItems="stretch"
          >
            {features.map((feature, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={4}
                xl={4}
                key={index}
                sx={{
                  display: "flex",
                  width:"370px"
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: { xs: "1rem", sm: "1.25rem", md: "1.5rem", lg: "1.75rem" },
                      border: `1px solid ${alpha("#0f172a", 0.06)}`,
                      bgcolor: "#ffffff",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg, #1a4a6b, #2c6e9e)",
                        transform: "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.3s ease",
                      },
                      "&:hover": {
                        transform: { xs: "none", sm: "translateY(-6px)", md: "translateY(-8px)" },
                        boxShadow: { 
                          xs: "none", 
                          sm: "0 20px 30px -12px rgba(0,0,0,0.15)",
                          md: "0 25px 35px -12px rgba(0,0,0,0.15)"
                        },
                        borderColor: { sm: alpha("#1a4a6b", 0.15), md: alpha("#1a4a6b", 0.2) },
                        "&::before": {
                          transform: "scaleX(1)",
                        },
                      },
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                        flex: 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 40, sm: 44, md: 48, lg: 52, xl: 56 },
                          height: { xs: 40, sm: 44, md: 48, lg: 52, xl: 56 },
                          borderRadius: { xs: "0.75rem", sm: "1rem", md: "1.25rem" },
                          bgcolor: alpha("#1a4a6b", 0.06),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
                          color: "#1a4a6b",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: { xs: "none", sm: "scale(1.05)" },
                            bgcolor: alpha("#1a4a6b", 0.1),
                          },
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          fontSize: { 
                            xs: "1rem", 
                            sm: "1.05rem", 
                            md: "1.1rem", 
                            lg: "1.2rem",
                            xl: "1.25rem" 
                          },
                          mb: { xs: 0.75, sm: 1, md: 1.25 },
                          color: "#0f172a",
                          lineHeight: 1.3,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          fontSize: { 
                            xs: "0.7rem", 
                            sm: "0.75rem", 
                            md: "0.8rem", 
                            lg: "0.85rem",
                            xl: "0.9rem" 
                          },
                          lineHeight: 1.5,
                          flex: 1,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* View All Features Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ 
            textAlign: "center", 
            mt: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 }
          }}>
            <Typography
              component="a"
              href="#"
              sx={{
                color: "#1a4a6b",
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  gap: { xs: 1.25, sm: 1.5 },
                  color: "#003350",
                },
                transition: "all 0.2s ease",
              }}
            >
              View all features →
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Features;