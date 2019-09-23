const Wallet = require('../classes/Wallet.js');

let wallet;
beforeEach(() => {
  wallet = new Wallet(true);
  return wallet;
});
afterEach(() => {
  wallet = undefined;
  return wallet;
});

test('Should generate new private key and RSK address', () => {
  expect(
    wallet
      .generateWifPrivateKey()
      .generatePublicKey()
      .generateRSKAddress()
  ).toBeTruthy();
});
test('Should encrypt a WIF Private Key', () => {
  expect(
    wallet.generateWifPrivateKey().encryptBIP38('passphrase')
  ).toBeTruthy();
});
test('Should decrypt a BIP38 encoded key', () => {
  expect(
    wallet
      .generateWifPrivateKey()
      .encryptBIP38('passphrase')
      .decryptBIP38('passphrase')
  ).toBeTruthy();
});
test('Should generate a new RSK Address', () => {
  expect(
    wallet
      .generateWifPrivateKey()
      .generatePublicKey()
      .generateRSKAddress()
  ).toBeTruthy();
});
test('Should fail, because missing public Key', () => {
  function RSKAddress() {
    wallet.generateRSKAddress();
  }
  expect(RSKAddress).toThrowError(
    'class Wallet => generateRSKAddress() is missing a public key'
  );
});

test('Should convert a property on the wallet instance to hex', () => {
  expect(wallet.generatePrivateKey().toHex(['privKey'])).toBeTruthy();
});

test('Should throw error because variable was not set', () => {
  function hexError() {
    wallet.toHex(['privKey']);
  }
  expect(hexError).toThrowError('Variable privKey is not set');
});
test('Should throw error because variable was not set', () => {
  function hexError() {
    wallet.toHex('privKey');
  }
  expect(hexError).toThrowError('Type of input must be array');
});
test('Should throw error because privateKey was not set', () => {
  function PublicKeyError() {
    wallet.generatePublicKey();
  }
  expect(PublicKeyError).toThrowError(
    'class Wallet => generatePublicKey() is missing a private key'
  );
});
