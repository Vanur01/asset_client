// pages/admin/CloneChecklist.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  InputBase,
  Paper,
  alpha,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useChecklistBuilder } from "../context/ChecklistBuilderContext";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SecurityIcon from "@mui/icons-material/Security";
import ConstructionIcon from "@mui/icons-material/Construction";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import VerifiedIcon from "@mui/icons-material/Verified";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import RefreshIcon from "@mui/icons-material/Refresh";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";

const PageContainer = styled(Box)({
  backgroundColor: "#f8fafb",
  minHeight: "100vh",
  width: "100%",
});

const SearchInput = styled(InputBase)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  transition: "all 0.2s ease",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.2, 1.2, 1.2, 5),
    fontSize: "0.8rem",
    color: "#1e293b",
    "&::placeholder": { color: "#94a3b8", opacity: 1 },
  },
  "&:hover, &:focus-within": {
    borderColor: "#003544",
    boxShadow: "0 2px 8px rgba(0,53,68,0.08)",
    backgroundColor: "#ffffff",
  },
}));

const StatusChip = styled(Box)(({ status }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 10px",
  borderRadius: "12px",
  fontSize: "0.65rem",
  fontWeight: 600,
  backgroundColor:
    status === "active"
      ? "#e6f7e6"
      : status === "draft"
        ? "#fef9c3"
        : "#fef3c7",
  color:
    status === "active"
      ? "#166534"
      : status === "draft"
        ? "#854d0e"
        : "#92400e",
  border: `1px solid ${status === "active" ? "#bbf7d0" : status === "draft" ? "#fde68a" : "#fde68a"}`,
}));

const CloneButton = styled(Button)({
  backgroundColor: "#003544",
  color: "#ffffff",
  fontSize: "0.7rem",
  fontWeight: 600,
  padding: "4px 12px",
  borderRadius: "6px",
  minWidth: "60px",
  "&:hover": { backgroundColor: "#004d61" },
  "&:active": { transform: "scale(0.95)" },
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#f8fafc",
  position: "sticky",
  top: 0,
  zIndex: 5,
  "& .MuiTableCell-head": {
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    padding: theme.spacing(1.2, 1.5),
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": { backgroundColor: "#f8fafc" },
  "& .MuiTableCell-body": {
    padding: theme.spacing(1.2, 1.5),
    fontSize: "0.8rem",
    borderBottom: "1px solid #edf2f7",
    color: "#334155",
  },
}));

const MobileCard = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  border: "1px solid #edf2f7",
  transition: "all 0.2s ease",
  "&:last-child": { marginBottom: 0 },
}));

// ─── Clone Name Dialog ────────────────────────────────────────────
const CloneDialog = ({ open, checklist, onClose, onConfirm, loading }) => {
  const [name, setName] = useState("");
  useEffect(() => {
    if (checklist) setName(`${checklist.name} (Clone)`);
  }, [checklist]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "14px" } }}
    >
      <DialogTitle sx={{ pb: 0.5, pt: 3, px: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}
            >
              Clone Checklist
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "#64748b", mt: 0.25 }}>
              Give your clone a unique name
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2 }}>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "#475569",
            mb: 0.75,
            fontWeight: 600,
          }}
        >
          Clone Name *
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontSize: "0.875rem",
            },
          }}
        />
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: "#f8fafc",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography sx={{ fontSize: "0.7rem", color: "#64748b" }}>
            Cloning from:{" "}
            <strong style={{ color: "#0f172a" }}>{checklist?.name}</strong>
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#64748b" }}>
            Type:{" "}
            <strong style={{ color: "#0f172a" }}>{checklist?.type}</strong> ·
            Fields:{" "}
            <strong style={{ color: "#0f172a" }}>
              {checklist?.totalFields || 0}
            </strong>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#e2e8f0",
            color: "#334155",
            borderRadius: "8px",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(name)}
          disabled={loading || !name.trim()}
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#003544",
            "&:hover": { bgcolor: "#004d61" },
            borderRadius: "8px",
            fontWeight: 600,
            "&:disabled": { bgcolor: "#e2e8f0" },
          }}
        >
          {loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "Create Clone"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Component ───────────────────────────────────────────────
const CloneChecklist = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getAllChecklists, cloneChecklist, loading, clearMessages } =
    useChecklistBuilder();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [cloneList, setCloneList] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  });
  const [cloneDialog, setCloneDialog] = useState({
    open: false,
    checklist: null,
  });
  const [cloneLoading, setCloneLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  // Fetch clone list (all checklists available for cloning)
  const fetchCloneList = useCallback(async () => {
    const filters = {
      page: page,
      limit: limit,
    };

    if (searchQuery) {
      filters.search = searchQuery;
    }

    const result = await getAllChecklists(filters);

    if (result.success && result.data) {
      let checklists = [];
      let paginationData = {};

      if (Array.isArray(result.data)) {
        checklists = result.data;
      } else if (result.data.checklists) {
        checklists = result.data.checklists;
        paginationData = result.data.pagination || {};
      }

      setCloneList(checklists);
      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || limit,
        total: paginationData.total || checklists.length,
        totalPages:
          paginationData.totalPages ||
          Math.ceil((paginationData.total || checklists.length) / limit),
      });
    }
  }, [getAllChecklists, page, limit, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCloneList();
    }, 350);
    return () => clearTimeout(timer);
  }, [page, searchQuery, fetchCloneList]);

  // Handle clone confirmation
  const handleClone = useCallback(
    async (newName) => {
      if (!cloneDialog.checklist) return;

      setCloneLoading(true);
      try {
        const result = await cloneChecklist(cloneDialog.checklist._id, newName);
        if (result.success) {
          setSnack({
            open: true,
            msg: `"${newName}" created successfully!`,
            severity: "success",
          });
          setCloneDialog({ open: false, checklist: null });
          // Refresh the list
          fetchCloneList();
          // Navigate back after 2 seconds
          setTimeout(() => navigate("/admin/checklists"), 2000);
        } else {
          setSnack({
            open: true,
            msg: result.error || "Clone failed.",
            severity: "error",
          });
        }
      } catch (err) {
        setSnack({
          open: true,
          msg: err.message || "Clone failed.",
          severity: "error",
        });
      } finally {
        setCloneLoading(false);
      }
    },
    [cloneDialog.checklist, cloneChecklist, navigate, fetchCloneList],
  );

  // Get icon based on category
  const getIcon = (category) => {
    const icons = {
      Safety: <SecurityIcon sx={{ fontSize: "1rem" }} />,
      Equipment: <ConstructionIcon sx={{ fontSize: "1rem" }} />,
      Site: <LocationCityIcon sx={{ fontSize: "1rem" }} />,
      Quality: <VerifiedIcon sx={{ fontSize: "1rem" }} />,
    };
    return (
      icons[category] || <AssignmentTurnedInIcon sx={{ fontSize: "1rem" }} />
    );
  };

  // Mobile card view
  const MobileCardView = ({ row }) => (
    <MobileCard elevation={0}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "6px",
              bgcolor: "#e6f7f9",
              color: "#003544",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getIcon(row.category)}
          </Box>
          <Box>
            <Typography
              sx={{ fontWeight: 600, fontSize: "0.8rem", color: "#0f172a" }}
            >
              {row.name}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "#64748b" }}>
              {row.createdBy?.name || "System Admin"}
            </Typography>
          </Box>
        </Box>
        <StatusChip status={row.status}>{row.status}</StatusChip>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: "0.65rem", color: "#64748b" }}>
            {new Date(row.createdAt).toLocaleDateString()}
          </Typography>
          <Box
            sx={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              bgcolor: "#cbd5e1",
            }}
          />
          <Box
            sx={{
              fontSize: "0.6rem",
              fontWeight: 600,
              bgcolor: "#f1f5f9",
              px: 1,
              py: 0.2,
              borderRadius: "12px",
              color: "#475569",
            }}
          >
            {row.totalFields || 0} fields
          </Box>
        </Box>
        <CloneButton
          size="small"
          startIcon={<ContentCopyIcon sx={{ fontSize: "0.7rem" }} />}
          onClick={() => setCloneDialog({ open: true, checklist: row })}
        >
          Clone
        </CloneButton>
      </Box>
    </MobileCard>
  );

  return (
    <PageContainer>
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: "10px" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>

      <CloneDialog
        open={cloneDialog.open}
        checklist={cloneDialog.checklist}
        onClose={() => setCloneDialog({ open: false, checklist: null })}
        onConfirm={handleClone}
        loading={cloneLoading}
      />

      {/* Header */}
      <Paper
        elevation={0}
        square
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "1125px",
          bgcolor: "#ffffff",
          display: "flex",
          ml: 4,
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 3 },
          py: 1.5,
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          borderBottom: "1px solid #edf2f7",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            onClick={() => navigate("/admin/checklists")}
            sx={{
              padding: "6px",
              backgroundColor: "#f1f5f9",
              "&:hover": { backgroundColor: "#e2e8f0" },
            }}
          >
            <ArrowBackIcon sx={{ color: "#003544", fontSize: "1.1rem" }} />
          </IconButton>
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.3rem" },
                fontWeight: 700,
                color: "#003544",
                lineHeight: 1.2,
              }}
            >
              Select Checklist to Clone
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                color: "#64748b",
              }}
            >
              Choose a checklist to create a copy
            </Typography>
          </Box>
        </Box>
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={() => fetchCloneList()}
                sx={{ padding: "6px", bgcolor: "#f1f5f9" }}
              >
                <RefreshIcon sx={{ fontSize: "1rem", color: "#64748b" }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>

      {/* Search */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          px: { xs: 2, sm: 3 },
          py: 2,
          mx: { xs: 1.5, sm: 3 },
          mt: 2,
          borderRadius: "12px",
          border: "1px solid #edf2f7",
        }}
      >
        <Box sx={{ position: "relative", maxWidth: 600 }}>
          <Box
            sx={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              display: "flex",
            }}
          >
            <SearchIcon sx={{ fontSize: "1rem" }} />
          </Box>
          <SearchInput
            fullWidth
            placeholder="Search checklists by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </Box>
      </Paper>

      {/* Table / Cards */}
      <Box
        sx={{
          mx: { xs: 1.5, sm: 3 },
          mt: 2,
          bgcolor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #edf2f7",
          overflow: "hidden",
        }}
      >
        {loading && cloneList.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={32} sx={{ color: "#003544" }} />
          </Box>
        ) : cloneList.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <AssignmentTurnedInIcon
              sx={{ fontSize: "3rem", color: "#cbd5e1", mb: 1.5 }}
            />
            <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              {searchQuery
                ? "No checklists match your search"
                : "No checklists available to clone"}
            </Typography>
          </Box>
        ) : isMobile ? (
          <Box sx={{ p: 1.5 }}>
            {cloneList.map((row) => (
              <MobileCardView key={row._id} row={row} />
            ))}
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: "calc(100vh - 280px)" }}>
            <Table stickyHeader size="small">
              <StyledTableHead>
                <TableRow>
                  {[
                    "Checklist Name",
                    "Created By",
                    "Date",
                    "Fields",
                    "Type",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {cloneList.map((row) => (
                  <StyledTableRow key={row._id} hover>
                    <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>
                      {row.name}
                    </TableCell>
                    <TableCell>
                      {row.createdBy?.name || "System Admin"}
                    </TableCell>
                    <TableCell sx={{ color: "#64748b" }}>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          bgcolor: "#f1f5f9",
                          px: 1,
                          py: 0.3,
                          borderRadius: "12px",
                          color: "#475569",
                          display: "inline-block",
                        }}
                      >
                        {row.totalFields || 0}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.type}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          bgcolor:
                            row.type === "global" ? "#003544" : "#f1f5f9",
                          color: row.type === "global" ? "#fff" : "#475569",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={row.status}>{row.status}</StatusChip>
                    </TableCell>
                    <TableCell align="center">
                      <CloneButton
                        size="small"
                        startIcon={
                          <ContentCopyIcon sx={{ fontSize: "0.7rem" }} />
                        }
                        onClick={() =>
                          setCloneDialog({ open: true, checklist: row })
                        }
                      >
                        Clone
                      </CloneButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Footer with Pagination */}
      <Box
        sx={{
          mx: { xs: 1.5, sm: 3 },
          mt: 2,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Typography
          sx={{ fontSize: "0.65rem", fontWeight: 500, color: "#64748b" }}
        >
          Showing {cloneList.length} of {pagination.total || cloneList.length}{" "}
          checklists
        </Typography>
        {pagination.totalPages > 1 &&
          (isMobile ? (
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              size="small"
              siblingCount={0}
              boundaryCount={1}
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: "0.6rem",
                  minWidth: "24px",
                  height: "24px",
                },
              }}
            />
          ) : (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <IconButton
                size="small"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                sx={{ padding: "4px" }}
              >
                <ChevronLeftIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
              {Array.from(
                { length: Math.min(pagination.totalPages, 5) },
                (_, i) => i + 1,
              ).map((p) => (
                <Typography
                  key={p}
                  onClick={() => setPage(p)}
                  sx={{
                    fontSize: "0.7rem",
                    color: p === page ? "#0f172a" : "#94a3b8",
                    fontWeight: p === page ? 700 : 400,
                    px: 1,
                    cursor: "pointer",
                    backgroundColor: p === page ? "#e2e8f0" : "transparent",
                    borderRadius: "4px",
                    py: 0.5,
                  }}
                >
                  {p}
                </Typography>
              ))}
              <IconButton
                size="small"
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                sx={{ padding: "4px" }}
              >
                <ChevronRightIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Box>
          ))}
      </Box>
    </PageContainer>
  );
};

export default CloneChecklist;
