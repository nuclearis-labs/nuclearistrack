const { createHash } = require('crypto');
const ipfs = require('ipfs-http-client')('localhost', '5001', {
  protocol: 'http'
});
const isIPFS = require('is-ipfs');

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

  async get(cid) {
    try {
      if (!isIPFS.cid(cid)) throw Error('Is not a correct CID format');
      let buffer = await ipfs.get(cid);
      return buffer[0].content.toString('base64');
    } catch (err) {
      throw Error(err);
    }
  }
}

module.exports = Document;
