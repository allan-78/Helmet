import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import { Visibility, ShoppingBag } from '@mui/icons-material';
import Loading from '../../components/common/Loading';
import api from '../../services/api';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'warning',
      Processing: 'info',
      Shipped: 'primary',
      Delivered: 'success',
      Cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) return <Loading message="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingBag sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          No Orders Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Start shopping to see your orders here!
        </Typography>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          size="large"
          sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}
        >
          Shop Now
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Order ID: <strong>{order._id}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={order.orderStatus}
                    color={getStatusColor(order.orderStatus)}
                    size="small"
                  />
                  <Button
                    component={Link}
                    to={`/orders/${order._id}`}
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                  >
                    View Details
                  </Button>
                </Box>
              </Box>

              {/* Order Items Preview */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                {order.orderItems.slice(0, 3).map((item, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={item.image}
                    sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                  />
                ))}
                {order.orderItems.length > 3 && (
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      +{order.orderItems.length - 3} more
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Order Summary */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {order.orderItems.length} item(s) • {order.paymentMethod}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Payment: <Chip label={order.paymentStatus} size="small" />
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                  ₱{order.totalPrice.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrdersPage;
