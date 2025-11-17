const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
} = require('../../controllers/admin/productController');
const { protect, authorize } = require('../../middleware/auth');
const { uploadMultiple, handleMulterError } = require('../../middleware/upload');
const {
  createProductValidation,
  updateProductValidation,
  handleValidationErrors,
} = require('../../middleware/validators');

router.use(protect, authorize('admin'));

router.post('/', uploadMultiple, handleMulterError, createProductValidation, handleValidationErrors, createProduct);
router.post('/bulk-delete', bulkDeleteProducts);
router.put('/:id', uploadMultiple, handleMulterError, updateProductValidation, handleValidationErrors, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
