require('dotenv').config({ path: './.env.local' });
usePlugin('@nomiclabs/buidler-truffle5');
usePlugin('@nomiclabs/buidler-web3');
usePlugin('solidity-coverage');

task('balance', "Prints an account's balance")
  .addParam('account', "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, 'ether'), 'RBTC');
  });

module.exports = {
  defaultNetwork: 'buidlerevm',
  networks: {
    buidlerevm: {},
    bfa: {
      url: 'http://localhost:8545',
      accounts: [process.env.BFA_PRIVATE_KEY],
    },
    rsk: {
      url: 'https://public-node.rsk.co:443',
      accounts: [process.env.RSK_PRIVATE_KEY],
    },
  },
  solc: {
    version: '0.6.11',
    optimizer: {
      enabled: false,
    },
  },
  paths: {
    sources: './src/contracts',
    tests: './src/contracts/test',
    cache: './cache',
    artifacts: './src/contracts/artifacts',
  },
};
