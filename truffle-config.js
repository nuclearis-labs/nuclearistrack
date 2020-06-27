const testNode = 'https://public-node.testnet.rsk.co:443';
const publicNode = 'https://public-node.rsk.co';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    dev: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 6721975,
      gasPrice: 20000000000,
    },
    // testnet: {
    //   provider: () =>
    //     new HDWalletProvider(process.env.PRIVKEY_TESTNET, testNode),
    //   network_id: '*',
    //   gas: 6800000,
    //   gasPrice: 60240000
    // },
    // mainnet: {
    //   provider: () =>
    //     new HDWalletProvider(process.env.PRIVKEY_MAINNET, publicNode),
    //   network_id: '30',
    //   gas: 6800000,
    //   gasPrice: 60240000
    // }
  },
  compilers: {
    solc: {
      version: '0.6.0',
    },
  },
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/build/contracts',
  migrations_directory: './src/migrations',
};
