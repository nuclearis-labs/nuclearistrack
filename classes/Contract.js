/* eslint-disable no-await-in-loop */
require('dotenv').config();
const web3 = require('../services/web3');
const nuclearPoEABI = JSON.parse(
  fs.readFileSync('build/contracts/NuclearPoE.json')
).abi;

class Contract {
  /**
   * Constructor
   * @param {string} abi The ABI to be used for this contract
   * @param {string} contractAddress Defaults to the main NuclearPoE contract, defined in the env variable
   */
  constructor({
    privateKey,
    abi = nuclearPoEABI,
    contractAddress = process.env.SCADDRESS
  }) {
    this.abi = abi;
    this.privateKey = privateKey;
    this.contractAddress = contractAddress;
    this.instance = new web3.eth.Contract(abi, contractAddress);
  }

  /**
   * Creates a new Transaction Instance and invokes a call method on the contract.
   * @param  {String} method External View Contract Method to be called
   * @param  {String} arg Arguments to provide for call
   * @returns {Object} Result of contract method call
   */
  async getDataFromContract({ method, arg }) {
    const tx = new Transaction(this.instance, method, arg);
    return await tx.call();
  }

  async sendDataToContract({ fromAddress, method, data }) {
    try {
      const tx = new Transaction(this.instance, fromAddress, method, data);

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
