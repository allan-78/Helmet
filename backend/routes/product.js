const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  searchProducts,
} = require('../controllers/productController');

router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
