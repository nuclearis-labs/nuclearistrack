const { createHash } = require('crypto');
const ipfs = require('ipfs-http-client')('localhost', '5001', {
  protocol: 'http'
});

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

  async save() {
    try {
      return await ipfs.add(this.file.buffer);
    } catch (err) {
      throw Error(err);
    }
  }

  async get(hash) {
    try {
      return await ipfs.get(hash);
    } catch (err) {
      throw Error(err);
    }
  }
}

module.exports = Document;
