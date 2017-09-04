const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');

router.post('/', storeController.addStore);

module.exports = router;
