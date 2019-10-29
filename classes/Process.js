/* eslint-disable no-await-in-loop */
const fs = require('fs');
const web3 = require('../services/web3');
const Contract = require('./Contract');
const { web3ArrayToJSArray } = require('../functions/utils');
const Transaction = require('./Transaction');

const projectABI = JSON.parse(fs.readFileSync('build/contracts/Project.json'))
  .abi;

class Process extends Contract {
  constructor(address, privateKey, contractAddress) {
    super(projectABI, contractAddress);
    this.address = address;
    this.privateKey = privateKey;
  }

  async addDocument(documentInformation) {
    try {
      const transaction = new Transaction(
        this.instance,
        this.address,
        'addDocument',
        documentInformation
      );

      transaction.encodeABI();
      await transaction.estimateGas();
      await transaction.estimateGasLimit();
      await transaction.getNonce();
      transaction
        .prepareRawTx()
        .sign(this.privateKey)
        .serialize();

      const txHash = await transaction.send();

      return await txModel.create({
        hash: txHash,
        proyecto: this.instance.options.address,
        subject: 'add-document',
        data: [_documentHash]
      });
    } catch (e) {
      throw Error(e);
    }
  }

  async verifyDocument(_hash) {
    try {
      const transaction = new Transaction(
        this.instance,
        this.address,
        'findDocument',
        [_hash]
      );

      return await transaction.call();
    } catch (e) {
      throw Error(e);
    }
  }

  async downloadDocument(_hash) {
    try {
      const transaction = new Transaction(
        this.instance,
        this.address,
        'findDocument',
        [_hash]
      );
      const data = await transaction.call();

      return web3ArrayToJSArray(data);
    } catch (e) {
      throw Error(e);
    }
  }
  /**
   *
   * @param  {} _supplierAddress
   */
  async returnProcessDetailsByOwner(_supplierAddress) {
    const supplierAddress = web3.utils.toChecksumAddress(_supplierAddress);

    const txSuppliers = new Transaction(
      this.instance,
      this.address,
      'returnProcessByOwner',
      [supplierAddress]
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
