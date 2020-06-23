/* eslint-disable no-await-in-loop */
require('dotenv').config();
import web3 from '../config/web3';
import Transaction from './Transaction';
import { Contract as web3Contract } from 'web3-eth-contract';

const nuclearPoEABI = require('../../build/contracts/NuclearPoE.json').abi;

/**
 * @param abi ABI Interface of contract
 * @param privateKey Privatekey to use in contract
 * @param contractAddress Address of deployed contract
 */
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

  async getDataFromContract({
    method,
    data
  }: {
    method: string;
    data?: string[];
  }) {
    const tx = new Transaction({
      contract: this.instance,
      method,
      data
    });
    return await tx.call();
  }

  async sendDataToContract({
    fromAddress,
    method,
    data
  }: {
    fromAddress: string;
    method: string;
    data: string[];
  }): Promise<string> {
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

      const balance = await web3.eth.getBalance(fromAddress);

      if (tx.gaslimit > parseInt(balance)) {
        throw Error(
          `Not enough funds, transfer at least ${web3.utils.fromWei(
            tx.gaslimit.toString()
          )} to ${fromAddress}`
        );
      }
      return await tx.send();
    } catch (e) {
      throw e;
    }
  }
}

export default Contract;
