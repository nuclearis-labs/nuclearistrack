"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const txSchema = new mongoose.Schema({
    txHash: String,
    subject: String,
    data: [String]
});
exports.default = mongoose.model('Transaction', txSchema);
//# sourceMappingURL=transaction.js.map