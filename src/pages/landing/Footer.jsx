// components/Footer.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  IconButton,
  Link,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ArrowUpward as ArrowUpIcon,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    company: [
      { name: "About Us", href: "#about" },
      { name: "Services", href: "#services" },
      { name: "Portfolio", href: "#portfolio" },
      { name: "Contact", href: "#contact" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Support Center", href: "#" },
      { name: "Status Page", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Security", href: "#" },
      { name: "Compliance", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: <FacebookIcon />, href: "#", label: "Facebook" },
    { icon: <TwitterIcon />, href: "#", label: "Twitter" },
    { icon: <LinkedInIcon />, href: "#", label: "LinkedIn" },
    { icon: <InstagramIcon />, href: "#", label: "Instagram" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        bgcolor: "#0a1929",
        color: "#e2e8f0",
        overflow: "hidden",
      }}
    >
      {/* Decorative top gradient */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #1a4a6b, #3b82f6, #1a4a6b)",
        }}
      />

      {/* Main Footer Content */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 } }}>
        <Grid
          container
          spacing={{ xs: 3, sm: 4, md: 5 }}
          sx={{
            py: { xs: 4, sm: 5, md: 6, lg: 7 },
            borderBottom: "1px solid",
            borderColor: alpha("#ffffff", 0.08),
          }}
        >
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.25rem", sm: "1.35rem", md: "1.45rem", lg: "1.5rem" },
                  background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: { xs: 1.5, sm: 2 },
                  letterSpacing: "-0.02em",
                }}
              >
                AssetFlow
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                  color: alpha("#ffffff", 0.7),
                  lineHeight: 1.6,
                  mb: { xs: 2, sm: 2.5 },
                  maxWidth: { xs: "100%", md: "90%" },
                }}
              >
                Modern asset management platform designed to help businesses track, manage, and optimize their assets efficiently.
              </Typography>
              
              {/* Contact Info */}
              <Stack spacing={{ xs: 1, sm: 1.25 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocationIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: alpha("#ffffff", 0.5) }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                      color: alpha("#ffffff", 0.6),
                    }}
                  >
                    Tech Park, Sector 62, Noida, India
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PhoneIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: alpha("#ffffff", 0.5) }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                      color: alpha("#ffffff", 0.6),
                    }}
                  >
                    +91 120 456 7890
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <EmailIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: alpha("#ffffff", 0.5) }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                      color: alpha("#ffffff", 0.6),
                    }}
                  >
                    support@assetflow.com
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>

          {/* Links Sections */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#94a3b8",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              Company
            </Typography>
            <Stack spacing={{ xs: 1, sm: 1.25 }}>
              {footerLinks.company.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  underline="none"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                    color: alpha("#ffffff", 0.6),
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#94a3b8",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              Resources
            </Typography>
            <Stack spacing={{ xs: 1, sm: 1.25 }}>
              {footerLinks.resources.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  underline="none"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                    color: alpha("#ffffff", 0.6),
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#94a3b8",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              Legal
            </Typography>
            <Stack spacing={{ xs: 1, sm: 1.25 }}>
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  underline="none"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                    color: alpha("#ffffff", 0.6),
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Newsletter / Social Section */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#94a3b8",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              Follow Us
            </Typography>
            <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  sx={{
                    color: alpha("#ffffff", 0.5),
                    transition: "all 0.2s ease",
                    p: { xs: 0.75, sm: 1 },
                    "&:hover": {
                      color: "#60a5fa",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            py: { xs: 2.5, sm: 3, md: 3.5 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
              color: alpha("#ffffff", 0.5),
              textAlign: "center",
              letterSpacing: "0.03em",
            }}
          >
            © {new Date().getFullYear()} AssetFlow. All rights reserved. Precision Engineered Asset Management.
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Link
              href="#"
              underline="none"
              sx={{
                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                color: alpha("#ffffff", 0.5),
                transition: "color 0.2s ease",
                "&:hover": { color: "#60a5fa" },
              }}
            >
              Privacy
            </Link>
            <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.3), fontSize: "0.6rem" }}>
              •
            </Typography>
            <Link
              href="#"
              underline="none"
              sx={{
                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                color: alpha("#ffffff", 0.5),
                transition: "color 0.2s ease",
                "&:hover": { color: "#60a5fa" },
              }}
            >
              Terms
            </Link>
            <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.3), fontSize: "0.6rem" }}>
              •
            </Typography>
            <Link
              href="#"
              underline="none"
              sx={{
                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                color: alpha("#ffffff", 0.5),
                transition: "color 0.2s ease",
                "&:hover": { color: "#60a5fa" },
              }}
            >
              Cookies
            </Link>
          </Stack>
        </Box>
      </Container>

      {/* Scroll to Top Button */}
      <IconButton
        onClick={scrollToTop}
        aria-label="Scroll to top"
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          bgcolor: "#1a4a6b",
          color: "#ffffff",
          width: { xs: 40, sm: 44, md: 48 },
          height: { xs: 40, sm: 44, md: 48 },
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "#0d3b56",
            transform: "translateY(-2px)",
          },
          zIndex: 1000,
        }}
      >
        <ArrowUpIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />
      </IconButton>
    </Box>
  );
};

export default Footer;