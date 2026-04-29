import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Stack,
  Divider,
  LinearProgress,
  Rating,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
  CircularProgress,
  Snackbar,
  Skeleton,
  IconButton,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DrawIcon from "@mui/icons-material/Draw";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { theme } from "./MyTask";
import { useAssignment } from "../context/TeamAssignmentcontext";

/* ═══════════ UPLOAD ZONE ════════════════════════════════════════════════════ */
const UploadZone = ({
  accept = "image/*",
  multiple = true,
  files,
  onChange,
  disabled,
}) => {
  const ref = useRef();
  return (
    <Box>
      <Box
        onClick={() => !disabled && ref.current?.click()}
        sx={{
          border: "2px dashed #d1d5db",
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "border-color .15s",
          opacity: disabled ? 0.6 : 1,
          "&:hover": { borderColor: disabled ? "#d1d5db" : "#0d3d52" },
        }}
      >
        <FileUploadOutlinedIcon
          sx={{ color: "#9ca3af", fontSize: 28, mb: 0.5 }}
        />
        <Typography variant="body2" color="text.secondary">
          Click to upload or drag and drop
        </Typography>
        <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mt: 0.3 }}>
          PNG, JPG, HEIC up to 10MB
        </Typography>
        <input
          ref={ref}
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          onChange={(e) => onChange(Array.from(e.target.files))}
        />
      </Box>
      {files?.length > 0 && (
        <Box mt={1.2} display="flex" flexWrap="wrap" gap={1}>
          {files.map((f, i) => (
            <Box
              key={i}
              sx={{
                background: "#f3f4f6",
                borderRadius: "8px",
                px: 1.5,
                py: 0.5,
                fontSize: "0.75rem",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                gap: 0.8,
              }}
            >
              {f.name}
              <IconButton
                size="small"
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                sx={{ p: 0, color: "#9ca3af", "&:hover": { color: "#ef4444" } }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

/* ═══════════ SIGNATURE PAD ═════════════════════════════════════════════════ */
const SignaturePad = ({ onSave, disabled, existing }) => {
  const canvasRef = useRef();
  const drawing = useRef(false);
  const [signed, setSigned] = useState(false);
  const [cleared, setCleared] = useState(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const start = (e) => {
    if (disabled) return;
    e.preventDefault();
    drawing.current = true;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const { x, y } = getPos(e, c);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const draw = (e) => {
    if (!drawing.current || disabled) return;
    e.preventDefault();
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const { x, y } = getPos(e, c);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0d3d52";
    ctx.lineTo(x, y);
    ctx.stroke();
    setSigned(true);
  };
  const stop = () => {
    drawing.current = false;
    if (signed) {
      canvasRef.current.toBlob((blob) => {
        if (blob)
          onSave(new File([blob], "signature.png", { type: "image/png" }));
      });
    }
  };
  const clear = () => {
    const c = canvasRef.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
    setSigned(false);
    setCleared(true);
    onSave(null);
  };

  return (
    <Box sx={{ border: "2px dashed #d1d5db", borderRadius: 3, p: 2 }}>
      {existing && !cleared ? (
        <Box textAlign="center">
          <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 36, mb: 1 }} />
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Signature already recorded
          </Typography>
          <Button
            size="small"
            onClick={() => setCleared(true)}
            sx={{
              textTransform: "none",
              color: "#6b7280",
              fontSize: "0.75rem",
            }}
          >
            Replace signature
          </Button>
        </Box>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={600}
            height={160}
            style={{
              width: "100%",
              height: 160,
              borderRadius: 8,
              background: "#fafafa",
              touchAction: "none",
              cursor: disabled ? "not-allowed" : "crosshair",
            }}
            onMouseDown={start}
            onMouseMove={draw}
            onMouseUp={stop}
            onMouseLeave={stop}
            onTouchStart={start}
            onTouchMove={draw}
            onTouchEnd={stop}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1.2}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <DrawIcon sx={{ fontSize: 13 }} /> Draw your signature above
            </Typography>
            <Button
              size="small"
              onClick={clear}
              sx={{
                textTransform: "none",
                color: "#6b7280",
                fontSize: "0.75rem",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            >
              Clear
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

/* ═══════════ DYNAMIC FIELD RENDERER ════════════════════════════════════════ */
const DynamicField = ({ field, value, onChange, disabled }) => {
  const {
    fieldType,
    label,
    placeholder,
    options,
    ratingMax,
    checkboxItems,
    isRequired,
  } = field;

  const labelEl = (
    <Typography
      variant="body2"
      fontWeight={600}
      mb={0.7}
      sx={{ color: "#111827" }}
    >
      {label}
      {isRequired && <span style={{ color: "#ef4444" }}> *</span>}
    </Typography>
  );

  switch (fieldType) {
    case "text_input":
      return (
        <Box>
          {labelEl}
          <TextField
            fullWidth
            size="small"
            placeholder={placeholder}
            value={value || ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { background: "#fafafa" } }}
          />
        </Box>
      );

    case "text_area":
      return (
        <Box>
          {labelEl}
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder={placeholder}
            value={value || ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { background: "#fafafa" } }}
          />
        </Box>
      );

    case "dropdown":
      return (
        <Box>
          {labelEl}
          <FormControl fullWidth size="small">
            <Select
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              displayEmpty
              disabled={disabled}
              sx={{
                background: "#fafafa",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e5e7eb",
                },
              }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: "#9ca3af" }}>{placeholder || "Select…"}</em>
              </MenuItem>
              {options?.map((o) => (
                <MenuItem key={o} value={o} sx={{ fontSize: "0.85rem" }}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );

    case "date_picker":
      return (
        <Box>
          {labelEl}
          <TextField
            fullWidth
            size="small"
            type="date"
            value={value || ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { background: "#fafafa" } }}
          />
        </Box>
      );

    case "checkbox":
      return (
        <Box>
          {labelEl}
          <FormGroup>
            {checkboxItems?.map((item) => (
              <FormControlLabel
                key={item}
                disabled={disabled}
                control={
                  <Checkbox
                    size="small"
                    checked={
                      Array.isArray(value) ? value.includes(item) : false
                    }
                    onChange={(e) => {
                      const arr = Array.isArray(value) ? [...value] : [];
                      onChange(
                        e.target.checked
                          ? [...arr, item]
                          : arr.filter((v) => v !== item),
                      );
                    }}
                    sx={{ "&.Mui-checked": { color: "#0d3d52" } }}
                  />
                }
                label={<Typography variant="body2">{item}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>
      );

    case "rating":
      return (
        <Box>
          {labelEl}
          <Rating
            value={value || 0}
            max={ratingMax || 5}
            disabled={disabled}
            onChange={(_, v) => onChange(v)}
            sx={{
              color: "#fbbf24",
              "& .MuiRating-iconEmpty": { color: "#d1d5db" },
            }}
            size="large"
          />
        </Box>
      );

    case "image_upload":
      return (
        <Box>
          {labelEl}
          <UploadZone
            files={value || []}
            onChange={onChange}
            disabled={disabled}
            accept="image/*"
            multiple
          />
        </Box>
      );

    case "signature":
      return (
        <Box>
          {labelEl}
          <SignaturePad onSave={onChange} disabled={disabled} existing={null} />
        </Box>
      );

    default:
      return (
        <Box>
          {labelEl}
          <TextField
            fullWidth
            size="small"
            placeholder={placeholder}
            value={value || ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { background: "#fafafa" } }}
          />
        </Box>
      );
  }
};

/* ═══════════ SECTION CARD ═══════════════════════════════════════════════════ */
const SectionCard = ({ section, responses, onFieldChange, disabled }) => (
  <Card sx={{ mb: 2, borderRadius: "14px" }}>
    <CardContent sx={{ px: { xs: "18px", md: "28px" }, py: "24px" }}>
      <Typography
        sx={{ fontWeight: 700, fontSize: "1rem", color: "#0d3d52", mb: 0.5 }}
      >
        {section.sectionTitle}
      </Typography>
      {section.sectionDescription && (
        <Typography variant="body2" color="text.secondary" mb={2.2}>
          {section.sectionDescription}
        </Typography>
      )}
      <Divider sx={{ mb: 2.5 }} />
      <Grid container spacing={2.5}>
        {section.fields.map((field) => (
          <Grid
            item
            xs={12}
            sm={
              ["text_input", "date_picker", "dropdown"].includes(
                field.fieldType,
              )
                ? 6
                : 12
            }
            key={field._id}
          >
            <DynamicField
              field={field}
              value={responses[field._id]}
              onChange={(val) => onFieldChange(field._id, val)}
              disabled={disabled}
            />
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

/* ═══════════ PROGRESS TRACKER ══════════════════════════════════════════════ */
const computeProgress = (checklist, responses) => {
  if (!checklist?.sections) return 0;
  const required = [];
  checklist.sections.forEach((s) =>
    s.fields.forEach((f) => {
      if (f.isRequired) required.push(f._id);
    }),
  );
  if (!required.length) return 100;
  const answered = required.filter((id) => {
    const v = responses[id];
    if (v === undefined || v === null || v === "") return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }).length;
  return Math.round((answered / required.length) * 100);
};

/* ═══════════ MAIN COMPONENT ════════════════════════════════════════════════ */
export default function TaskDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    fetchAssignmentDetail,
    saveDraft,
    submitAssignment,
    detailLoading,
    submitting,
  } = useAssignment();

  const [task, setTask] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [responses, setResponses] = useState({});
  const [photos, setPhotos] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [signature, setSignature] = useState(null);
  const [inspNotes, setInspNotes] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const [loadErr, setLoadErr] = useState(null);

  /* ─── load detail ─── */
  useEffect(() => {
    const load = async () => {
      const detail = await fetchAssignmentDetail(id);
      if (!detail) {
        setLoadErr("Could not load assignment details.");
        return;
      }
      setTask(detail);
      const cl = detail.checklist;
      setChecklist(cl);
      if (detail.responses?.length) {
        const seed = {};
        detail.responses.forEach((r) => {
          seed[r.fieldId] = r.value;
        });
        setResponses(seed);
      }
      setInspNotes(detail.inspectorNotes || "");
      setAddNotes(detail.additionalNotes || "");
    };
    if (id) load();
  }, [id, fetchAssignmentDetail]);

  const progress = computeProgress(checklist, responses);

  const fieldChange = useCallback((fieldId, value) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const buildResponsesArr = () => {
    if (!checklist?.sections) return [];
    const arr = [];
    checklist.sections.forEach((s) =>
      s.fields.forEach((f) => {
        const v = responses[f._id];
        if (v !== undefined && v !== null && v !== "") {
          arr.push({ fieldId: f._id, value: Array.isArray(v) ? v : String(v) });
        }
      }),
    );
    return arr;
  };

  const handleDraft = async () => {
    const result = await saveDraft(id, {
      responses: buildResponsesArr(),
      inspectorNotes: inspNotes,
      additionalNotes: addNotes,
    });
    setSnack({
      open: true,
      msg: result.success ? result.message || "Draft saved!" : result.error,
      sev: result.success ? "success" : "error",
    });
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    const responsesArr = buildResponsesArr();
    fd.append("responses", JSON.stringify(responsesArr));
    fd.append("inspectorNotes", inspNotes);
    fd.append("additionalNotes", addNotes);
    if (signature) fd.append("signature", signature);
    photos.forEach((f) => fd.append("photos", f));
    attachments.forEach((f) => fd.append("attachments", f));

    const result = await submitAssignment(id, fd);
    setSnack({
      open: true,
      msg: result.success
        ? result.message || "Submitted successfully!"
        : result.error,
      sev: result.success ? "success" : "error",
    });
    if (result.success) setTimeout(() => navigate("/team"), 1500);
  };

  const isSubmitted =
    task?.rawStatus === "submitted" ||
    task?.rawStatus === "completed" ||
    task?.rawStatus === "approved";

  if (detailLoading && !task) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            px: { xs: 2, md: 4 },
            pt: 3,
          }}
        >
          <Skeleton width={120} height={36} sx={{ mb: 2 }} />
          <Skeleton width="40%" height={38} sx={{ mb: 1 }} />
          <Skeleton width="30%" height={24} sx={{ mb: 3 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} sx={{ mb: 2, borderRadius: "14px" }}>
              <CardContent sx={{ p: "24px 28px" }}>
                <Skeleton width="30%" height={28} sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {[1, 2, 3, 4].map((j) => (
                    <Grid item xs={12} sm={6} key={j}>
                      <Skeleton height={56} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Box sx={{ minHeight: "100vh", pb: 8 }}>
        <Box px={{ xs: 2, md: 4 }} pt={3}>
          <Button
            startIcon={<ArrowBackIcon sx={{ fontSize: 17 }} />}
            onClick={() => navigate("/team")}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 400,
              mb: 1.5,
              pl: 0,
              "&:hover": { background: "transparent", color: "text.primary" },
            }}
          >
            Back to Tasks
          </Button>

          {loadErr && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loadErr}
            </Alert>
          )}

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.1rem", md: "1.35rem" },
              color: "#0d3d52",
            }}
          >
            {task?.title || checklist?.name || "Inspection Task"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.3} mb={3}>
            {task?.assetName} — {task?.location}
          </Typography>

          <Card sx={{ mb: 2, borderRadius: "14px" }}>
            <CardContent sx={{ px: { xs: "18px", md: "28px" }, py: "22px" }}>
              <Box display="flex" justifyContent="space-between" mb={1.2}>
                <Typography variant="body2" fontWeight={600}>
                  Checklist Progress
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 100,
                  background: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg,#0d3d52,#1a5a78)",
                    borderRadius: 100,
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 2, borderRadius: "14px" }}>
            <CardContent sx={{ px: { xs: "18px", md: "28px" }, py: "24px" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0d3d52",
                  mb: 2.2,
                }}
              >
                Asset Information
              </Typography>
              <Grid container spacing={2}>
                {[
                  ["Asset Name", task?.assetName || "—"],
                  ["Asset ID", task?.assetId || "—"],
                  ["Tag Number", task?.tagNumber || "—"],
                  ["Location", task?.location || "—"],
                  ["Category", task?.category || "—"],
                  ["Customer", task?.customerName || "—"],
                  ["Due Date", task?.due || "—"],
                  ["Checklist Type", checklist?.category || "—"],
                ].map(([lbl, val]) => (
                  <Grid item xs={12} sm={6} key={lbl}>
                    <Typography variant="body2" fontWeight={600} mb={0.7}>
                      {lbl}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={val}
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": { background: "#fafafa" },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {checklist?.sections?.map((section) => (
            <SectionCard
              key={section._id}
              section={section}
              responses={responses}
              onFieldChange={fieldChange}
              disabled={isSubmitted}
            />
          ))}

          <Card sx={{ mb: 2, borderRadius: "14px"  }}>
            <CardContent sx={{ px: { xs: "18px", md: "28px" }, py: "24px" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0d3d52",
                  mb: 2,
                }}
              >
                Inspector Notes
              </Typography>

              <Typography variant="body2" fontWeight={600} mb={0.7}>
                Inspector Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Any notes from inspector…"
                value={inspNotes}
                onChange={(e) => setInspNotes(e.target.value)}
                disabled={isSubmitted}
                sx={{
                  mb: 2.5,
                  "& .MuiOutlinedInput-root": { background: "#fafafa" },
                }}
              />

              <Typography variant="body2" fontWeight={600} mb={0.7}>
                Additional Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Enter any additional observations, issues, or recommendations…"
                value={addNotes}
                onChange={(e) => setAddNotes(e.target.value)}
                disabled={isSubmitted}
                sx={{ "& .MuiOutlinedInput-root": { background: "#fafafa" } }}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 2, borderRadius: "14px" }}>
            <CardContent sx={{ px: { xs: "18px", md: "28px" }, py: "24px" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0d3d52",
                  mb: 2.2,
                }}
              >
                Documentation
              </Typography>

              <Typography variant="body2" fontWeight={600} sx={{ mb: 1.2 }}>
                Upload Photos
              </Typography>
              <UploadZone
                files={photos}
                onChange={setPhotos}
                disabled={isSubmitted}
                accept="image/*"
                multiple
                sx={{width:"1000px"}}
              />

              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ mt: 2.5, mb: 1.2 }}
              >
                Upload Attachments
              </Typography>
              <UploadZone
                files={attachments}
                onChange={setAttachments}
                disabled={isSubmitted}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple
              />

              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ mt: 2.5, mb: 1.2 }}
              >
                Digital Signature
              </Typography>
              <SignaturePad
                onSave={setSignature}
                disabled={isSubmitted}
                existing={task?.signaturePath}
              />
            </CardContent>
          </Card>

          {isSubmitted && (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{ mb: 2, borderRadius: "12px" }}
            >
              This inspection has been <strong>{task?.rawStatus}</strong> and is
              no longer editable.
            </Alert>
          )}

          {!isSubmitted && (
            <Card sx={{ borderRadius: "14px" }}>
              <CardContent sx={{ px: { xs: "18px", md: "24px" }, py: "18px" }}>
                <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    disabled={submitting}
                    onClick={handleDraft}
                    sx={{
                      borderColor: "#e5e7eb",
                      color: "text.primary",
                      borderRadius: "10px",
                      py: 1.3,
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": { background: "#f9fafb" },
                    }}
                  >
                    {submitting ? <CircularProgress size={18} /> : "Save Draft"}
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={submitting || progress < 1}
                    onClick={handleSubmit}
                    sx={{
                      py: 1.3,
                      textTransform: "none",
                      fontWeight: 600,
                      flex: 2,
                      fontSize: "0.95rem",
                      background:
                        "linear-gradient(135deg,#0d3d52 0%,#1a5a78 100%)",
                      borderRadius: "10px",
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={18} sx={{ color: "#fff" }} />
                    ) : (
                      "Submit Inspection"
                    )}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.sev}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}