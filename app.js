const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true, useUnifiedTopology: true,
})
  .then(() => {
    console.log('С подключением');
  })
  .catch(() => {
    console.log('Не подключились :(');
  });

app.use((req, res, next) => {
  req.user = {
    _id: '6476d709ab2d077e6c6372e3',
  };

  next();
});

app.use('/', routerUsers);
app.use('/', routerCards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
