/* eslint-disable no-await-in-loop */
require('dotenv').config();
const Web3C = require('web3');
const Transaction = require('ethereumjs-tx');

const web3 = new Web3C(
  new Web3C.providers.WebsocketProvider('ws://127.0.0.1:8545')
);

class Contract {
  constructor(wallet, privateKey, abi) {
    if (wallet && privateKey) {
      const privateBuffer = Buffer.from(privateKey, 'hex');
      this.wallet = wallet;
      this.private = privateBuffer;
      this.abi = abi;
    }
  }

  initiateContract(address = process.env.SCADDRESS) {
    return new web3.eth.Contract(this.abi, address);
  }

  /**
   * Emite la transacción y espera respuesta
   * @name sendTx
   * @function
   * @memberof Blockchain
   */
  // eslint-disable-next-line consistent-return
  async sendTx(contractAddress = process.env.SCADDRESS) {
    let rawTx;
    let serializedTx;
    try {
      const gasprice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(this.wallet);

      rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasprice),
        gasLimit: web3.utils.toHex(this.gaslimit),
        to: contractAddress,
        value: '0x00',
        data: this.data
      };

      const tx = new Transaction(rawTx);
      tx.sign(this.private);
      serializedTx = tx.serialize();

      const transaction = new Promise((resolve, reject) => {
        web3.eth
          .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
          .on('transactionHash', hash => resolve(hash))
          .on('error', error => reject(error));
      });

      const result = await transaction;
      return result;
    } catch (e) {
      throw Error(e);
    }
  }

  async getDetails() {
    const result = await this.instance.methods.contractDetails().call();
    return {
      result
    };
  }
}

module.exports = Contract;
