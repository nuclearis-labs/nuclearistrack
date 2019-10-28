const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
  hash: String,
  proyecto: String,
  subject: String,
  data: [String]
});

module.exports = mongoose.model('Transaction', txSchema);
