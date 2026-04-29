// components/Testimonials.jsx - Fully Responsive with Single Row Layout
import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Rating,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Ops Lead, Metro Logistics",
    content:
      "AMS has fundamentally transformed our maintenance efficiency. We've seen a 30% reduction in downtime since launch.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Anita Sharma",
    role: "Facility Head, Apex Corp",
    content:
      "The mobile interface is flawless. Our field staff adopted it instantly—no training required. Total game changer.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Vikram Mehta",
    role: "CTO, Innovate Solutions",
    content:
      "The predictive analytics feature has saved us over ₹15L in maintenance costs. The ROI has been exceptional.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Priya Nair",
    role: "Operations Director, Global Industries",
    content:
      "Best asset management platform we've used. The team loves the intuitive interface and real-time reporting capabilities.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

const Testimonials = () => {
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
      component="section"
      sx={{
        py: { xs: 6, sm: 8, md: 10, lg: 12, xl: 14 },
        bgcolor: "#fafbfc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "-5%",
          width: { xs: "60%", sm: "50%", md: "40%", lg: "30%" },
          height: { xs: "60%", sm: "50%", md: "40%", lg: "30%" },
          background: "radial-gradient(circle, rgba(26,74,107,0.03) 0%, rgba(26,74,107,0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: { xs: "60%", sm: "50%", md: "40%", lg: "30%" },
          height: { xs: "60%", sm: "50%", md: "40%", lg: "30%" },
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
              variant="overline"
              sx={{
                color: "#1a4a6b",
                fontWeight: 600,
                fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem", lg: "0.7rem" },
                letterSpacing: "0.1em",
                mb: { xs: 0.75, sm: 1, md: 1.25 },
                display: "block",
              }}
            >
              CLIENT TESTIMONIALS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { 
                  xs: "1.5rem", 
                  sm: "1.8rem", 
                  md: "2rem", 
                  lg: "2.2rem", 
                  xl: "2.5rem" 
                },
                fontWeight: 700,
                mb: { xs: 1, sm: 1.25, md: 1.5 },
                letterSpacing: "-0.02em",
                color: "#0f172a",
                px: { xs: 2, sm: 0 },
              }}
            >
              Trusted by Industry Leaders
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                maxWidth: { xs: "90%", sm: "80%", md: "70%", lg: "600px" },
                mx: "auto",
              }}
            >
              Hear what our clients say about their experience with AMS
            </Typography>
          </Box>
        </motion.div>

        {/* Testimonials Cards in Single Row - Fully Responsive */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: { xs: 2.5, sm: 3, md: 3.5, lg: 4, xl: 5 },
              justifyContent: "center",
              alignItems: { xs: "center", lg: "stretch" },
              maxWidth: "1600px",
              mx: "auto",
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  flex: 1,
                  width: "100%",
                  minWidth: { xs: "100%", sm: "100%", md: "100%", lg: "auto" },
                  maxWidth: { xs: "100%", sm: "500px", md: "550px", lg: "none" },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                    borderRadius: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" },
                    border: "1px solid",
                    borderColor: alpha("#0f172a", 0.06),
                    boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)",
                    height: "100%",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                      background: "linear-gradient(90deg, #1a4a6b, #3d8bb8)",
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover": {
                      transform: { xs: "translateY(-4px)", lg: "translateY(-8px)" },
                      boxShadow: "0 20px 30px -12px rgba(0,0,0,0.12)",
                      borderColor: alpha("#1a4a6b", 0.2),
                      "&::before": {
                        transform: "scaleX(1)",
                      },
                    },
                  }}
                >
                  {/* Quote Icon with animation */}
                  <Box sx={{ mb: { xs: 1.5, sm: 2, md: 2.5, lg: 3 } }}>
                    <motion.div
                      initial={{ rotate: 0, opacity: 0.5 }}
                      whileInView={{ rotate: 180, opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                    >
                      <FormatQuoteIcon
                        sx={{
                          fontSize: { xs: 24, sm: 28, md: 32, lg: 36 },
                          color: alpha("#1a4a6b", 0.25),
                          transform: "rotate(180deg)",
                        }}
                      />
                    </motion.div>
                  </Box>

                  {/* Rating with stars */}
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    icon={<StarIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18, lg: 20 } }} />}
                    sx={{ 
                      mb: { xs: 1.5, sm: 2, md: 2.5, lg: 3 }, 
                      color: "#f59e0b",
                      "& .MuiRating-iconFilled": {
                        color: "#f59e0b",
                      },
                    }}
                  />

                  {/* Content */}
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "0.95rem" },
                      fontWeight: 500,
                      lineHeight: 1.6,
                      mb: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                      color: "#334155",
                      fontStyle: "italic",
                      flex: 1,
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>

                  {/* Author Section */}
                  <Stack 
                    direction="row" 
                    spacing={{ xs: 1.5, sm: 2, md: 2.5 }} 
                    alignItems="center"
                  >
                    <Avatar
                      src={testimonial.avatar}
                      sx={{
                        width: { xs: 44, sm: 48, md: 52, lg: 56 },
                        height: { xs: 44, sm: 48, md: 52, lg: 56 },
                        borderRadius: "1rem",
                        border: "2px solid",
                        borderColor: alpha("#1a4a6b", 0.1),
                        bgcolor: "#f1f5f9",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          borderColor: alpha("#1a4a6b", 0.3),
                        },
                      }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "0.95rem" },
                          color: "#0f172a",
                          mb: 0.25,
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#1a4a6b",
                          fontWeight: 600,
                          fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem", lg: "0.7rem" },
                          letterSpacing: "0.03em",
                          display: "block",
                        }}
                      >
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Trust Indicators with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}
            justifyContent="center"
            alignItems="center"
            sx={{
              mt: { xs: 5, sm: 6, md: 7, lg: 8, xl: 10 },
              pt: { xs: 3, sm: 4, md: 5 },
              borderTop: "1px solid",
              borderColor: alpha("#0f172a", 0.06),
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "500+", label: "Happy Clients", icon: "⭐" },
              { value: "98%", label: "Satisfaction Rate", icon: "😊" },
              { value: "4.9", label: "Average Rating", icon: "★" },
              { value: "30%", label: "Avg. Efficiency Gain", icon: "📈" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Stack 
                  direction="row" 
                  spacing={{ xs: 1, sm: 1.5 }} 
                  alignItems="center"
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: "2rem",
                    bgcolor: alpha("#1a4a6b", 0.02),
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: alpha("#1a4a6b", 0.06),
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ 
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem", lg: "1.2rem" }, 
                      color: "#1a4a6b" 
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ 
                      fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem", lg: "0.75rem" }, 
                      color: "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Stack>
              </motion.div>
            ))}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Testimonials;