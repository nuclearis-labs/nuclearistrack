const HDWalletProvider = require('@truffle/hdwallet-provider');
const testNode = 'https://public-node.testnet.rsk.co:443';
const publicNode = 'https://public-node.rsk.co';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    dev: {
      host: '0.0.0.0',
      port: 8545,
      network_id: '5777',
      gas: 6721975,
      gasPrice: 20000000000,
    },
    testnet: {
      provider: () =>
        new HDWalletProvider(
          '7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6',
          testNode
        ),
      network_id: '*',
      gas: 4000000,
      gasPrice: 65000000,
    },
    // mainnet: {
    //   provider: () =>
    //     new HDWalletProvider(process.env.PRIVKEY_MAINNET, publicNode),
    //   network_id: '30',
    //   gas: 6800000,
    //   gasPrice: 60240000
    // }
  },
  plugins: ['solidity-coverage'],
  compilers: {
    solc: {
      version: '0.6.11',
    },
  },
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/build/contracts',
  migrations_directory: './src/migrations',
  test_directory: './src/contracts/test',
};
