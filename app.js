const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const routes = require('./routes');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
// app.use(cookieParser());
app.use(express.json());

app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true, useUnifiedTopology: true,
});

const { createUser, login } = require('./controllers/auth');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // за 15 минут
//   max: 100, // можно совершить максимум 100 запросов с одного IP
// });

// app.use(limiter);

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
