const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSalesData,
} = require('../../controllers/admin/dashboardController');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getDashboardStats);
router.get('/sales', getSalesData);

module.exports = router;
