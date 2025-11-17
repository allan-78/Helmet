import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, Divider } from '@mui/material';
import { CheckCircle, Receipt, ShoppingBag } from '@mui/icons-material';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data.order);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!order) return <Typography>Order not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        {/* Success Icon */}
        <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Order Placed Successfully!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your purchase. Your order has been confirmed.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Order Details */}
        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Order Details
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">Order ID:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{order._id}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">Date:</Typography>
            <Typography>{new Date(order.createdAt).toLocaleDateString()}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">Payment Method:</Typography>
            <Typography>{order.paymentMethod}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">Total Amount:</Typography>
            <Typography color="primary.main" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
              ₱{order.totalPrice.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Shipping Address */}
        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Shipping Address
          </Typography>
          <Typography variant="body2">{order.shippingAddress.fullName}</Typography>
          <Typography variant="body2">{order.shippingAddress.address}</Typography>
          <Typography variant="body2">
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </Typography>
          <Typography variant="body2">{order.shippingAddress.phoneNumber}</Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/orders"
            variant="contained"
            startIcon={<Receipt />}
            sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}
          >
            View My Orders
          </Button>
          <Button
            component={Link}
            to="/products"
            variant="outlined"
            startIcon={<ShoppingBag />}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccessPage;
