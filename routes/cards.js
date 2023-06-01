const router = require('express').Router();

const {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', postCards);
router.delete('/:cardID', deleteCards);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
