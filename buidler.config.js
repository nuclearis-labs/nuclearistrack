usePlugin('@nomiclabs/buidler-truffle5');
usePlugin('@nomiclabs/buidler-web3');
usePlugin('solidity-coverage');

task('decrypt', 'Decrypt keystore file', async () => {
  const result = await web3.eth.accounts.decrypt(
    {
      address: 'b51aadba64a42a2fb6f91fc4f94f67f464eab26c',
      crypto: {
        cipher: 'aes-128-ctr',
        ciphertext:
          '5f62c8b32af72e106c9740f5b1c0624db7365f05d3cf36c1686c155c64c47183',
        cipherparams: { iv: 'd2ad5b8f29475819eaec580e465a2adc' },
        kdf: 'scrypt',
        kdfparams: {
          dklen: 32,
          n: 262144,
          p: 1,
          r: 8,
          salt:
            '83f8d3c57860101cf74d0d524dba0259a882c8519145fc309917fba2833d9af8',
        },
        mac: '29ffe2d635de1e5cb9b5e0b41fc2aeed4dae88509494c6a3d2cb40e6f7fd8bac',
      },
      id: '5578b43d-deae-4e40-bb95-48e478031eb7',
      version: 3,
    },
    ''
  );
  console.log(result);
});

task('accounts', 'Prints the list of accounts', async () => {
  console.log(await web3.eth.getAccounts());
});

module.exports = {
  defaultNetwork: 'buidlerevm',
  networks: {
    buidlerevm: {},
    bfa: {
      url: 'http://localhost:8545',
      accounts: [
        '0xb0f913e790312aea9d3edd635952bcd1cebe71fe5444b772152095f0529a371b',
      ],
    },
  },
  solc: {
    version: '0.5.2',
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
