const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const routes = require('./routes/routes');

app.use(bodyParser.json());
app.use('/object', routes);

app.use((err, req, res, next) => {
  res.status(404).send({ error: err.message });
});

module.exports = app;
