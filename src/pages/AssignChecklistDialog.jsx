// components/AssignChecklistDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PRIMARY = "#1a4a5c";

export default function AssignChecklistDialog({ 
  open, 
  onClose, 
  checklist, 
  userRole,
  admins = [],
  teamMembers = [],
  assets = [],
  onAssign,
  loading 
}) {
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [selectedSecondaryMember, setSelectedSecondaryMember] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");

  const isSuperAdmin = userRole === "super_admin";

  useEffect(() => {
    if (open) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setDueDate(defaultDate.toISOString().split("T")[0]);
      setPriority("medium");
      setNotes("");
      setSelectedAdmin("");
      setSelectedTeamMember("");
      setSelectedSecondaryMember("");
      setSelectedAsset("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (isSuperAdmin && selectedAdmin) {
      const assignmentData = {
        checklistId: checklist._id,
        adminId: selectedAdmin,
        dueDate: new Date(dueDate).toISOString(),
        priority: priority,
        notes: notes,
        assetId: selectedAsset || null,
      };
      onAssign(assignmentData);
    } else if (!isSuperAdmin && selectedTeamMember) {
      const assignmentData = {
        checklistId: checklist._id,
        primaryMemberId: selectedTeamMember,
        secondaryMemberId: selectedSecondaryMember || null,
        dueDate: new Date(dueDate).toISOString(),
        priority: priority,
        notes: notes,
        assetId: selectedAsset || null,
      };
      onAssign(assignmentData);
    }
  };

  const canSubmit = () => {
    if (isSuperAdmin) {
      return selectedAdmin && dueDate;
    } else {
      return selectedTeamMember && dueDate;
    }
  };

  const getPriorityColor = (p) => {
    switch(p) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#10b981";
      case "critical": return "#dc2626";
      default: return PRIMARY;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: PRIMARY, color: "#fff", p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight={700} fontSize={18}>
              {isSuperAdmin ? "Assign Checklist to Admin" : "Assign Checklist to Team Member"}
            </Typography>
            <Typography fontSize={12} sx={{ opacity: 0.8, mt: 0.5 }}>
              {checklist?.name}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{mt:3}}>
          {isSuperAdmin ? (
            <Grid item xs={12} sx={{width:"250px"}}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Select Admin *</InputLabel>
                <Select
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  label="Select Admin *"
                >
                  {admins.length === 0 ? (
                    <MenuItem disabled>No admins available</MenuItem>
                  ) : (
                    admins.map((admin) => (
                      <MenuItem key={admin._id} value={admin._id}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {admin.name || admin.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {admin.email}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} sx={{width:"250px"}}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Primary Team Member *</InputLabel>
                  <Select
                    value={selectedTeamMember}
                    onChange={(e) => setSelectedTeamMember(e.target.value)}
                    label="Primary Team Member *"
                  >
                    {teamMembers.length === 0 ? (
                      <MenuItem disabled>No team members available</MenuItem>
                    ) : (
                      teamMembers.map((member) => (
                        <MenuItem key={member._id} value={member._id}>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {member.name || member.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Role: {member.role || "Team Member"}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{width:"250px"}}>
                <FormControl fullWidth size="small">
                  <InputLabel>Secondary Team Member (Optional)</InputLabel>
                  <Select
                    value={selectedSecondaryMember}
                    onChange={(e) => setSelectedSecondaryMember(e.target.value)}
                    label="Secondary Team Member (Optional)"
                  >
                    <MenuItem value="">None</MenuItem>
                    {teamMembers
                      .filter((m) => m._id !== selectedTeamMember)
                      .map((member) => (
                        <MenuItem key={member._id} value={member._id}>
                          <Box>
                            <Typography variant="body2">
                              {member.name || member.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {member.role || "Team Member"}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {/* Asset Selection - Only for Admin */}
          {!isSuperAdmin && (
            <Grid item xs={12} sx={{width:"250px"}}>
              <FormControl fullWidth size="small">
                <InputLabel>Select Asset (Optional)</InputLabel>
                <Select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  label="Select Asset (Optional)"
                >
                  <MenuItem value="">None</MenuItem>
                  {assets.map((asset) => (
                    <MenuItem key={asset._id} value={asset._id}>
                      <Box>
                        <Typography variant="body2">
                          {asset.assetName || asset.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {asset.assetTag || asset.serialNumber || asset.assetId}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={6} sx={{width:"250px"}}>
            <TextField
              fullWidth
              type="date"
              label="Due Date *"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{width:"250px"}}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)} label="Priority">
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{width:"250px"}}>
            <TextField
              fullWidth
              label="Assignment Notes"
              placeholder="Add any additional instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ bgcolor: "#f8fafc", p: 1.5, borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" component="div">
            <strong>Checklist:</strong> {checklist?.name}<br />
            <strong>Total Fields:</strong> {checklist?.totalFields || 0}<br />
            <strong>Due Date:</strong> {formatDate(dueDate)}<br />
            <strong>Priority:</strong>{" "}
            <Chip
              label={priority.toUpperCase()}
              size="small"
              sx={{ bgcolor: getPriorityColor(priority), color: "#fff", height: 20, fontSize: 10 }}
            />
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: PRIMARY, color: PRIMARY }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !canSubmit()}
          sx={{ bgcolor: PRIMARY, "&:hover": { bgcolor: PRIMARY } }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Assign Checklist"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}