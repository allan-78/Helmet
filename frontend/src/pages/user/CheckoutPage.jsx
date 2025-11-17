import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Divider,
  FormControl,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
    country: 'Philippines',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, cart]);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/addresses');
      setAddresses(data.addresses);
      const defaultAddr = data.addresses.find((addr) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr._id);
        setShippingInfo({
          fullName: defaultAddr.fullName,
          address: defaultAddr.address,
          city: defaultAddr.city,
          postalCode: defaultAddr.postalCode,
          phoneNumber: defaultAddr.phoneNumber,
          country: defaultAddr.country,
        });
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddress(addressId);
    const address = addresses.find((addr) => addr._id === addressId);
    if (address) {
      setShippingInfo({
        fullName: address.fullName,
        address: address.address,
        city: address.city,
        postalCode: address.postalCode,
        phoneNumber: address.phoneNumber,
        country: address.country,
      });
    }
  };

  const handleShippingInfoChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const subtotal = cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shipping = 150;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    // Validation
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.phoneNumber) {
      toast.error('Please fill in all shipping information');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          image: item.product.images?.[0]?.url,
        })),
        shippingAddress: shippingInfo,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };

      const { data } = await api.post('/orders', orderData);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side - Shipping & Payment */}
        <Grid item xs={12} md={8}>
          {/* Shipping Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Shipping Information
            </Typography>

            {/* Saved Addresses */}
            {addresses.length > 0 && (
              <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                <FormLabel component="legend">Select Saved Address</FormLabel>
                <RadioGroup value={selectedAddress} onChange={(e) => handleAddressChange(e.target.value)}>
                  {addresses.map((address) => (
                    <FormControlLabel
                      key={address._id}
                      value={address._id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {address.fullName} {address.isDefault && '(Default)'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.address}, {address.city}, {address.postalCode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.phoneNumber}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                  <FormControlLabel value="" control={<Radio />} label="Use new address" />
                </RadioGroup>
              </FormControl>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Manual Address Input */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingInfoChange}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleShippingInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={shippingInfo.phoneNumber}
                  onChange={handleShippingInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleShippingInfoChange}
                  required
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Payment Method */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Payment Method
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery (COD)" />
                <FormControlLabel value="Card" control={<Radio />} label="Credit/Debit Card" disabled />
                <FormControlLabel value="GCash" control={<Radio />} label="GCash" disabled />
                <FormControlLabel value="PayMaya" control={<Radio />} label="PayMaya" disabled />
              </RadioGroup>
            </FormControl>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              * Online payment methods coming soon
            </Typography>
          </Paper>
        </Grid>

        {/* Right Side - Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order Summary
            </Typography>

            {/* Order Items */}
            <Box sx={{ mb: 3 }}>
              {cart.items?.map((item) => (
                <Box key={item._id || item.product._id} sx={{ display: 'flex', mb: 2 }}>
                  <Box
                    component="img"
                    src={item.product.images?.[0]?.url}
                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.size} • {item.color} • Qty: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Pricing */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Subtotal:</Typography>
                <Typography>₱{subtotal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Shipping:</Typography>
                <Typography>₱{shipping.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Tax (12%):</Typography>
                <Typography>₱{tax.toFixed(2)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                  ₱{total.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePlaceOrder}
              disabled={loading}
              sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Place Order'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
