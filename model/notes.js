const mongo = require('mongoose');

//------------------------- Schema for user notes

const noteSchema = new mongo.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  userId: {
    type: String,
    required: true,
  },
});
module.exports = mongo.model('userNotes', noteSchema);
