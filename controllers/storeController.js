const mongoose = require('mongoose');
const Store = require('../models/Store');

exports.addStore = async(req, res) => {
  const [key, value] = Object.entries(req.body)[0];
  try {
    const newStore = await Store.create({ key, value });
    const timeStamp = newStore.timeStamp;
    res.status(200).json({ key, value, timeStamp });
  } catch (err) {
    res.status(404).json(err);
  }
};
