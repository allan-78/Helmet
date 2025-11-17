import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import {
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
  Visibility,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../../services/api';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatDateInput = (date) => date.toISOString().split('T')[0];

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [monthlySales, setMonthlySales] = useState([]);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [rangeFilters, setRangeFilters] = useState({
    startDate: formatDateInput(new Date(new Date().setMonth(new Date().getMonth() - 1))),
    endDate: formatDateInput(new Date()),
  });
  const [rangeSales, setRangeSales] = useState([]);
  const [rangeLoading, setRangeLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchMonthlySales(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    fetchRangeSales(rangeFilters.startDate, rangeFilters.endDate);
  }, []);

  const fetchDashboardData = async () => {
    setStatsLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchMonthlySales = async (year) => {
    setMonthlyLoading(true);
    try {
      const { data } = await api.get('/admin/dashboard/sales', { params: { year } });
      setMonthlySales(data.salesByMonth || []);
    } catch (error) {
      console.error('Failed to fetch monthly sales:', error);
    } finally {
      setMonthlyLoading(false);
    }
  };

  const fetchRangeSales = async (startDate, endDate) => {
    if (!startDate || !endDate) return;
    setRangeLoading(true);
    try {
      const { data } = await api.get('/admin/dashboard/sales', { params: { startDate, endDate } });
      setRangeSales(data.salesByDay || []);
    } catch (error) {
      console.error('Failed to fetch range sales:', error);
    } finally {
      setRangeLoading(false);
    }
  };

  const summary = dashboardData?.stats || {};
  const recentOrders = dashboardData?.recentOrders || [];
  const lowStockProducts = dashboardData?.lowStockProducts || [];

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₱${(summary.totalRevenue || 0).toLocaleString()}`,
      change: '+12.5%',
      accent: '#FF6B35',
      icon: <AttachMoney fontSize="large" />,
    },
    {
      title: 'Total Orders',
      value: summary.totalOrders || 0,
      change: '+8.2%',
      accent: '#3b82f6',
      icon: <ShoppingCart fontSize="large" />,
    },
    {
      title: 'Total Products',
      value: summary.totalProducts || 0,
      change: '+2.1%',
      accent: '#8b5cf6',
      icon: <Inventory fontSize="large" />,
    },
    {
      title: 'Total Users',
      value: summary.totalUsers || 0,
      change: '+5.1%',
      accent: '#10b981',
      icon: <People fontSize="large" />,
    },
  ];

  const monthlyChartData = useMemo(() => {
    return monthLabels.map((label, index) => {
      const match = monthlySales.find((item) => item.month === index + 1);
      return {
        month: label,
        sales: match?.totalSales || 0,
        orders: match?.orderCount || 0,
      };
    });
  }, [monthlySales]);

  const rangeChartData = useMemo(() => {
    return rangeSales.map((entry) => {
      const date = new Date(entry.date);
      return {
        dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: entry.totalSales,
        orders: entry.orderCount,
      };
    });
  }, [rangeSales]);

  const yearOptions = Array.from({ length: 5 }).map((_, idx) => new Date().getFullYear() - idx);

  if (statsLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor your helmet empire at a glance.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              sx={{
                borderRadius: 4,
                background: `linear-gradient(135deg, ${card.accent}33, rgba(15,15,15,0.9))`,
                border: `1px solid ${card.accent}55`,
                color: '#fff',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: `${card.accent}33`,
                      border: `1px solid ${card.accent}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.accent,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Chip label={card.change} size="small" sx={{ bgcolor: '#22c55e22', color: '#22c55e' }} />
                </Box>
                <Typography variant="h4" fontWeight={800}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 3, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Monthly Sales Trend
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Full-year performance overview
                </Typography>
              </Box>
              <TextField
                select
                size="small"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ height: 320, p: 2 }}>
              {monthlyLoading ? (
                <LinearProgress />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#FF6B35" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'background.paper', height: '100%' }}>
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography variant="h6" fontWeight={700}>
                Custom Range Performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Filter revenue by any period
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={rangeFilters.startDate}
                  onChange={(e) => setRangeFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={rangeFilters.endDate}
                  onChange={(e) => setRangeFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => fetchRangeSales(rangeFilters.startDate, rangeFilters.endDate)}
                  disabled={!rangeFilters.startDate || !rangeFilters.endDate}
                >
                  Apply
                </Button>
              </Stack>
            </Box>
            <Box sx={{ height: 280, p: 2 }}>
              {rangeLoading ? (
                <LinearProgress />
              ) : rangeChartData.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    No sales in this range.
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rangeChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="dateLabel" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#FF6B35" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="h6" fontWeight={700}>
                Recent Orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latest transactions across the store
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>#{order._id.slice(-6)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {order.user?.name?.charAt(0) || 'R'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {order.user?.name || 'Guest'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>₱{order.totalPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.orderStatus}
                            size="small"
                            color={
                              order.orderStatus === 'Delivered'
                                ? 'success'
                                : order.orderStatus === 'Cancelled'
                                ? 'error'
                                : 'warning'
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No orders yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'background.paper', height: '100%' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="h6" fontWeight={700}>
                Low Stock Alert
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reorder helmets before riders miss out.
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <Box
                    key={product._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={product.images?.[0]?.url}
                        sx={{ width: 48, height: 48, bgcolor: '#1f1f1f' }}
                      >
                        {product.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.stock} units left
                        </Typography>
                      </Box>
                    </Box>
                    <Chip label="Low" size="small" color="error" />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  All products have comfortable stock levels.
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
