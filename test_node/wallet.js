const wallet = require('../dist/config/wallet.js');
const expect = require('chai').expect;

let mnemonic;
let privateKey;
let passphrase = 'Password';
let encryptedKey;
let decryptedKey;
let rskAddress;

describe('Wallet Generation Functions', () => {
  it('Should generate a Mnemonic Pasphrase', () => {
    mnemonic = wallet.newMnemonic();
    expect(mnemonic).to.be.a('string');
  });

  it('Should generate a Private Key from the Mnemonic Passphrase', async () => {
    privateKey = await wallet.generatePrivateKeyFromMnemonic(mnemonic);
    const buf = Buffer.alloc(0);
    expect(privateKey).to.be.instanceof(Buffer);
  });

  it('Should generate a new RSK Address', () => {
    rskAddress = wallet.generateRSKAddress(privateKey);
    expect(rskAddress).to.be.a('string');
    expect(rskAddress.toString('hex')).to.have.lengthOf(42);
  });
});

describe('Wallet Encryption', () => {
  it('Should encrypt a WIF Private Key', () => {
    encryptedKey = wallet.encryptBIP38(privateKey, passphrase);
    expect(encryptedKey).to.be.a('string');
    expect(encryptedKey).to.have.lengthOf(58);
  });

  it('Should decrypt a BIP38 encoded key', async () => {
    decryptedKey = await wallet.decryptBIP38(encryptedKey, passphrase);
    let decryptedKeyString = decryptedKey.toString('hex');
    expect(decryptedKeyString).to.be.a('string');
    expect(decryptedKeyString).to.have.lengthOf(64);
  });
});
