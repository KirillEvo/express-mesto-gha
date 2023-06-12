const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUser,
} = require('../controllers/users');

const {
  validateUserId,
  validateUpdateUser,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
