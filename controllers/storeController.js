const mongoose = require('mongoose');
const Store = require('../models/Store');

exports.getStore = async(req, res) => {
  const queryTimeStamp = parseInt(req.query.timestamp, 10);
  try {
    const store = queryTimeStamp ?
      await Store
      .find({ key: req.params.key })
      .where('timeStamp').lte(queryTimeStamp)
      .sort({ timeStamp: -1 })
      .limit(1) :
      await Store
      .find({ key: req.params.key })
      .sort({ timeStamp: -1 })
      .limit(1);
    const { value } = store[0];
    res.json({ value });
  } catch (err) {
    res.status(404).json(err);
  }
};

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
