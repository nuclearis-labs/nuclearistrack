const { createHash } = require('crypto');

module.exports.createSHA256 = buffer => {
  return `0x${createHash('sha256')
    .update(buffer)
    .digest('hex')}`;
};
