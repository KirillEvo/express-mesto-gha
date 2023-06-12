const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequest = require('../errors/bad-request');

const validateUrl = (url) => {
  const validate = validator.isURL(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный URL');
};

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserId = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUserId,
};
