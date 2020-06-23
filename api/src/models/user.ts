const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  address: String,
  roles: [String],
  encryptedPrivateKey: String
});

export default mongoose.model('User', userSchema);
