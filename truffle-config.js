//var HDWalletProvider = require('truffle-hdwallet-provider')

var mnemonic = '7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6'
var publicNode = 'https://public-node.testnet.rsk.co:443'

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

    networks: {
      aws: {
         host: "http://localhost:4444",
         port: 4444,
         network_id: "*",
         gas: 2500000,
         gasPrice: 183000
      },
      rsk: {
        provider: () =>
        new HDWalletProvider(mnemonic, publicNode),
        network_id: "*",
        gas: 2500000,
        gasPrice: 183000
     },
     dev: {
       host: "127.0.0.1",
       port: 8545,
       network_id: "*"
     }
    }
};
