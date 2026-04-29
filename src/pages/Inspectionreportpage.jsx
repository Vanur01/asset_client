// pages/InspectionReportPage.jsx
import React, { useRef , useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  alpha,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  navy: "#0f4c61",
  ink: "#1a2e3b",
  muted: "#64748b",
  ghost: "#94a3b8",
  border: "#e8edf2",
  white: "#ffffff",
  green: "#16a34a",
  greenIcon: "#22c55e",
  red: "#ef4444",
  amber: "#f59e0b",
  bg: "#f3f5f8",
};

// ─── Styled Components ─────────────────────────────────────────────────────────
const PageWrap = styled(Box)({
  minHeight: "100vh",
  fontFamily: '"DM Sans", "Segoe UI", sans-serif',
});

const TopBar = styled(Box)({
  background: C.white,
  width:"1130px",
  marginLeft:"32px",
  borderBottom: `1px solid ${C.border}`,
  padding: "12px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
  zIndex: 100,
  borderRadius:"10px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  flexWrap: "wrap",
  gap: "12px",
  "@media (max-width: 600px)": {
    padding: "12px 16px",
  },
});

const SectionCard = styled(Paper)({
  borderRadius: 16,
  background: C.white,
  border: `1px solid ${C.border}`,
  boxShadow: "none",
  overflow: "hidden",
  marginBottom: 16,
});

const SectionTitle = styled(Typography)({
  fontSize: "1rem",
  fontWeight: 700,
  color: C.navy,
  padding: "20px 24px 16px",
  "@media (max-width: 600px)": {
    padding: "16px 20px 12px",
    fontSize: "0.9rem",
  },
});

const InfoGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 0,
  padding: "0 24px 20px",
  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
    padding: "0 20px 16px",
  },
});

const InfoCell = styled(Box)({
  padding: "12px 0",
  borderBottom: `1px solid ${C.border}`,
  "&:nth-of-type(odd)": { paddingRight: 24 },
  "&:last-child, &:nth-last-child(2):nth-of-type(odd)": {
    borderBottom: "none",
  },
  "@media (max-width: 600px)": {
    "&:nth-of-type(odd)": { paddingRight: 0 },
  },
});

const InfoLabel = styled(Typography)({
  fontSize: "0.72rem",
  color: C.muted,
  marginBottom: 4,
});

const InfoValue = styled(Typography)({
  fontSize: "0.9rem",
  fontWeight: 700,
  color: C.ink,
});

const SummaryBox = styled(Box)({
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  padding: "18px 16px 14px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  flex: 1,
});

const CheckRow = styled(Box)(({ failed }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "13px 16px",
  borderBottom: `1px solid ${C.border}`,
  background: failed ? alpha(C.red, 0.035) : C.white,
  "&:last-child": { borderBottom: "none" },
  flexWrap: "wrap",
  gap: "8px",
}));

const CheckHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "13px 16px",
  background: C.bg,
  borderBottom: `1px solid ${C.border}`,
  flexWrap: "wrap",
  gap: "8px",
});

const ResultChip = ({ result }) => {
  const isYes = result === "Yes";
  return (
    <Chip
      label={result}
      size="small"
      sx={{
        bgcolor: isYes ? C.greenIcon : C.red,
        color: C.white,
        fontWeight: 700,
        fontSize: "0.7rem",
        height: 24,
        borderRadius: "20px",
        "& .MuiChip-label": { px: "10px" },
      }}
    />
  );
};

const StarRating = ({ rating, max = 5 }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
    {Array.from({ length: max }).map((_, i) =>
      i < rating ? (
        <StarIcon key={i} sx={{ fontSize: "1.4rem", color: C.ink }} />
      ) : (
        <StarOutlineIcon key={i} sx={{ fontSize: "1.4rem", color: C.ink }} />
      ),
    )}
    <Typography sx={{ ml: 0.5, fontSize: "0.85rem", fontWeight: 600, color: C.ink }}>
      {rating}/{max}
    </Typography>
  </Box>
);

// ─── Main Component ─────────────────────────────────────────────────────────────
const InspectionReportPage = ({ report, onBack, token }) => {
  const reportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Transform report data
  const d = {
    id: report._id || 'N/A',
    asset: report.assetName || 'N/A',
    formType: report.checklist?.name || 'Inspection Form',
    status: report.submissionStatus || report.status,
    score: report.overallRating ? (report.overallRating * 20) : null,
    scoreLabel: report.overallRating >= 4 ? 'Excellent' : report.overallRating >= 3 ? 'Good' : 'Needs Improvement',
    itemsPassed: report.responses?.filter(r => r.answer === 'Yes' || r.value === true).length || 0,
    itemsFailed: report.responses?.filter(r => r.answer === 'No' || r.value === false).length || 0,
    notApplicable: report.responses?.filter(r => r.answer === 'N/A').length || 0,
    assetName: report.assetName || 'N/A',
    location: report.assetDetails?.location || 'N/A',
    category: report.assetDetails?.category || 'General',
    lastInspection: report.previousInspectionDate || 'N/A',
    inspectorName: report.primaryMember?.name || 'Unknown',
    overallCondition: report.overallRating >= 4 ? 'Excellent' : report.overallRating >= 3 ? 'Good' : 'Fair',
    submittedDate: report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : 'N/A',
    rating: report.overallRating || 0,
    inspectorNotes: report.inspectorNotes || 'No additional notes',
    adminNotes: report.adminNotes || 'No admin notes',
    checklist: {
      title: report.checklist?.name || 'Inspection Checklist',
      passed: report.responses?.filter(r => r.answer === 'Yes' || r.value === true).length || 0,
      total: report.responses?.length || 0,
      items: report.responses?.map(r => ({
        label: r.questionText || r.question || 'Question',
        result: r.answer === 'Yes' || r.value === true ? 'Yes' : r.answer === 'No' || r.value === false ? 'No' : 'N/A',
        note: r.notes || r.comments || null,
      })) || [],
    },
  };

  const scoreColor = d.score >= 90 ? C.green : d.score >= 75 ? C.amber : C.red;

  // Download PDF function
  const downloadPDF = async () => {
    setExporting(true);
    try {
      const element = reportRef.current;
      if (!element) return;

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `inspection_report_${d.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
      
      setSnackbar({
        open: true,
        message: 'PDF downloaded successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbar({
        open: true,
        message: 'Failed to generate PDF',
        severity: 'error'
      });
    } finally {
      setExporting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <PageWrap>
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <TopBar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            onClick={onBack}
            sx={{ color: C.muted, "&:hover": { color: C.ink, bgcolor: C.bg } }}
          >
            <ArrowBackIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
          <Box>
            <Typography sx={{ fontSize: "0.65rem", color: C.ghost, lineHeight: 1 }}>
              Inspection Report
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                fontWeight: 800,
                color: C.ink,
                lineHeight: 1.3,
              }}
            >
              {d.formType} - {d.asset}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Chip
            label={d.status === 'pending_review' ? 'Under Review' : d.status}
            size="small"
            sx={{
              bgcolor: d.status === 'approved' || d.status === 'reviewed' ? C.green : C.red,
              color: C.white,
              fontWeight: 700,
              fontSize: "0.72rem",
              height: 30,
              borderRadius: "8px",
              "& .MuiChip-label": { px: "12px" },
            }}
          />
          <Button
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: "0.9rem !important" }} />}
            onClick={downloadPDF}
            disabled={exporting}
            sx={{
              borderRadius: 2,
              bgcolor: C.navy,
              color: C.white,
              fontWeight: 600,
              fontSize: "0.8rem",
              textTransform: "none",
              py: 0.7,
              px: 2,
              boxShadow: `0 3px 10px ${alpha(C.navy, 0.22)}`,
              "&:hover": { bgcolor: alpha(C.navy, 0.88) },
            }}
          >
            {exporting ? <CircularProgress size={16} color="inherit" /> : 'Download PDF'}
          </Button>
        </Box>
      </TopBar>

      {/* ── Report Content for PDF/Print ────────────────────────────────── */}
      <Box ref={reportRef}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
          
          {/* Report Header - Print Only */}
          <Box sx={{ textAlign: 'center', mb: 3, display: { xs: 'none', print: 'block' } }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: C.navy }}>
              AssetInspect
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: C.muted }}>
              Inspection Report
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: C.ghost, mt: 1 }}>
              Generated on {new Date().toLocaleDateString()}
            </Typography>
          </Box>

          {/* ── Row 1: Score + Summary ───────────────────────────────────── */}
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
            {/* Overall Score card */}
            <SectionCard sx={{ minWidth: { sm: 200 }, flex: { sm: "0 0 250px" } }}>
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.72rem", color: C.muted, mb: 1.5 }}>
                  Overall Score
                </Typography>
                <Typography
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: scoreColor,
                    lineHeight: 1,
                  }}
                >
                  {d.score || '–'}%
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: C.muted, mt: 1 }}>
                  {d.scoreLabel}
                </Typography>
              </Box>
            </SectionCard>

            {/* Inspection Summary card */}
            <SectionCard sx={{ flex: 1 }}>
              <Box sx={{ p: 3 }}>
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: C.ink,
                    mb: 2,
                  }}
                >
                  Inspection Summary
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <SummaryBox>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        bgcolor: alpha(C.greenIcon, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: "1.3rem", color: C.greenIcon }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        color: C.ink,
                        lineHeight: 1,
                      }}
                    >
                      {d.itemsPassed}
                    </Typography>
                    <Typography sx={{ fontSize: "0.68rem", color: C.muted }}>
                      Items Passed
                    </Typography>
                  </SummaryBox>

                  <SummaryBox>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        bgcolor: alpha(C.red, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CancelOutlinedIcon
                        sx={{ fontSize: "1.3rem", color: C.red }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        color: C.red,
                        lineHeight: 1,
                      }}
                    >
                      {d.itemsFailed}
                    </Typography>
                    <Typography sx={{ fontSize: "0.68rem", color: C.muted }}>
                      Items Failed
                    </Typography>
                  </SummaryBox>

                  <SummaryBox>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        bgcolor: alpha(C.ghost, 0.12),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <WarningAmberOutlinedIcon
                        sx={{ fontSize: "1.3rem", color: C.ghost }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        color: C.ink,
                        lineHeight: 1,
                      }}
                    >
                      {d.notApplicable}
                    </Typography>
                    <Typography sx={{ fontSize: "0.68rem", color: C.muted }}>
                      N/A
                    </Typography>
                  </SummaryBox>
                </Box>
              </Box>
            </SectionCard>
          </Box>

          {/* ── Asset Information ────────────────────────────────────────── */}
          <SectionCard>
            <SectionTitle>Asset Information</SectionTitle>
            <InfoGrid>
              <InfoCell>
                <InfoLabel>Asset Name</InfoLabel>
                <InfoValue>{d.assetName}</InfoValue>
              </InfoCell>
              <InfoCell>
                <InfoLabel>Location</InfoLabel>
                <InfoValue>{d.location}</InfoValue>
              </InfoCell>
              <InfoCell>
                <InfoLabel>Category</InfoLabel>
                <InfoValue>{d.category}</InfoValue>
              </InfoCell>
              <InfoCell>
                <InfoLabel>Last Inspection</InfoLabel>
                <InfoValue>{d.lastInspection}</InfoValue>
              </InfoCell>
            </InfoGrid>
          </SectionCard>

          {/* ── Inspection Details ───────────────────────────────────────── */}
          <SectionCard>
            <SectionTitle>Inspection Details</SectionTitle>
            <InfoGrid>
              <InfoCell>
                <InfoLabel>Inspector Name</InfoLabel>
                <InfoValue>{d.inspectorName}</InfoValue>
              </InfoCell>
              <InfoCell>
                <InfoLabel>Overall Condition</InfoLabel>
                <InfoValue>{d.overallCondition}</InfoValue>
              </InfoCell>
              <InfoCell>
                <InfoLabel>Submitted Date</InfoLabel>
                <InfoValue>{d.submittedDate}</InfoValue>
              </InfoCell>
              <InfoCell>
                <InfoLabel>Inspection ID</InfoLabel>
                <InfoValue>{d.id}</InfoValue>
              </InfoCell>
            </InfoGrid>
          </SectionCard>

          {/* ── Inspection Checklist ─────────────────────────────────────────── */}
          <SectionCard>
            <SectionTitle>{d.checklist.title}</SectionTitle>
            <Box
              sx={{
                mx: { xs: 2, sm: 3 },
                mb: 3,
                borderRadius: 2.5,
                border: `1px solid ${C.border}`,
                overflow: "hidden",
              }}
            >
              <CheckHeader>
                <Typography
                  sx={{ fontSize: "0.82rem", fontWeight: 700, color: C.ink }}
                >
                  Checklist Items
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: C.muted }}>
                  {d.checklist.passed}/{d.checklist.total} passed
                </Typography>
              </CheckHeader>
              {d.checklist.items.map((item, i) => (
                <CheckRow key={i} failed={item.result === "No"}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{ fontSize: "0.82rem", color: C.ink, fontWeight: 500 }}
                    >
                      {item.label}
                    </Typography>
                    {item.note && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.3,
                        }}
                      >
                        <InfoOutlinedIcon
                          sx={{ fontSize: "0.75rem", color: C.muted }}
                        />
                        <Typography sx={{ fontSize: "0.7rem", color: C.muted }}>
                          Note: {item.note}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <ResultChip result={item.result} />
                </CheckRow>
              ))}
            </Box>
          </SectionCard>

          {/* ── Inspector Notes ───────────────────────────────────────── */}
          <SectionCard>
            <SectionTitle>Inspector Notes</SectionTitle>
            <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
              <Typography sx={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.6 }}>
                {d.inspectorNotes}
              </Typography>
            </Box>
          </SectionCard>

          {/* ── Admin Notes (if any) ───────────────────────────────────────── */}
          {d.adminNotes !== 'No admin notes' && (
            <SectionCard>
              <SectionTitle>Admin Review Notes</SectionTitle>
              <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
                <Typography sx={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.6 }}>
                  {d.adminNotes}
                </Typography>
              </Box>
            </SectionCard>
          )}

          {/* ── Performance Rating ───────────────────────────────────────── */}
          <SectionCard>
            <SectionTitle>Performance Rating</SectionTitle>
            <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
              <StarRating rating={d.rating} />
            </Box>
          </SectionCard>

          {/* Footer - Print Only */}
          <Box sx={{ textAlign: 'center', mt: 4, pt: 2, borderTop: `1px solid ${C.border}`, display: { xs: 'none', print: 'block' } }}>
            <Typography sx={{ fontSize: '0.65rem', color: C.ghost }}>
              © {new Date().getFullYear()} AssetInspect - Inspection Report
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: C.ghost, mt: 0.5 }}>
              This is a computer-generated document and does not require a signature.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageWrap>
  );
};

export default InspectionReportPage;