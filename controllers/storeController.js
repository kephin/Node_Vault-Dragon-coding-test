const Store = require('../models/Store');

exports.getStore = async(req, res, next) => {
  const queryLength = Object.keys(req.query).length;
  switch (queryLength) {
    case 0:
      // no query will return latest value
      try {
        const store = await Store
          .find({ key: req.params.key })
          .sort({ timeStamp: -1 })
          .limit(1);
        const { value } = store[0];
        res.json({ value });
      } catch (err) {
        next(new Error(`${req.params.key} not found!`));
      }
      break;
    case 1:
      // check if the key is correct
      if (Object.keys(req.query)[0] !== 'timestamp') return next(new Error('Bad request with incorrect query name.'));
      // check if the value is a number
      const queryString = Object.values(req.query)[0];
      const queryTimeStamp = Number(queryString);
      if (!queryString || isNaN(queryTimeStamp)) return next(new Error('Bad request with incorrect query value.'));
      // return value within the timestamp query
      try {
        const store = await Store
          .find({ key: req.params.key })
          .where('timeStamp').lte(queryTimeStamp)
          .sort({ timeStamp: -1 })
          .limit(1);
        const { value } = store[0];
        res.json({ value });
      } catch (err) {
        next(new Error(`${req.params.key} not found!`));
      }
      break;
    default: // more than 1 queries
      next(new Error('Bad request with too much queries.'));
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
