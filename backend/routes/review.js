const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getReviewEligibility,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const { filterReviewContent } = require('../middleware/badWordsFilter'); // ✅ Already here
const {
  createReviewValidation,
  handleValidationErrors,
} = require('../middleware/validators');

router.get('/product/:productId', getProductReviews);
router.get('/product/:productId/eligibility', protect, getReviewEligibility);

router.post(
  '/', 
  protect, 
  filterReviewContent, // ✅ Bad words filter applied
  createReviewValidation, 
  handleValidationErrors, 
  createReview
);

router.put('/:id', protect, filterReviewContent, updateReview); // ✅ Also on update
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;
