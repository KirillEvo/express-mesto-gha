const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createNewUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createNewUser);

router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
