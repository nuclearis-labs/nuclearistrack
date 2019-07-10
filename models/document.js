var mongoose = require("mongoose");

var docSchema = new mongoose.Schema({
  id: String,
  hash: String,
  tx: String,
  proyecto: Number,
  filename: String,
  mined: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  username: String
});

module.exports = mongoose.model("Document", docSchema);
