const express = require('express');
const router = require('express').Router();

const NotFoundError = require('../errors/not-found-err');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Некорректный путь'));
});

router.use(express.json());
module.exports = router;
