const { createHash } = require('crypto');

class Document {
  constructor(file) {
    this.file = file;
  }

  createHash() {
    this.documentHash = `0x${createHash('sha256')
      .update(this.file.buffer)
      .digest('hex')}`;
    return this;
  }

  get getHash() {
    return this.documentHash;
  }
}

module.exports = Document;
