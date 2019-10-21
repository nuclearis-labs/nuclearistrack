const ethTx = require('ethereumjs-tx');
const web3 = require('../services/web3');

class Transaction {
  constructor(contract, fromAddress, method, arg = []) {
    this.contract = contract;
    this.method = method;
    this.arg = arg;
    this.fromAddress = fromAddress;
  }

  encodeABI() {
    this.data = this.contract.methods[this.method](...this.arg).encodeABI();
    return this;
  }

  async call() {
    try {
      return await this.contract.methods[this.method](...this.arg).call();
    } catch (e) {
      console.log('Error in Call(): ' + e.message);
    }
  }

  async estimateGas() {
    this.gasprice = await web3.eth.getGasPrice();
    return this;
  }

  async estimateGasLimit() {
    this.gaslimit = await this.contract.methods[this.method](
      ...this.arg
    ).estimateGas({
      from: this.fromAddress
    });
    return this;
  }

  async getNonce() {
    this.nonce = await web3.eth.getTransactionCount(this.fromAddress);
    return this;
  }

  /**
   * Prepares
   * @param {ethTx} tx Instance of ethTx Class
   * @param {Buffer} privateKey Private Key of user
   * @returns {ethTx} Signed Transaction Instance
   */
  prepareRawTx() {
    this.tx = new ethTx({
      nonce: web3.utils.toHex(this.nonce),
      gasPrice: web3.utils.toHex(this.gasprice),
      gasLimit: web3.utils.toHex(this.gaslimit),
      to: this.contract.options.address,
      value: '0x00',
      data: this.data,
      chainId: web3.utils.toHex(5777)
    });
    console.log(this.nonce);
    console.log(this.gasprice);
    console.log(this.gaslimit);
    console.log(this.contract.options.address);
    console.log(this.data);

    return this;
  }

  /**
   * Sign Transaction Instance
   * @param {ethTx} tx Instance of ethTx Class
   * @param {Buffer} privateKey Private Key of user
   * @returns {ethTx} Signed Transaction Instance
   */
  sign(privateKey) {
    // console.log(privateKey.toString('hex'));

    this.tx.sign(privateKey);
    return this;
  }

  /**
   * Serialize transaction data
   * @param {ethTx} tx Instance of ethTx Class
   * @returns {ethTx} Serialized Transaction Instance
   */
  serialize() {
    this.serializedTx = this.tx.serialize();
    return this;
  }

  /**
   * Send a serialized transaction
   * @returns {Promise<string>} Hash of transaction
   */
  async send(eventContractInstance = this.contract) {
    return new Promise((resolve, reject) => {
      web3.eth.sendSignedTransaction(
        `0x${this.serializedTx.toString('hex')}`,
        (err, result) => {
          console.log('Transaction Hash ' + result);
          if (err) reject(err);
          resolve(result);
          // Only works with a websocket connection.. Not available on RSK Public Nodes
          // eventContractInstance.events.allEvents({}, (err, event) => {
          //   if (err) reject(err);
          //   resolve(event);
          // });
        }
      );
    });
  }
}

module.exports = Transaction;
