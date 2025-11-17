import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Email, HeadsetMic } from '@mui/icons-material';

const HomeCta = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        background: 'radial-gradient(circle at top, rgba(255,107,53,0.16), transparent 60%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 4, color: 'primary.light' }}>
          READY TO RIDE
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, maxWidth: 720, lineHeight: 1.2 }}>
          Book a fitting session or get matched with the perfect helmet today.
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', maxWidth: 640, lineHeight: 1.6 }}
        >
          Our gear experts are online 7 days a week to answer fit, safety, and tech questions. We
          also send exclusive drops straight to your inbox.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          <Button
            component={Link}
            to="/contact"
            variant="contained"
            size="large"
            startIcon={<HeadsetMic />}
            sx={{ minWidth: 220 }}
          >
            Talk to an Expert
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            size="large"
            startIcon={<Email />}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              minWidth: 220,
              '&:hover': {
                borderColor: 'primary.light',
                color: 'primary.light',
              },
            }}
          >
            Join the Newsletter
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomeCta;

