const { VALIDATION_ERROR, NOT_FOUND_ERROR, REFERENCE_ERROR } = require('../errors/errors');
const User = require('../models/users');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(REFERENCE_ERROR).send({ message: 'Ошибка по умолчанию.' });
      } else {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь по указанному _id не найден. ${userId}` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(REFERENCE_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(REFERENCE_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(VALIDATION_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(REFERENCE_ERROR).send({ message: 'Произошла ошибка по умолчанию' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createNewUser,
  updateUser,
  updateUserAvatar,
};
