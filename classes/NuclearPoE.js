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
  constructor(address, privateKey) {
    super(nuclearPoEABI);
    this.address = address;
    this.privateKey = privateKey;
    this.initiateContract();
  }

  async addProject(_expediente, _oc, _projectTitle, _clientAddress) {
    try {
      const transaction = new Transaction(
        this.instance,
        this.address,
        'createProject',
        [_expediente, _projectTitle, _clientAddress, _oc]
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

  // ATTENTION! Temporal method for testing..
  // async createNewNuclearPoE() {
  //   try {
  //     const newContract = new web3.eth.Contract(nuclearPoEABI);

  //     const account = web3.eth.accounts.wallet.add(
  //       this.privateKey.toString('hex')
  //     );

  //     const tx = new Promise((resolve, reject) => {
  //       newContract
  //         .deploy({ data: NuclearPoEBin.toString() })
  //         .send({
  //           from: account.address,
  //           gas: 9000000,
  //           gasPrice: 0
  //         })
  //         .on('error', error => reject(error))
  //         .then(newContractInstance => {
  //           resolve(newContractInstance.options.address);
  //         });
  //     });

  //     return await tx;
  //   } catch (e) {
  //     console.log(e);

  //     throw Error(e);
  //   }
  // }

  async return(method, arg) {
    const tx = new Transaction(this.instance, this.address, method, arg);
    return await tx.call();
  }

  async createUser(_address, _name) {
    try {
      const address = Validator.checkAndConvertAddress(_address);
      const name = Validator.checkAndConvertString(_name);

      const transaction = new Transaction(
        this.instance,
        this.address,
        'createUser',
        [address, name]
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
