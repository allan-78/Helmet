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
  Stack,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Loading from '../../components/common/Loading';
import api from '../../services/api';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

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
    const index = statusSteps.indexOf(status);
    return index === -1 ? 0 : index;
  };

  if (loading) return <Loading />;
  if (!order) return <Typography>Order not found</Typography>;

  return (
    <Box
      sx={{
        background: 'radial-gradient(circle at top, rgba(255,107,53,0.12), transparent 60%)',
        minHeight: '100vh',
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Button
          component={Link}
          to="/orders"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
          color="inherit"
        >
          Back to Orders
        </Button>

        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ letterSpacing: 4 }}>
            Order #{order._id}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Fulfillment tracker
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length}{' '}
            item{order.orderItems.length > 1 ? 's' : ''}
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                mb: 3,
                background: 'linear-gradient(180deg, rgba(20,20,20,0.9), rgba(5,5,5,0.95))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Status
              </Typography>
              <Stepper activeStep={getActiveStep(order.orderStatus)} alternativeLabel>
                {statusSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Chip
                  label={order.orderStatus}
                  color={
                    order.orderStatus === 'Delivered'
                      ? 'success'
                      : order.orderStatus === 'Cancelled'
                      ? 'error'
                      : 'primary'
                  }
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Paper>

            <Paper
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                background: 'linear-gradient(180deg, rgba(15,15,15,0.95), rgba(5,5,5,0.95))',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Items in this shipment
              </Typography>
              <Stack spacing={3}>
                {order.orderItems.map((item, index) => (
                  <Box
                    key={`${item.product}-${index}`}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      borderBottom:
                        index !== order.orderItems.length - 1
                          ? '1px solid rgba(255,255,255,0.05)'
                          : 'none',
                      pb: index !== order.orderItems.length - 1 ? 3 : 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image || item.product?.images?.[0]?.url}
                      alt={item.name}
                      sx={{
                        width: 96,
                        height: 96,
                        objectFit: 'cover',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {item.size || 'Standard'} • Color: {item.color || '—'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty {item.quantity}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary.main"
                        sx={{ fontWeight: 700, mt: 1 }}
                      >
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'linear-gradient(165deg, rgba(255,107,53,0.18), rgba(5,5,5,0.95))',
                  border: '1px solid rgba(255,107,53,0.4)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Order summary
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Items</Typography>
                    <Typography>₱{order.itemsPrice.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography>₱{order.shippingPrice.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Tax</Typography>
                    <Typography>₱{order.taxPrice.toFixed(2)}</Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Total paid
                  </Typography>
                  <Typography variant="h5" color="primary.light" sx={{ fontWeight: 800 }}>
                    ₱{order.totalPrice.toLocaleString()}
                  </Typography>
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Shipping
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {order.shippingAddress.fullName}
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </Typography>
                <Typography variant="body2">📞 {order.shippingAddress.phoneNumber}</Typography>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Payment
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Method</Typography>
                  <Typography>{order.paymentMethod}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary">Status</Typography>
                  <Chip
                    label={order.paymentStatus}
                    size="small"
                    color={order.isPaid ? 'success' : 'warning'}
                  />
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OrderDetailPage;
