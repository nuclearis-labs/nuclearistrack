/* eslint-disable no-await-in-loop */
require('dotenv').config();
const web3 = require('../services/web3');
const fs = require('fs');
const nuclearPoEABI = JSON.parse(
  fs.readFileSync('build/contracts/NuclearPoE.json')
).abi;
const Transaction = require('../classes/Transaction');

class Contract {
  /**
   * Constructor
   * @param {string} abi The ABI to be used for this contract
   * @param {string} contractAddress Defaults to the main NuclearPoE contract, defined in the env variable
   */
  constructor({
    privateKey = undefined,
    abi = nuclearPoEABI,
    contractAddress = process.env.SCADDRESS
  } = {}) {
    this.abi = abi;
    this.privateKey = privateKey ? Buffer.from(privateKey, 'hex') : undefined;
    this.contractAddress = contractAddress;
    this.instance = new web3.eth.Contract(abi, contractAddress);
  }

  /**
   * Creates a new Transaction Instance and invokes a call method on the contract.
   * @param  {String} method External View Contract Method to be called
   * @param  {String} arg Arguments to provide for call
   * @returns {Object} Result of contract method call
   */
  async getDataFromContract({ method, data }) {
    const tx = new Transaction({ contract: this.instance, method, data });
    return await tx.call();
  }

  async sendDataToContract({ fromAddress, method, data }) {
    try {
      const tx = new Transaction({
        contract: this.instance,
        fromAddress,
        method,
        data
      });

      console.log(tx);

      tx.encodeABI();
      await tx.estimateGas();
      await tx.estimateGasLimit();
      await tx.getNonce();
      tx.prepareRawTx()
        .sign(this.privateKey)
        .serialize();

      return await tx.send();
    } catch (e) {
      throw Error(e);
    }
  }
}

module.exports = Contract;
