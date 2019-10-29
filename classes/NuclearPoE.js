/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const web3 = require('../services/web3');
const Contract = require('./Contract');
const Transaction = require('./Transaction');
const Validator = require('./Validator');
const NuclearPoEBin = require('../build/contracts/NuclearPoE.json').bytecode;
const nuclearPoEABI = require('../build/contracts/NuclearPoE.json').abi;
const projectABI = require('../build/contracts/Project.json').abi;

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

      return await transaction.send('add-project', [expediente, projectTitle]);
    } catch (e) {
      throw Error(e);
    }
  }

  async return(method, arg) {
    const tx = new Transaction(this.instance, this.address, method, arg);
    return await tx.call();
  }

  async createUser(_address, _userType, _name) {
    try {
      const address = Validator.checkAndConvertAddress(_address);
      const name = Validator.checkAndConvertString(_name);
      const userType = Validator.checkAndConvertNumber(_userType);

      const transaction = new Transaction(
        this.instance,
        this.address,
        'createUser',
        [address, userType, name]
      );

      transaction.encodeABI();
      await transaction.estimateGas();
      await transaction.estimateGasLimit();
      await transaction.getNonce();
      transaction
        .prepareRawTx()
        .sign(this.privateKey)
        .serialize();

      return await transaction.send('create-user', [_name, address]);
    } catch (e) {
      console.log(e);
      throw Error(e);
    }
  }
}

module.exports = NuclearPoE;
