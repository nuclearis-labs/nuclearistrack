const wallet = require('../dist/config/wallet.js');

const toBeType = require('jest-tobetype');
expect.extend(toBeType);

let mnemonic;
let privateKey;
let passphrase = 'Password';
let encryptedKey;
let decryptedKey;
let rskAddress;

describe('Wallet Generation Functions', () => {
  test('Should generate a Mnemonic Pasphrase', () => {
    mnemonic = wallet.generateMnemonic();
    expect(mnemonic).toBeType('string');
  });

  test('Should generate a Private Key from the Mnemonic Passphrase', async () => {
    privateKey = await wallet.generatePrivateKeyFromMnemonic(mnemonic);
    expect(privateKey).toBeType('object');
  });

  test('Should generate a new RSK Address', () => {
    rskAddress = wallet.generateRSKAddress(privateKey);
    expect(rskAddress).toBeType('string');
    expect(rskAddress.toString('hex')).toHaveLength(42);
  });
});

describe('Wallet Encryption', () => {
  test('Should encrypt a WIF Private Key', () => {
    encryptedKey = wallet.encryptBIP38(privateKey, passphrase);
    expect(encryptedKey).toBeType('string');
    expect(encryptedKey).toHaveLength(58);
  });

  test('Should decrypt a BIP38 encoded key', async () => {
    decryptedKey = await wallet.decryptBIP38(encryptedKey, passphrase);
    let decryptedKeyString = decryptedKey.toString('hex');
    expect(decryptedKeyString).toBeType('string');
    expect(decryptedKeyString).toHaveLength(64);
  });
});
