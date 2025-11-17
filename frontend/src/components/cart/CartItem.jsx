import { Box, Card, CardMedia, Typography, IconButton, TextField } from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity, size, color, price } = item;

  return (
    <Card sx={{ display: 'flex', p: 2, mb: 2 }}>
      {/* Product Image */}
      <CardMedia
        component={Link}
        to={`/products/${product._id}`}
        sx={{
          width: 120,
          height: 120,
          objectFit: 'cover',
          borderRadius: 2,
          flexShrink: 0,
        }}
        image={product.images?.[0]?.url || '/placeholder.jpg'}
        title={product.name}
      />

      {/* Product Info */}
      <Box sx={{ flex: 1, ml: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component={Link}
          to={`/products/${product._id}`}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            '&:hover': { color: 'primary.main' },
            mb: 0.5,
          }}
        >
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.brand?.name} • {product.category?.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Size: <strong>{size}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Color: <strong>{color}</strong>
          </Typography>
        </Box>

        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700, mt: 'auto' }}>
          ₱{(price * quantity).toLocaleString()}
        </Typography>
      </Box>

      {/* Quantity Controls */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <IconButton size="small" onClick={() => onRemove(item._id || product._id)} color="error">
          <Delete />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onUpdateQuantity(item._id || product._id, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Remove fontSize="small" />
          </IconButton>
          <TextField
            value={quantity}
            size="small"
            sx={{ width: 60 }}
            inputProps={{ style: { textAlign: 'center' } }}
            disabled
          />
          <IconButton
            size="small"
            onClick={() => onUpdateQuantity(item._id || product._id, quantity + 1)}
            disabled={quantity >= product.stock}
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default CartItem;
