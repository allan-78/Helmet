import { Container, Typography, Box } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom fontWeight={700}>
          About AegisGear
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Your trusted partner in motorcycle safety
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto' }}>
          AegisGear is committed to providing the highest quality motorcycle helmets
          that combine safety, style, and comfort. Every helmet in our collection
          meets or exceeds international safety standards.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
