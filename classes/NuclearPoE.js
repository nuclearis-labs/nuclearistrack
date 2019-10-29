/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const Contract = require('./Contract');
const Transaction = require('./Transaction');
const NuclearPoEBin = require('../build/contracts/NuclearPoE.json').bytecode;
const nuclearPoEABI = require('../build/contracts/NuclearPoE.json').abi;
const txModel = require('../models/transaction');

class NuclearPoE extends Contract {
  /**
   * Constructor
   * @param {string} address The user address to be used for creation and other methods
   * @param {string} privateKey THe user private key to be used for transaction signing.
   */
  constructor(address, privateKey) {
    super(nuclearPoEABI);
    this.address = address;
    this.privateKey = privateKey;
  }

  /**
   * Prepares a new project creation tx and sends it.
   * @param {string} expediente The user address to be used for creation and other methods
   * @param {string} oc The user address to be used for creation and other methods
   * @param {string} projectTitle The user address to be used for creation and other methods
   * @param {string} clientAddress The user address to be used for creation and other methods
   * @returns {array} privateKey THe user private key to be used for transaction signing.
   */
  async addProject({ expediente, oc, projectTitle, clientAddress }) {
    try {
      const transaction = new Transaction(
        this.instance,
        this.address,
        'createProject',
        [expediente, projectTitle, clientAddress, oc]
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

  /**
   * Creates a new Transaction Instance and invokes a call method on the contract.
   * @param  {String} method External View Contract Method to be called
   * @param  {String} arg Arguments to provide for call
   * @returns {Object} Result of contract method call
   */
  async return(method, arg) {
    const tx = new Transaction(this.instance, this.address, method, arg);
    return await tx.call();
  }

  /**
   * Creates a new user on the contract
   * @param  {} _address
   * @param  {} _userType
   * @param  {} _name
   */
  async createUser(_address, _userType, _name) {
    try {
      const transaction = new Transaction(
        this.instance,
        this.address,
        'createUser',
        [_address, _userType, _name]
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
      console.log(e);
      throw Error(e);
    }
  }
}

module.exports = NuclearPoE;
