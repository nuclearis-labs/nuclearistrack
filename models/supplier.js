const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const supplierSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  contract: String,
  encryptedPrivateKey: String
});

supplierSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Supplier', supplierSchema);
