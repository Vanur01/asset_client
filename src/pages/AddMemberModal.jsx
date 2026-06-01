// components/AddMemberModal.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import { useTeam } from "../context/TeamContext";

const C = {
  primary: "#0d4a5c",
  primaryDark: "#0a3a49",
  error: "#ef4444",
  border: "#e5e7eb",
};

export default function AddMemberModal({ open, onClose, onSubmit, loading }) {
  const {
    roles,
    fetchRoles,
    departments,
    fetchDepartments,
    locations,
    fetchLocations,
  } = useTeam();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    roleId: "",
    departmentId: "",
    locationId: "",
    bio: "",
  });

  const [errors, setErrors] = useState({});
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch roles, departments, locations when modal opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setFetchLoading(true);
        setFetchError(null);
        try {
          await Promise.all([
            fetchRoles({ limit: 100 }, true),
            fetchDepartments({ limit: 100 }, true),
            fetchLocations({ limit: 100 }, true),
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
          setFetchError("Failed to load form data. Please try again.");
        } finally {
          setFetchLoading(false);
        }
      };
      fetchData();
    }
  }, [open, fetchRoles, fetchDepartments, fetchLocations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName?.trim())
      newErrors.firstName = "First name is required";
    
    if (!formData.lastName?.trim()) 
      newErrors.lastName = "Last name is required";
    
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.roleId) 
      newErrors.roleId = "Role is required";
    
    if (!formData.departmentId)
      newErrors.departmentId = "Department is required";
    
    if (!formData.locationId) 
      newErrors.locationId = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // Prepare data for API (exclude confirmPassword)
    const submitData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone?.trim() || "",
      roleId: formData.roleId,
      departmentId: formData.departmentId,
      locationId: formData.locationId,
      bio: formData.bio?.trim() || "",
    };

    try {
      const result = await onSubmit(submitData);
      
      if (result?.success) {
        handleClose();
      } else {
        // Handle API validation errors
        if (result?.error) {
          setErrors(prev => ({
            ...prev,
            submit: result.error
          }));
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || "Failed to add team member"
      }));
    }
  };

  const handleClose = () => {
    // Reset all form state
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      roleId: "",
      departmentId: "",
      locationId: "",
      bio: "",
    });
    setErrors({});
    setFetchError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, overflow: "hidden" },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2, px: { xs: 2, sm: 2.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              fontSize={{ xs: "1rem", sm: "1.1rem" }}
            >
              Add New Team Member
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.65rem" }}
            >
              Create a new team member account
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
        {fetchError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
            {fetchError}
          </Alert>
        )}

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
            {errors.submit}
          </Alert>
        )}

        {fetchLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={40} sx={{ color: C.primary }} />
          </Box>
        ) : (
          <Grid container spacing={1.5} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} sx={{width:"250px"}}>
              <TextField
                fullWidth
                required
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ fontSize: "0.9rem" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{width:"250px"}}>
              <TextField
                fullWidth
                required
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{width:"250px"}}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ fontSize: "0.9rem" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{width:"250px"}}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ fontSize: "0.9rem" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{width:"250px"}}>
              <TextField
                fullWidth
                required
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ fontSize: "0.9rem" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{width:"250px"}}>
              <TextField
                fullWidth
                required
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ fontSize: "0.9rem" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{width:"250px"}}>
              <FormControl fullWidth size="small" error={!!errors.roleId} required>
                <InputLabel>Role *</InputLabel>
                <Select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  label="Role *"
                  startAdornment={
                    <InputAdornment position="start">
                      <WorkIcon sx={{ fontSize: "0.9rem", ml: 1 }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="" disabled>
                    Select a role
                  </MenuItem>
                  {roles && roles.length > 0 ? (
                    roles.map((role) => (
                      <MenuItem
                        key={role._id || role.id}
                        value={role._id || role.id}
                      >
                        {role.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No roles available</MenuItem>
                  )}
                </Select>
                {errors.roleId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.roleId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} sx={{width:"250px"}}>
              <FormControl fullWidth size="small" error={!!errors.departmentId} required>
                <InputLabel>Department *</InputLabel>
                <Select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  label="Department *"
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ fontSize: "0.9rem", ml: 1 }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="" disabled>
                    Select a department
                  </MenuItem>
                  {departments && departments.length > 0 ? (
                    departments.map((dept) => (
                      <MenuItem
                        key={dept._id || dept.id}
                        value={dept._id || dept.id}
                      >
                        {dept.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No departments available</MenuItem>
                  )}
                </Select>
                {errors.departmentId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.departmentId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} sx={{width:"250px"}}>
              <FormControl fullWidth size="small" error={!!errors.locationId} required>
                <InputLabel>Location *</InputLabel>
                <Select
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  label="Location *"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ fontSize: "0.9rem", ml: 1 }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="" disabled>
                    Select a location
                  </MenuItem>
                  {locations && locations.length > 0 ? (
                    locations.map((loc) => (
                      <MenuItem
                        key={loc._id || loc.id}
                        value={loc._id || loc.id}
                      >
                        {loc.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No locations available</MenuItem>
                  )}
                </Select>
                {errors.locationId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.locationId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{width:"250px"}}>
              <TextField
                fullWidth
                label="Bio (Optional)"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                multiline
                size="small"
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 2.5 }, pb: 2.5, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading || fetchLoading}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            fontSize: "0.8rem",
            py: 0.75,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || fetchLoading}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            backgroundColor: C.primary,
            fontSize: "0.8rem",
            py: 0.75,
            px: 2.5,
            "&:hover": { backgroundColor: C.primaryDark },
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Add Member"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}