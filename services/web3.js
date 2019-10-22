const Web3 = require('web3');

const web3 = new Web3(
  new Web3.providers.HttpProvider('https://public-node.testnet.rsk.co')
);

module.exports = web3;
