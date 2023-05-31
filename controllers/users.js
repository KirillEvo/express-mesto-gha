const { VALIDATION_ERROR, NOT_FOUND_ERROR, REFERENCE_ERROR } = require('../errors/errors');
const User = require('../modules/users');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошабка по умолчанию' }));
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' }));
      }
      next(res.send({ data: user }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные _id' }));
      }
      next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' }));
    });
};

module.exports.createNewUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' }));
      }
      next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' }));
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        next(res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' }));
      }
      next(res.send({ data: user }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' }));
      }
      next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' }));
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (!user) {
        next(res.status(NOT_FOUND_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' }));
      }
      next(res.send({ data: user }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR).send({ message: 'Пользователь с указанным _id не найден' }));
      }
      next(res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' }));
    });
};
