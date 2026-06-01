// pages/RoleManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  alpha,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { useTeam } from "../context/TeamContext";

const C = {
  primary: "#0d4a5c",
  primaryDark: "#0a3a49",
  primaryBg: alpha("#0a3a49", 0.08),
  success: "#10b981",
  successBg: "#ecfdf5",
  error: "#ef4444",
  surface: "#ffffff",
  bg: "#f9fafb",
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  text: { primary: "#111827", secondary: "#6b7280", muted: "#9ca3af" },
};

// ─── Role Modal ───────────────────────────────────────────────────────────────
function RoleModal({ open, onClose, onSubmit, loading, editRole }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        editRole
          ? {
              name: editRole.name || "",
              description: editRole.description || "",
              isActive: editRole.isActive !== false,
            }
          : { name: "", description: "", isActive: true },
      );
      setErrors({});
    }
  }, [editRole, open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Role name is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", border: `1px solid ${C.border}` },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: C.primaryBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldIcon sx={{ fontSize: 18, color: C.primary }} />
          </Box>
          <Typography
            sx={{ fontWeight: 700, fontSize: "1rem", color: C.text.primary }}
          >
            {editRole ? "Edit Role" : "Add New Role"}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: C.text.muted }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.5} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Role Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="e.g. Senior Inspector"
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              "& label": { fontSize: "0.85rem" },
              "& input": { fontSize: "0.85rem" },
            }}
          />
          <TextField
            fullWidth
            size="small"
            label="Description"
            value={form.description}
            multiline
            rows={3}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the responsibilities of this role..."
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              "& label": { fontSize: "0.85rem" },
              "& textarea": { fontSize: "0.85rem" },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
            }
            label={
              <Typography sx={{ fontSize: "0.85rem", color: C.text.secondary }}>
                {form.isActive ? "Active" : "Inactive"}
              </Typography>
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontSize: "0.85rem",
            borderRadius: "10px",
            borderColor: C.border,
            color: C.text.secondary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (validate()) onSubmit(form);
          }}
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            fontSize: "0.85rem",
            borderRadius: "10px",
            bgcolor: C.primary,
            "&:hover": { bgcolor: C.primaryDark },
            minWidth: 100,
          }}
        >
          {loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : editRole ? (
            "Update Role"
          ) : (
            "Create Role"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ open, onClose, onConfirm, loading, item, itemType }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: alpha(C.error, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteIcon sx={{ fontSize: 18, color: C.error }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
            Delete {itemType}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: "0.85rem", color: C.text.secondary }}>
          Are you sure you want to delete{" "}
          <strong>{item?.displayName || item?.name}</strong>? This action cannot
          be undone.
        </Typography>
        {item?.memberCount > 0 && (
          <Alert
            severity="warning"
            sx={{ mt: 1.5, fontSize: "0.8rem", borderRadius: "10px" }}
          >
            This {itemType.toLowerCase()} has {item.memberCount} member(s)
            assigned to it.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontSize: "0.85rem",
            borderRadius: "10px",
            borderColor: C.border,
            color: C.text.secondary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            fontSize: "0.85rem",
            borderRadius: "10px",
            bgcolor: C.error,
            "&:hover": { bgcolor: "#dc2626" },
          }}
        >
          {loading ? <CircularProgress size={16} color="inherit" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RoleManagement() {
  const {
    roles,
    rolesPagination,
    rolesLoading,
    actionLoading,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  } = useTeam();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback(
    (msg, sev = "success") =>
      setToast({ open: true, message: msg, severity: sev }),
    [],
  );

  // Fetch on search/pagination change with debounce — fetchRoles is stable (no deps)
  useEffect(() => {
    const t = setTimeout(() => {
      fetchRoles(
        { search: searchTerm, page: page + 1, limit: rowsPerPage },
        true,
      );
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm, page, rowsPerPage, fetchRoles]);

  const handleSubmit = async (formData) => {
    const result = editRole
      ? await updateRole(editRole._id, formData)
      : await createRole(formData);
    if (result.success) {
      showToast(result.message);
      setModalOpen(false);
      setEditRole(null);
    } else showToast(result.error, "error");
  };

  const handleDelete = async () => {
    const result = await deleteRole(deleteTarget._id);
    if (result.success) {
      showToast(result.message);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    } else showToast(result.error, "error");
  };

  const closeToast = () => setToast((p) => ({ ...p, open: false }));

  const statItems = [
    {
      label: "Total Roles",
      value: rolesPagination.total || roles.length,
      color: C.primary,
      icon: ShieldIcon,
    },
    {
      label: "Active Roles",
      value: roles.filter((r) => r.isActive).length,
      color: C.success,
      icon: CheckCircleIcon,
    },
    {
      label: "Inactive Roles",
      value: roles.filter((r) => !r.isActive).length,
      color: C.text.muted,
      icon: CancelIcon,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: C.bg,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3.5 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                color: C.text.primary,
                letterSpacing: "-0.02em",
                mb: 0.5,
              }}
            >
              Role Management
            </Typography>
            <Typography sx={{ color: C.text.secondary, fontSize: "0.85rem" }}>
              Create and manage custom roles for your team
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditRole(null);
              setModalOpen(true);
            }}
            sx={{
              bgcolor: C.primary,
              "&:hover": { bgcolor: C.primaryDark },
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              px: 2.5,
              py: 0.8,
            }}
          >
            Add Role
          </Button>
        </Box>

        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          {statItems.map((s) => (
            <Card
              key={s.label}
              elevation={0}
              sx={{
                borderRadius: "14px",
                border: `1px solid ${C.border}`,
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: s.color,
                  boxShadow: `0 4px 12px ${alpha(s.color, 0.1)}`,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: C.text.secondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {s.label}
                  </Typography>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "10px",
                      bgcolor: alpha(s.color, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <s.icon sx={{ fontSize: 16, color: s.color }} />
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: C.text.primary,
                  }}
                >
                  {s.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Search */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "14px",
            border: `1px solid ${C.border}`,
            mb: 2.5,
            p: 1.5,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search roles..."
            variant="standard"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: C.text.muted, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: { fontSize: "0.9rem", color: C.text.primary, py: 0.8, px: 1 },
            }}
          />
        </Paper>

        {/* Table */}
        {rolesLoading && !roles.length ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: C.primary }} />
          </Box>
        ) : roles.length === 0 ? (
          <Paper
            sx={{
              textAlign: "center",
              py: 8,
              borderRadius: "14px",
              border: `1px solid ${C.border}`,
            }}
          >
            <ShieldIcon sx={{ fontSize: 48, color: C.text.muted, mb: 1.5 }} />
            <Typography sx={{ color: C.text.secondary, fontSize: "0.9rem" }}>
              No roles found
            </Typography>
            <Button
              onClick={() => setModalOpen(true)}
              sx={{ mt: 2, fontSize: "0.8rem" }}
            >
              Add your first role
            </Button>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              borderRadius: "14px",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: C.bg }}>
                    {[
                      "Role Name",
                      "Description",
                      "Members",
                      "Status",
                      "Created",
                      "Actions",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        align={h === "Actions" ? "center" : "left"}
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          color: C.text.secondary,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          py: 1.8,
                          borderBottom: `1px solid ${C.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow
                      key={role._id}
                      hover
                      sx={{ "&:hover": { bgcolor: alpha(C.primary, 0.02) } }}
                    >
                      <TableCell sx={{ py: 1.8, pl: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "10px",
                              bgcolor: C.primaryBg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ShieldIcon
                              sx={{ fontSize: 16, color: C.primary }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: C.text.primary,
                              }}
                            >
                              {role.displayName || role.name}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "0.7rem", color: C.text.muted }}
                            >
                              ID: {role._id?.slice(-6)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "0.82rem",
                            color: C.text.secondary,
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {role.description || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <PeopleIcon
                            sx={{ fontSize: 14, color: C.text.muted }}
                          />
                          <Typography
                            sx={{ fontSize: "0.85rem", fontWeight: 500 }}
                          >
                            {role.memberCount || 0}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={role.isActive ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            bgcolor: role.isActive
                              ? C.successBg
                              : C.borderLight,
                            color: role.isActive ? C.success : C.text.muted,
                            fontWeight: 500,
                            fontSize: "0.7rem",
                            height: 24,
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{ fontSize: "0.8rem", color: C.text.secondary }}
                        >
                          {new Date(role.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ pr: 2.5 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Edit Role" arrow>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditRole(role);
                                setModalOpen(true);
                              }}
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: "8px",
                                color: C.text.secondary,
                                "&:hover": {
                                  bgcolor: alpha(C.primary, 0.08),
                                  color: C.primary,
                                },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Role" arrow>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setDeleteTarget(role);
                                setDeleteModalOpen(true);
                              }}
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: "8px",
                                color: C.text.secondary,
                                "&:hover": {
                                  bgcolor: alpha(C.error, 0.08),
                                  color: C.error,
                                },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{ borderTop: `1px solid ${C.border}`, bgcolor: C.surface }}
            >
              <TablePagination
                component="div"
                count={rolesPagination.total || roles.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 20]}
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    fontSize: "0.8rem",
                    minHeight: 52,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    { fontSize: "0.75rem", color: C.text.secondary },
                }}
              />
            </Box>
          </Paper>
        )}
      </Container>

      <RoleModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditRole(null);
        }}
        onSubmit={handleSubmit}
        loading={actionLoading}
        editRole={editRole}
      />
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        loading={actionLoading}
        item={deleteTarget}
        itemType="Role"
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: "10px", fontSize: "0.8rem" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
