const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "shaft chuckle video pelican jacket song average whip dilemma brave curtain fun";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

    networks: {
      development: {
         host: "localhost",
         port: 8545,
         network_id: "*"
      },
     rinkeby: {
       provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/1e2cf6384a7c463dbb35cd85a61b5861`),
       from: 0x5568171522363b5D4cd05dC27893C4B150173297,
       network_id: 4,       // Rinkeby's id
       confirmations: 2,    // # of confs to wait between deployments. (default: 0)
       timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
       skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
     },
    }
};
