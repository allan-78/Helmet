import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const ForgotPasswordPage = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '' },
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email }) => {
    setSending(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, rgba(255,107,53,0.15), transparent 60%)',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'rgba(15,15,15,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Typography variant="overline" color="primary.light" sx={{ letterSpacing: 4 }}>
            PASSWORD RESET
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
            Forgot your password?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Enter your account email and we’ll send you a secure link to create a new password.
          </Typography>

          {sent ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Email sent!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Check your inbox for the reset link. Didn’t get it? Make sure to check spam or request
                another.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/login')} fullWidth>
                Back to Login
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 3 }}
                  />
                )}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={sending}
                sx={{ mb: 2 }}
              >
                {sending ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Remembered your password?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography component="span" color="primary">
                    Log back in
                  </Typography>
                </Link>
              </Typography>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;

