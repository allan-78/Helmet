import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Divider,
  LinearProgress,
} from '@mui/material';
import { ShoppingCart, Favorite, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1516979187457-637abb4f9356?auto=format&fit=crop&w=800&q=80';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const defaultSize = product.sizes?.[0] || 'Standard';
  const defaultColor = product.colors?.[0] || 'Matte Black';

  const handleQuickAdd = () => {
    if (product.stock === 0) return;
    addToCart(product, 1, defaultSize, defaultColor);
  };
  const imageUrl = product.images?.[0]?.url || FALLBACK_IMAGE;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const statusChip =
    product.stock === 0
      ? { label: 'Out of Stock', color: 'error.main' }
      : discountPercent
      ? { label: `-${discountPercent}%`, color: 'success.main' }
      : null;

  const stock = product.stock ?? 0;
  const sold = product.sold ?? 0;
  const stockTotal = stock + sold || 1;
  const stockPercent = Math.min(100, Math.round((stock / stockTotal) * 100));
  const lowStock = stock > 0 && stock <= 5;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.65) 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        '&:hover': {
          borderColor: 'rgba(255,107,53,0.4)',
          '& .product-image': {
            transform: 'scale(1.05)',
          },
          '& .quick-actions': {
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative', p: 2, pb: 0 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 0,
            paddingTop: '80%',
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#0f0f0f',
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={product.name}
            className="product-image"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s ease',
            }}
          />

          {product.isFeatured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: 'primary.main',
                color: 'common.white',
                fontWeight: 600,
              }}
            />
          )}

          {statusChip && (
            <Chip
              label={statusChip.label}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                bgcolor: statusChip.color,
                color: 'common.white',
                fontWeight: 600,
              }}
            />
          )}

          <Box
            className="quick-actions"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(0.92)',
              display: 'flex',
              gap: 1,
              opacity: 0,
              transition: 'all 0.3s ease',
            }}
          >
            <IconButton
              component={Link}
              to={`/products/${product._id}`}
              sx={{
                bgcolor: 'rgba(0,0,0,0.65)',
                color: 'common.white',
                '&:hover': { bgcolor: 'primary.main' },
              }}
            >
              <Visibility />
            </IconButton>
            <IconButton
              disabled={product.stock === 0 || loading}
              onClick={handleQuickAdd}
              sx={{
                bgcolor: 'rgba(0,0,0,0.65)',
                color: 'common.white',
                '&:hover': { bgcolor: 'primary.main' },
                '&.Mui-disabled': {
                  opacity: 0.4,
                  color: 'common.white',
                },
              }}
            >
              <ShoppingCart />
            </IconButton>
            <IconButton
              sx={{
                bgcolor: 'rgba(0,0,0,0.65)',
                color: 'common.white',
                '&:hover': { bgcolor: 'error.main' },
              }}
            >
              <Favorite />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          pt: 3,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {product.brand?.name || 'AegisGear'} • {product.category?.name || 'Helmet'}
        </Typography>

        <Typography
          variant="h6"
          component={Link}
          to={`/products/${product._id}`}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            '&:hover': { color: 'primary.main' },
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={product.averageRating || 0} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            ({product.numReviews || 0})
          </Typography>
        </Box>

        <Divider flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            ₱{(product.discountPrice || product.price).toLocaleString()}
          </Typography>
          {product.discountPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              ₱{product.price.toLocaleString()}
            </Typography>
          )}
        </Box>

        {product.certifications?.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {product.certifications.slice(0, 2).map((cert) => (
              <Chip key={cert} label={cert} size="small" variant="outlined" />
            ))}
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Stock: {stock > 0 ? `${stock} units ready` : 'Sold out'}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={stockPercent}
            sx={{
              mt: 0.5,
              height: 6,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: lowStock ? 'warning.main' : 'primary.main',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

