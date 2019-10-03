const fs = require('fs');
const Contract = require('./Contract');
const utils = require('../functions/utils');

const projectABI = JSON.parse(fs.readFileSync('build/contracts/Project.json'))
  .abi;

class Project extends Contract {
  constructor(wallet, privateKey) {
    super(wallet, privateKey, projectABI);
  }

  async approve() {
    try {
      this.data = this.instance.methods.approveProject().encodeABI();
      this.gaslimit = await this.instance.methods
        .approveProject()
        .estimateGas({ from: this.wallet });
      this.result = await this.sendTx(this.instance.options.address);

      return {
        contractAddress: this.instance.options.address,
        transactionHash: this.result.transactionHash,
        blockNumber: this.result.blockNumber
      };
    } catch (e) {
      throw Error(e);
    }
  }

  async addProcess(
    _supplierContractAddress,
    _supplierAddress,
    _processName,
    _supplierName
  ) {
    try {
      utils.isValidAddress(_supplierAddress);
      utils.isValidAddress(_supplierContractAddress);
      utils.isString(_processName);
      utils.isString(_supplierName);

      const supplierAddress = utils.toChecksumAddress(_supplierAddress);
      const supplierContractAddress = utils.toChecksumAddress(
        _supplierContractAddress
      );
      const processName = utils.toBytes32(_processName);
      const supplierName = utils.toBytes32(_supplierName);

      // Prepare data package and estimate gas cost
      this.data = this.instance.methods
        .addProcess(
          supplierContractAddress,
          supplierAddress,
          processName,
          supplierName
        )
        .encodeABI();
      this.gaslimit = await this.instance.methods
        .addProcess(
          supplierContractAddress,
          supplierAddress,
          processName,
          supplierName
        )
        .estimateGas({ from: this.wallet });
      this.result = await this.sendTx(this.instance.options.address);
      return {
        supplierAddress: _supplierAddress,
        supplierName: _supplierName,
        processName: _processName,
        contractAddress: this.instance.options.address,
        transactionHash: this.result.transactionHash,
        blockNumber: this.result.blockNumber
      };
    } catch (e) {
      throw Error(e);
    }
  }

  async getAllProcessByProject() {
    const processCount = await this.instance.methods.supplierCount().call();
    this.processList = [];
    for (let i = 0; i < processCount; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const supplierAddress = await this.instance.methods
        .supplierAddresses(i)
        .call();
      // eslint-disable-next-line no-await-in-loop
      const process = await this.instance.methods
        .process(supplierAddress)
        .call();
      process.processName = utils.toAscii(process.processName);
      process.supplierName = utils.toAscii(process.supplierName);
      this.processList.push(process);
    }
    return this;
  }
}

module.exports = Project;
