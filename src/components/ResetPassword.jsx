// components/ResetPassword.jsx - Complete with API Integration

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Avatar,
  Stack,
  Link,
  useTheme,
  alpha,
  Alert,
  Snackbar,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContexts";
import Navbar from "../pages/landing/Navbar";

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenError, setTokenError] = useState(false);

  // Get token from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    
    if (!tokenParam) {
      setTokenError(true);
      setErrors({ general: "Invalid or missing reset token. Please request a new password reset link." });
    } else {
      setToken(tokenParam);
    }
  }, [location]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("One number");
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setErrors({ general: "Invalid reset token. Please request a new password reset link." });
      setSnackbarOpen(true);
      return;
    }

    const newErrors = {};

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors.join(", ");
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await resetPassword(token, formData.password, formData.confirmPassword);
      
      if (result.success) {
        setSubmitted(true);
      } else {
        setErrors({ general: result.error });
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const strengthScore = getPasswordStrength();
  const strengthText = () => {
    if (strengthScore <= 2) return { text: "Weak", color: "#ef4444" };
    if (strengthScore <= 4) return { text: "Medium", color: "#f59e0b" };
    return { text: "Strong", color: "#10b981" };
  };

  // Show error if token is missing
  if (tokenError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f8fafc",
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
              p: { xs: 2.5, sm: 3, md: 4 },
              textAlign: "center",
            }}
          >
            <ErrorIcon sx={{ fontSize: 64, color: "#ef4444", mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Invalid Reset Link
            </Typography>
            <Typography sx={{ mb: 3, color: "#64748b" }}>
              {errors.general || "The password reset link is invalid or has expired."}
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
                "&:hover": { bgcolor: "#003350" },
              }}
            >
              Back to Login
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

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

      {/* Main Content */}
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
          <Box
            sx={{
              p: { xs: 2.5, sm: 3, md: 4 },
              bgcolor: "white",
            }}
          >
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
                <LockResetIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: "#1a4a6b" }} />
              </Avatar>
              <Typography
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                  fontWeight: 700,
                  color: "#0f172a",
                  mb: 1,
                }}
              >
                Reset Password
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                  color: "#64748b",
                  maxWidth: "320px",
                  mx: "auto",
                }}
              >
                Please create a new secure password for your account.
              </Typography>
            </Box>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  {/* New Password Field */}
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
                      New Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a new password"
                      value={formData.password}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!errors.password}
                      disabled={loading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                              sx={{ p: 0.5 }}
                              disabled={loading}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                              ) : (
                                <VisibilityIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fafbfc",
                          borderRadius: "0.5rem",
                          "& fieldset": {
                            borderColor: errors.password ? "#ef4444" : "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: errors.password ? "#ef4444" : alpha("#1a4a6b", 0.3),
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: errors.password ? "#ef4444" : "#1a4a6b",
                            borderWidth: 1,
                          },
                        },
                        "& .MuiInputBase-input": {
                          py: { xs: 1.2, sm: 1.3 },
                          fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        },
                      }}
                    />
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Box
                            sx={{
                              flex: 1,
                              height: 3,
                              bgcolor: alpha("#e2e8f0", 0.5),
                              borderRadius: "full",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                width: `${(strengthScore / 5) * 100}%`,
                                height: "100%",
                                bgcolor: strengthText().color,
                                transition: "width 0.3s ease",
                              }}
                            />
                          </Box>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.6rem", sm: "0.65rem" },
                              color: strengthText().color,
                              fontWeight: 500,
                            }}
                          >
                            {strengthText().text}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.6rem", sm: "0.65rem" },
                            color: "#64748b",
                          }}
                        >
                          Password must contain at least 8 characters, one uppercase, one lowercase, and one number
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Confirm Password Field */}
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
                      Confirm Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!errors.confirmPassword}
                      disabled={loading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              size="small"
                              sx={{ p: 0.5 }}
                              disabled={loading}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOffIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                              ) : (
                                <VisibilityIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fafbfc",
                          borderRadius: "0.5rem",
                          "& fieldset": {
                            borderColor: errors.confirmPassword ? "#ef4444" : "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: errors.confirmPassword ? "#ef4444" : alpha("#1a4a6b", 0.3),
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: errors.confirmPassword ? "#ef4444" : "#1a4a6b",
                            borderWidth: 1,
                          },
                        },
                        "& .MuiInputBase-input": {
                          py: { xs: 1.2, sm: 1.3 },
                          fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        },
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
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
                      "Reset Password"
                    )}
                  </Button>
                </Stack>
              </form>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <CheckCircleIcon
                  sx={{
                    fontSize: { xs: 56, sm: 64 },
                    color: "#10b981",
                    mb: 2,
                  }}
                />
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: "0.5rem",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    "& .MuiAlert-message": {
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    },
                  }}
                >
                  Password reset successful!
                </Alert>
                <Typography
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    color: "#64748b",
                    mb: 3,
                  }}
                >
                  Your password has been successfully reset. You can now login with your new password.
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
                    "&:hover": {
                      bgcolor: "#003350",
                    },
                  }}
                >
                  Go to Login
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
                  Need help?{" "}
                  <Link
                    href="#"
                    sx={{
                      color: "#1a4a6b",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Contact Support
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
          {errors.password || errors.confirmPassword || errors.general}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPassword;