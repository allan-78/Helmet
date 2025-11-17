import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { ShoppingCart, Favorite, Add, Remove, LocalShipping, Shield } from '@mui/icons-material';
import Loading from '../../components/common/Loading';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
      if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);
    } catch (error) {
      toast.error('Failed to load product');
      console.error(error);
    } finally {
      setLoading(false);
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
    // Add to cart logic here
    toast.success('Added to cart!');
  };

  if (loading) return <Loading />;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            {/* Main Image */}
            <Box
              component="img"
              src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 500,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 2,
              }}
            />

            {/* Thumbnail Gallery */}
            <Grid container spacing={1}>
              {product.images?.map((image, index) => (
                <Grid item xs={3} key={index}>
                  <Box
                    component="img"
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      width: '100%',
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      opacity: selectedImage === index ? 1 : 0.6,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          {/* Brand & Category */}
          <Typography variant="overline" color="text.secondary">
            {product.brand?.name} • {product.category?.name}
          </Typography>

          {/* Product Name */}
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            {product.name}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Rating value={product.averageRating || 0} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({product.numReviews} reviews)
            </Typography>
          </Box>

          {/* Price */}
          <Box sx={{ mb: 3 }}>
            {product.discountPrice ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                    ₱{product.discountPrice.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ₱{product.price.toLocaleString()}
                  </Typography>
                  <Chip
                    label={`Save ${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`}
                    color="success"
                  />
                </Box>
              </>
            ) : (
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                ₱{product.price.toLocaleString()}
              </Typography>
            )}
          </Box>

          {/* Stock Status */}
          <Chip
            label={product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            color={product.stock > 0 ? 'success' : 'error'}
            sx={{ mb: 3 }}
          />

          <Divider sx={{ my: 3 }} />

          {/* Size Selection */}
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

          {/* Color Selection */}
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

          {/* Quantity */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Quantity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Remove />
              </IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                <Add />
              </IconButton>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
            <IconButton size="large" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Favorite />
            </IconButton>
          </Box>

          {/* Features */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Chip icon={<LocalShipping />} label="Free Shipping" />
            <Chip icon={<Shield />} label="Warranty Included" />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Description */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Description
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          {/* Certifications */}
          {product.certifications?.length > 0 && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Safety Certifications
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.certifications.map((cert) => (
                  <Chip key={cert} label={cert} variant="outlined" />
                ))}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
