const { VALIDATION_ERROR, NOT_FOUND_ERROR, REFERENCE_ERROR } = require('../errors/errors');
const Card = require('../models/cards');

const getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(REFERENCE_ERROR).send({ message: 'Ошибка по умолчанию.' });
      } else {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
    });
};

const postCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(REFERENCE_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const deleteCards = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для удаления карточки' });
      } else {
        res.status(REFERENCE_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(VALIDATION_ERROR).send({ message: 'Передан несуществующий _id карточки' });
    }
    res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'castError') {
      res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка.' });
    } else {
      res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' });
    }
  });

module.exports = {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
};
