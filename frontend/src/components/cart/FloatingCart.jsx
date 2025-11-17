import { useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ShoppingCart, Close, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const FloatingCart = () => {
  const { cart, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice ?? items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const previewItems = useMemo(() => items.slice(0, 3), [items]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 16, md: 32 },
        right: { xs: 16, md: 32 },
        zIndex: 1300,
      }}
    >
      {open && (
        <Paper
          elevation={12}
          sx={{
            width: { xs: 280, sm: 340 },
            mb: 2,
            borderRadius: 4,
            background: 'linear-gradient(180deg, rgba(15,15,15,0.95) 0%, rgba(8,8,8,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Quick Cart
              </Typography>
              <Typography variant="h6">{itemCount} item{itemCount === 1 ? '' : 's'}</Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

          <Stack spacing={2} sx={{ p: 2, maxHeight: 260, overflowY: 'auto' }}>
            {previewItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Your cart is empty. Start adding helmets!
              </Typography>
            ) : (
              previewItems.map((item) => {
                const product = item.product || item;
                const image =
                  product?.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1516979187457-637abb4f9356?auto=format&fit=crop&w=200&q=80';
                const name = product?.name || 'Helmet';
                const price = item.price || product?.price || 0;
                return (
                  <Box
                    key={product?._id || item._id}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Avatar
                      variant="rounded"
                      src={image}
                      alt={name}
                      sx={{ width: 56, height: 56, borderRadius: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        component={Link}
                        to={`/products/${product?._id}`}
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
                        {name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qty {item.quantity || 1}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      ₱{(price * (item.quantity || 1)).toLocaleString()}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ₱{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                component={Link}
                to="/cart"
                variant="outlined"
                color="inherit"
                size="small"
                fullWidth
              >
                View Cart
              </Button>
              <Button
                component={Link}
                to="/checkout"
                variant="contained"
                size="small"
                endIcon={<ArrowForward />}
                fullWidth
              >
                Checkout
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}

      <Button
        onClick={() => setOpen((prev) => !prev)}
        variant="contained"
        color="primary"
        startIcon={
          <Badge badgeContent={itemCount} color="secondary" max={99}>
            <ShoppingCart />
          </Badge>
        }
        sx={{
          borderRadius: 999,
          px: 3,
          py: 1.2,
          fontWeight: 700,
          boxShadow: '0 20px 40px rgba(255,107,53,0.35)',
        }}
      >
        {open ? 'Hide Cart' : 'Cart'}
      </Button>
    </Box>
  );
};

export default FloatingCart;

