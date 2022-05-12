const mongoDb = require('mongoose');

const detailSchema = new mongoDb.Schema({
  age: {
    type: Number,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  lastPeriodDate: {
    type: Date,
  },
  periodLength: {
    type: Number,
  },
  cycleLength: {
    type: Number,
  },
});

module.exports = mongoDb.model('personaldetail', detailSchema);
