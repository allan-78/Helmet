import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { ArrowForward, ShoppingBag } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(circle, #FF6B35 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                mb: 2,
                lineHeight: 1.2,
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

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 500 }}
            >
              Discover top-quality motorcycle helmets designed for ultimate protection and comfort. Your safety is our priority.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                endIcon={<ShoppingBag />}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                  px: 4,
                  py: 1.5,
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
                  px: 4,
                  py: 1.5,
                }}
              >
                Learn More
              </Button>
            </Box>

            {/* Features */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={6} sm={4}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  500+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Premium Helmets
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  50K+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Happy Customers
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  100%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Safety Certified
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Side - Hero Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 300, md: 500 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Placeholder for helmet image */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 140, 66, 0.1) 100%)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px solid rgba(255, 107, 53, 0.3)',
                }}
              >
                <Typography variant="h1" sx={{ opacity: 0.3 }}>
                  🪖
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
