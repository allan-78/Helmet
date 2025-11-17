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
    <Box
      sx={{
        py: 6,
        background: 'radial-gradient(circle at top, rgba(255,107,53,0.12), transparent 60%)',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ letterSpacing: 4 }}>
            Secure Checkout
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Lock in your ride
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Confirm your shipping details and payment method to finalize the order.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Side */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                mb: 3,
                background: 'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(8,8,8,0.95))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Shipping Information
              </Typography>

              {addresses.length > 0 && (
                <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                  <FormLabel component="legend">Saved Addresses</FormLabel>
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

              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Grid container spacing={2}>
                {[
                  { label: 'Full Name', name: 'fullName' },
                  { label: 'Address', name: 'address', multiline: true, rows: 2 },
                  { label: 'City', name: 'city', half: true },
                  { label: 'Postal Code', name: 'postalCode', half: true },
                  { label: 'Phone Number', name: 'phoneNumber', half: true },
                  { label: 'Country', name: 'country', half: true },
                ].map((field) => (
                  <Grid item xs={12} sm={field.half ? 6 : 12} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={shippingInfo[field.name]}
                      onChange={handleShippingInfoChange}
                      required
                      multiline={field.multiline}
                      rows={field.rows}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                background: 'linear-gradient(165deg, rgba(255,107,53,0.15), rgba(5,5,5,0.95))',
                border: '1px solid rgba(255,107,53,0.3)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
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
                * Additional payment rails launching soon. COD available nationwide.
              </Typography>
            </Paper>
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                position: 'sticky',
                top: 100,
                background: 'linear-gradient(200deg, rgba(10,10,10,0.95), rgba(0,0,0,0.9))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Order Review
              </Typography>

              <Box sx={{ mb: 3, maxHeight: 280, overflowY: 'auto' }}>
                {cart.items?.map((item) => (
                  <Box key={item._id || item.product._id} sx={{ display: 'flex', mb: 2 }}>
                    <Box
                      component="img"
                      src={item.product.images?.[0]?.url}
                      sx={{
                        width: 64,
                        height: 64,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mr: 2,
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.size} • {item.color} • Qty {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.12)' }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>₱{subtotal.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography>₱{shipping.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography color="text.secondary">Tax (12%)</Typography>
                  <Typography>₱{tax.toFixed(2)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h5" color="primary.light" sx={{ fontWeight: 800 }}>
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
              >
                {loading ? <CircularProgress size={24} /> : 'Place Order'}
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                You’ll receive an email with your digital receipt and PDF copy instantly.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
