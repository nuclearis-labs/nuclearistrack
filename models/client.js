const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  username: String,
  email: String,
  address: String,
  contract: String,
  encryptedPrivateKey: String
});

module.exports = mongoose.model('Client', clientSchema);
