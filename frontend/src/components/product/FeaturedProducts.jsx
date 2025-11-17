import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ProductCard from './ProductCard';
import Loading from '../common/Loading';
import api from '../../services/api';
import { toast } from 'react-toastify';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await api.get('/products/featured');
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to load featured products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 8 }}>
        <Loading message="Loading featured products..." />
      </Box>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        background:
          'linear-gradient(180deg, rgba(255,107,53,0.06) 0%, rgba(10,10,10,1) 60%)',
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="overline" sx={{ letterSpacing: 4, color: 'primary.light' }}>
          FEATURED DROP
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mt: 1,
            mb: 4,
          }}
        >
          Track-bred helmets built for the city.
        </Typography>

        {/* Horizontal Scrolling Box */}
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 3,
            pb: 2, // Padding for scrollbar
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 107, 53, 0.4)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          {products.map((product) => (
            // Set a minimum width for each card so they don't collapse
            <Box key={product._id} sx={{ minWidth: { xs: 280, sm: 300, md: 320 } }}>
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedProducts;