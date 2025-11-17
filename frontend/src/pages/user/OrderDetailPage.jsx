import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Loading from '../../components/common/Loading';
import api from '../../services/api';

const OrderDetailPage = () => {
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

  const getActiveStep = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status);
  };

  if (loading) return <Loading />;
  if (!order) return <Typography>Order not found</Typography>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button component={Link} to="/orders" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
        Back to Orders
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Order Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Order ID: {order._id}
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side - Order Info */}
        <Grid item xs={12} md={8}>
          {/* Order Status Stepper */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order Status
            </Typography>
            <Stepper activeStep={getActiveStep(order.orderStatus)} alternativeLabel>
              <Step>
                <StepLabel>Pending</StepLabel>
              </Step>
              <Step>
                <StepLabel>Processing</StepLabel>
              </Step>
              <Step>
                <StepLabel>Shipped</StepLabel>
              </Step>
              <Step>
                <StepLabel>Delivered</StepLabel>
              </Step>
            </Stepper>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Chip
                label={order.orderStatus}
                color={order.orderStatus === 'Delivered' ? 'success' : 'primary'}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Paper>

          {/* Order Items */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order Items
            </Typography>
            {order.orderItems.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 3, pb: 3, borderBottom: index !== order.orderItems.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <Box
                  component="img"
                  src={item.image}
                  sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 2, mr: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Size: {item.size} • Color: {item.color}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ mt: 1, fontWeight: 700 }}>
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Right Side - Summary */}
        <Grid item xs={12} md={4}>
          {/* Order Summary */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Subtotal:</Typography>
                <Typography>₱{order.itemsPrice.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Shipping:</Typography>
                <Typography>₱{order.shippingPrice.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Tax:</Typography>
                <Typography>₱{order.taxPrice.toFixed(2)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                  ₱{order.totalPrice.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Shipping Address */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Shipping Address
            </Typography>
            <Typography variant="body2">{order.shippingAddress.fullName}</Typography>
            <Typography variant="body2">{order.shippingAddress.address}</Typography>
            <Typography variant="body2">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </Typography>
            <Typography variant="body2">{order.shippingAddress.phoneNumber}</Typography>
          </Paper>

          {/* Payment Info */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Payment Information
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Method:</Typography>
              <Typography>{order.paymentMethod}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Status:</Typography>
              <Chip label={order.paymentStatus} size="small" color={order.isPaid ? 'success' : 'warning'} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailPage;
