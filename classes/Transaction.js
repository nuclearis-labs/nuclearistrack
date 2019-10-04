/* eslint-disable no-await-in-loop */
require('dotenv').config();
const web3 = require('web3');
const Contract = require('./Contract');
const ethTx = require('ethereumjs-tx');

class Transaction extends Contract {
  constructor(address, contractInstance, method, arg = []) {
    super();
    this.address = address;
    this.instance = contractInstance;
    this.method = method;
    this.arg = arg;
    this.data = this.instance.methods[this.method](...this.arg).encodeABI();
  }

  async estimateGas() {
    this.gasprice = await this.web3.eth.getGasPrice();
    return this;
  }

  async estimateGasLimit() {
    this.gaslimit = await this.instance.methods[this.method](
      ...this.arg
    ).estimateGas({
      from: this.address
    });
    return this;
  }

  async getNonce() {
    this.nonce = await this.web3.eth.getTransactionCount(this.address);
    return this;
  }

  prepareRawTx() {
    this.tx = new ethTx({
      nonce: this.web3.utils.toHex(this.nonce),
      gasPrice: this.web3.utils.toHex(this.gasprice),
      gasLimit: this.web3.utils.toHex(this.gaslimit),
      to: this.instance.options.address,
      value: '0x00',
      data: this.data
    });
    return this;
  }

  sign(privateKey) {
    this.tx.sign(privateKey);
    return this;
  }

  serialize() {
    this.tx = this.tx.serialize();
    return this;
  }

  /**
   * Initiate the contract using a web3.eth.Contract instance
   * @param {string} address Defaults to the main NuclearPoE contract, defined in the env variable
   * @returns {Contract Instance}
   */

  // eslint-disable-next-line consistent-return
  async send() {
    await new Promise((resolve, reject) => {
      this.web3.eth
        .sendSignedTransaction(`0x${this.tx.toString('hex')}`)
        .on('transactionHash', hash => resolve(hash))
        .on('error', error => reject(error));
    });
  }
}

module.exports = Transaction;
