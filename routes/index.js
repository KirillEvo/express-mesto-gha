const express = require('express');

const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use(express.json());
module.exports = router;
