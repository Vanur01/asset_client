// components/Contact.jsx - Both Cards in Same Row (Side by Side)
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert("Thank you! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

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
      id="contact"
      component="section"
      sx={{
        py: { xs: 6, sm: 8, md: 10, lg: 12 },
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
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp}>
            <Box sx={{ 
              textAlign: "center", 
              mb: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 }
            }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#1a4a6b",
                  fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem", lg: "0.7rem", xl: "0.75rem" },
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  mb: { xs: 0.75, sm: 1, md: 1.25 },
                  display: "block",
                }}
              >
                CONTACT US
              </Typography>
              <Typography
                variant="h3"
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
                  color: "#0f172a",
                  px: { xs: 2, sm: 0 },
                }}
              >
                Let's Talk
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem", xl: "0.95rem" },
                  maxWidth: { xs: "90%", sm: "80%", md: "70%", lg: "600px", xl: "700px" },
                  mx: "auto",
                }}
              >
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Typography>
            </Box>
          </motion.div>

          {/* Cards in Same Row - Side by Side Layout */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, sm: 3.5, md: 4, lg: 5, xl: 6 },
              justifyContent: "center",
              alignItems: { xs: "center", md: "stretch" },
              maxWidth: "1600px",
              mx: "auto",
            }}
          >
            {/* Contact Information Card */}
            <motion.div
              variants={fadeInUp}
              style={{
                flex: 1,
                width: "100%",
                minWidth: 0, // Prevents overflow issues
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3, md: 3.5, lg: 4, xl: 4.5 },
                  borderRadius: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem", xl: "2.25rem" },
                  border: `1px solid ${alpha("#0f172a", 0.06)}`,
                  bgcolor: "#ffffff",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: { xs: "none", md: "translateY(-4px)", lg: "translateY(-6px)" },
                    boxShadow: { xs: "none", md: "0 20px 30px -12px rgba(0,0,0,0.1)" },
                    borderColor: { md: alpha("#1a4a6b", 0.15) },
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem", lg: "1.5rem", xl: "1.6rem" },
                    fontWeight: 600,
                    mb: { xs: 1.5, sm: 2, md: 2.5 },
                    color: "#0f172a",
                  }}
                >
                  Get in Touch
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                    mb: { xs: 2.5, sm: 3, md: 3.5 },
                    lineHeight: 1.6,
                  }}
                >
                  Our team is here to help you with any questions about our platform, pricing, or implementation.
                </Typography>

                <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                  {/* Address */}
                  <motion.div whileHover={!isMobile ? { x: 5 } : {}}>
                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2, md: 2.5 }} alignItems="flex-start">
                      <Box
                        sx={{
                          width: { xs: 36, sm: 40, md: 44, lg: 48 },
                          height: { xs: 36, sm: 40, md: 44, lg: 48 },
                          borderRadius: "0.75rem",
                          bgcolor: alpha("#1a4a6b", 0.08),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <LocationOnIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 }, color: "#1a4a6b" }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                            color: "#0f172a",
                            mb: 0.25,
                          }}
                        >
                          Visit Us
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem", lg: "0.85rem" },
                            color: "#64748b",
                            lineHeight: 1.5,
                          }}
                        >
                          Tech Park, Sector 62<br />
                          Noida, Uttar Pradesh<br />
                          India - 201301
                        </Typography>
                      </Box>
                    </Stack>
                  </motion.div>

                  {/* Phone */}
                  <motion.div whileHover={!isMobile ? { x: 5 } : {}}>
                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2, md: 2.5 }} alignItems="center">
                      <Box
                        sx={{
                          width: { xs: 36, sm: 40, md: 44, lg: 48 },
                          height: { xs: 36, sm: 40, md: 44, lg: 48 },
                          borderRadius: "0.75rem",
                          bgcolor: alpha("#1a4a6b", 0.08),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <PhoneIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 }, color: "#1a4a6b" }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                            color: "#0f172a",
                            mb: 0.25,
                          }}
                        >
                          Call Us
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem", lg: "0.85rem" },
                            color: "#64748b",
                          }}
                        >
                          +91 120 456 7890<br />
                          Mon-Fri, 9 AM - 6 PM IST
                        </Typography>
                      </Box>
                    </Stack>
                  </motion.div>

                  {/* Email */}
                  <motion.div whileHover={!isMobile ? { x: 5 } : {}}>
                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2, md: 2.5 }} alignItems="center">
                      <Box
                        sx={{
                          width: { xs: 36, sm: 40, md: 44, lg: 48 },
                          height: { xs: 36, sm: 40, md: 44, lg: 48 },
                          borderRadius: "0.75rem",
                          bgcolor: alpha("#1a4a6b", 0.08),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <EmailIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 }, color: "#1a4a6b" }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                            color: "#0f172a",
                            mb: 0.25,
                          }}
                        >
                          Email Us
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem", lg: "0.85rem" },
                            color: "#64748b",
                          }}
                        >
                          support@assetflow.com<br />
                          sales@assetflow.com
                        </Typography>
                      </Box>
                    </Stack>
                  </motion.div>
                </Stack>

                {/* Business Hours */}
                <Box
                  sx={{
                    mt: { xs: 3, sm: 3.5, md: 4, lg: 4.5 },
                    pt: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                    borderTop: "1px solid",
                    borderColor: alpha("#0f172a", 0.06),
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem", lg: "0.75rem" },
                      color: "#64748b",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    🚀 Average response time: &lt; 24 hours
                  </Typography>
                </Box>
              </Paper>
            </motion.div>

            {/* Contact Form Card */}
            <motion.div
              variants={fadeInUp}
              style={{
                flex: 1,
                width: "100%",
                minWidth: 0, // Prevents overflow issues
              }}
            >
              <Paper
                elevation={0}
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: { xs: 2.5, sm: 3, md: 3.5, lg: 4, xl: 4.5 },
                  borderRadius: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem", xl: "2.25rem" },
                  border: `1px solid ${alpha("#0f172a", 0.06)}`,
                  bgcolor: "#ffffff",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: { xs: "none", md: "translateY(-4px)", lg: "translateY(-6px)" },
                    boxShadow: { xs: "none", md: "0 20px 30px -12px rgba(0,0,0,0.08)" },
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem", lg: "1.5rem", xl: "1.6rem" },
                    fontWeight: 600,
                    mb: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                    color: "#0f172a",
                  }}
                >
                  Send us a Message
                </Typography>

                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    mb: { xs: 1.5, sm: 2, md: 2.5 },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }
                    },
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    mb: { xs: 1.5, sm: 2, md: 2.5 },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }
                    },
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={isMobile ? 4 : isTablet ? 5 : 6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  size="small"
                  sx={{ 
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }
                    },
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }
                    }
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  endIcon={!isSubmitting && <SendIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />}
                  sx={{
                    py: { xs: 1, sm: 1.125, md: 1.25, lg: 1.5 },
                    borderRadius: { xs: "0.75rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
                    bgcolor: "#1a4a6b",
                    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      bgcolor: "#0d3b56",
                      transform: "translateY(-2px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                {/* Form assurance text */}
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: { xs: 1.5, sm: 2, md: 2.5 },
                    fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                    color: "#94a3b8",
                  }}
                >
                  We'll never share your information. Promise. ✨
                </Typography>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Contact;