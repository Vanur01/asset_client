// pages/admin/ContactInquiries.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  InputAdornment,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Fade,
  Zoom,
  alpha,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Message as MessageIcon,
  Clear as ClearIcon,
  GetApp as ExportIcon,
} from "@mui/icons-material";
import { useContactInquiry } from "../context/InquiryContext";
import { useAuth } from "../context/AuthContexts";

// Modern color palette
const colors = {
  primary: "#0f4c61",
  primaryLight: "#eef2ff",
  success: "#10b981",
  successLight: "#d1fae5",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  error: "#ef4444",
  errorLight: "#fee2e2",
  info: "#3b82f6",
  infoLight: "#dbeafe",
  text: {
    primary: "#111827",
    secondary: "#6b7280",
    tertiary: "#9ca3af",
  },
  border: "#e5e7eb",
  surface: "#ffffff",
  surfaceAlt: "#f9fafb",
};

// Status Chip Component
const StatusChip = ({ date }) => {
  const daysOld = Math.floor(
    (new Date() - new Date(date)) / (1000 * 60 * 60 * 24),
  );
  let status = { label: "New", color: colors.success, bg: colors.successLight };

  if (daysOld > 7) {
    status = { label: "Old", color: colors.warning, bg: colors.warningLight };
  }
  if (daysOld > 30) {
    status = {
      label: "Archived",
      color: colors.text.tertiary,
      bg: alpha(colors.text.tertiary, 0.1),
    };
  }

  return (
    <Chip
      label={status.label}
      size="small"
      sx={{
        bgcolor: status.bg,
        color: status.color,
        fontWeight: 600,
        fontSize: "0.65rem",
        height: 24,
        borderRadius: "16px",
      }}
    />
  );
};

// Delete Confirmation Dialog
const DeleteConfirmDialog = ({ open, onClose, onConfirm, inquiryName }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ p: 2.5, pb: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontSize: "1rem", fontWeight: 700, color: colors.error }}
        >
          Delete Inquiry
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
          Are you sure you want to delete inquiry from "
          <strong>{inquiryName}</strong>"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" size="small">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          size="small"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// View Inquiry Dialog
const ViewInquiryDialog = ({ open, onClose, inquiry }) => {
  if (!inquiry) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, #0f4c61 100%)`,
          p: 2.5,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}
          >
            Inquiry Details
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* Header Info */}
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: colors.primary,
                background: `linear-gradient(135deg, ${colors.primary} 0%, #0f4c61 100%)`,
              }}
            >
              {inquiry.fullName?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: colors.text.primary,
                }}
              >
                {inquiry.fullName}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <StatusChip date={inquiry.createdAt} />
                <Typography
                  variant="caption"
                  sx={{ color: colors.text.tertiary }}
                >
                  ID: {inquiry._id?.slice(-8)}
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Divider />

          {/* Contact Information */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 600,
                color: colors.text.secondary,
                mb: 1.5,
                display: "block",
              }}
            >
              Contact Information
            </Typography>
            <Stack spacing={1.5}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <EmailIcon sx={{ fontSize: 18, color: colors.text.tertiary }} />
                <Typography variant="body2" sx={{ color: colors.text.primary }}>
                  {inquiry.email}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <PhoneIcon sx={{ fontSize: 18, color: colors.text.tertiary }} />
                <Typography variant="body2" sx={{ color: colors.text.primary }}>
                  {inquiry.phone}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <CalendarIcon
                  sx={{ fontSize: 18, color: colors.text.tertiary }}
                />
                <Typography variant="body2" sx={{ color: colors.text.primary }}>
                  Submitted: {new Date(inquiry.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Message */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 600,
                color: colors.text.secondary,
                mb: 1.5,
                display: "block",
              }}
            >
              Message
            </Typography>
            <Paper sx={{ p: 2, bgcolor: colors.surfaceAlt, borderRadius: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: colors.text.secondary, lineHeight: 1.6 }}
              >
                {inquiry.message}
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="outlined" size="small">
          Close
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
          sx={{
            bgcolor: colors.primary,
            "&:hover": { bgcolor: alpha(colors.primary, 0.85) },
          }}
          onClick={() => (window.location.href = `mailto:${inquiry.email}`)}
        >
          Reply via Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Component
export default function ContactInquiries() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { isAuthenticated } = useAuth();
  const {
    inquiries,
    pagination,
    loading,
    error,
    fetchInquiries,
    deleteInquiry,
    fetchInquiryById,
    selectedInquiry,
    clearSelectedInquiry,
    clearError,
  } = useContactInquiry();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [selectedInquiryName, setSelectedInquiryName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries(1, 10);
    }
  }, [isAuthenticated, fetchInquiries]);

  const handlePageChange = (event, value) => {
    fetchInquiries(value, pagination.limit);
  };

  const handleViewInquiry = async (id) => {
    const result = await fetchInquiryById(id);
    if (result.success) {
      setViewDialogOpen(true);
    } else {
      showToast(result.error, "error");
    }
  };

  const handleDeleteClick = (id, name) => {
    setSelectedInquiryId(id);
    setSelectedInquiryName(name);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedInquiryId) {
      const result = await deleteInquiry(selectedInquiryId);
      if (result.success) {
        showToast("Inquiry deleted successfully", "success");
        setDeleteDialogOpen(false);
        setSelectedInquiryId(null);
      } else {
        showToast(result.error, "error");
      }
    }
  };

  const handleRefresh = () => {
    fetchInquiries(pagination.page, pagination.limit);
    showToast("Refreshed successfully", "success");
  };

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Please login to access this page</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.surfaceAlt,
        p: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        spacing={2}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.25rem", sm: "1.35rem", md: "1.5rem" },
              color: colors.text.primary,
            }}
          >
            Contact Inquiries
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: colors.text.secondary, mt: 0.5, display: "block" }}
          >
            Manage customer inquiries and support requests • {pagination.total}{" "}
            total inquiries
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={handleRefresh}
              size="small"
              sx={{
                bgcolor: colors.surface,
                border: `1px solid ${colors.border}`,
              }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, email, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ fontSize: "1rem", color: colors.text.tertiary }}
                />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <ClearIcon sx={{ fontSize: "0.8rem" }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: { fontSize: "0.75rem", borderRadius: 2 },
          }}
        />
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={clearError}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && inquiries.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress sx={{ color: colors.primary }} />
        </Box>
      )}

      {/* Table View */}
      {!loading && filteredInquiries.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${colors.border}`,
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: colors.surfaceAlt }}>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      color: colors.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      color: colors.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Contact
                  </TableCell>
                  {!isMobile && (
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        color: colors.text.secondary,
                        textTransform: "uppercase",
                      }}
                    >
                      Message
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      color: colors.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      color: colors.text.secondary,
                      textTransform: "uppercase",
                    }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInquiries.map((inquiry, idx) => (
                  <TableRow key={inquiry._id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: colors.primaryLight,
                            color: colors.primary,
                            fontSize: "0.75rem",
                          }}
                        >
                          {inquiry.fullName?.charAt(0) || "U"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              color: colors.text.primary,
                            }}
                          >
                            {inquiry.fullName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.65rem",
                              color: colors.text.tertiary,
                            }}
                          >
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.7rem",
                            color: colors.text.secondary,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <EmailIcon sx={{ fontSize: 12 }} /> {inquiry.email}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.7rem",
                            color: colors.text.secondary,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: 12 }} /> {inquiry.phone}
                        </Typography>
                      </Stack>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.75rem",
                            color: colors.text.secondary,
                            maxWidth: 250,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {inquiry.message}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <StatusChip date={inquiry.createdAt} />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewInquiry(inquiry._id)}
                            sx={{ color: colors.info }}
                          >
                            <VisibilityIcon sx={{ fontSize: 18 , color:"#0f4c61" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteClick(inquiry._id, inquiry.fullName)
                            }
                            sx={{ color: colors.error }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{ "& .MuiPaginationItem-root": { borderRadius: 2 } }}
              />
            </Box>
          )}
        </>
      ) : (
        !loading && (
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              py: 8,
              borderRadius: 2,
              border: `1px solid ${colors.border}`,
              bgcolor: colors.surface,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: alpha(colors.primary, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <MessageIcon sx={{ fontSize: 40, color: colors.primary }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: colors.text.primary,
                mb: 1,
              }}
            >
              {searchTerm ? "No matching inquiries" : "No inquiries yet"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.75rem", color: colors.text.secondary }}
            >
              {searchTerm
                ? "Try adjusting your search term"
                : "Customer inquiries will appear here"}
            </Typography>
          </Paper>
        )
      )}

      {/* View Dialog */}
      <ViewInquiryDialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          clearSelectedInquiry();
        }}
        inquiry={selectedInquiry}
      />

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        inquiryName={selectedInquiryName}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: 2, fontSize: "0.75rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
