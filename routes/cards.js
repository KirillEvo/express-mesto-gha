const router = require('express').Router();

const {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCard,
  validateCardById,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateCard, postCards);
router.delete('/:cardId', validateCardById, deleteCards);

router.put('/:cardId/likes', validateCardById, likeCard);
router.delete('/:cardId/likes', validateCardById, dislikeCard);

module.exports = router;
