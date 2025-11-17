const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/User');
const Review = require('../../models/Review');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name stock images')
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      ordersByStatus,
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
      error: error.message,
    });
  }
};

// @desc    Get sales data
// @route   GET /api/admin/dashboard/sales
// @access  Private/Admin
exports.getSalesData = async (req, res) => {
  try {
    const { year, startDate, endDate } = req.query;

    // Handle custom date range request
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const salesByDay = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            paymentStatus: 'Paid',
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
            totalSales: { $sum: '$totalPrice' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      ]);

      const normalizedDaily = salesByDay.map((item) => {
        const date = new Date(item._id.year, item._id.month - 1, item._id.day);
        return {
          date: date.toISOString(),
          totalSales: item.totalSales,
          orderCount: item.orderCount,
        };
      });

      return res.status(200).json({
        success: true,
        salesByDay: normalizedDaily,
      });
    }

    const targetYear = Number(year) || new Date().getFullYear();

    const rawMonthly = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${targetYear}-01-01`),
            $lte: new Date(`${targetYear}-12-31`),
          },
          paymentStatus: 'Paid',
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalSales: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const monthMap = rawMonthly.reduce((acc, item) => {
      acc[item._id] = {
        month: item._id,
        totalSales: item.totalSales,
        orderCount: item.orderCount,
      };
      return acc;
    }, {});

    const salesByMonth = Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      return (
        monthMap[monthNumber] || {
          month: monthNumber,
          totalSales: 0,
          orderCount: 0,
        }
      );
    });

    res.status(200).json({
      success: true,
      salesByMonth,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get sales data',
      error: error.message,
    });
  }
};
