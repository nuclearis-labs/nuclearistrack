const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  mnemonic: String,
  address: String,
  index: { type: Number, default: 0 },
  type: Number,
  status: Boolean
});

module.exports = mongoose.model('User', userSchema);
