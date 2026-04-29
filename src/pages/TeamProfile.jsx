// pages/team/Profile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
  Badge,
  Tooltip,
  Fade,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  LinearProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { TeamProvider, useTeam } from '../context/TeamContext';

// Icons
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SpeedIcon from '@mui/icons-material/Speed';

// ─── Animations ────────────────────────────────────────────────────────────────
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.35); }
  50%       { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
`;

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TOKEN = {
  navy:    '#0f4c61',
  navyDim: alpha('#0f4c61', 0.08),
  navyMid: alpha('#0f4c61', 0.15),
  ink:     '#1e293b',
  muted:   '#64748b',
  ghost:   '#94a3b8',
  surface: '#f8fafc',
  white:   '#ffffff',
  border:  alpha('#cbd5e1', 0.45),
  green:   '#10b981',
  greenBg: alpha('#10b981', 0.1),
  red:     '#ef4444',
  redBg:   alpha('#ef4444', 0.1),
  radius:  14,
  radiusSm: 10,
};

// ─── Styled Components ─────────────────────────────────────────────────────────

const PageContainer = styled(Box)({
  minHeight: '100vh',
  padding: '20px 16px 40px',
  '@media (min-width:900px)': { padding: '28px 24px 48px' },
});

const Card = styled(Paper)({
  borderRadius: TOKEN.radius,
  background: TOKEN.white,
  border: `1px solid ${TOKEN.border}`,
  boxShadow: '0 2px 8px rgba(15,76,97,0.04), 0 1px 2px rgba(0,0,0,0.04)',
  overflow: 'hidden',
  animation: `${fadeSlideUp} 0.35s ease both`,
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 28px rgba(15,76,97,0.09)',
    borderColor: alpha(TOKEN.navy, 0.18),
  },
});

const SectionHeader = styled(Box)({
  padding: '12px 20px',
  borderBottom: `1px solid ${TOKEN.border}`,
  background: `linear-gradient(90deg, ${alpha(TOKEN.surface, 0.8)}, ${TOKEN.white})`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const IconBox = styled(Box)({
  width: 28,
  height: 28,
  borderRadius: 8,
  background: TOKEN.navyDim,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& .MuiSvgIcon-root': { fontSize: '0.85rem', color: TOKEN.navy },
});

const StyledField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: TOKEN.radiusSm,
    fontSize: '0.78rem',
    background: TOKEN.white,
    transition: 'box-shadow 0.15s ease',
    '& fieldset': { borderColor: TOKEN.border, borderWidth: 1 },
    '&:hover fieldset': { borderColor: alpha(TOKEN.navy, 0.35) },
    '&.Mui-focused': {
      boxShadow: `0 0 0 3px ${alpha(TOKEN.navy, 0.08)}`,
    },
    '&.Mui-focused fieldset': { borderColor: TOKEN.navy, borderWidth: 1.5 },
    '&.Mui-disabled': { background: TOKEN.surface },
    '&.Mui-disabled fieldset': { borderColor: TOKEN.border },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.78rem',
    padding: '9px 12px',
    color: TOKEN.ink,
    '&::placeholder': { color: TOKEN.ghost, opacity: 1 },
  },
  '& .MuiInputBase-input.Mui-disabled': { color: TOKEN.muted, WebkitTextFillColor: TOKEN.muted },
  '& .MuiInputLabel-root': { fontSize: '0.7rem', color: TOKEN.muted },
  '& .MuiInputBase-inputMultiline': {
    fontSize: '0.78rem',
    lineHeight: 1.6,
    padding: '9px 12px',
  },
});

const PrimaryBtn = styled(Button)({
  background: TOKEN.navy,
  color: TOKEN.white,
  fontWeight: 600,
  fontSize: '0.72rem',
  padding: '7px 18px',
  borderRadius: TOKEN.radiusSm,
  textTransform: 'none',
  letterSpacing: '0.2px',
  boxShadow: `0 3px 10px ${alpha(TOKEN.navy, 0.22)}`,
  transition: 'all 0.18s ease',
  '&:hover': {
    background: alpha(TOKEN.navy, 0.88),
    transform: 'translateY(-1px)',
    boxShadow: `0 5px 16px ${alpha(TOKEN.navy, 0.28)}`,
  },
  '&:active': { transform: 'translateY(0)' },
  '&.Mui-disabled': { background: alpha(TOKEN.navy, 0.4), color: TOKEN.white },
});

const SecondaryBtn = styled(Button)({
  color: TOKEN.muted,
  fontWeight: 500,
  fontSize: '0.72rem',
  padding: '7px 18px',
  borderRadius: TOKEN.radiusSm,
  textTransform: 'none',
  border: `1px solid ${TOKEN.border}`,
  background: TOKEN.white,
  transition: 'all 0.18s ease',
  '&:hover': {
    background: TOKEN.surface,
    borderColor: alpha(TOKEN.navy, 0.3),
    color: TOKEN.navy,
  },
});

const InfoRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 0',
  '& .MuiSvgIcon-root': { fontSize: '0.85rem', color: TOKEN.ghost },
});

const Label = styled(Typography)({
  fontSize: '0.58rem',
  fontWeight: 700,
  color: TOKEN.ghost,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: 4,
});

const StatBadge = styled(Box)(({ color = TOKEN.navy }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 8px',
  borderRadius: 20,
  background: alpha(color, 0.08),
  color: color,
  fontSize: '0.58rem',
  fontWeight: 700,
  letterSpacing: '0.3px',
}));

// ─── ProfileContent ─────────────────────────────────────────────────────────────
const ProfileContent = () => {
  const theme = useTheme();
  const {
    profile,
    loading,
    updateTeamProfile,
    changePassword,
    formatDate,
    formatJoinDate,
    getFullName,
    getInitials,
    fetchTeamProfile,
  } = useTeam();

  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', location: '', bio: '', department: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName:  profile.firstName  || '',
        lastName:   profile.lastName   || '',
        phone:      profile.phone      || '',
        location:   profile.location   || '',
        bio:        profile.bio        || '',
        department: profile.department || '',
      });
    }
  }, [profile]);

  useEffect(() => { fetchTeamProfile(); }, [fetchTeamProfile]);

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async () => {
    const r = await updateTeamProfile(formData);
    setSnackbar({ open: true, message: r.success ? r.message : r.error, severity: r.success ? 'success' : 'error' });
    if (r.success) setIsEditing(false);
  };

  const handleChangePassword = async () => {
    const r = await changePassword(passwordData.currentPassword, passwordData.newPassword, passwordData.confirmPassword);
    setSnackbar({ open: true, message: r.success ? r.message : r.error, severity: r.success ? 'success' : 'error' });
    if (r.success) setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      firstName:  profile?.firstName  || '',
      lastName:   profile?.lastName   || '',
      phone:      profile?.phone      || '',
      location:   profile?.location   || '',
      bio:        profile?.bio        || '',
      department: profile?.department || '',
    });
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress sx={{ color: TOKEN.navy }} size={32} />
      </Box>
    );
  }

  const isActive       = profile?.status === 'active';
  const completionRate = profile?.stats?.completionRate || 0;
  const assignedCount  = profile?.stats?.assignedCount  || 0;

  const pwdFields = [
    { key: 'current', name: 'currentPassword', label: 'Current Password',     placeholder: 'Enter current password' },
    { key: 'next',    name: 'newPassword',      label: 'New Password',         placeholder: 'Min. 6 characters' },
    { key: 'confirm', name: 'confirmPassword',  label: 'Confirm New Password', placeholder: 'Re-enter new password' },
  ];

  return (
    <PageContainer>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 1.5, md: 2 } }}>
        <Grid container spacing={2.5}>

          {/* ── Left Column ─────────────────────────────────────────────────── */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2.5}>

              {/* Identity Card */}
              <Card>
                {/* Tinted header strip */}
                <Box sx={{
                  height: 72,
                  background: `linear-gradient(135deg, ${TOKEN.navy} 0%, ${alpha(TOKEN.navy, 0.75)} 100%)`,
                  position: 'relative',
                }} />

                <Box sx={{ px: 2.5, pb: 2.5 }}>
                  {/* Avatar overlap */}
                  <Box sx={{ mt: '-38px', mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box sx={{
                          width: 13, height: 13,
                          bgcolor: isActive ? TOKEN.green : TOKEN.red,
                          border: '2.5px solid #fff',
                          borderRadius: '50%',
                          animation: isActive ? `${pulse} 2.5s infinite` : 'none',
                        }} />
                      }
                    >
                      <Avatar sx={{
                        width: 72, height: 72,
                        bgcolor: TOKEN.navy,
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        border: '3px solid #fff',
                        boxShadow: '0 4px 14px rgba(15,76,97,0.25)',
                        letterSpacing: '-0.5px',
                      }}>
                        {getInitials()}
                      </Avatar>
                    </Badge>
                    <Chip
                      label={isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        letterSpacing: '0.3px',
                        bgcolor: isActive ? TOKEN.greenBg : TOKEN.redBg,
                        color:   isActive ? TOKEN.green   : TOKEN.red,
                        border:  `1px solid ${isActive ? alpha(TOKEN.green, 0.25) : alpha(TOKEN.red, 0.25)}`,
                      }}
                    />
                  </Box>

                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: TOKEN.ink, lineHeight: 1.2 }}>
                    {getFullName()}
                  </Typography>
                  <Typography sx={{ color: TOKEN.muted, fontSize: '0.68rem', mt: 0.25, mb: 1.5 }}>
                    {profile?.roleDisplay || profile?.teamRole || 'Team Member'}
                  </Typography>

                  <Divider sx={{ borderColor: TOKEN.border, mb: 1.5 }} />

                  <Stack spacing={0.8}>
                    {[
                      { icon: <MailOutlineIcon />,   text: profile?.email        || 'N/A' },
                      { icon: <PhoneIcon />,          text: profile?.phone        || 'Not provided' },
                      { icon: <LocationOnIcon />,     text: profile?.location     || 'Not specified' },
                      { icon: <BusinessCenterIcon />, text: profile?.organization || 'N/A' },
                      { icon: <CalendarTodayIcon />,  text: `Joined ${formatJoinDate(profile?.joinDate)}` },
                    ].map(({ icon, text }, i) => (
                      <InfoRow key={i}>
                        {icon}
                        <Typography sx={{ fontSize: '0.72rem', color: '#475569', fontWeight: 500 }}>{text}</Typography>
                      </InfoRow>
                    ))}
                  </Stack>
                </Box>
              </Card>

              {/* Change Password Card */}
              <Card>
                <SectionHeader>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconBox><LockIcon /></IconBox>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: TOKEN.ink }}>Change Password</Typography>
                  </Box>
                </SectionHeader>

                <Box sx={{ p: 2.5 }}>
                  <Stack spacing={1.6}>
                    {pwdFields.map(({ key, name, label, placeholder }) => (
                      <Box key={key}>
                        <Label>{label}</Label>
                        <StyledField
                          fullWidth
                          size="small"
                          name={name}
                          type={showPwd[key] ? 'text' : 'password'}
                          placeholder={placeholder}
                          value={passwordData[name]}
                          onChange={handlePasswordChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))}
                                  edge="end" size="small"
                                  sx={{ p: 0.4, color: TOKEN.ghost, '&:hover': { color: TOKEN.navy } }}
                                >
                                  {showPwd[key]
                                    ? <VisibilityOffIcon sx={{ fontSize: '0.85rem' }} />
                                    : <VisibilityIcon   sx={{ fontSize: '0.85rem' }} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    ))}

                    <PrimaryBtn
                      fullWidth
                      startIcon={<LockIcon sx={{ fontSize: '0.85rem !important' }} />}
                      onClick={handleChangePassword}
                      disabled={loading}
                      sx={{ mt: 0.5 }}
                    >
                      {loading ? <CircularProgress size={14} color="inherit" /> : 'Update Password'}
                    </PrimaryBtn>
                  </Stack>
                </Box>
              </Card>
            </Stack>
          </Grid>

          {/* ── Right Column ────────────────────────────────────────────────── */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2.5}>

              {/* Personal Information Card */}
              <Card sx={{width:"800px"}}>
                <SectionHeader>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconBox><BadgeIcon /></IconBox>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: TOKEN.ink }}>Personal Information</Typography>
                  </Box>
                  <Tooltip title={isEditing ? 'Cancel editing' : 'Edit profile'} arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                      sx={{
                        color:   isEditing ? TOKEN.red   : TOKEN.navy,
                        bgcolor: isEditing ? TOKEN.redBg : TOKEN.navyDim,
                        width: 30, height: 30,
                        transition: 'all 0.18s ease',
                        '&:hover': {
                          bgcolor: isEditing ? alpha(TOKEN.red, 0.16) : TOKEN.navyMid,
                        },
                      }}
                    >
                      {isEditing
                        ? <CancelIcon sx={{ fontSize: '0.9rem' }} />
                        : <EditIcon   sx={{ fontSize: '0.9rem' }} />}
                    </IconButton>
                  </Tooltip>
                </SectionHeader>

                <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Grid container spacing={1.8}>
                    {/* First Name */}
                    <Grid item xs={12} sm={6} sx={{width:"228px"}}>
                      <Label>First Name</Label>
                      <StyledField fullWidth size="small" name="firstName" value={formData.firstName} onChange={handleFormChange} disabled={!isEditing} />
                    </Grid>

                    {/* Last Name */}
                    <Grid item xs={12} sm={6} sx={{width:"228px"}}>
                      <Label>Last Name</Label>
                      <StyledField fullWidth size="small" name="lastName" value={formData.lastName} onChange={handleFormChange} disabled={!isEditing} />
                    </Grid>

                    {/* Email (read-only) */}
                    <Grid item xs={12} sm={6} sx={{width:"228px"}}>
                      <Label>Email Address</Label>
                      <StyledField
                        fullWidth size="small" type="email"
                        value={profile?.email || ''} disabled
                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: '0.8rem', color: TOKEN.ghost }} /></InputAdornment> }}
                      />
                    </Grid>

                    {/* Department */}
                    <Grid item xs={12} sm={6}>
                      <Label>Department</Label>
                      <StyledField
                        fullWidth size="small" name="department"
                        value={formData.department} onChange={handleFormChange} disabled={!isEditing}
                        InputProps={{ startAdornment: <InputAdornment position="start"><WorkIcon sx={{ fontSize: '0.8rem', color: TOKEN.ghost }} /></InputAdornment> }}
                      />
                    </Grid>

                    {/* Phone */}
                    <Grid item xs={12} sm={6}>
                      <Label>Phone Number</Label>
                      <StyledField
                        fullWidth size="small" name="phone"
                        value={formData.phone} onChange={handleFormChange} disabled={!isEditing}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PhoneInTalkIcon sx={{ fontSize: '0.8rem', color: TOKEN.ghost }} /></InputAdornment> }}
                      />
                    </Grid>

                    {/* Location */}
                    <Grid item xs={12} sm={6}>
                      <Label>Location</Label>
                      <StyledField
                        fullWidth size="small" name="location"
                        value={formData.location} onChange={handleFormChange} disabled={!isEditing}
                        InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ fontSize: '0.8rem', color: TOKEN.ghost }} /></InputAdornment> }}
                      />
                    </Grid>

                    {/* Bio */}
                    <Grid item xs={12} sx={{width:"230px"}}>
                      <Label>Bio</Label>
                      <StyledField
                        fullWidth multiline rows={1} name="bio"
                        value={formData.bio} onChange={handleFormChange}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself…"
                      />
                    </Grid>
                  </Grid>

                  {/* Save / Cancel */}
                  <Fade in={isEditing}>
                    <Box sx={{
                      display: isEditing ? 'flex' : 'none',
                      justifyContent: 'flex-end',
                      gap: 1.5, mt: 2.5,
                      pt: 2,
                      borderTop: `1px solid ${TOKEN.border}`,
                      flexDirection: { xs: 'column', sm: 'row' },
                    }}>
                      <SecondaryBtn startIcon={<CancelIcon sx={{ fontSize: '0.85rem !important' }} />} onClick={handleCancelEdit}>
                        Discard
                      </SecondaryBtn>
                      <PrimaryBtn startIcon={<SaveIcon sx={{ fontSize: '0.85rem !important' }} />} onClick={handleUpdateProfile} disabled={loading}>
                        {loading ? <CircularProgress size={14} color="inherit" /> : 'Save Changes'}
                      </PrimaryBtn>
                    </Box>
                  </Fade>
                </Box>
              </Card>

              {/* Performance Overview Card */}
              <Card>
                <SectionHeader>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconBox><AssignmentIcon /></IconBox>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: TOKEN.ink }}>Performance Overview</Typography>
                  </Box>
                  <StatBadge color={TOKEN.green}>
                    <TrendingUpIcon sx={{ fontSize: '0.65rem' }} /> Active
                  </StatBadge>
                </SectionHeader>

                <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Grid container spacing={2}>

                    {/* Assigned Tasks */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: TOKEN.surface,
                        border: `1px solid ${TOKEN.border}`,
                        display: 'flex',
                        width:"250px",
                        alignItems: 'center',
                        gap: 1.5,
                      }}>
                        <Box sx={{
                          width: 40, height: 40,
                          borderRadius: 3,
                          background: TOKEN.navyDim,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <TaskAltIcon sx={{ fontSize: '1.1rem', color: TOKEN.navy }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.6rem', color: TOKEN.ghost, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            Assigned Tasks
                          </Typography>
                          <Typography sx={{ fontSize: '1.45rem', fontWeight: 800, color: TOKEN.ink, lineHeight: 1.1 }}>
                            {assignedCount}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Completion Rate */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: TOKEN.surface,
                        border: `1px solid ${TOKEN.border}`,
                        display: 'flex',
                        width:"250px",
                        alignItems: 'center',
                        gap: 1.5,
                      }}>
                        <Box sx={{
                          width: 40, height: 40,
                          borderRadius: 10,
                          background: TOKEN.greenBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <SpeedIcon sx={{ fontSize: '1.1rem', color: TOKEN.green }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: '0.6rem', color: TOKEN.ghost, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            Completion Rate
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '1.45rem', fontWeight: 800, color: TOKEN.ink, lineHeight: 1.1 }}>
                              {completionRate}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: TOKEN.muted }}>%</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Progress bar */}
                    <Grid item xs={12}>
                      <Box sx={{ px: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: TOKEN.muted, fontWeight: 600 }}>Task Progress</Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: TOKEN.navy, fontWeight: 700 }}>{completionRate}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={completionRate}
                          sx={{
                            height: 6, borderRadius: 99,
                            bgcolor: TOKEN.navyDim,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 99,
                              background: `linear-gradient(90deg, ${TOKEN.navy}, ${alpha(TOKEN.green, 0.85)})`,
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2, borderColor: TOKEN.border }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.65rem', color: TOKEN.ghost }}>
                      Last login: <Box component="span" sx={{ color: TOKEN.muted, fontWeight: 600 }}>{formatDate(profile?.lastLoginDate)}</Box>
                    </Typography>
                    <StatBadge color={TOKEN.navy}>
                      <CheckCircleIcon sx={{ fontSize: '0.65rem' }} /> In Good Standing
                    </StatBadge>
                  </Box>
                </Box>
              </Card>

            </Stack>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ borderTop: `1px solid ${TOKEN.border}`, mt: 4, pt: 2.5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.6rem', color: TOKEN.ghost }}>
            © 2026 Profile Management System · All rights reserved
          </Typography>
        </Box>
      </Container>

      {/* Toast */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          icon={snackbar.severity === 'success' ? <CheckCircleIcon /> : undefined}
          sx={{
            borderRadius: TOKEN.radiusSm,
            fontSize: '0.75rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

// ─── Root export ───────────────────────────────────────────────────────────────
const Profile = () => (
  <TeamProvider>
    <ProfileContent />
  </TeamProvider>
);

export default Profile;