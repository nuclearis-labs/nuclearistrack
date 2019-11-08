require('ts-node/register');

const testNode = 'https://public-node.testnet.rsk.co:443';
const publicNode = 'https://public-node.rsk.co';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    testnet: {
      provider: () =>
        new HDWalletProvider(
          '0x7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6',
          testNode
        ),
      network_id: '*',
      gas: 4000000,
      gasPrice: 59240000
    },
    mainnet: {
      provider: () => new HDWalletProvider(process.env.PRIVKEYLIVE, publicNode),
      network_id: '30',
      gas: 6800000,
      gasPrice: 60240000
    },
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      gas: 6800000,
      gasPrice: 65164000
    }
  }
};
