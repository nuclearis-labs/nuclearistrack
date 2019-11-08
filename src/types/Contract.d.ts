/// <reference types="node" />

import Web3 from 'web3';

declare class Contract {
  constructor(
    privateKey: string,
    abi: object,
    contractAddress: string,
    instance: Web3['eth']['Contract']
  );

  abi: string;
  instance: Web3['eth']['Contract'];
}

export = Contract;
