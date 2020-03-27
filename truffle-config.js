require('ts-node/register');
require('dotenv').config();

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
      gas: 6800000,
      gasPrice: 65164000
    }
  }
};
