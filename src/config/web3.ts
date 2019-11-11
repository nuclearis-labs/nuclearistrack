import Web3 from 'web3';

export default new Web3(
  new Web3.providers.HttpProvider('http://127.0.0.1:8545')
);
