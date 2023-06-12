const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.get('/me', getUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
