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

  async addProject(_expediente, _projectTitle, _clientAddress) {
    try {
      const transaction = new Transaction(
        this.instance,
        this.address,
        'createProject',
        [_expediente, _projectTitle, _clientAddress]
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

  // ATENTION! Temporal method for testing..
  async createNewNuclearPoE() {
    try {
      const newContract = new web3.eth.Contract(nuclearPoEABI);

      const account = web3.eth.accounts.wallet.add(
        this.privateKey.toString('hex')
      );

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

      return await tx;
    } catch (e) {
      console.log(e);

      throw Error(e);
    }
  }

  async returnAll(count, array) {
    const tx = new Transaction(this.instance, this.address, count);
    const cantidad = await tx.call();

    const result = [];
    for (let i = 0; i < cantidad; i += 1) {
      let txContractAddress = new Transaction(
        this.instance,
        this.address,
        array,
        [i]
      );

      let contractAddress = await txContractAddress.call();
      result.push(contractAddress);
    }
    return result;
  }

  async addProcessToProject(
    _supplierAddress,
    _projectContractAddress,
    _processTitle
  ) {
    try {
      const supplierAddress = Validator.checkAndConvertAddress(
        _supplierAddress
      );
      const projectContractAddress = Validator.checkAndConvertAddress(
        _projectContractAddress
      );
      const processTitle = Validator.checkAndConvertString(_processTitle);

      const tx = new Transaction(
        this.instance,
        this.address,
        'addProcessToProject',
        [supplierAddress, projectContractAddress, processTitle]
      );

      const eventContractInstance = new web3.eth.Contract(
        projectABI,
        projectContractAddress
      );

      tx.encodeABI();
      await tx.estimateGasLimit();
      await tx.estimateGas();
      await tx.getNonce();
      tx.prepareRawTx()
        .sign(this.privateKey)
        .serialize();

      return await tx.send(eventContractInstance);
    } catch (e) {
      throw Error(e);
    }
  }

  async createUser(_address, _name, _type) {
    try {
      const address = Validator.checkAndConvertAddress(_address);
      const name = Validator.checkAndConvertString(_name);
      const type = Validator.checkAndConvertNumber(_type);

      const transaction = new Transaction(
        this.instance,
        this.address,
        'createUser',
        [address, name, type]
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
