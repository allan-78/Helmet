import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Pagination,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  CircularProgress,
} from '@mui/material';
import ProductGrid from './ProductGrid';
import Loading from '../common/Loading';
import api from '../../services/api';
import { toast } from 'react-toastify';

const VIEW_MODES = {
  PAGINATION: 'pagination',
  INFINITE: 'infinite',
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [mode, setMode] = useState(VIEW_MODES.PAGINATION);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [mode]);

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, mode]);

  useEffect(() => {
    if (mode !== VIEW_MODES.INFINITE) return undefined;
    const target = loadMoreRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [mode, hasMore, loading, loadingMore]);

  const fetchProducts = async (pageToLoad) => {
    const isFirstPage = pageToLoad === 1;
    if (mode === VIEW_MODES.PAGINATION || isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const limit = mode === VIEW_MODES.PAGINATION ? 8 : 6;
      const params = { page: pageToLoad, limit };
      const { data } = await api.get('/products', { params });

      setTotalPages(data.totalPages);
      setCount(data.count);

      if (mode === VIEW_MODES.PAGINATION) {
        setProducts(data.products);
      } else {
        setProducts((prev) => (pageToLoad === 1 ? data.products : [...prev, ...data.products]));
        setHasMore(pageToLoad < data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModeChange = (event, newMode) => {
    if (newMode) {
      setMode(newMode);
    }
  };

  if (loading && products.length === 0) {
    return <Loading message="Loading products..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            All Helmets
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Showing {products.length} of {count} products
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="product list mode"
          size="small"
          color="primary"
        >
          <ToggleButton value={VIEW_MODES.PAGINATION} aria-label="pagination mode">
            Pagination
          </ToggleButton>
          <ToggleButton value={VIEW_MODES.INFINITE} aria-label="infinite scroll mode">
            Infinite Scroll
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {products.length === 0 && !loading ? (
        <Typography variant="h6" color="text.secondary" align="center">
          No products found.
        </Typography>
      ) : (
        <>
          <ProductGrid products={products} />

          {mode === VIEW_MODES.PAGINATION && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {mode === VIEW_MODES.INFINITE && (
            <Box
              ref={loadMoreRef}
              sx={{
                mt: 6,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 80,
              }}
            >
              {loadingMore ? <CircularProgress /> : hasMore ? 'Scroll to load more' : 'No more products'}
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductList;