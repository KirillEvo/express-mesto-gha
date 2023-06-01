const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true, useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6476d709ab2d077e6c6372e3',
  };
  next();
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
