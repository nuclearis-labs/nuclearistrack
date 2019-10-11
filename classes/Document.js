const { createHash } = require('crypto');
const { swarmClient } = require('../services/swarm');

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
      return await swarmClient.bzz.uploadFile(this.file.buffer, {
        contentType: 'application/pdf'
      });
    } catch (err) {
      throw Error(err);
    }
  }

  async get(hash) {
    try {
      const { body } = await swarmClient.bzz.download(hash);
      return new Promise((resolve, reject) => {
        let bufs = [];
        body.on('data', chunk => {
          bufs.push(chunk);
        });
        body.on('end', () => {
          resolve(Buffer.concat(bufs));
        });
        body.on('error', err => {
          reject(err);
        });
      });
    } catch (err) {
      throw Error(err);
    }
  }
}

module.exports = Document;
