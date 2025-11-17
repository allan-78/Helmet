import { Box, Container, Grid, Paper, Typography, Chip } from '@mui/material';
import { Bolt, WorkspacePremium, Shield, Speed, Verified } from '@mui/icons-material';

const featureItems = [
  {
    title: 'DOT & ECE Certified',
    description:
      'Every helmet in our line-up passes dual safety certifications and a 42-point inspection.',
    icon: Shield,
    tag: 'Safety First',
  },
  {
    title: 'CarbonLite Shells',
    description:
      'Multi-layer carbon fiber and Kevlar shells keep protection high and weight low.',
    icon: Bolt,
    tag: 'Lightweight',
  },
  {
    title: 'Wind Tunnel Tested',
    description:
      'Aerodynamic profiles engineered for whisper-quiet rides beyond 150 km/h.',
    icon: Speed,
    tag: 'Aero',
  },
  {
    title: 'Pro-Fit Customization',
    description:
      '3D fit kits, magnetic cheek pads, and Bluetooth-ready channels for your comfort.',
    icon: WorkspacePremium,
    tag: 'Comfort',
  },
  {
    title: 'Crash Replacement',
    description:
      'Enjoy a two-year crash replacement promise plus lifetime liner care.',
    icon: Verified,
    tag: 'Warranty',
  },
];

const HelmetFeatures = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #050505 0%, #111927 50%, #050505 100%)',
        color: 'common.white',
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="overline" sx={{ letterSpacing: 6, color: 'primary.light' }}>
          WHY AEGIS GEAR
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mt: 2,
            maxWidth: 640,
            lineHeight: 1.2,
          }}
        >
          Engineered protection for riders who demand more than average.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mt: 2,
            mb: 6,
            color: 'rgba(255,255,255,0.72)',
            maxWidth: 720,
          }}
        >
          From carbon fiber race shells to Bluetooth-ready touring lids, every helmet we stock
          blends aggressive styling with certified safety tech.
        </Typography>

        <Grid container spacing={3}>
          {featureItems.map(({ title, description, icon: Icon, tag }) => (
            <Grid item xs={12} sm={6} md={4} key={title}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Chip
                  label={tag}
                  sx={{
                    alignSelf: 'flex-start',
                    color: 'primary.contrastText',
                    backgroundColor: 'primary.main',
                    fontWeight: 600,
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'rgba(255,107,53,0.12)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'primary.light',
                    }}
                  >
                    <Icon fontSize="large" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}
                >
                  {description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HelmetFeatures;

