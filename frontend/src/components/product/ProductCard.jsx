import { Card, CardMedia, CardContent, Typography, Box, Chip, IconButton, Rating } from '@mui/material';
import { ShoppingCart, Favorite, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          '& .quick-actions': {
            opacity: 1,
          },
        },
      }}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="250"
          image={product.images?.[0]?.url || '/placeholder-helmet.jpg'}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />

        {/* Badges */}
        {product.isFeatured && (
          <Chip
            label="Featured"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              bgcolor: 'primary.main',
              color: 'white',
            }}
          />
        )}

        {product.stock === 0 && (
          <Chip
            label="Out of Stock"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'error.main',
              color: 'white',
            }}
          />
        )}

        {product.discountPrice && (
          <Chip
            label={`-${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'success.main',
              color: 'white',
            }}
          />
        )}

        {/* Quick Actions */}
        <Box
          className="quick-actions"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.3s',
          }}
        >
          <IconButton
            component={Link}
            to={`/products/${product._id}`}
            sx={{
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'primary.main' },
            }}
          >
            <Visibility />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'primary.main' },
            }}
          >
            <ShoppingCart />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'error.main' },
            }}
          >
            <Favorite />
          </IconButton>
        </Box>
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Brand & Category */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          {product.brand?.name} • {product.category?.name}
        </Typography>

        {/* Product Name */}
        <Typography
          variant="h6"
          component={Link}
          to={`/products/${product._id}`}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            '&:hover': { color: 'primary.main' },
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.averageRating || 0} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({product.numReviews || 0})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ mt: 'auto' }}>
          {product.discountPrice ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                ₱{product.discountPrice.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ₱{product.price.toLocaleString()}
              </Typography>
            </Box>
          ) : (
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
              ₱{product.price.toLocaleString()}
            </Typography>
          )}
        </Box>

        {/* Certifications */}
        {product.certifications?.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
            {product.certifications.slice(0, 3).map((cert) => (
              <Chip key={cert} label={cert} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
