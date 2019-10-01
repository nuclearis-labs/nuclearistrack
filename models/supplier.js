const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  username: String,
  email: String,
  address: String,
  contract: String,
  encryptedPrivateKey: String
});

module.exports = mongoose.model('Supplier', supplierSchema);
