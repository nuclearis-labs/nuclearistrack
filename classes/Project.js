const Contract = require('./Contract');
const Transaction = require('./Transaction');
const web3 = require('../services/web3');
const projectABI = require('../build/contracts/Project.json').abi;

class Project extends Contract {
  constructor(address, privateKey, contractAddress) {
    super(projectABI, contractAddress);
    this.address = address;
    this.privateKey = privateKey;
  }
  /**
   * Approves a Project by Client
   * @returns Result of Transaction
   */
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
  /**
   * Adds a new process to the main contract
   * @param  {} _supplierAddress
   * @param  {} _processTitle
   * @returns Result of Transaction
   */
  async addProcess(_supplierAddress, _processTitle) {
    try {
      const supplierAddress = web3.utils.toChecksumAddress(_supplierAddress);
      const processTitle = web3.utils.asciiToHex(_processTitle);

      const tx = new Transaction(this.instance, this.address, 'addProcess', [
        supplierAddress,
        processTitle
      ]);

      tx.encodeABI();
      await tx.estimateGasLimit();
      await tx.estimateGas();
      await tx.getNonce();
      tx.prepareRawTx()
        .sign(this.privateKey)
        .serialize();

      return await tx.send();
    } catch (e) {
      throw Error(e);
    }
  }

  async getDetails() {
    const tx = new Transaction(this.instance, this.address, 'contractDetails');
    return await tx.call();
  }

  /*   async getAllProcessByProject() {
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
  } */

  async return(method, arg) {
    const tx = new Transaction(this.instance, this.address, method, arg);
    return await tx.call();
  }
}

module.exports = Project;
