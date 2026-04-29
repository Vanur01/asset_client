// Main.jsx
import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import Navbar from "./Navbar";
import Hero from "./Home";
import Analytics from "./Analytics";
import Features from "./Features";
import UserRoles from "./Userroles";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import CTA from "./Ctabanner";
import Contact from "./Contact";
import Footer from "./Footer";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1a4a6b",
      light: "#2c6b94",
      dark: "#003350",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#51606f",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: '"Inter", "sans-serif"',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

function Main() {
  const [activeSection, setActiveSection] = useState("home");

  const sections = [
    { id: "home", label: "Home" },
    { id: "analytics", label: "Analytics" },
    { id: "features", label: "Features" },
    { id: "roles", label: "Solutions" },
    { id: "pricing", label: "Pricing" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default" }}>
        <Navbar
          sections={sections}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />
        <Hero scrollToSection={scrollToSection} />
        <Analytics />
        <Features />
        <UserRoles />
        <Pricing />
        <Testimonials />
        <CTA />
        <Contact />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default Main;
