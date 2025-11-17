const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const { getAllReviews, deleteReview } = require('../../controllers/reviewController');

router.use(protect, authorize('admin'));

router.route('/').get(getAllReviews);
router.route('/:id').delete(deleteReview);

module.exports = router;

