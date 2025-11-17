import { Avatar, Box, Card, CardContent, Container, Grid, Rating, Typography } from '@mui/material';

const testimonials = [
  {
    name: 'Alex Cruz',
    role: 'Track Racer',
    quote:
      'The CarbonLite R1 is the quietest lid I own. Zero buffeting at 180 km/h and the visor lock is bulletproof.',
    rating: 5,
  },
  {
    name: 'Mia Santos',
    role: 'Daily Commuter',
    quote:
      'Love the quick-release cheek pads and the integrated Bluetooth channels. Shipping was insanely fast too.',
    rating: 4.5,
  },
  {
    name: 'Kenji Dela Vega',
    role: 'Adventure Rider',
    quote:
      'Took the Axis ADV through a 900 km weekend run. Ventilation and visor clarity were perfect in the rain.',
    rating: 5,
  },
];

const HelmetTestimonials = () => {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Typography variant="overline" sx={{ letterSpacing: 4, color: 'primary.light' }}>
          REAL RIDER VOICES
        </Typography>

        <Typography
          variant="h3"
          sx={{ fontWeight: 800, mt: 2, maxWidth: 600, lineHeight: 1.2 }}
        >
          Trusted by 50K+ riders across the Philippines.
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, mb: 6, color: 'text.secondary', maxWidth: 640 }}>
          Every order ships with crash replacement coverage and lifetime support from our helmet
          technicians.
        </Typography>

        <Grid container spacing={3}>
          {testimonials.map((testimonial) => (
            <Grid item xs={12} md={4} key={testimonial.name}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(145deg, #141414 0%, #0f0f0f 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Rating value={testimonial.rating} precision={0.5} readOnly />
                  <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                    “{testimonial.quote}”
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {testimonial.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HelmetTestimonials;

