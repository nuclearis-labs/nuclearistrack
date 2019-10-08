const {
  encryptBIP38,
  decryptBIP38,
  generatePrivateKey,
  generateWifPrivateKey,
  generatePublicKey,
  generateRSKAddress,
  toHex
} = require('../functions/wallet.js');

const toBeType = require('jest-tobetype');
expect.extend(toBeType);

let privKey;
let wifPrivKey;
let passphrase = 'Password';
let encryptedKey;
let decryptedKey;
let publicKey;
let rskAddress;

test('Should generate new private key', () => {
  privKey = generatePrivateKey();
  expect(privKey).toBeType('object'); // Checks for buffer existance
  expect(privKey.toString('hex')).toHaveLength(64);
});

test('Should generate a WIF Private Key', () => {
  wifPrivKey = generateWifPrivateKey(privKey);
  expect(wifPrivKey).toBeType('string');
  expect(wifPrivKey).toHaveLength(52);
});

test('Should encrypt a WIF Private Key', () => {
  encryptedKey = encryptBIP38(wifPrivKey, passphrase);
  expect(encryptedKey).toBeType('string');
  expect(encryptedKey).toHaveLength(58);
});

test('Should decrypt a BIP38 encoded key', () => {
  decryptedKey = decryptBIP38(encryptedKey, passphrase);
  expect(decryptedKey).toBeType('string');
  expect(decryptedKey).toHaveLength(52);
});

test('Should generate a public Key', () => {
  publicKey = generatePublicKey(privKey);
  expect(publicKey).toBeType('object');
  expect(publicKey.toString('hex')).toHaveLength(66);
});

test('Should generate a new RSK Address', () => {
  rskAddress = generateRSKAddress(publicKey);
  expect(rskAddress).toBeType('string');
  expect(rskAddress.toString('hex')).toHaveLength(42);
});

test('Should fail, because missing public Key', () => {
  expect(generateRSKAddress).toThrowError(
    'class Wallet => generateRSKAddress() is missing a public key'
  );
});

test('Should convert a property on the wallet instance to hex', () => {
  expect(toHex(generatePrivateKey())).toBeType('string');
});

test('Should throw error because privateKey was not set', () => {
  expect(generatePublicKey).toThrowError(
    'class Wallet => generatePublicKey() is missing a private key'
  );
});
