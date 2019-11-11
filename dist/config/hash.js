"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function createSHA256(buffer) {
    return `0x${crypto_1.createHash('sha256')
        .update(buffer)
        .digest('hex')}`;
}
exports.createSHA256 = createSHA256;
//# sourceMappingURL=hash.js.map