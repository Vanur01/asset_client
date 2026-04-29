// components/UserRoles.jsx - Ultra Minimal Design with Responsive Row Layout
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
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import EngineeringIcon from "@mui/icons-material/Engineering";
import TouchAppIcon from "@mui/icons-material/TouchApp";

const roles = [
  {
    title: "Executive",
    description: "Full system governance. Global oversight, multi-tenant billing, and strategic data exports.",
    icon: <SettingsSuggestIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }} />,
    focus: "Governance",
    color: "#1a4a6b",
  },
  {
    title: "Manager",
    description: "Operational excellence. Regional asset management, team leading, and performance tracking.",
    icon: <EngineeringIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }} />,
    focus: "Operations",
    color: "#2c6b94",
  },
  {
    title: "Technician",
    description: "Execution focus. Direct field inspections, issue reporting, and real-time task completion.",
    icon: <TouchAppIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }} />,
    focus: "Field Work",
    color: "#3d8bb8",
  },
];

const UserRoles = () => {
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
      id="roles"
      component="section"
      sx={{
        py: { xs: 6, sm: 8, md: 10, lg: 12 },
        bgcolor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
          height: { xs: "50%", sm: "60%", md: "70%" },
          background: "radial-gradient(circle, rgba(26,74,107,0.02) 0%, rgba(26,74,107,0) 70%)",
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
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            textAlign: "center", 
            mb: { xs: 5, sm: 6, md: 7, lg: 8 }
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
              }}
            >
              ROLES
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
                fontWeight: 600,
                color: "#0f172a",
                px: { xs: 2, sm: 0 },
              }}
            >
              Designed for Every Tier
            </Typography>
          </Box>
        </motion.div>

        {/* Cards in a single row - fully responsive */}
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
              gap: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
              justifyContent: "center",
              alignItems: { xs: "center", md: "stretch" },
              maxWidth: "1200px",
              mx: "auto",
            }}
          >
            {roles.map((role, index) => (
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
                    p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                    borderRadius: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    border: `1px solid ${alpha("#0f172a", 0.06)}`,
                    bgcolor: "#ffffff",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: `linear-gradient(90deg, ${role.color}, ${alpha(role.color, 0.6)})`,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover": {
                      transform: { xs: "none", sm: "translateY(-4px)", md: "translateY(-6px)" },
                      boxShadow: { 
                        xs: "none", 
                        sm: `0 12px 24px -12px ${alpha(role.color, 0.2)}`,
                        md: `0 20px 30px -12px ${alpha(role.color, 0.25)}`
                      },
                      borderColor: { sm: alpha(role.color, 0.2), md: alpha(role.color, 0.3) },
                      "&::before": {
                        transform: "scaleX(1)",
                      },
                    },
                  }}
                >
                  {/* Icon and Title Row */}
                  <Stack 
                    direction="row" 
                    spacing={{ xs: 1.5, sm: 2, md: 2.5 }} 
                    alignItems="center" 
                    sx={{ mb: { xs: 1.5, sm: 2, md: 2.5 } }}
                  >
                    <Box
                      sx={{
                        width: { xs: 34, sm: 38, md: 42, lg: 46 },
                        height: { xs: 34, sm: 38, md: 42, lg: 46 },
                        borderRadius: { xs: "0.625rem", sm: "0.75rem", md: "0.875rem" },
                        bgcolor: alpha(role.color, 0.08),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: role.color,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: { xs: "none", sm: "scale(1.05)" },
                          bgcolor: alpha(role.color, 0.12),
                        },
                      }}
                    >
                      {role.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      sx={{ 
                        fontSize: { 
                          xs: "1.1rem", 
                          sm: "1.2rem", 
                          md: "1.3rem", 
                          lg: "1.4rem" 
                        },
                        color: "#0f172a",
                      }}
                    >
                      {role.title}
                    </Typography>
                  </Stack>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                      lineHeight: 1.6,
                      mb: { xs: 1.5, sm: 2, md: 2.5 },
                    }}
                  >
                    {role.description}
                  </Typography>

                  {/* Focus Badge */}
                  <Box
                    sx={{
                      display: "inline-block",
                      px: { xs: 1.25, sm: 1.5, md: 1.75 },
                      py: { xs: 0.5, sm: 0.6, md: 0.75 },
                      bgcolor: alpha(role.color, 0.06),
                      borderRadius: "full",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: alpha(role.color, 0.12),
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                        fontWeight: 500,
                        color: role.color,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {role.focus}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UserRoles;