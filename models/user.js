const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  address: String,
  type: Number,
  status: Boolean,
  encryptedPrivateKey: String
});

module.exports = mongoose.model('User', userSchema);
