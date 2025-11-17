import { Box } from '@mui/material';
import Hero from '../../components/common/Hero';
import FeaturedProducts from '../../components/product/FeaturedProducts';
import ProductList from '../../components/product/ProductList';
import HelmetFeatures from '../../components/home/HelmetFeatures';
import HelmetTestimonials from '../../components/home/HelmetTestimonials';
import HomeCta from '../../components/home/HomeCta';
import FloatingCart from '../../components/cart/FloatingCart';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box component="main" sx={{ backgroundColor: 'background.default' }}>
      <Hero />
      <FeaturedProducts />
      <HelmetFeatures />
      <ProductList />
      <HelmetTestimonials />
      <HomeCta />
      {isAuthenticated && <FloatingCart />}
    </Box>
  );
};

export default HomePage;