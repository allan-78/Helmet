require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const brandRoutes = require('./routes/brand');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/user/auth');
const userRoutes = require('./routes/user/user');
const cartRoutes = require('./routes/user/cart');
const addressRoutes = require('./routes/user/address');
const userOrderRoutes = require('./routes/user/order');
const adminProductRoutes = require('./routes/admin/product');
const adminOrderRoutes = require('./routes/admin/order');
const adminUserRoutes = require('./routes/admin/user');
const adminDashboardRoutes = require('./routes/admin/dashboard');

const app = express();

// Connect to MongoDB
connectDB();

// Security & Optimization Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AegisGear API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API root
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AegisGear API',
    version: '1.0.0',
  });
});

// ============================================
// PUBLIC ROUTES
// ============================================
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/reviews', reviewRoutes);

// ============================================
// USER ROUTES (Protected)
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', userOrderRoutes);

// ============================================
// ADMIN ROUTES (Protected + Admin Only)
// ============================================
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║     🛡️  AEGISGEAR API SERVER 🛡️      ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`\n✅ Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('\n📚 Available Routes:');
  console.log('   PUBLIC:');
  console.log('   - GET    /api/products');
  console.log('   - GET    /api/categories');
  console.log('   - GET    /api/brands');
  console.log('   - GET    /api/reviews/product/:productId');
  console.log('\n   USER:');
  console.log('   - POST   /api/auth/register');
  console.log('   - POST   /api/auth/login');
  console.log('   - GET    /api/user/profile');
  console.log('   - GET    /api/cart');
  console.log('   - POST   /api/orders');
  console.log('\n   ADMIN:');
  console.log('   - GET    /api/admin/dashboard');
  console.log('   - POST   /api/admin/products');
  console.log('   - GET    /api/admin/orders');
  console.log('   - GET    /api/admin/users');
  console.log('\n════════════════════════════════════════\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ UNHANDLED REJECTION! Shutting down...`);
  console.error(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;
