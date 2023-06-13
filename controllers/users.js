const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорретный Id'));
        return;
      }
      next(err);
    });
};

function cachingDecorator(func) {
  const cache = new Map();

  // eslint-disable-next-line func-names
  return function (x) {
    if (cache.has(x)) { // если кеш содержит такой x,
      return cache.get(x); // читаем из него результат
    }

    const result = func(x); // иначе, вызываем функцию

    cache.set(x, result); // и кешируем (запоминаем) результат
    return result;
  };
}

function updateUserData(req, res, next, args) {
  User.findByIdAndUpdate(req.user._id, args, { new: true, runValidators: true })
    .then((user) => { next(res.send({ user })); })
    .catch(next);
}

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  cachingDecorator(updateUserData(req, res, next, { name, about }));
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  cachingDecorator(updateUserData(req, res, next, { avatar }));
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
