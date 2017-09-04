const mongoose = require('mongoose');
const app = require('./app');

// import env from variable.env file
require('dotenv').config({ path: 'variable.env' });

// connect to MongoDB
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => console.error(err.message));

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));
