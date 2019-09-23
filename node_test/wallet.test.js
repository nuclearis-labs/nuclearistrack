const Wallet = require('../classes/Wallet.js');

const wallet = new Wallet(true);

describe('Keypair Generation', () => {
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
});
