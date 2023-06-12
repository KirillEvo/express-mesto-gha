const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const { validateUserId } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.get('/me', validateUserId, getUsers);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
