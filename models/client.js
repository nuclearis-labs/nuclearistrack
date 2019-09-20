const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  encryptedPrivateKey: String
});

clientSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Client', clientSchema);
