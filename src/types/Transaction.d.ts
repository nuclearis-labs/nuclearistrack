/// <reference types="node" />

import Web3 from 'web3';

declare class Transaction {
  constructor({ fromAddress }: { fromAddress: string });
}

export = Transaction;
