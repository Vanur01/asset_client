// components/TeamManagement/EditMemberModal.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTeam } from "../context/TeamContext";

const statusOptions = [
  { value: "active", label: "Active", color: "#10b981" },
  { value: "inactive", label: "Inactive", color: "#94a3b8" },
  { value: "onLeave", label: "On Leave", color: "#f59e0b" },
];

const EditMemberModal = ({ open, onClose, onSubmit, member, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    roles,
    departments,
    locations,
    fetchRoles,
    fetchDepartments,
    fetchLocations,
  } = useTeam();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: "",
    departmentId: "",
    locationId: "",
    status: "active",
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

  // Populate form when member data is available
  useEffect(() => {
    if (member && !fetchLoading) {
      setFormData({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        email: member.email || "",
        phone: member.phone || "",
        roleId: member.roleId || member.role?._id || member.roleId?._id || "",
        departmentId: member.departmentId || member.department?._id || "",
        locationId: member.locationId || member.location?._id || "",
        status: member.status || "active",
      });
    }
  }, [member, fetchLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.roleId) newErrors.roleId = "Role is required";
    if (!formData.departmentId)
      newErrors.departmentId = "Department is required";
    if (!formData.locationId) newErrors.locationId = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Prepare update data with proper field names
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      roleId: formData.roleId,
      departmentId: formData.departmentId,
      locationId: formData.locationId,
      status: formData.status,
    };

    await onSubmit(member?.id || member?._id, updateData);
  };

  // Helper function to get selected item name
  const getRoleName = (roleId) => {
    const role = roles.find((r) => (r._id || r.id) === roleId);
    return role ? role.name : "";
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find((d) => (d._id || d.id) === deptId);
    return dept ? dept.name : "";
  };

  const getLocationName = (locId) => {
    const loc = locations.find((l) => (l._id || l.id) === locId);
    return loc ? loc.name : "";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
              Edit Team Member
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.65rem" }}
            >
              Update team member information
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
          {fetchError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
              {fetchError}
            </Alert>
          )}

          {fetchLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={40} sx={{ color: "#0d4a5c" }} />
            </Box>
          ) : (
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
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
                  InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  size="small"
                  InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
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
                  InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone Number"
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
                  InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                <TextField
                  fullWidth
                  select
                  name="roleId"
                  label="Role"
                  value={formData.roleId}
                  onChange={handleChange}
                  error={!!errors.roleId}
                  helperText={errors.roleId}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon sx={{ fontSize: "0.9rem" }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" } }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: "0.9rem" }}>
                    Select a role
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem
                      key={role._id || role.id}
                      value={role._id || role.id}
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {role.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                <TextField
                  fullWidth
                  select
                  name="departmentId"
                  label="Department"
                  value={formData.departmentId}
                  onChange={handleChange}
                  error={!!errors.departmentId}
                  helperText={errors.departmentId}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ fontSize: "0.9rem" }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" } }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: "0.9rem" }}>
                    Select a department
                  </MenuItem>
                  {departments.map((dept) => (
                    <MenuItem
                      key={dept._id || dept.id}
                      value={dept._id || dept.id}
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                <TextField
                  fullWidth
                  select
                  name="locationId"
                  label="Location"
                  value={formData.locationId}
                  onChange={handleChange}
                  error={!!errors.locationId}
                  helperText={errors.locationId}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ fontSize: "0.9rem" }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" } }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: "0.9rem" }}>
                    Select a location
                  </MenuItem>
                  {locations.map((loc) => (
                    <MenuItem
                      key={loc._id || loc.id}
                      value={loc._id || loc.id}
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {loc.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} sx={{width:"250px"}}>
                <TextField
                  fullWidth
                  select
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                  size="small"
                  InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" } }}
                >
                  {statusOptions.map((opt) => (
                    <MenuItem
                      key={opt.value}
                      value={opt.value}
                      sx={{ fontSize: "0.9rem" }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: opt.color,
                          }}
                        />
                        {opt.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 2.5 }, pb: 2.5, gap: 1.5 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading || fetchLoading}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              fontSize: "0.7rem",
              py: 0.75,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || fetchLoading}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              backgroundColor: "#0d4a5c",
              fontSize: "0.7rem",
              py: 0.75,
              px: 2.5,
              "&:hover": { backgroundColor: "#0a3a46" },
            }}
          >
            {loading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditMemberModal;
