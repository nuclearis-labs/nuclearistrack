// @ts-ignore
usePlugin('@nomiclabs/buidler-truffle5');

module.exports = {
  networks: {
    localhost: {
      url: 'http://localhost:8545',
    },
    testnet: {
      url: 'https://public-node.testnet.rsk.co',
      accounts: [
        '0x7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6',
      ],
    },
    mainnet: {
      url: 'https://public-node.rsk.co',
      accounts: [
        '0x6cf14c6aa87cdfd44211e1953633633a1c33f6b086faeffb2085f0416980bb97',
      ],
    },
  },
  solc: { version: '0.6.0' },
  paths: {
    sources: './src/contracts',
    artifacts: './src/artifacts',
    cache: './src/cache',
  },
};
