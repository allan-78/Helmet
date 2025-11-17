const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../../controllers/user/userController');
const { protect } = require('../../middleware/auth');
const { uploadSingle, handleMulterError } = require('../../middleware/upload');
const {
  updateProfileValidation,
  changePasswordValidation,
  handleValidationErrors,
} = require('../../middleware/validators');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', uploadSingle, handleMulterError, updateProfileValidation, handleValidationErrors, updateProfile);
router.put('/password', changePasswordValidation, handleValidationErrors, changePassword);
router.delete('/account', deleteAccount);

module.exports = router;
