const express = require('express');
const app = express();

// import environment viriable from variable.env
require('dotenv').config({ path: 'variable.env' });

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));
