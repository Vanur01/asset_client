// components/CTA.jsx - Fully Responsive Minimal Version
import React from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Stack, 
  alpha,
  useTheme,
  useMediaQuery 
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const CTA = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, sm: 6, md: 8, lg: 10 },
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "70%" },
          height: { xs: "90%", sm: "80%", md: "70%" },
          background: "radial-gradient(circle, rgba(26,74,107,0.03) 0%, rgba(26,74,107,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <Container 
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #1a4a6b 0%, #003350 100%)",
              borderRadius: { xs: "1.25rem", sm: "1.5rem", md: "2rem", lg: "2.5rem" },
              p: { 
                xs: 2.5, 
                sm: 3.5, 
                md: 4.5, 
                lg: 5.5 
              },
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -50,
                right: -50,
                width: { xs: 150, sm: 200, md: 250, lg: 300 },
                height: { xs: 150, sm: 200, md: 250, lg: 300 },
                background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
                borderRadius: "50%",
                pointerEvents: "none",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -50,
                left: -50,
                width: { xs: 150, sm: 200, md: 250, lg: 300 },
                height: { xs: 150, sm: 200, md: 250, lg: 300 },
                background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
                borderRadius: "50%",
                pointerEvents: "none",
              },
            }}
          >
            {/* Animated floating particles - optional */}
            <Box
              sx={{
                position: "absolute",
                top: "20%",
                left: "10%",
                width: { xs: 4, sm: 6, md: 8 },
                height: { xs: 4, sm: 6, md: 8 },
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                animation: "float 6s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-20px)" },
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "20%",
                right: "10%",
                width: { xs: 3, sm: 5, md: 6 },
                height: { xs: 3, sm: 5, md: 6 },
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: "50%",
                animation: "float 8s ease-in-out infinite reverse",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-15px)" },
                },
              }}
            />

            {/* Main Content */}
            <Typography
              variant="h3"
              sx={{
                fontSize: { 
                  xs: "1.25rem", 
                  sm: "1.5rem", 
                  md: "1.75rem", 
                  lg: "2rem",
                  xl: "2.2rem"
                },
                color: "white",
                fontWeight: 700,
                mb: { xs: 1, sm: 1.25, md: 1.5 },
                letterSpacing: "-0.02em",
                position: "relative",
                zIndex: 1,
                px: { xs: 1, sm: 2 },
              }}
            >
              Ready to Elevate Your Asset Infrastructure?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.85)",
                maxWidth: { xs: "100%", sm: "90%", md: "550px" },
                mx: "auto",
                mb: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                lineHeight: 1.6,
                position: "relative",
                zIndex: 1,
                px: { xs: 1, sm: 2 },
              }}
            >
              Join 500+ enterprises. Start your 14-day free trial today. No credit card required.
            </Typography>

            {/* Button Stack - Fully Responsive */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
              justifyContent="center"
              alignItems="center"
              sx={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <motion.div
                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />}
                  sx={{
                    bgcolor: "white",
                    color: "#1a4a6b",
                    px: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                    py: { xs: 0.875, sm: 1, md: 1.125, lg: 1.25 },
                    borderRadius: { xs: "0.75rem", sm: "1rem", md: "1.125rem" },
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem", lg: "0.85rem" },
                    fontWeight: 600,
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: "160px", md: "180px" },
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      bgcolor: "white", 
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Start Free Trial
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "white",
                    px: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                    py: { xs: 0.875, sm: 1, md: 1.125, lg: 1.25 },
                    borderRadius: { xs: "0.75rem", sm: "1rem", md: "1.125rem" },
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem", lg: "0.85rem" },
                    fontWeight: 500,
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: "160px", md: "180px" },
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      borderColor: "white", 
                      bgcolor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  Contact Sales
                </Button>
              </motion.div>
            </Stack>

            {/* Additional Trust Badge for Mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 2,
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.6rem",
                  }}
                >
                  ⚡ Setup in minutes • 🛡️ Enterprise-grade security • 💳 No credit card required
                </Typography>
              </motion.div>
            )}
          </Box>
        </motion.div>

        {/* Optional: Additional trust indicators for larger screens */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Stack
              direction="row"
              spacing={{ sm: 2, md: 3, lg: 4 }}
              justifyContent="center"
              alignItems="center"
              sx={{
                mt: { sm: 3, md: 4, lg: 5 },
                flexWrap: "wrap",
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                ⚡ Setup in minutes
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                🛡️ Enterprise-grade security
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
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
                  color: "#64748b",
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                🎧 24/7 Support
              </Typography>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default CTA;