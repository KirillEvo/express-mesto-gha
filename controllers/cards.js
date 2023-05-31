const { VALIDATION_ERROR, NOT_FOUND_ERROR, REFERENCE_ERROR } = require('../errors/errors');
const Card = require('../modules/cards');

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' }));
      }
      next(err);
    });
};

module.exports.postCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' }));
      }
      next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' }));
    });
};

module.exports.deleteCards = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        next(res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' }));
      }
      next(res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для удаления карточки' }));
      }
      next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' }));
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      next(res.status(NOT_FOUND_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка.' }));
    }
    next(res.send({ data: card }));
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(res.status(VALIDATION_ERROR).send({ message: 'Передан несуществующий _id карточки' }));
    }
    next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' }));
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (card) {
      next(res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки' }));
    }
    next(res.send({ data: card }));
  })
  .catch((err) => {
    if (err.name === 'castError') {
      next(res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка.' }));
    }
    next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' }));
  });
