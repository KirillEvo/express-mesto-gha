const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createNewUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createNewUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
