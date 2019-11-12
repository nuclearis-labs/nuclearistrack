import { Transaction as ethTx } from 'ethereumjs-tx';
import web3 from '../config/web3';
import { Contract } from 'web3-eth-contract';
import Common from 'ethereumjs-common';

class Transaction {
  public contract: Contract;
  public method: string;
  public data: string;
  public fromAddress: string;
  arg: Array<string>;
  tx: ethTx;
  serializedTx: Buffer;
  gaslimit: string;
  nonce: number;
  gasprice: string;

  constructor({
    fromAddress,
    contract,
    method,
    data
  }: {
    fromAddress?: string;
    contract?: Contract;
    method?: string;
    data?: Array<string>;
  }) {
    this.contract = contract;
    this.method = method;
    this.arg = data || [];
    this.fromAddress = fromAddress;
  }

  encodeABI(): Transaction {
    this.data = this.contract.methods[this.method](...this.arg).encodeABI();
    return this;
  }

  async call(): Promise<any> {
    try {
      return await this.contract.methods[this.method](...this.arg).call();
    } catch (e) {
      throw Error(e);
    }
  }

  async estimateGas(): Promise<Transaction> {
    this.gasprice = await web3.eth.getGasPrice();
    return this;
  }

  async estimateGasLimit(): Promise<Transaction> {
    this.gaslimit = await this.contract.methods[this.method](
      ...this.arg
    ).estimateGas({
      from: this.fromAddress
    });
    return this;
  }

  async getNonce(): Promise<Transaction> {
    this.nonce = await web3.eth.getTransactionCount(this.fromAddress);
    return this;
  }

  prepareRawTx({
    value = '0',
    to = this.contract.options.address,
    gaslimit = this.gaslimit
  }: { value?: string; to?: string; gaslimit?: string } = {}): Transaction {
    let weiValue = web3.utils.toWei(value, 'ether');

    const txParams = {
      nonce: web3.utils.toHex(this.nonce),
      gasPrice: web3.utils.toHex(this.gasprice),
      gasLimit: web3.utils.toHex(gaslimit),
      to: to,
      value: web3.utils.toHex(weiValue),
      data: this.data
    };

    this.tx = new ethTx(txParams);
    return this;
  }

  sign(privateKey: Buffer): Transaction {
    this.tx.sign(privateKey);
    return this;
  }

  serialize(): Transaction {
    this.serializedTx = this.tx.serialize();
    return this;
  }

  async send(): Promise<string> {
    return new Promise((resolve, reject) => {
      web3.eth.sendSignedTransaction(
        `0x${this.serializedTx.toString('hex')}`,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
}

export default Transaction;
