import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import { ShoppingBag, ArrowForward, LocalShipping, Shield, WorkspacePremium } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const perkCards = [
  {
    title: 'Crash Replacement',
    description: '2-year crash replacement promise on every lid.',
    icon: <Shield sx={{ color: 'primary.light' }} />,
  },
  {
    title: 'Express Shipping',
    description: 'Same-day dispatch for Metro Manila orders before 3PM.',
    icon: <LocalShipping sx={{ color: 'primary.light' }} />,
  },
  {
    title: 'Fit Concierge',
    description: 'Free virtual fitting session with our gear experts.',
    icon: <WorkspacePremium sx={{ color: 'primary.light' }} />,
  },
];

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shipping = subtotal > 0 ? 150 : 0;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: 'radial-gradient(circle at top, rgba(255,107,53,0.08), transparent 60%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            sx={{
              p: 6,
              borderRadius: 4,
              background: 'linear-gradient(180deg, rgba(30,30,30,0.9), rgba(10,10,10,0.95))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <ShoppingBag sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Gear up with premium helmets engineered for safety and speed.
            </Typography>
            <Button component={Link} to="/products" variant="contained" size="large">
              Shop Helmets
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 6,
        background: 'radial-gradient(circle at top, rgba(255,107,53,0.12), transparent 55%)',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 5 }}>
          <Chip label="Bag" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.08)' }} />
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Your Ride-Ready Cart
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {cart.items.length} item{cart.items.length > 1 ? 's' : ''} curated for protection and performance.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                background: 'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(10,10,10,0.95))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Helmet Lineup
              </Typography>

              <Stack spacing={2}>
                {cart.items.map((item) => (
                  <CartItem
                    key={item.product._id + item.size + item.color}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </Stack>

              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  justifyContent: 'space-between',
                }}
              >
                <Button component={Link} to="/products" variant="outlined" fullWidth>
                  Continue Shopping
                </Button>
                <Button
                  fullWidth
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    if (window.confirm('Clear all items in your cart?')) clearCart();
                  }}
                >
                  Clear Cart
                </Button>
              </Box>
            </Paper>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {perkCards.map((perk) => (
                <Grid item xs={12} md={4} key={perk.title}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      minHeight: 140,
                    }}
                  >
                    <Box sx={{ mb: 1 }}>{perk.icon}</Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {perk.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {perk.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(165deg, rgba(255,107,53,0.18), rgba(5,5,5,0.95))',
                border: '1px solid rgba(255,107,53,0.4)',
                position: 'sticky',
                top: 100,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>₱{subtotal.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography>₱{shipping.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Tax (12%)</Typography>
                  <Typography>₱{tax.toFixed(2)}</Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h5" color="primary.light" sx={{ fontWeight: 800 }}>
                  ₱{total.toLocaleString()}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Secure checkout · SSL encrypted · COD ready
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;
