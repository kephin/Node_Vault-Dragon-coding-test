const mongoose = require('mongoose');
const app = require('./app');

// import env from variable.env file
require('dotenv').config({ path: 'variable.env' });

// connect to MongoDB
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(process.env.MONGODB_TEST_URI);
} else {
  mongoose.connect(process.env.MONGODB_URI);
}
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => console.error(err.message));

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
