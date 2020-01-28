import Web3 from 'web3';

let node;
switch (process.env.NODE_ENV) {
  case 'development':
    node = 'http://127.0.0.1:8545';
    break;
  case 'testnet':
    node = 'https://public-node.testnet.rsk.co';
    break;
  case 'mainnet':
    node = 'https://public-node.rsk.co';
    break;
  default:
    node = 'http://ganachecli:8545';
    break;
}

export default new Web3(new Web3.providers.HttpProvider(node));
