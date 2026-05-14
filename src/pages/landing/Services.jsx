// components/ServicesSection.jsx - Fully Responsive for All Devices (320px - 1200px+)
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  Collapse,
  Fade,
} from "@mui/material";
import {
  Computer,
  School,
  Business,
  Verified,
  Router,
  Description,
  Memory,
  Code,
  Factory,
  Science,
  Analytics,
  Cloud,
  Security,
  Storage,
  AccountTree,
  Handshake,
  Settings,
  LocationCity,
  ArrowForward,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const ServicesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [showAll, setShowAll] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const servicesData = [
    {
      id: 1,
      title: "Technology Services",
      icon: <Computer sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "End-to-end technology services to build, modernize, and scale digital capabilities.",
      longDescription:
        "From architecture to implementation, we ensure systems are secure, resilient, and future-ready. Our team delivers enterprise-grade solutions tailored to your specific needs.",
      tags: ["Architecture", "Implementation", "Managed Services"],
      color: "#3b82f6",
    },
    {
      id: 2,
      title: "EdTech",
      icon: <School sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "Intelligent, technology-driven platforms bridging learning with real-world skills.",
      longDescription:
        "Adaptive learning, analytics, and personalized pathways for enhanced outcomes. Transform education with our innovative digital solutions.",
      tags: ["Adaptive Learning", "Analytics", "Personalization"],
      color: "#10b981",
    },
    {
      id: 3,
      title: "Consulting & Advisory",
      icon: <Business sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "Strategic consulting to define, plan, and execute digital transformation journeys.",
      longDescription:
        "Align technology with business goals and optimize operations. Our experts guide you through every step of your digital evolution.",
      tags: ["Strategy", "Digital Transformation", "Risk Management"],
      color: "#8b5cf6",
    },
    {
      id: 4,
      title: "Quality Control & Assurance",
      icon: <Verified sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description: "Robust quality frameworks ensuring operational excellence.",
      longDescription:
        "Inspection platforms, testing methodologies, and compliance mechanisms tailored to enterprises. Ensure reliability at every level.",
      tags: ["Testing", "Compliance", "Quality Frameworks"],
      color: "#ef4444",
    },
    {
      id: 5,
      title: "Networks",
      icon: <Router sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "High-performance network infrastructures that are secure, scalable, and resilient.",
      longDescription:
        "Enterprise networking, cloud connectivity, and SD-WAN solutions. Keep your business connected with our network expertise.",
      tags: ["SD-WAN", "Cloud Connectivity", "Security"],
      color: "#f59e0b",
    },
    {
      id: 6,
      title: "Document Management",
      icon: (
        <Description sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />
      ),
      description:
        "Digitize, organize, and control information assets with ease.",
      longDescription:
        "Secure, compliant, searchable repositories with workflow automation. Transform how you handle documents and data.",
      tags: ["Workflow", "Compliance", "Collaboration"],
      color: "#06b6d4",
    },
    {
      id: 7,
      title: "Hardware Solutions",
      icon: <Memory sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "Hardware solutions complementing digital systems and infrastructure.",
      longDescription:
        "IoT-enabled devices and infrastructure components ensuring reliability and performance. Bridge the physical and digital gap.",
      tags: ["IoT", "Infrastructure", "Integration"],
      color: "#ec4899",
    },
    {
      id: 8,
      title: "Software Development",
      icon: <Code sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description: "Scalable, secure, high-performance software solutions.",
      longDescription:
        "Custom development, cloud-native platforms, and enterprise system integration. Build the future with our development expertise.",
      tags: ["Custom Development", "Cloud-Native", "Integration"],
      color: "#14b8a6",
    },
    {
      id: 9,
      title: "Industrial Tech",
      icon: <Factory sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description: "Digital intelligence integrated into physical operations.",
      longDescription:
        "Smart manufacturing, predictive maintenance, and real-time monitoring. Optimize your industrial operations with IoT.",
      tags: ["IoT", "Predictive Maintenance", "Automation"],
      color: "#6366f1",
    },
    {
      id: 10,
      title: "Research & Development",
      icon: <Science sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "Exploring emerging technologies and solving complex challenges.",
      longDescription:
        "Developing new products and innovative solutions. Stay ahead of the curve with our R&D capabilities.",
      tags: ["Innovation", "Prototyping", "IP Development"],
      color: "#a855f7",
    },
    {
      id: 11,
      title: "Product Management",
      icon: (
        <AccountTree sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />
      ),
      description: "End-to-end product management from ideation to launch.",
      longDescription:
        "Market insights, user-centric design, and agile execution. Bring your product vision to life.",
      tags: ["Strategy", "Agile", "Go-to-Market"],
      color: "#eab308",
    },
    {
      id: 12,
      title: "Data Science & AI",
      icon: <Analytics sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description: "Transforming raw data into actionable intelligence.",
      longDescription:
        "Advanced analytics, predictive algorithms, and AI-driven systems. Unlock the power of your data.",
      tags: ["Machine Learning", "Predictive Analytics", "AI"],
      color: "#3b82f6",
    },
    {
      id: 13,
      title: "Cloud Services",
      icon: <Cloud sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "Secure, scalable cloud architectures for modern businesses.",
      longDescription:
        "Migration, modernization, multi-cloud strategy, and continuous operations. Leverage the full potential of cloud computing.",
      tags: ["Migration", "Multi-Cloud", "DevOps"],
      color: "#0ea5e9",
    },
    {
      id: 14,
      title: "Cyber Security",
      icon: <Security sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "Comprehensive cybersecurity protecting your digital assets.",
      longDescription:
        "Governance, risk management, threat detection, and incident response. Sleep better with our security solutions.",
      tags: ["Zero Trust", "Threat Detection", "Compliance"],
      color: "#dc2626",
    },
    {
      id: 15,
      title: "Infrastructure",
      icon: <Storage sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "Robust infrastructure ecosystems supporting critical operations.",
      longDescription:
        "Data centers, hybrid environments, and scalable storage solutions. Build a foundation that lasts.",
      tags: ["Data Centers", "Hybrid", "Scalability"],
      color: "#8b5cf6",
    },
    {
      id: 16,
      title: "Sales Enablement",
      icon: <Handshake sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description: "Sales enablement and go-to-market strategies for growth.",
      longDescription:
        "Pre-sales consulting, solution positioning, and revenue optimization. Empower your sales team for success.",
      tags: ["Sales Enablement", "GTM", "Revenue Growth"],
      color: "#10b981",
    },
    {
      id: 17,
      title: "Tech Operations",
      icon: <Settings sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "End-to-end technology operations ensuring continuous performance.",
      longDescription:
        "Monitoring, incident management, and automation. Keep your systems running smoothly 24/7.",
      tags: ["Monitoring", "Incident Management", "Automation"],
      color: "#f59e0b",
    },
    {
      id: 18,
      title: "Channel Partnerships",
      icon: <Handshake sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />,
      description:
        "Partner ecosystems to expand market reach and collaboration.",
      longDescription:
        "Collaboration with OEMs, technology providers, and distribution networks. Grow together with strategic partnerships.",
      tags: ["Partnerships", "Distribution", "Ecosystem"],
      color: "#06b6d4",
    },
    {
      id: 19,
      title: "Smart Cities",
      icon: (
        <LocationCity sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 } }} />
      ),
      description:
        "Smart city technologies and intelligent urban infrastructure.",
      longDescription:
        "Integrated platforms for urban living, mobility, and sustainability. Build the cities of tomorrow today.",
      tags: ["Smart Cities", "IoT", "Urban Planning"],
      color: "#6366f1",
    },
  ];

  const displayedServices = showAll ? servicesData : servicesData.slice(0, 6);
  const remainingCount = servicesData.length - 6;

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
      id="services"
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
        {/* Section Header - Compact & Modern & Responsive */}
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
              label="OUR SERVICES"
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
              Comprehensive Technology Solutions
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
              End-to-end technology services that enable organizations to build,
              modernize, and scale their digital capabilities
            </Typography>
          </Box>
        </motion.div>

        {/* Services Grid - Alternative Card Design */}
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
            <AnimatePresence mode="wait">
              {displayedServices.map((service, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  key={service.id}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    variants={fadeInUp}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    style={{ width: "100%", height: "100%" }}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
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
                        width:"360px",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        cursor: "pointer",
                        "&:hover": {
                          transform: isDesktop
                            ? "translateY(-6px)"
                            : "translateY(-3px)",
                          boxShadow: isDesktop
                            ? `0 20px 40px -12px ${alpha(service.color, 0.25)}`
                            : `0 12px 24px -12px ${alpha(service.color, 0.2)}`,
                          borderColor: alpha(service.color, 0.3),
                        },
                      }}
                      onMouseEnter={() => setExpandedCard(service.id)}
                      onMouseLeave={() => setExpandedCard(null)}
                    >
                      {/* Color Accent Bar */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: { xs: "3px", sm: "4px" },
                          background: `linear-gradient(90deg, ${service.color}, ${alpha(service.color, 0.6)})`,
                          borderTopLeftRadius: {
                            xs: "1rem",
                            sm: "1.125rem",
                            md: "1.25rem",
                            lg: "1.375rem",
                          },
                          borderTopRightRadius: {
                            xs: "1rem",
                            sm: "1.125rem",
                            md: "1.25rem",
                            lg: "1.375rem",
                          },
                          opacity: expandedCard === service.id ? 1 : 0.7,
                          transition: "opacity 0.2s ease",
                        }}
                      />

                      <CardContent
                        sx={{
                          p: { xs: 1.75, sm: 2, md: 2.5, lg: 3 },
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {/* Icon Section - Responsive */}
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
                            bgcolor: alpha(service.color, 0.1),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: { xs: 1.5, sm: 1.75, md: 2 },
                            color: service.color,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                              backgroundColor: alpha(service.color, 0.15),
                            },
                          }}
                        >
                          {service.icon}
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
                          {service.title}
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
                            mb: 1.5,
                          }}
                        >
                          {service.description}
                        </Typography>

                        {/* Tags - Responsive */}
                        <Stack
                          direction="row"
                          spacing={0.75}
                          flexWrap="wrap"
                          sx={{ gap: 0.75, mb: 1.5 }}
                        >
                          {service.tags.slice(0, 2).map((tag, idx) => (
                            <Chip
                              key={idx}
                              label={tag}
                              size="small"
                              sx={{
                                fontSize: {
                                  xs: "0.5rem",
                                  sm: "0.55rem",
                                  md: "0.6rem",
                                },
                                height: { xs: 20, sm: 22, md: 24 },
                                bgcolor: alpha(service.color, 0.1),
                                color: service.color,
                                borderRadius: "100px",
                                fontWeight: 600,
                                "& .MuiChip-label": {
                                  px: { xs: 0.75, sm: 1 },
                                },
                              }}
                            />
                          ))}
                          {service.tags.length > 2 && (
                            <Chip
                              label={`+${service.tags.length - 2}`}
                              size="small"
                              sx={{
                                fontSize: {
                                  xs: "0.5rem",
                                  sm: "0.55rem",
                                  md: "0.6rem",
                                },
                                height: { xs: 20, sm: 22, md: 24 },
                                bgcolor: alpha(theme.palette.divider, 0.1),
                                color: "text.secondary",
                                borderRadius: "100px",
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Stack>

                        {/* Learn More Link - Responsive */}
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: "auto",
                            color: service.color,
                            cursor: "pointer",
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
                              letterSpacing: "0.02em",
                            }}
                          >
                            Learn more
                          </Typography>
                          <ArrowForward
                            sx={{ fontSize: { xs: 12, sm: 13, md: 14 } }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        </motion.div>

        {/* View More / View Less Button - Fully Functional & Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              textAlign: "center",
              mt: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 },
            }}
          >
            {!showAll ? (
              <Stack spacing={2} alignItems="center">
                <Button
                  onClick={() => setShowAll(true)}
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  endIcon={
                    <ExpandMore sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                  }
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: 700,
                    fontSize: {
                      xs: "0.7rem",
                      sm: "0.75rem",
                      md: "0.8rem",
                      lg: "0.85rem",
                    },
                    textTransform: "none",
                    px: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                    py: { xs: 0.75, sm: 0.875, md: 1, lg: 1.125 },
                    borderRadius: { xs: "1.5rem", sm: "2rem" },
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  View All {remainingCount}+ Services
                </Button>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem" },
                    color: alpha(theme.palette.text.secondary, 0.7),
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 30,
                      height: 1,
                      bgcolor: alpha(theme.palette.divider, 0.2),
                    }}
                  />
                  Showing 6 of {servicesData.length} services
                  <Box
                    component="span"
                    sx={{
                      width: 30,
                      height: 1,
                      bgcolor: alpha(theme.palette.divider, 0.2),
                    }}
                  />
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={2} alignItems="center">
                <Button
                  onClick={() => setShowAll(false)}
                  variant="outlined"
                  size={isMobile ? "medium" : "large"}
                  endIcon={
                    <ExpandLess sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                  }
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    fontSize: {
                      xs: "0.7rem",
                      sm: "0.75rem",
                      md: "0.8rem",
                      lg: "0.85rem",
                    },
                    textTransform: "none",
                    px: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                    py: { xs: 0.75, sm: 0.875, md: 1, lg: 1.125 },
                    borderRadius: { xs: "1.5rem", sm: "2rem" },
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Show Less Services
                </Button>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem" },
                    color: alpha(theme.palette.text.secondary, 0.7),
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 30,
                      height: 1,
                      bgcolor: alpha(theme.palette.divider, 0.2),
                    }}
                  />
                  Showing all {servicesData.length} services
                  <Box
                    component="span"
                    sx={{
                      width: 30,
                      height: 1,
                      bgcolor: alpha(theme.palette.divider, 0.2),
                    }}
                  />
                </Typography>
              </Stack>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ServicesSection;
