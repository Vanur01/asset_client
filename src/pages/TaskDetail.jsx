// TaskDetail.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Chip,
  Button,
  IconButton,
  Divider,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TeamContext";

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  primary: "#0d4a5c",
  primaryDark: "#0a3a49",
  primaryLight: "#e8f2f5",
  success: "#16a34a",
  successBg: "#dcfce7",
  warning: "#f59e0b",
  warningBg: "#fef3c7",
  error: "#d32f2f",
  errorBg: "#ffebea",
  info: "#3b82f6",
  infoBg: "#dbeafe",
  surface: "#f1f4f8",
  card: "#ffffff",
  border: "#e2e8f0",
  text: { primary: "#1e293b", secondary: "#64748b", disabled: "#94a3b8" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStatusConfig = (status) => {
  const statusMap = {
    completed: {
      icon: <CheckCircleIcon />,
      color: C.success,
      bg: C.successBg,
      label: "Completed",
    },
    in_progress: {
      icon: <PendingIcon />,
      color: C.warning,
      bg: C.warningBg,
      label: "In Progress",
    },
    pending: {
      icon: <ScheduleIcon />,
      color: C.info,
      bg: C.infoBg,
      label: "Pending",
    },
    cancelled: {
      icon: <ErrorIcon />,
      color: C.error,
      bg: C.errorBg,
      label: "Cancelled",
    },
    overdue: {
      icon: <ErrorIcon />,
      color: C.error,
      bg: C.errorBg,
      label: "Overdue",
    },
  };
  return statusMap[status?.toLowerCase()] || statusMap.pending;
};

const getPriorityConfig = (priority) => {
  const priorityMap = {
    high: { color: C.error, bg: C.errorBg, label: "High" },
    medium: { color: C.warning, bg: C.warningBg, label: "Medium" },
    low: { color: C.success, bg: C.successBg, label: "Low" },
  };
  return priorityMap[priority?.toLowerCase()] || priorityMap.medium;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Info Row Component ──────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: C.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{ fontSize: "0.72rem", color: C.text.secondary, mb: 0.2 }}
        >
          {label}
        </Typography>
        <Typography
          sx={{ fontSize: "0.85rem", fontWeight: 600, color: C.text.primary }}
        >
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Checklist Item Component ────────────────────────────────────────────────
function ChecklistItem({ item, onToggle, disabled }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        bgcolor: item.completed ? C.successBg : "transparent",
        border: `1px solid ${C.border}`,
        cursor: onToggle ? "pointer" : "default",
      }}
      onClick={() => onToggle && !disabled && onToggle(item.id)}
    >
      {item.completed ? (
        <CheckCircleIcon sx={{ color: C.success, fontSize: "1.2rem" }} />
      ) : (
        <CheckCircleOutlineIcon
          sx={{ color: C.text.disabled, fontSize: "1.2rem" }}
        />
      )}
      <Typography
        sx={{
          flex: 1,
          fontSize: "0.85rem",
          color: item.completed ? C.text.secondary : C.text.primary,
          textDecoration: item.completed ? "line-through" : "none",
        }}
      >
        {item.name}
      </Typography>
      {item.notes && (
        <Typography sx={{ fontSize: "0.72rem", color: C.text.disabled }}>
          {item.notes}
        </Typography>
      )}
    </Box>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function TaskDetailSkeleton() {
  return (
    <Box sx={{ bgcolor: C.surface, minHeight: "100vh", p: { xs: 2, md: 3 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rounded" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={400} />
        </Box>
      </Container>
    </Box>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TaskDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    selectedTask,
    loading,
    actionLoading,
    fetchTaskDetails,
    updateTask,
    deleteTask,
  } = useTasks();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignedTo: "",
    dueDate: "",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (msg, sev = "success") =>
    setToast({ open: true, message: msg, severity: sev });
  const closeToast = () => setToast((p) => ({ ...p, open: false }));

  useEffect(() => {
    if (id) fetchTaskDetails(id);
  }, [id, fetchTaskDetails]);

  useEffect(() => {
    if (selectedTask) {
      setEditForm({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        status: selectedTask.status || "pending",
        priority: selectedTask.priority || "medium",
        assignedTo:
          selectedTask.assignedTo?.id || selectedTask.assignedTo || "",
        dueDate: selectedTask.dueDate || "",
      });
    }
  }, [selectedTask]);

  const handleUpdate = async () => {
    const result = await updateTask(id, editForm);
    if (result.success) {
      showToast(result.message);
      setEditDialogOpen(false);
      fetchTaskDetails(id);
    } else {
      showToast(result.error, "error");
    }
  };

  const handleDelete = async () => {
    const result = await deleteTask(id);
    if (result.success) {
      showToast(result.message);
      setDeleteDialogOpen(false);
      setTimeout(() => navigate("/tasks"), 1200);
    } else {
      showToast(result.error, "error");
    }
  };

  const handleChecklistToggle = async (itemId) => {
    // Implementation for toggling checklist items
    console.log("Toggle item:", itemId);
  };

  if (loading && !selectedTask) return <TaskDetailSkeleton />;

  if (!selectedTask && !loading) {
    return (
      <Box
        sx={{
          bgcolor: C.surface,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 2, color: C.text.secondary }}>
            Task not found
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/tasks")}
            sx={{ bgcolor: C.primary, textTransform: "none" }}
          >
            Back to Tasks
          </Button>
        </Paper>
      </Box>
    );
  }

  const statusConfig = getStatusConfig(selectedTask?.status);
  const priorityConfig = getPriorityConfig(selectedTask?.priority);
  const isOverdue =
    selectedTask?.dueDate &&
    new Date(selectedTask.dueDate) < new Date() &&
    selectedTask?.status !== "completed";

  return (
    <Box sx={{ bgcolor: C.surface, minHeight: "100vh", p: { xs: 2, md: 3 } }}>
      <Container maxWidth="lg" disableGutters>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${C.border}`,
            bgcolor: C.card,
            mb: 3,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <IconButton
                onClick={() => navigate("/tasks")}
                sx={{ color: C.text.primary, bgcolor: C.surface, mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  Delete
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: C.text.primary }}
              >
                {selectedTask?.title}
              </Typography>
              <Chip
                icon={statusConfig.icon}
                label={statusConfig.label}
                sx={{
                  bgcolor: statusConfig.bg,
                  color: statusConfig.color,
                  fontWeight: 600,
                }}
              />
              <Chip
                label={`${priorityConfig.label} Priority`}
                sx={{
                  bgcolor: priorityConfig.bg,
                  color: priorityConfig.color,
                  fontWeight: 600,
                }}
              />
              {isOverdue && (
                <Chip
                  label="Overdue"
                  icon={<ErrorIcon />}
                  sx={{ bgcolor: C.errorBg, color: C.error, fontWeight: 600 }}
                />
              )}
            </Box>

            <Typography
              sx={{ color: C.text.secondary, fontSize: "0.9rem", mt: 1 }}
            >
              {selectedTask?.description}
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column - Task Details */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${C.border}`,
                bgcolor: C.card,
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    mb: 2,
                    color: C.text.primary,
                  }}
                >
                  Task Details
                </Typography>

                <InfoRow
                  icon={<AssignmentIcon sx={{ fontSize: "1rem" }} />}
                  label="Task ID"
                  value={selectedTask?.taskId || selectedTask?.id}
                />

                <Divider sx={{ borderColor: C.border }} />

                <InfoRow
                  icon={<PersonIcon sx={{ fontSize: "1rem" }} />}
                  label="Assigned To"
                  value={
                    selectedTask?.assignedTo?.name ||
                    selectedTask?.assignedTo ||
                    "Unassigned"
                  }
                />

                <Divider sx={{ borderColor: C.border }} />

                <InfoRow
                  icon={<ScheduleIcon sx={{ fontSize: "1rem" }} />}
                  label="Due Date"
                  value={formatDate(selectedTask?.dueDate)}
                />

                <Divider sx={{ borderColor: C.border }} />

                <InfoRow
                  icon={<LocationOnIcon sx={{ fontSize: "1rem" }} />}
                  label="Location"
                  value={selectedTask?.location || "—"}
                />

                {selectedTask?.createdAt && (
                  <>
                    <Divider sx={{ borderColor: C.border }} />
                    <InfoRow
                      icon={<DescriptionIcon sx={{ fontSize: "1rem" }} />}
                      label="Created"
                      value={formatDateTime(selectedTask?.createdAt)}
                    />
                  </>
                )}
              </Box>
            </Paper>

            {/* Checklist Section */}
            {selectedTask?.checklist && selectedTask.checklist.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${C.border}`,
                  bgcolor: C.card,
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      mb: 2,
                      color: C.text.primary,
                    }}
                  >
                    Checklist (
                    {selectedTask.checklist.filter((i) => i.completed).length}/
                    {selectedTask.checklist.length})
                  </Typography>
                  <Stack spacing={1.5}>
                    {selectedTask.checklist.map((item) => (
                      <ChecklistItem
                        key={item.id}
                        item={item}
                        onToggle={handleChecklistToggle}
                        disabled={selectedTask.status === "completed"}
                      />
                    ))}
                  </Stack>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Right Column - Progress & Attachments */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${C.border}`,
                bgcolor: C.card,
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    mb: 2,
                    color: C.text.primary,
                  }}
                >
                  Progress
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "0.8rem", color: C.text.secondary }}
                    >
                      Completion
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: C.text.primary,
                      }}
                    >
                      {selectedTask?.progress || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={selectedTask?.progress || 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: C.border,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: C.primary,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Paper>

            {/* Attachments Section */}
            {selectedTask?.attachments &&
              selectedTask.attachments.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${C.border}`,
                    bgcolor: C.card,
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        mb: 2,
                        color: C.text.primary,
                      }}
                    >
                      Attachments ({selectedTask.attachments.length})
                    </Typography>
                    <Stack spacing={1.5}>
                      {selectedTask.attachments.map((attachment, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            border: `1px solid ${C.border}`,
                            cursor: "pointer",
                            "&:hover": { bgcolor: C.surface },
                          }}
                          onClick={() => window.open(attachment.url, "_blank")}
                        >
                          <ImageIcon
                            sx={{ color: C.text.secondary, fontSize: "1.2rem" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              color: C.text.primary,
                              flex: 1,
                            }}
                          >
                            {attachment.name}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "0.72rem", color: C.text.disabled }}
                          >
                            {attachment.size}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              )}
          </Grid>
        </Grid>
      </Container>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ borderBottom: `1px solid ${C.border}`, pb: 1.5, pt: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
              Edit Task
            </Typography>
            <IconButton size="small" onClick={() => setEditDialogOpen(false)}>
              <CloseIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              multiline
              rows={3}
              fullWidth
              size="small"
            />
            <TextField
              label="Due Date"
              type="date"
              value={editForm.dueDate?.split("T")[0] || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, dueDate: e.target.value })
              }
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{ p: 2, pt: 1.5, borderTop: `1px solid ${C.border}` }}
        >
          <Button
            onClick={() => setEditDialogOpen(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Typography
            sx={{ fontWeight: 700, color: C.error, fontSize: "1rem" }}
          >
            Delete Task
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: C.text.secondary, fontSize: "0.8rem" }}>
            Are you sure you want to delete "
            <strong>{selectedTask?.title}</strong>"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
