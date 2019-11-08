/* eslint-disable no-await-in-loop */
require('dotenv').config();
import web3 from '../config/web3';
import Transaction from './Transaction';

const nuclearPoEABI = require('../build/contracts/NuclearPoE.json');

interface getDataFromContractInput {
  method: string;
  data?: Array<string>;
}

interface sendDataToContract {
  fromAddress: string;
  method: string;
  data: Array<string>;
}

class Contract {
  abi: string;
  privateKey?: Buffer;
  contractAddress?: string;
  instance?: object;

  constructor({
    privateKey = undefined,
    abi = nuclearPoEABI,
    contractAddress = process.env.SCADDRESS
  } = {}) {
    this.abi = abi;
    this.privateKey = Buffer.from(privateKey, 'hex');
    this.contractAddress = contractAddress;
    this.instance = new web3.eth.Contract(abi, contractAddress);
  }

  /**
   * Creates a new Transaction Instance and invokes a call method on the contract.
   * @param  {String} method External View Contract Method to be called
   * @param  {String} arg Arguments to provide for call
   * @returns {Object} Result of contract method call
   */
  async getDataFromContract({ method, data }: getDataFromContractInput) {
    const tx = new Transaction({ contract: this.instance, method, data });
    return await tx.call();
  }

  async sendDataToContract({
    fromAddress,
    method,
    data
  }: sendDataToContract): Promise<string> {
    try {
      const tx = new Transaction({
        contract: this.instance,
        fromAddress,
        method,
        data
      });

      tx.encodeABI();
      await tx.estimateGas();
      await tx.estimateGasLimit();
      await tx.getNonce();
      tx.prepareRawTx()
        .sign(this.privateKey)
        .serialize();

      return await tx.send();
    } catch (e) {
      throw Error(e);
    }
  }
}

export default Contract;
