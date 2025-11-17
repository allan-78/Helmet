import { Box, Container, Typography, Button, Grid, Stack, Chip } from '@mui/material';
import { ArrowForward, ShoppingBag, Shield, EmojiPeople, LocalFireDepartment } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const HERO_BG =
  'https://images.unsplash.com/photo-1611004061856-ccc3cbe944b2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const HERO_HELMET =
  'data:image/jpeg;base64,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';

const Hero = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '80vh', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(120deg, #050505 0%, #0f0f0f 55%, #050505 100%)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.25,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip
              label="NEW DROP · STEALTH COLLECTION"
              sx={{
                mb: 3,
                bgcolor: 'rgba(255,255,255,0.08)',
                color: 'primary.light',
                fontWeight: 600,
                letterSpacing: 1.2,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.8rem', md: '3.5rem', lg: '4.5rem' },
                mb: 2,
                lineHeight: 1.1,
                color: 'white',
              }}
            >
              Ride Safe with{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Premium Helmets
              </Box>
            </Typography>

            <Typography variant="h6" sx={{ mb: 4, maxWidth: 520, color: 'rgba(255,255,255,0.7)' }}>
              Discover top-quality motorcycle helmets engineered for ultimate protection and comfort.
              Your safety is our priority.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 6 }}>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                endIcon={<ShoppingBag />}
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: '1rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)',
                  },
                }}
              >
                Shop Now
              </Button>
              <Button
                component={Link}
                to="/about"
                variant="outlined"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  px: 5,
                  py: 1.5,
                  fontSize: '1rem',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderColor: 'primary.light',
                    color: 'primary.light',
                  },
                }}
              >
                Learn More
              </Button>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={4}
              sx={{ color: 'white', opacity: 0.9 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Shield sx={{ color: 'primary.main', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Premium Helmets
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Safety Certified
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmojiPeople sx={{ color: 'primary.main', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    50K+
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Happy Customers
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocalFireDepartment sx={{ color: 'primary.main', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    4.9 / 5
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Average Rating
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 320, md: 520 },
                borderRadius: '40px',
                overflow: 'hidden',
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255,107,53,0.4), transparent 50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={HERO_HELMET}
                alt="Premium Helmet"
                sx={{
                  width: '90%',
                  maxWidth: 520,
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
                  objectFit: 'contain',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 12,
                  borderRadius: '36px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;