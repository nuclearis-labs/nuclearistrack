/* eslint-disable no-await-in-loop */
const fs = require('fs');

const Contract = require('./Contract');
const Document = require('./Document');
const { convertResult } = require('../functions/utils');
const Validator = require('./Validator');
const Transaction = require('./Transaction');

const projectABI = JSON.parse(fs.readFileSync('build/contracts/Project.json'))
  .abi;

class Process extends Contract {
  constructor(address, privateKey, contractAddress) {
    super(projectABI, contractAddress);
    this.address = address;
    this.privateKey = privateKey;
    this.initiateContract();
  }

  async addDocument(_documentName, file) {
    try {
      const documentName = Validator.checkAndConvertString(_documentName);

      const document = new Document(file);

      document.createHash();
      const documentHash = document.getHash;

      const storageHash = await document.save();
      console.log(storageHash);

      const transaction = new Transaction(
        this.instance,
        this.address,
        'addDocument',
        [documentHash, documentName, storageHash[0].hash]
      );

      transaction.encodeABI();
      await transaction.estimateGas();
      await transaction.estimateGasLimit();
      await transaction.getNonce();
      transaction
        .prepareRawTx()
        .sign(this.privateKey)
        .serialize();

      return await transaction.send('add-document');
    } catch (e) {
      throw Error(e);
    }
  }

  async verifyDocument(file) {
    try {
      this.documentHash = new Document(file).createHash().getHash;

      const transaction = new Transaction(
        this.instance,
        this.address,
        'findDocument',
        [this.documentHash]
      );

      return await transaction.call();
    } catch (e) {
      throw Error(e);
    }
  }

  async downloadDocument(hash) {
    try {
      const transaction = new Transaction(
        this.instance,
        this.address,
        'findDocument',
        [hash]
      );
      const data = await transaction.call();
      const doc = new Document();
      const buffer = await doc.get(data[2]);
      return { data: convertResult(data), buffer };
    } catch (e) {
      throw Error(e);
    }
  }

  async returnProcessDetailsByOwner(_supplierAddress) {
    const txSuppliers = new Transaction(
      this.instance,
      this.address,
      'returnProcessByOwner',
      [_supplierAddress]
    );

    return await txSuppliers.call();
  }
  async returnDocuments() {
    const txSuppliers = new Transaction(
      this.instance,
      this.address,
      'returnAllDocuments'
    );

    return await txSuppliers.call();
  }
}

module.exports = Process;
