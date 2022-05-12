const mongoDb = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = new mongoDb.Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  details: {
    type: mongoDb.Schema.Types.ObjectId,
    ref: 'personaldetail',
    default: null,
  },
  securityQuestion: {
    type: String,
  },
});
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoDb.model('user', userSchema);
