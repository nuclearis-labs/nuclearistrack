const ethTx = require('ethereumjs-tx');
const web3 = require('../services/web3');

module.exports.encodeABI = async (instance, method, arg) => {
  return instance.methods[method](...arg).encodeABI();
};

module.exports.call = async (instance, method) => {
  return await instance.methods[method]().call();
};

module.exports.estimateGas = async () => {
  return await web3.eth.getGasPrice();
};

module.exports.estimateGasLimit = async (
  instance,
  method,
  arg,
  fromAddress
) => {
  return await instance.methods[method](...arg).estimateGas({
    from: fromAddress
  });
};

module.exports.getNonce = async address => {
  return await web3.eth.getTransactionCount(address);
};

/**
 * Prepares
 * @param {ethTx} tx Instance of ethTx Class
 * @param {Buffer} privateKey Private Key of user
 * @returns {ethTx} Signed Transaction Instance
 */
module.exports.prepareRawTx = async (
  contractAddress,
  data,
  { nonce, gasprice, gaslimit }
) => {
  return new ethTx({
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(gasprice),
    gasLimit: web3.utils.toHex(gaslimit),
    to: contractAddress,
    value: '0x00',
    data: data
  });
};

/**
 * Sign Transaction Instance
 * @param {ethTx} tx Instance of ethTx Class
 * @param {Buffer} privateKey Private Key of user
 * @returns {ethTx} Signed Transaction Instance
 */
module.exports.sign = async (tx, privateKey) => {
  return tx.sign(privateKey);
};

/**
 * Serialize transaction data
 * @param {ethTx} tx Instance of ethTx Class
 * @returns {ethTx} Serialized Transaction Instance
 */
module.exports.serialize = async tx => {
  return tx.serialize();
};

/**
 * Send a serialized transaction
 * @returns {string} Hash of transaction
 */
module.exports.send = async () => {
  return new Promise((resolve, reject) => {
    this.web3.eth.sendSignedTransaction(`0x${this.tx.toString('hex')}`);
    this.instance.events.allEvents({}, (error, event) => {
      if (error) reject(error);
      resolve(event);
    });
  });
};
