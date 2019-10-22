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
  prepareRawTx(
    value = '0',
    to = this.contract.options.address,
    gaslimit = this.gaslimit
  ) {
    let weiValue = web3.utils.toWei(value, 'ether');

    this.tx = new ethTx({
      nonce: web3.utils.toHex(this.nonce),
      gasPrice: web3.utils.toHex(this.gasprice),
      gasLimit: web3.utils.toHex(gaslimit),
      to: to,
      value: web3.utils.toHex(weiValue),
      data: this.data
      // chainId: web3.utils.numberToHex(5777)
    });
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
          if (err) reject(err);
          console.log('Transaction Hash ' + result);
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
