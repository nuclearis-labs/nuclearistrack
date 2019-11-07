"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    address: String,
    type: Number,
    status: Boolean,
    encryptedPrivateKey: String
});
exports.default = mongoose.model('User', userSchema);
//# sourceMappingURL=user.js.map