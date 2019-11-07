const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
  txHash: String,
  subject: String,
  data: [String]
});

export default mongoose.model('Transaction', txSchema);
