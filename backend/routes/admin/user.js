const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  blockUser,
  deleteUser,
} = require('../../controllers/admin/userController');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/block', blockUser);
router.delete('/:id', deleteUser);

module.exports = router;
