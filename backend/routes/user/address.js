const express = require('express');
const router = express.Router();
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../../controllers/user/addressController');
const { protect } = require('../../middleware/auth');

router.use(protect);

router.route('/').get(getAddresses).post(addAddress);
router.route('/:id').put(updateAddress).delete(deleteAddress);
router.patch('/:id/default', setDefaultAddress);

module.exports = router;
