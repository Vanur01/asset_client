// components/Testimonials.jsx - Fully Responsive for All Devices (320px - 1200px+)
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Ops Lead, Metro Logistics",
    content:
      "AMS has fundamentally transformed our maintenance efficiency. We've seen a 30% reduction in downtime since launch.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=1",
    company: "Metro Logistics",
  },
  {
    id: 2,
    name: "Anita Sharma",
    role: "Facility Head, Apex Corp",
    content:
      "The mobile interface is flawless. Our field staff adopted it instantly—no training required. Total game changer.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=2",
    company: "Apex Corp",
  },
  {
    id: 3,
    name: "Vikram Mehta",
    role: "CTO, Innovate Solutions",
    content:
      "The predictive analytics feature has saved us over ₹15L in maintenance costs. The ROI has been exceptional.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=3",
    company: "Innovate Solutions",
  },
  {
    id: 4,
    name: "Priya Nair",
    role: "Operations Director, Global Industries",
    content:
      "Best asset management platform we've used. The team loves the intuitive interface and real-time reporting capabilities.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=4",
    company: "Global Industries",
  },
  {
    id: 5,
    name: "Suresh Patel",
    role: "Plant Manager, Tata Motors",
    content:
      "Implementation was smooth and support team is exceptional. Our plant efficiency has improved by 25%.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=5",
    company: "Tata Motors",
  },
  {
    id: 6,
    name: "Meera Gupta",
    role: "CEO, TechStart",
    content:
      "The platform's scalability and reliability have been crucial for our growth. Highly recommended for any business.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=6",
    company: "TechStart",
  },
];

const Testimonials = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const itemsPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerView);
  const currentPage = Math.min(Math.floor(activeIndex / itemsPerView), totalPages - 1);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => {
      const nextStart = (currentPage + 1) * itemsPerView;
      if (nextStart >= testimonials.length) {
        return 0;
      }
      return nextStart;
    });
  }, [currentPage, itemsPerView]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => {
      const prevStart = (currentPage - 1) * itemsPerView;
      if (prevStart < 0) {
        return Math.max(0, testimonials.length - itemsPerView);
      }
      return prevStart;
    });
  }, [currentPage, itemsPerView]);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay, isPaused, nextSlide]);

  const getVisibleTestimonials = () => {
    const start = currentPage * itemsPerView;
    return testimonials.slice(start, start + itemsPerView);
  };

  const goToPage = (pageIndex) => {
    setActiveIndex(pageIndex * itemsPerView);
  };

  const toggleAutoplay = () => {
    setIsPaused(!isPaused);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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
      id="testimonials"
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
        {/* Section Header - Fully Responsive & Centered */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 } }}>
            <Chip
              label="TESTIMONIALS"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem", lg: "0.7rem" },
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
              What Our Clients Say
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem", xl: "1rem" },
                maxWidth: { xs: "95%", sm: "85%", md: "75%", lg: "65%", xl: "60%" },
                mx: "auto",
                lineHeight: 1.5,
                px: { xs: 1, sm: 0 },
              }}
            >
              Trusted by industry leaders worldwide. Real success stories from our valued clients.
            </Typography>
          </Box>
        </motion.div>

        {/* Testimonials Carousel - Fully Responsive */}
        <Box sx={{ position: "relative", width: "100%" }}>
          {/* Navigation Buttons - Desktop/Tablet */}
          {testimonials.length > itemsPerView && totalPages > 1 && (
            <>
              <IconButton
                onClick={() => {
                  setAutoplay(false);
                  prevSlide();
                  setTimeout(() => setAutoplay(true), 3000);
                }}
                sx={{
                  position: "absolute",
                  left: { md: -20, lg: -24, xl: -28 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor: "background.paper",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  "&:hover": { 
                    bgcolor: "background.paper", 
                    transform: "translateY(-50%) scale(1.08)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                  display: { xs: "none", md: "inline-flex" },
                  width: { md: 40, lg: 44, xl: 48 },
                  height: { md: 40, lg: 44, xl: 48 },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: { md: 20, lg: 22, xl: 24 } }} />
              </IconButton>
              <IconButton
                onClick={() => {
                  setAutoplay(false);
                  nextSlide();
                  setTimeout(() => setAutoplay(true), 3000);
                }}
                sx={{
                  position: "absolute",
                  right: { md: -20, lg: -24, xl: -28 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor: "background.paper",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  "&:hover": { 
                    bgcolor: "background.paper", 
                    transform: "translateY(-50%) scale(1.08)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                  display: { xs: "none", md: "inline-flex" },
                  width: { md: 40, lg: 44, xl: 48 },
                  height: { md: 40, lg: 44, xl: 48 },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: { md: 20, lg: 22, xl: 24 } }} />
              </IconButton>
            </>
          )}

          {/* Cards Container - Fully Responsive Grid */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
              minHeight: { xs: 360, sm: 380, md: 400, lg: 420 },
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "stretch",
                  gap: { xs: 16, sm: 20, md: 24, lg: 28 },
                  width: "100%",
                }}
              >
                {getVisibleTestimonials().map((testimonial, idx) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    style={{
                      flex: "1 1 auto",
                      minWidth: itemsPerView === 1 ? "100%" : itemsPerView === 2 ? "calc(50% - 8px)" : "calc(33.333% - 16px)",
                      maxWidth: itemsPerView === 1 ? "100%" : itemsPerView === 2 ? "calc(50% - 8px)" : "calc(33.333% - 16px)",
                      display: "flex",
                    }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: { xs: "1rem", sm: "1.125rem", md: "1.25rem", lg: "1.375rem" },
                        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        bgcolor: "background.paper",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "visible",
                        "&:hover": {
                          transform: isDesktop ? "translateY(-8px)" : "translateY(-4px)",
                          boxShadow: isDesktop ? `0 24px 48px -16px ${alpha(theme.palette.common.black, 0.2)}` : 
                                     `0 16px 32px -12px ${alpha(theme.palette.common.black, 0.15)}`,
                          borderColor: alpha(theme.palette.primary.main, 0.25),
                        },
                      }}
                    >
                      <CardContent sx={{ 
                        p: { xs: 1.75, sm: 2, md: 2.5, lg: 3 },
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}>
                        {/* Quote Icon */}
                        <FormatQuoteIcon
                          sx={{
                            fontSize: { xs: 32, sm: 36, md: 40, lg: 44 },
                            color: alpha(theme.palette.primary.main, 0.12),
                            mb: { xs: 1.5, sm: 1.75, md: 2 },
                          }}
                        />

                        {/* Rating */}
                        <Rating
                          value={testimonial.rating}
                          readOnly
                          size={isMobile ? "small" : "medium"}
                          sx={{ mb: { xs: 1.5, sm: 1.75, md: 2 } }}
                        />

                        {/* Content */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                            lineHeight: 1.6,
                            color: "text.secondary",
                            mb: { xs: 2, sm: 2.5, md: 3 },
                            fontStyle: "italic",
                            minHeight: { xs: 80, sm: 90, md: 100, lg: 110 },
                            flex: 1,
                          }}
                        >
                          "{testimonial.content}"
                        </Typography>

                        {/* Author */}
                        <Stack 
                          direction="row" 
                          spacing={{ xs: 1.5, sm: 2 }} 
                          alignItems="center" 
                          sx={{ mt: "auto" }}
                        >
                          <Avatar
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            sx={{
                              width: { xs: 44, sm: 48, md: 52, lg: 56 },
                              height: { xs: 44, sm: 48, md: 52, lg: 56 },
                              borderRadius: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                                color: "text.primary",
                                lineHeight: 1.3,
                                mb: 0.25,
                              }}
                            >
                              {testimonial.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                                letterSpacing: "0.02em",
                              }}
                            >
                              {testimonial.role}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Company Badge */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: { xs: 12, sm: 14, md: 16 },
                            right: { xs: 12, sm: 14, md: 16 },
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            label={testimonial.company}
                            size="small"
                            sx={{
                              fontSize: { xs: "0.45rem", sm: "0.5rem", md: "0.55rem" },
                              height: { xs: 18, sm: 20, md: 22 },
                              bgcolor: alpha(theme.palette.primary.main, 0.06),
                              color: theme.palette.primary.main,
                              borderRadius: "0.625rem",
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Dots Indicator & Controls - Fully Responsive */}
          {testimonials.length > itemsPerView && totalPages > 1 && (
            <Stack
              direction="row"
              spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: { xs: 3, sm: 4, md: 5, lg: 6 }, width: "100%" }}
            >
              {/* Mobile Previous Button */}
              <IconButton
                onClick={() => {
                  setAutoplay(false);
                  prevSlide();
                  setTimeout(() => setAutoplay(true), 3000);
                }}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  p: 0.75,
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  "&:hover": { 
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>

              {/* Dot Indicators */}
              <Stack direction="row" spacing={{ xs: 1, sm: 1.25, md: 1.5 }} alignItems="center">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => {
                      setAutoplay(false);
                      goToPage(idx);
                      setTimeout(() => setAutoplay(true), 3000);
                    }}
                    sx={{
                      width: currentPage === idx 
                        ? { xs: 28, sm: 32, md: 36, lg: 40 } 
                        : { xs: 8, sm: 9, md: 10, lg: 12 },
                      height: { xs: 8, sm: 9, md: 10, lg: 12 },
                      borderRadius: { xs: "6px", sm: "8px" },
                      bgcolor: currentPage === idx
                        ? theme.palette.primary.main
                        : alpha(theme.palette.text.disabled, 0.25),
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: currentPage === idx
                          ? theme.palette.primary.dark
                          : alpha(theme.palette.primary.main, 0.5),
                        transform: "scale(1.2)",
                      },
                    }}
                  />
                ))}
              </Stack>

              {/* Mobile Next Button */}
              <IconButton
                onClick={() => {
                  setAutoplay(false);
                  nextSlide();
                  setTimeout(() => setAutoplay(true), 3000);
                }}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  p: 0.75,
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  "&:hover": { 
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronRightIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>

              {/* Autoplay Toggle Button - Desktop */}
              <Tooltip title={isPaused ? "Play" : "Pause"} arrow>
                <IconButton
                  onClick={toggleAutoplay}
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    ml: 2,
                    width: { md: 36, lg: 40 },
                    height: { md: 36, lg: 40 },
                    "&:hover": { 
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {isPaused ? (
                    <PlayArrowIcon sx={{ fontSize: { md: 18, lg: 20 } }} />
                  ) : (
                    <PauseIcon sx={{ fontSize: { md: 18, lg: 20 } }} />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Box>

        {/* Stats Row - Fully Responsive & Centered */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}
            justifyContent="center"
            alignItems="center"
            sx={{
              mt: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 },
              pt: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "500+", label: "Happy Clients", icon: "😊" },
              { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
              { value: "4.9", label: "Average Rating", icon: "🌟" },
            ].map((stat, idx) => (
              <Stack 
                key={idx} 
                direction="row" 
                spacing={{ xs: 1, sm: 1.5, md: 2 }} 
                alignItems="baseline"
                sx={{
                  px: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                  py: { xs: 0.75, sm: 0.875, md: 1 },
                  borderRadius: "2rem",
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography 
                  variant="caption"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  }}
                >
                  {stat.icon}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem", lg: "1.5rem" }, 
                    fontWeight: 800, 
                    color: "primary.main",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem", lg: "0.8rem" }, 
                    color: "text.secondary",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {stat.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Testimonials;