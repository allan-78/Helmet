const express = require('express');
const router = express.Router();
const {
  checkout,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
} = require('../../controllers/user/orderController');
const { protect } = require('../../middleware/auth');

router.use(protect);

router.route('/').post(checkout).get(getUserOrders);
router.get('/:id', getOrderDetails);
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
