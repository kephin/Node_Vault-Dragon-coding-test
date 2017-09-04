const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const routes = require('./routes/index');

app.use(bodyParser.json());
app.use('/object', routes);

module.exports = app;
