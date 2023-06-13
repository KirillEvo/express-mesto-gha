const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized_error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // извлечём токен
  const token = req.cookies.jwt;
  // верифицируем токен
  let payload;
  try {
    if (!token) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError('Необходима авторизация'));
    // throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
