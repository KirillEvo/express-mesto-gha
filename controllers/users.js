const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
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
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля.');
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('Переданы некорректные данные при обновлении аватара');
      } else {
        res.status(500).send({ message: 'Произошла ошибка по умолчанию' });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      } else {
        res.status(500).send({ message: 'Произошла ошибка по умолчанию' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUser,
};
