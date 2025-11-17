import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Stack,
} from '@mui/material';
import { CameraAlt, Save } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const profileSchema = yup.object({
    name: yup.string().required('Full name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    phoneNumber: yup.string().nullable(),
  });

  const passwordSchema = yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm your password'),
  });

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
    resolver: yupResolver(profileSchema),
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    resetProfile({
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
  }, [user, resetProfile]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // TODO: Implement avatar upload logic here
    toast.info(`Selected file: ${file.name}. Upload logic not yet implemented.`);
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);

    try {
      const { data } = await api.put('/user/profile', values);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);

    try {
      await api.put('/user/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed successfully!');
      resetPasswordForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, rgba(255,107,53,0.18), transparent 60%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(0,0,0,0.85))',
                border: '1px solid rgba(255,107,53,0.4)',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={user?.avatar?.url}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <Button variant="outlined" startIcon={<CameraAlt />} onClick={handleAvatarClick}>
                  Change Photo
                </Button>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" color="primary.light" sx={{ letterSpacing: 4 }}>
                  PROFILE
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {[
                    { label: 'Orders', value: user?.orderCount ?? 0 },
                    { label: 'Wishlist', value: 0 },
                    { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString() },
                  ].map((stat) => (
                    <Grid item xs={4} key={stat.label}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                background: 'rgba(18,18,18,0.95)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Account Details
              </Typography>
              <form onSubmit={handleProfileSubmit(handleUpdateProfile)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="name"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Full Name"
                          error={!!profileErrors.name}
                          helperText={profileErrors.name?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="email"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email"
                          type="email"
                          error={!!profileErrors.email}
                          helperText={profileErrors.email?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="phoneNumber"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone Number"
                          error={!!profileErrors.phoneNumber}
                          helperText={profileErrors.phoneNumber?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={loading}
                      sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'rgba(18,18,18,0.95)',
                border: '1px solid rgba(255,255,255,0.05)',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Security
              </Typography>
              <form onSubmit={handlePasswordSubmit(handleChangePassword)}>
                <Stack spacing={2}>
                  <Controller
                    name="currentPassword"
                    control={passwordControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Current Password"
                        type="password"
                        error={!!passwordErrors.currentPassword}
                        helperText={passwordErrors.currentPassword?.message}
                      />
                    )}
                  />
                  <Controller
                    name="newPassword"
                    control={passwordControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="New Password"
                        type="password"
                        helperText={passwordErrors.newPassword?.message || 'At least 6 characters'}
                        error={!!passwordErrors.newPassword}
                      />
                    )}
                  />
                  <Controller
                    name="confirmPassword"
                    control={passwordControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        error={!!passwordErrors.confirmPassword}
                        helperText={passwordErrors.confirmPassword?.message}
                      />
                    )}
                  />
                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={loading}
                    sx={{ borderColor: 'primary.main' }}
                  >
                    Update Password
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
