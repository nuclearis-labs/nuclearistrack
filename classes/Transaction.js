const ethTx = require('ethereumjs-tx');
const web3 = require('../services/web3');

class Transaction {
  constructor(instance, fromAddress, method, arg = []) {
    this.instance = instance;
    this.method = method;
    this.arg = arg;
    this.fromAddress = fromAddress;
  }

  encodeABI = () => {
    this.data = this.instance.methods[this.method](...this.arg).encodeABI();
  };

  call = async () => {
    return await this.instance.methods[this.method]().call();
  };

  estimateGas = async () => {
    this.gasprice = await web3.eth.getGasPrice();
  };

  estimateGasLimit = async () => {
    this.gaslimit = await this.instance.methods[this.method](
      ...this.arg
    ).estimateGas({
      from: this.fromAddress
    });
  };

  getNonce = async () => {
    this.nonce = await web3.eth.getTransactionCount(this.fromAddress);
  };

  /**
   * Prepares
   * @param {ethTx} tx Instance of ethTx Class
   * @param {Buffer} privateKey Private Key of user
   * @returns {ethTx} Signed Transaction Instance
   */
  prepareRawTx = () => {
    this.tx = new ethTx({
      nonce: web3.utils.toHex(this.nonce),
      gasPrice: web3.utils.toHex(this.gasprice),
      gasLimit: web3.utils.toHex(this.gaslimit),
      to: this.instance.options.address,
      value: '0x00',
      data: this.data
    });
  };

  /**
   * Sign Transaction Instance
   * @param {ethTx} tx Instance of ethTx Class
   * @param {Buffer} privateKey Private Key of user
   * @returns {ethTx} Signed Transaction Instance
   */
  sign = privateKey => {
    return this.tx.sign(privateKey);
  };

  /**
   * Serialize transaction data
   * @param {ethTx} tx Instance of ethTx Class
   * @returns {ethTx} Serialized Transaction Instance
   */
  serialize = () => {
    return this.tx.serialize();
  };

  /**
   * Send a serialized transaction
   * @returns {Promise<string>} Hash of transaction
   */
  send = async () => {
    return new Promise((resolve, reject) => {
      web3.eth.sendSignedTransaction(`0x${this.tx.toString('hex')}`);
      this.instance.events.allEvents({}, (error, event) => {
        if (error) reject(error);
        resolve(event);
      });
    });
  };
}

module.exports = Transaction;
