import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  Category,
  LocalOffer,
  RateReview,
  Settings,
  Logout,
  ChevronLeft,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 260;

const AdminLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Products', icon: <Inventory />, path: '/admin/products' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Categories', icon: <Category />, path: '/admin/categories' },
    { text: 'Brands', icon: <LocalOffer />, path: '/admin/brands' },
    { text: 'Reviews', icon: <RateReview />, path: '/admin/reviews' },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        position: 'relative',
        background: 'radial-gradient(circle at top, rgba(255,107,53,0.2), rgba(5,5,5,0.95))',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(120deg, rgba(255,255,255,0.02) 25%, transparent 25%), linear-gradient(-120deg, rgba(255,255,255,0.02) 25%, transparent 25%)',
          backgroundSize: '80px 80px',
          opacity: 0.7,
        }}
      />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: `${open ? drawerWidth : 0}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          bgcolor: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            borderRadius: { xs: 0, md: 999 },
            mx: { xs: 2, md: 4 },
            mt: 2,
            px: 3,
            py: 1.25,
            background: 'linear-gradient(135deg, rgba(5,5,5,0.8), rgba(15,15,15,0.7))',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            Admin Command Center
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            color="inherit"
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              mr: 2,
            }}
            onClick={() => navigate('/')}
          >
            View Store
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => navigate('/profile')}>
              <Settings sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'rgba(4,4,4,0.92)',
            color: '#f5f5f5',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            transform: open ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
            transition: theme.transitions.create('transform', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: [1], py: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'rgba(255,107,53,0.12)',
                border: '1px solid rgba(255,107,53,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
              }}
            >
              🛡️
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', letterSpacing: 2 }}>
                AEGISGEAR
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
                Admin Hub
              </Typography>
            </Box>
          </Box>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                    color: isActive ? theme.palette.primary.main : 'rgba(255,255,255,0.7)',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: '0.95rem' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ px: 2, pb: 3, mt: 'auto' }}>
          <Box
            sx={{
              borderRadius: 3,
              p: 2,
              background: 'linear-gradient(145deg, rgba(255,107,53,0.2), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Logged in as
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              sx={{ mt: 2, borderColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => navigate('/profile')}
            >
              View Profile
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'transparent',
          px: { xs: 2, md: 4 },
          pb: { xs: 4, md: 6 },
          pt: { xs: 22, sm: 18, md: 16 },
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          minHeight: '100vh',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box
          sx={{
            maxWidth: 1440,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
