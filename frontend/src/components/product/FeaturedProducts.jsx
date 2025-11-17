import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ProductGrid from './ProductGrid';
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

  if (loading) return <Loading message="Loading featured products..." />;

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Featured Helmets
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Handpicked premium helmets for ultimate protection
          </Typography>
        </Box>

        <ProductGrid products={products} />
      </Container>
    </Box>
  );
};

export default FeaturedProducts;
