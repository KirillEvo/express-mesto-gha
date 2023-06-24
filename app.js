require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes');
const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateCreateUser, validateLogin } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/auth');

const { MONGO_URL } = process.env;

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true, useUnifiedTopology: true,
});

app.use(cookieParser());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

app.use(requestLogger);
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);
app.use(routes);

// app.use(limiter);
app.use(helmet());

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? err.message
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
