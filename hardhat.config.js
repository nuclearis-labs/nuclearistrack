require('@nomiclabs/hardhat-truffle5');
require('@nomiclabs/hardhat-web3');
require('solidity-coverage')

task('balance', "Prints an account's balance")
  .addParam('account', "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, 'ether'), 'RBTC');
  });

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    ganache: {
      url: 'http://ganache:8545',
    }
  },
  solidity: {
    version: '0.6.11',
    settings: {
      optimizer: {
        enabled: false,
      },
    },
  },
  paths: {
    sources: './src/contracts',
    tests: './src/contracts/test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
