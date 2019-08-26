const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
  id: String,
  proyecto: Number,
  username: String,
  fileName: String,
  fileHash: String,
  transactionHash: String,
  blockHash: String,
  blockNumber: Number,
  visible: { type: Boolean, default: true }
});

module.exports = mongoose.model('Document', docSchema);
