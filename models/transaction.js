const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
  txHash: String,
  subject: String,
  data: [String]
});

module.exports = mongoose.model('Transaction', txSchema);
