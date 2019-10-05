/* eslint-disable no-await-in-loop */
require('dotenv').config();
const Web3 = require('web3');

class Contract {
  /**
   * Constructor.
   * @param {string} address A wallet address which will be used for transaction signing
   * @param {string} privateKey The private Key associated with the wallet address
   * @param {string} abi The abi of the child contract.
   */

  constructor(abi, contractAddress = process.env.SCADDRESS) {
    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider(
        process.env.BLOCKCHAIN || 'ws://127.0.0.1:8545'
      )
    );
    this.abi = abi;
    this.contractAddress = contractAddress;
  }

  /**
   * Initiate the contract using a web3.eth.Contract instance
   * @param {string} address Defaults to the main NuclearPoE contract, defined in the env variable
   * @returns {Contract Instance}
   */

  initiateContract() {
    return new this.web3.eth.Contract(this.abi, this.contractAddress);
  }
}

module.exports = Contract;
