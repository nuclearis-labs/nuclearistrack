const { createHash } = require('crypto');
const ipfs = require('../services/ipfs');

class Document {
  constructor(file) {
    this.file = file;
  }

  /**
   * Creates a SHA256 hash of a uploaded document
   * @returns {Document} Returns the Document Instance with the created Hash.
   */
  createHash() {
    this.documentHash = createHash('sha256')
      .update(this.file.buffer)
      .digest('hex');
    return this;
  }

  /**
   * Getter function for Document Hash
   * @returns {Object} Returns the Document Instance with the created Hash.
   */
  get getHash() {
    return this.documentHash;
  }

  /**
   * Adds File Buffer to IPFS Node and pins file by default
   * @returns {Document} Returns the Document Instance with the created Hash.
   */
  async saveToIPFS() {
    try {
      const [{ hash }] = await ipfs.add(this.file.buffer);
      return hash;
    } catch (err) {
      throw Error(err);
    }
  }

  async getFromIPFS(hash) {
    try {
      return await ipfs.get(hash);
    } catch (err) {
      throw Error(err);
    }
  }
}

module.exports = Document;
