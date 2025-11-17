import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Rating,
  Divider,
  IconButton,
  TextField,
  MenuItem,
  Paper,
  Stack,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Add,
  Remove,
  LocalShipping,
  Shield,
  Bolt,
} from '@mui/icons-material';
import Loading from '../../components/common/Loading';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ReviewList from '../../components/review/ReviewList';
import ReviewForm from '../../components/review/ReviewForm';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviewEligibility();
    } else {
      setCanReview(false);
      setUserReview(null);
    }
  }, [id, isAuthenticated]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      if (data.product.sizes?.length > 0) {
        setSelectedSize(data.product.sizes[0]);
      } else {
        setSelectedSize('Standard');
      }
      if (data.product.colors?.length > 0) {
        setSelectedColor(data.product.colors[0]);
      } else {
        setSelectedColor('Matte Black');
      }
    } catch (error) {
      toast.error('Failed to load product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data } = await api.get(`/reviews/product/${id}`);
      setReviews(data.reviews);
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error(error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchReviewEligibility = async () => {
    try {
      const { data } = await api.get(`/reviews/product/${id}/eligibility`);
      setCanReview(data.canReview);
      setUserReview(data.review);
    } catch (error) {
      console.error('Eligibility check failed', error);
    }
  };

  const handleQuantityChange = (change) => {
    const newQty = quantity + change;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.warning('Please select size and color');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!isAuthenticated) {
      toast.info('Login to leave a review');
      return;
    }
    if (!rating || rating === 0) {
      toast.warning('Please provide a rating');
      return;
    }
    if (!comment.trim()) {
      toast.warning('Please share a short comment');
      return;
    }

    setReviewSubmitting(true);
    try {
      if (editingReview || userReview) {
        const targetReview = editingReview || userReview;
        await api.put(`/reviews/${targetReview._id}`, { rating, comment });
        toast.success('Review updated');
      } else {
        await api.post('/reviews', {
          product: id,
          rating,
          comment,
        });
        toast.success('Review posted');
      }
      setEditingReview(null);
      await Promise.all([fetchReviews(), fetchReviewEligibility(), fetchProduct()]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const ratingLabel = useMemo(() => {
    if (!product?.averageRating) return 'No ratings yet';
    return `${product.averageRating.toFixed(1)} / 5`;
  }, [product]);

  const stock = product?.stock ?? 0;
  const sold = product?.sold ?? 0;
  const inventoryBase = stock + sold || 1;
  const stockPercent = Math.min(100, Math.round((stock / inventoryBase) * 100));
  const lowStock = stock > 0 && stock <= 5;

  if (loading || !product) {
    return loading ? <Loading /> : <Typography>Product not found</Typography>;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        py: 6,
        backgroundImage: 'radial-gradient(circle at top, rgba(255,107,53,0.12), transparent 60%)',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(180deg, rgba(15,15,15,0.95), rgba(5,5,5,0.95))',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'sticky',
                top: 100,
              }}
            >
              <Box
                component="img"
                src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: { xs: 320, md: 480 },
                  objectFit: 'cover',
                  borderRadius: 3,
                  mb: 3,
                }}
              />

              <Grid container spacing={1}>
                {product.images?.map((image, index) => (
                  <Grid item xs={3} key={image.publicId || index}>
                    <Box
                      component="img"
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border:
                          selectedImage === index
                            ? '2px solid rgba(255,107,53,0.8)'
                            : '1px solid rgba(255,255,255,0.1)',
                        opacity: selectedImage === index ? 1 : 0.6,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                background: 'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(8,8,8,0.95))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Chip
                label={`${product.brand?.name || 'Aegis'} • ${product.category?.name || 'Helmet'}`}
                sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.08)' }}
              />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                {product.name}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Rating value={product.averageRating || 0} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {ratingLabel} · {product.numReviews} reviews
                </Typography>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ₱{(product.discountPrice || product.price).toLocaleString()}
                </Typography>
                {product.discountPrice && (
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ₱{product.price.toLocaleString()}
                  </Typography>
                )}
                {product.discountPrice && (
                  <Chip
                    label={`Save ${Math.round(
                      ((product.price - product.discountPrice) / product.price) * 100
                    )}%`}
                    color="success"
                  />
                )}
              </Stack>

              <Chip
                label={stock > 0 ? `${stock} units ready to ship` : 'Out of Stock'}
                color={stock > 0 ? 'success' : 'error'}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Inventory pulse
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stockPercent}
                  sx={{
                    mt: 1,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: lowStock ? 'warning.main' : 'primary.main',
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {stock > 0
                    ? `${stockPercent}% of current batch remaining`
                    : 'Next batch coming soon'}
                </Typography>
              </Box>

              {product.sizes?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Select Size
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {product.sizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}

              {product.colors?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Select Color
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                  >
                    {product.colors.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Remove />
                  </IconButton>
                  <Typography variant="h6">{quantity}</Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  fullWidth
                >
                  Add to Cart
                </Button>
                <IconButton
                  size="large"
                  sx={{
                    border: '1px solid',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Favorite />
                </IconButton>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip icon={<LocalShipping />} label="Free Metro Manila shipping" />
                <Chip icon={<Shield />} label="Crash replacement" />
                <Chip icon={<Bolt />} label="Wind tunnel tested" />
              </Stack>

              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {product.description}
              </Typography>

              {product.certifications?.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Safety Certifications
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.certifications.map((cert) => (
                      <Chip key={cert} label={cert} variant="outlined" />
                    ))}
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={7}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Rider Reviews
            </Typography>
            {reviewsLoading ? (
              <Loading message="Loading reviews..." />
            ) : (
              <ReviewList
                reviews={reviews}
                currentUserId={user?._id}
                onEdit={(review) => {
                  setEditingReview(review);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'linear-gradient(180deg, rgba(30,30,30,0.95), rgba(10,10,10,0.95))',
              }}
            >
              {!isAuthenticated && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Login to leave a review for this helmet.
                </Alert>
              )}
              {isAuthenticated && !canReview && !userReview && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  Reviews unlock once your order is delivered. Track your orders under My Orders.
                </Alert>
              )}

              <ReviewForm
                onSubmit={handleReviewSubmit}
                initialData={editingReview || userReview}
                loading={reviewSubmitting}
                disabled={!isAuthenticated || (!canReview && !userReview)}
                mode={
                  editingReview
                    ? 'edit'
                    : userReview
                    ? 'update'
                    : 'create'
                }
                onCancelEdit={() => setEditingReview(null)}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
