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
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
                        <IconButton component={Link} to={`/orders/${order._id}`} size="small">
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent sx={{ minWidth: 300, pt: 2 }}>
          <TextField
            fullWidth
            select
            label="Order Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrders;
