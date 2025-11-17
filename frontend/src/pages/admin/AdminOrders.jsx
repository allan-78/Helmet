import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  InputAdornment,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import { Visibility, Edit, Search } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    try {
      await api.patch(`/admin/orders/${selectedOrder._id}/status`, {
        status: newStatus,
      });
      toast.success('Order status updated!');
      fetchOrders();
      handleCloseDialog();
    } catch (error) {
      toast.error('Update failed');
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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  const handleViewOrder = async (orderId) => {
    setDetailLoading(true);
    try {
      const { data } = await api.get(`/admin/orders/${orderId}`);
      setOrderDetail(data.order);
      setViewDialogOpen(true);
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setOrderDetail(null);
  };

  const handlePaymentUpdate = async () => {
    if (!selectedOrder) {
      toast.error('No order selected');
      return;
    }
    try {
      await api.patch(`/admin/orders/${selectedOrder._id}/payment`, { paymentStatus });
      toast.success('Payment status updated!');
      fetchOrders();
    } catch (error) {
      toast.error('Payment update failed');
    }
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Orders & Fulfillment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track transactions, payments, and status updates.
          </Typography>
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(15,15,15,0.95), rgba(5,5,5,0.95))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              placeholder="Search order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">All statuses</MenuItem>
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Paper>

        <Paper
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          #{order._id.slice(-8)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar>{order.user?.name?.charAt(0) || 'R'}</Avatar>
                          <Box>
                            <Typography fontWeight={600}>{order.user?.name || 'Guest'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.user?.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{order.orderItems.length}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>₱{order.totalPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.paymentStatus}
                          size="small"
                          color={order.isPaid ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={order.orderStatus} size="small" color={getStatusColor(order.orderStatus)} />
                      </TableCell>
                      <TableCell align="right">
                      <IconButton size="small" onClick={() => handleViewOrder(order._id)}>
                        <Visibility />
                      </IconButton>
                        <IconButton size="small" onClick={() => handleOpenDialog(order)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No orders match your filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      {/* Update Status Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography component="div">
            <Typography variant="h6" fontWeight={700}>
              Update Order Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep riders in the loop with accurate fulfillment.
            </Typography>
          </Typography>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: 'linear-gradient(135deg, rgba(10,10,10,0.95), rgba(5,5,5,0.95))',
          }}
        >
          {selectedOrder && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 3,
                borderColor: 'rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                #{selectedOrder._id.slice(-8)}
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                ₱{selectedOrder.totalPrice.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedOrder.orderItems.length} item(s) • {selectedOrder.user?.name || 'Guest'}
              </Typography>
              <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.08)' }} />
              <Stack direction="row" spacing={2}>
                <Chip label={selectedOrder.paymentStatus} size="small" color={selectedOrder.isPaid ? 'success' : 'warning'} />
                <Chip label={selectedOrder.orderStatus} size="small" color={getStatusColor(selectedOrder.orderStatus)} />
              </Stack>
            </Paper>
          )}

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Select Status
          </Typography>
          <ToggleButtonGroup
            value={newStatus}
            color="primary"
            exclusive
            onChange={(e, value) => value && setNewStatus(value)}
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <ToggleButton
                key={status}
                value={status}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  borderRadius: 999,
                }}
              >
                {status}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Payment Status
          </Typography>
          <ToggleButtonGroup
            value={paymentStatus}
            color="primary"
            exclusive
            onChange={(e, value) => value && setPaymentStatus(value)}
            sx={{ gap: 1 }}
          >
            {['Pending', 'Paid', 'Refunded'].map((status) => (
              <ToggleButton key={status} value={status} sx={{ textTransform: 'none', px: 3, borderRadius: 999 }}>
                {status}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={handlePaymentUpdate}>
              Update Payment
            </Button>
          <Button
            onClick={async () => {
              await handlePaymentUpdate();
              await handleUpdateStatus();
            }}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}
          >
            Save Status
          </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog open={viewDialogOpen} onClose={handleCloseView} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers sx={{ background: 'radial-gradient(circle at top, rgba(255,107,53,0.08), rgba(5,5,5,0.95))' }}>
          {detailLoading && <Typography>Loading...</Typography>}
          {!detailLoading && orderDetail && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6">#{orderDetail._id}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Placed on {new Date(orderDetail.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Paper sx={{ p: 2, flex: 1, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer
                  </Typography>
                  <Typography fontWeight={600}>{orderDetail.user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderDetail.user?.email}
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label={orderDetail.orderStatus} color={getStatusColor(orderDetail.orderStatus)} />
                    <Chip label={orderDetail.paymentStatus} color={orderDetail.paymentStatus === 'Paid' ? 'success' : 'warning'} />
                  </Stack>
                </Paper>
              </Stack>
              <Paper sx={{ borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetail.orderItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.product?.name || 'Product'}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell align="right">₱{(item.price * item.quantity).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrders;
