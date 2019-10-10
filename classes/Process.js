/* eslint-disable no-await-in-loop */
const fs = require('fs');
const Contract = require('./Contract');
const Document = require('./Document');
const utils = require('../functions/utils');
const Validator = require('./Validator');
const Transaction = require('./Transaction');

const projectABI = JSON.parse(fs.readFileSync('build/contracts/Project.json'))
  .abi;

class Process extends Contract {
  constructor(address, wallet, privateKey) {
    super(wallet, privateKey);
    this.address = address;
    this.instance = this.initiateContract(projectABI, address);
  }

  async addDocument(_supplierAddress, _documentName, file) {
    try {
      const documentName = Validator.checkAndConvertNumber(_documentName);
      const supplierAddress = Validator.checkAndConvertAddress(
        _supplierAddress
      );

      const documentHash = new Document(file).createHash().getHash;

      const transaction = new Transaction(this, this.address, 'addDocument', [
        supplierAddress,
        documentHash,
        documentName
      ]);

      transaction.encodeABI();
      await transaction.estimateGas();
      await transaction.estimateGasLimit();
      await transaction.getNonce();
      transaction
        .prepareRawTx()
        .sign()
        .serialize();

      return await transaction.send();
    } catch (e) {
      throw Error(e);
    }
  }

  async verifyDocument(file) {
    try {
      const documentHash = new Document(file).createHash().getHash;

      const transaction = new Transaction(this, this.address, 'findDocument', [
        documentHash
      ]);

      transaction.encodeABI();
      await transaction.estimateGas();
      await transaction.estimateGasLimit();
      await transaction.getNonce();
      transaction
        .prepareRawTx()
        .sign()
        .serialize();

      return await transaction.send();
    } catch (e) {
      throw Error(e);
    }
  }

  async returnDocuments() {
    const txDocQty = new Transaction(this, this.address, 'documentQty');

    const documentQty = await txDocQty.call();

    this.documents = [];
    for (let i = 0; i < documentQty; i += 1) {
      const txAllDoc = new Transaction(this, this.address, 'allDocuments', [i]);
      const document = await txAllDoc.call();

      const txDoc = new Transaction(this, this.address, 'findDocument', [
        document
      ]);
      const documentDetails = await txDoc.call();

      this.documents.push(documentDetails);
    }
    return this;
  }
}

module.exports = Process;
