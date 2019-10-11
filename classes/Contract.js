/* eslint-disable no-await-in-loop */
require('dotenv').config();
const web3 = require('../services/web3');

class Contract {
  /**
   * Constructor.
   * @param {string} address A wallet address which will be used for transaction signing
   * @param {string} privateKey The private Key associated with the wallet address
   * @param {string} abi The abi of the child contract.
   */

  constructor(abi, contractAddress = process.env.SCADDRESS) {
    this.abi = abi;
    this.contractAddress = contractAddress;
  }

  /**
   * Initiate the contract using a web3.eth.Contract instance
   * @param {string} address Defaults to the main NuclearPoE contract, defined in the env variable
   * @returns {Contract Instance}
   */

  initiateContract(contractAddress = this.contractAddress, abi = this.abi) {
    this.instance = new web3.eth.Contract(abi, contractAddress);
  }
}

module.exports = Contract;
