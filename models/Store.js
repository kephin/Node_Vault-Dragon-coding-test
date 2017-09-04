const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  timeStamp: {
    type: Number,
    default: Date.now,
  }
});

module.exports = mongoose.model('Store', storeSchema);