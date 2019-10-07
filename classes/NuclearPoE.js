/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const web3 = require('web3');
const Contract = require('./Contract');
const Project = require('./Project');
const Transaction = require('./Transaction');
const Validator = require('./Validator');
const utils = require('../functions/utils');
const NuclearPoEBin = require('../build/contracts/NuclearPoE.json').bytecode;
const nuclearPoEABI = require('../build/contracts/NuclearPoE.json').abi;

class NuclearPoE extends Contract {
  constructor(address, privateKey) {
    super(nuclearPoEABI);
    this.address = address;
    this.privateKey = Buffer.from(privateKey, 'hex');
    this.instance = this.initiateContract();
  }

  async addProject(_expediente, _projectTitle, _clientAddress) {
    try {
      const transaction = new Transaction(this, 'createProject', [
        _expediente,
        _projectTitle,
        _clientAddress
      ]);

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

  // ATENTION! Temporal method for testing..
  async createNewNuclearPoE(privKey) {
    try {
      const newContract = new this.web3.eth.Contract(nuclearPoEABI);

      const account = this.web3.eth.accounts.wallet.add(privKey);

      const tx = new Promise((resolve, reject) => {
        newContract
          .deploy({ data: NuclearPoEBin.toString() })
          .send({
            from: account.address,
            gas: 9000000,
            gasPrice: 0
          })
          .on('error', error => reject(error))
          .then(newContractInstance => {
            resolve(newContractInstance.options.address);
          });
      });

      const txResolved = await tx;
      return txResolved;
    } catch (e) {
      console.log(e);

      throw Error(e);
    }
  }

  async returnAllProjects() {
    const cantidadProjectos = await this.instance.methods.projectCount().call();
    const result = [];
    for (let i = 0; i < cantidadProjectos; i += 1) {
      const contractAddress = await this.instance.methods
        .projectContractsArray(i)
        .call();
      result.push(contractAddress);
      // const project = new Project(contractAddress);
      // const details = utils.convertResult(await project.getDetails());
      // result.push({
      //   expediente: details[0],
      //   contractAddress: details[1],
      //   clientAddress: details[2],
      //   projectTitle: details[3],
      //   approved: details[4],
      //   allDocuments: details[5],
      //   allSuppliers: details[6]
      // });
    }
    return result;
  }

  async createUser(_address, _name, _type) {
    try {
      const transaction = new Transaction(this, 'createUser', [
        Validator.checkAndConvertAddress(_address),
        Validator.checkAndConvertString(_name),
        Validator.checkAndConvertNumber(_type)
      ]);

      await transaction.estimateGas();
      await transaction.estimateGasLimit();
      await transaction.getNonce();
      transaction
        .prepareRawTx()
        .sign()
        .serialize();

      transaction.txHash = await transaction.send();

      return transaction;
    } catch (e) {
      throw Error(e);
    }
  }
}

module.exports = NuclearPoE;
