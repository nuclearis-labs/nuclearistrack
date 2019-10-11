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
  constructor(address, privateKey, contractAddress) {
    super(projectABI, contractAddress);
    this.address = address;
    this.privateKey = privateKey;
    this.initiateContract(contractAddress, projectABI);
  }

  async addDocument(_documentName, file) {
    try {
      const documentName = Validator.checkAndConvertString(_documentName);

      const document = new Document(file);

      document.createHash();
      const documentHash = document.getHash;

      const storageHash = await document.save();
      const transaction = new Transaction(
        this.instance,
        this.address,
        'addDocument',
        [documentHash, documentName, storageHash]
      );

      transaction.encodeABI();
      await transaction.estimateGas();
      await transaction.estimateGasLimit();
      await transaction.getNonce();
      transaction
        .prepareRawTx()
        .sign(this.privateKey)
        .serialize();

      return await transaction.send();
    } catch (e) {
      throw Error(e);
    }
  }

  async verifyDocument(file) {
    try {
      const documentHash = new Document(file).createHash().getHash;

      const transaction = new Transaction(
        this.instance,
        this.address,
        'findDocument',
        [documentHash]
      );

      return await transaction.call();
    } catch (e) {
      throw Error(e);
    }
  }

  async downloadDocument(hash) {
    try {
      const doc = new Document();
      return await doc.get(hash);
    } catch (e) {
      throw Error(e);
    }
  }

  async returnDocuments() {
    const txDocQty = new Transaction(
      this.instance,
      this.address,
      'documentQty'
    );

    const documentQty = await txDocQty.call();

    let documents = [];
    for (let i = 0; i < documentQty; i += 1) {
      const txAllDoc = new Transaction(
        this.instance,
        this.address,
        'allDocuments',
        [i]
      );
      const document = await txAllDoc.call();

      const txDoc = new Transaction(
        this.instance,
        this.address,
        'findDocument',
        [document]
      );
      const documentDetails = await txDoc.call();

      documents.push(documentDetails);
    }
    return documents;
  }
}

module.exports = Process;
