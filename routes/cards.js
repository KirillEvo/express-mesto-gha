const router = require('express').Router();

const {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', postCards);
router.delete('/cards/:cardID', deleteCards);

router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
