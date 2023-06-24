const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized_error');

// const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // извлекаем токен
  const token = req.cookies.jwt;
  // верифицируем токен
  let payload;
  try {
    if (!token) {
      return next(new UnauthorizedError('Необходима авторизация'));
      // throw next(new UnauthorizedError('Необходима авторизация'));
    }
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
    // payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError('Необходима авторизация'));
    // throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
