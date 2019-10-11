const Contract = require('./Contract');
const Transaction = require('./Transaction');
const utils = require('../functions/utils');
const Validator = require('./Validator');
const projectABI = require('../build/contracts/Project.json').abi;

class Project extends Contract {
  constructor(address, privateKey, contractAddress) {
    super(projectABI, contractAddress);
    this.address = address;
    this.privateKey = privateKey;
    this.initiateContract();
  }

  async approve() {
    try {
      const transaction = new Transaction(
        this.instance,
        this.address,
        'approveProject'
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

  async getDetails() {
    const tx = new Transaction(this.instance, this.address, 'contractDetails');
    const result = await tx.call();
    return result;
  }

  async getAllProcessByProject() {
    const txProcessCount = new Transaction(
      this.instance,
      this.address,
      'supplierCount'
    );
    const processCount = await txProcessCount.call();

    this.processList = [];
    for (let i = 0; i < processCount; i += 1) {
      const txSupplierAddress = new Transaction(
        this.instance,
        this.address,
        'supplierAddresses',
        [i]
      );
      const supplierAddress = await txSupplierAddress.call();

      const txProcess = new Transaction(
        this.instance,
        this.address,
        'process',
        [supplierAddress]
      );
      const process = await txProcess.call();
      process.processName = utils.toAscii(process.processName);
      process.supplierName = utils.toAscii(process.supplierName);
      this.processList.push(process);
    }
    return this;
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
}

module.exports = Project;
