// components/ForgotPassword.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Stack,
  Link,
  useTheme,
  alpha,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContexts";
import Navbar from "../pages/landing/Navbar";

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (emailError) {
      setEmailError(validateEmail(newEmail));
    }
    if (error) {
      setError("");
      setEmailError("");
      setSnackbarOpen(false);
    }
  };

  // UPDATED: Shows field-level error + snackbar when email not found
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      setError(validationError);
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setError("");
    setEmailError("");

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setSuccessMessage(
          result.message || "Password reset link sent to your email."
        );
        setSubmitted(true);
      } else {
        // Show error on the field (red highlight) AND in the snackbar
        const errorMsg =
          result.error || "Unable to process request. Please try again.";
        setEmailError(errorMsg);
        setError(errorMsg);
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMsg = "Unable to process request. Please try again later.";
      setError(errorMsg);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => navigate("/login");

  const handleResendEmail = () => {
    setSubmitted(false);
    setSuccessMessage("");
    setEmail("");
    setEmailError("");
    setError("");
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8fafc",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 1.5, sm: 2, md: 3 },
          mt: { xs: 7, sm: 8, md: 9 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: { xs: "100%", sm: 480, md: 520 },
            width: "100%",
            borderRadius: { xs: "1rem", sm: "1.25rem" },
            overflow: "hidden",
            boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 }, bgcolor: "white" }}>
            <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
              <Avatar
                sx={{
                  bgcolor: alpha("#1a4a6b", 0.1),
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  mx: "auto",
                  mb: 2,
                }}
              >
                <EmailIcon
                  sx={{ fontSize: { xs: 24, sm: 28 }, color: "#1a4a6b" }}
                />
              </Avatar>
              <Typography
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                  fontWeight: 700,
                  color: "#0f172a",
                  mb: 1,
                }}
              >
                Forgot Password?
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                  color: "#64748b",
                  maxWidth: "320px",
                  mx: "auto",
                }}
              >
                Enter your email address and we'll send you a link to reset
                your password.
              </Typography>
            </Box>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.55rem", sm: "0.6rem" },
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        display: "block",
                        mb: 0.75,
                      }}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={handleEmailChange}
                      variant="outlined"
                      required
                      error={!!emailError}
                      helperText={emailError}
                      disabled={loading}
                      autoFocus
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fafbfc",
                          borderRadius: "0.5rem",
                          "& fieldset": {
                            borderColor: emailError ? "#ef4444" : "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: emailError
                              ? "#ef4444"
                              : alpha("#1a4a6b", 0.3),
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: emailError ? "#ef4444" : "#1a4a6b",
                            borderWidth: 1,
                          },
                        },
                        "& .MuiInputBase-input": {
                          py: { xs: 1.2, sm: 1.3 },
                          fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: { xs: "0.65rem", sm: "0.7rem" },
                          marginLeft: 0,
                          color: "#ef4444",
                        },
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    endIcon={
                      !loading && (
                        <SendIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                      )
                    }
                    sx={{
                      py: { xs: 1, sm: 1.2 },
                      bgcolor: "#1a4a6b",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      boxShadow: "0 4px 12px rgba(26,74,107,0.2)",
                      "&:hover": {
                        bgcolor: "#003350",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                      "&.Mui-disabled": {
                        bgcolor: alpha("#1a4a6b", 0.6),
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </Stack>
              </form>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <CheckCircleIcon
                  sx={{ fontSize: { xs: 56, sm: 64 }, color: "#10b981", mb: 2 }}
                />
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: "0.5rem",
                    "& .MuiAlert-message": {
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    },
                  }}
                >
                  {successMessage}
                </Alert>
                <Typography
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    color: "#64748b",
                    mb: 2,
                  }}
                >
                  We've sent a password reset link to <strong>{email}</strong>
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.7rem" },
                    color: "#94a3b8",
                    mb: 3,
                  }}
                >
                  Didn't receive the email? Check your spam folder or{" "}
                  <Link
                    onClick={handleResendEmail}
                    sx={{
                      color: "#1a4a6b",
                      fontWeight: 600,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    try again
                  </Link>
                </Typography>
                <Button
                  onClick={handleBackToLogin}
                  fullWidth
                  variant="contained"
                  sx={{
                    py: { xs: 1, sm: 1.2 },
                    bgcolor: "#1a4a6b",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                    "&:hover": { bgcolor: "#003350" },
                  }}
                >
                  Back to Login
                </Button>
              </Box>
            )}

            {!submitted && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.7rem" },
                    color: "#94a3b8",
                  }}
                >
                  Remember your password?{" "}
                  <Link
                    onClick={handleBackToLogin}
                    sx={{
                      color: "#1a4a6b",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Back to Login
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          icon={<ErrorIcon />}
          sx={{
            width: "100%",
            borderRadius: "0.75rem",
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;