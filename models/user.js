const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  address: String,
  type: Number,
  encryptedPrivateKey: String
});

module.exports = mongoose.model('User', userSchema);
