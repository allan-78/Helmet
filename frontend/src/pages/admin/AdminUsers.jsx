import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Box,
  Stack,
  Grid,
} from '@mui/material';
import { Block, CheckCircle, Search } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users', {
        params: { search },
      });
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await api.put(`/admin/users/${userId}/block`, {
        isBlocked: !isBlocked,
      });
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (loading) return <Loading />;

  const totalAdmins = users.filter((user) => user.role === 'admin').length;
  const blockedUsers = users.filter((user) => user.isBlocked).length;
  const activeUsers = users.length - blockedUsers;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            User Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage riders, admins, and access status.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {[
            { label: 'Total Users', value: users.length, accent: '#FF6B35' },
            { label: 'Active', value: activeUsers, accent: '#22c55e' },
            { label: 'Blocked', value: blockedUsers, accent: '#ef4444' },
            { label: 'Admins', value: totalAdmins, accent: '#3b82f6' },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: `1px solid ${stat.accent}33`,
                  background: 'rgba(15,15,15,0.95)',
                }}
              >
                <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: stat.accent }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(15,15,15,0.95), rgba(5,5,5,0.95))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
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
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={user.avatar?.url} sx={{ bgcolor: 'primary.main' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.phoneNumber || 'No contact'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" color={user.role === 'admin' ? 'primary' : 'default'} />
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isBlocked ? 'Blocked' : 'Active'}
                        size="small"
                        color={user.isBlocked ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleBlockUser(user._id, user.isBlocked)}
                        color={user.isBlocked ? 'success' : 'error'}
                        disabled={user.role === 'admin'}
                      >
                        {user.isBlocked ? <CheckCircle /> : <Block />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </Container>
  );
};

export default AdminUsers;
