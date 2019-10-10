const Web3 = require('web3');

module.exports.web3 = new Web3.providers.WebsocketProvider(
  'ws://127.0.0.1:8545'
);
