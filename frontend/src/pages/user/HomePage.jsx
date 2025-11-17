import { Box } from '@mui/material';
import Hero from '../../components/common/Hero';
import FeaturedProducts from '../../components/product/FeaturedProducts';

const HomePage = () => {
  return (
    <Box>
      <Hero />
      <FeaturedProducts />
    </Box>
  );
};

export default HomePage;
