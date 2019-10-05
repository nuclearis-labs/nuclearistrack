const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  address: String,
  contract: String,
  encryptedPrivateKey: String
});

module.exports = mongoose.model('User', userSchema);
