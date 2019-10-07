/* eslint-disable no-await-in-loop */
require('dotenv').config();
const Contract = require('./Contract');
const ethTx = require('ethereumjs-tx');

class Transaction {
  constructor(contract, method, arg = []) {
    const { instance, web3, address, privateKey } = contract;
    this.instance = instance;
    this.web3 = web3;
    this.address = address;
    this.privateKey = privateKey;

    this.method = method;
    this.arg = arg;

    this.data = this.instance.methods[this.method](...this.arg).encodeABI();
  }

  async call() {
    const result = await this.instance.methods[this.method]().call();
    return {
      result
    };
  }

  async estimateGas() {
    this.gasprice = await this.web3.eth.getGasPrice();
  }

  async estimateGasLimit() {
    this.gaslimit = await this.instance.methods[this.method](
      ...this.arg
    ).estimateGas({
      from: this.address
    });
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

  sign() {
    this.tx.sign(this.privateKey);
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
    return new Promise((resolve, reject) => {
      this.web3.eth.sendSignedTransaction(`0x${this.tx.toString('hex')}`);
      this.instance.events.allEvents({}, (error, event) => {
        if (error) reject(error);
        resolve(event);
      });
    });
  }
}

module.exports = Transaction;
