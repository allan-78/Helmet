const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  resendOrderEmail,
} = require('../../controllers/admin/orderController');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/payment', updatePaymentStatus);
router.post('/:id/resend-email', resendOrderEmail);

module.exports = router;
