const express = require('express');
const router = express.Router();
const {
  register,
  login,
  firebaseLogin,
  forgotPassword,
  resetPassword,
  logout,
} = require('../../controllers/user/authController');
const {
  registerValidation,
  loginValidation,
  handleValidationErrors,
} = require('../../middleware/validators');
const { protect } = require('../../middleware/auth');

router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/firebase-login', firebaseLogin);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/logout', protect, logout);

module.exports = router;
