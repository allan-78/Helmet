const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../../controllers/admin/brandController');

router.use(protect, authorize('admin'));

router.route('/').get(getBrands).post(createBrand);
router.route('/:id').put(updateBrand).delete(deleteBrand);

module.exports = router;

