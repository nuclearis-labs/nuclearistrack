/* eslint-disable no-await-in-loop */
require('dotenv').config();
import web3 from '../config/web3';
import Transaction from './Transaction';
import { Contract as web3Contract } from 'web3-eth-contract';

const nuclearPoEABI = require('../../build/contracts/NuclearPoE.json').abi;

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
  abi: web3Contract['_jsonInterface'][0];
  privateKey?: Buffer;
  contractAddress?: string;
  instance?: web3Contract;

  constructor({
    privateKey = Buffer.from('', 'hex'),
    abi = nuclearPoEABI,
    contractAddress = process.env.SCADDRESS
  }: {
    privateKey?: Buffer;
    abi?: any;
    contractAddress?: string;
  } = {}) {
    this.abi = abi;
    this.privateKey = privateKey;
    this.contractAddress = contractAddress;
    this.instance = new web3.eth.Contract(abi, contractAddress);
  }

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
