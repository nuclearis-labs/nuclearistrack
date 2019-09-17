//const HDWalletProvider = require('truffle-hdwallet-provider');

const testNode = 'https://public-node.testnet.rsk.co:443';
const publicNode = 'https://public-node.rsk.co';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    testnet: {
      provider: () => new HDWalletProvider(process.env.PRIVKEYTEST, testNode),
      network_id: '*',
      gas: 2500000,
      gasPrice: 183000
    },
    mainnet: {
      provider: () => new HDWalletProvider(process.env.PRIVKEYLIVE, publicNode),
      network_id: '30',
      gas: 6800000,
      gasPrice: 60240000
    },
    dev: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      gas: 5000000,
      gasPrice: 183000
    }
  }
};
