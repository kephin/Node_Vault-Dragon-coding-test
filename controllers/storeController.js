const Store = require('../models/Store');

exports.getStore = async(req, res, next) => {
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
    next(err);
  }
};

exports.addStore = async(req, res, next) => {
  // avoid empty JSON data
  const keyValueArray = Object.entries(req.body);
  if (keyValueArray.length === 0) return next(new Error('Empty input.'));

  const [key, value] = keyValueArray[0];
  try {
    const newStore = await Store.create({ key, value });
    const timeStamp = newStore.timeStamp;
    res.status(200).json({ key, value, timeStamp });
  } catch (err) {
    next(err);
  }
};
