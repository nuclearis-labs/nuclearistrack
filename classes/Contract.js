/* eslint-disable no-await-in-loop */
require('dotenv').config();
const web3 = require('../services/web3');

class Contract {
  /**
   * Constructor
   * @param {string} abi The ABI to be used for this contract
   * @param {string} contractAddress Defaults to the main NuclearPoE contract, defined in the env variable
   */
  constructor(abi, contractAddress = process.env.SCADDRESS) {
    this.abi = abi;
    this.contractAddress = contractAddress;
    this.instance = new web3.eth.Contract(abi, contractAddress);
  }
}

module.exports = Contract;
