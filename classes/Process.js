/* eslint-disable no-await-in-loop */
const fs = require('fs');
const Contract = require('./Contract');
const Document = require('./Document');
const utils = require('../functions/utils');

const projectABI = JSON.parse(fs.readFileSync('build/contracts/Project.json'))
  .abi;

class Process extends Contract {
  constructor(address, wallet, privateKey) {
    super(wallet, privateKey);
    this.instance = this.initiateContract(projectABI, address);
  }

  async addDocument(_supplierAddress, _documentName, file) {
    try {
      utils.isString(_documentName);
      utils.isValidAddress(_supplierAddress);

      const documentName = utils.toBytes32(_documentName);
      const supplierAddress = utils.toChecksumAddress(_supplierAddress);

      const documentHash = new Document(file).createHash().getHash;

      this.data = this.instance.methods
        .addDocument(supplierAddress, documentHash, documentName)
        .encodeABI();
      this.gaslimit = await this.instance.methods
        .addDocument(supplierAddress, documentHash, documentName)
        .estimateGas({ from: this.wallet });

      const { transactionHash, blockNumber } = await this.sendTx(
        'AddDocument',
        this.instance.options.address
      );
      return {
        documentHash,
        contractAddress: this.instance.options.address,
        transactionHash,
        blockNumber
      };
    } catch (e) {
      throw Error(e);
    }
  }

  async verifyDocument(file) {
    try {
      const documentHash = new Document(file).createHash().getHash;

      this.data = this.instance.methods.findDocument(documentHash).encodeABI();
      this.gaslimit = await this.instance.methods
        .findDocument(documentHash)
        .estimateGas({ from: this.wallet });

      const { transactionHash, blockNumber } = await this.sendTx(
        this.instance.options.address
      );
      return {
        documentHash,
        contractAddress: this.instance.options.address,
        transactionHash,
        blockNumber
      };
    } catch (e) {
      throw Error(e);
    }
  }

  async returnDocuments() {
    this.documentsQty = await this.instance.methods.documentQty().call();
    this.documents = [];
    for (let i = 0; i < this.documentsQty; i += 1) {
      const document = await this.instance.methods.allDocuments(i).call();
      const documentDetails = await this.instance.methods
        .findDocument(document)
        .call();
      this.documents.push(documentDetails);
    }
    return this;
  }
}

module.exports = Process;
