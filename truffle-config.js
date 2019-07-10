var HDWalletProvider = require("truffle-hdwallet-provider");

var privkeytest =
  "7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6";
var privkeylive =
  "6cf14c6aa87cdfd44211e1953633633a1c33f6b086faeffb2085f0416980bb97";

var testNode = "https://public-node.testnet.rsk.co:443";
var publicNode = "https://public-node.rsk.co";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    test: {
      provider: () => new HDWalletProvider(privkeytest, testNode),
      network_id: "*",
      gas: 2500000,
      gasPrice: 183000
    },
    live: {
      provider: () => new HDWalletProvider(privkeylive, publicNode),
      network_id: "30",
      gas: 6800000,
      gasPrice: 60240000
    },
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  }
};
