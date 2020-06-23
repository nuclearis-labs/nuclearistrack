import * as wallet from '../src/config/wallet';

let mnemonic;
let privateKey;
let passphrase = 'Password';
let encryptedKey;
let decryptedKey;
let rskAddress;

describe('Wallet Generation Functions', () => {
  it('Should generate a Mnemonic Pasphrase', () => {
    mnemonic = wallet.newMnemonic();
    expect(typeof mnemonic).toBe('string');
  });

  it('Should generate a Private Key from the Mnemonic Passphrase', async () => {
    privateKey = await wallet.generatePrivateKeyFromMnemonic(mnemonic);
    expect(privateKey).toBeInstanceOf(Buffer);
  });

  it('Should generate a new RSK Address', () => {
    rskAddress = wallet.generateRSKAddress(privateKey);
    expect(typeof rskAddress).toBe('string');
    expect(rskAddress.toString('hex')).toHaveLength(42);
  });
});

describe('Wallet Encryption', () => {
  it('Should encrypt a WIF Private Key', () => {
    encryptedKey = wallet.encryptBIP38(privateKey, passphrase);
    expect(typeof encryptedKey).toBe('string');
    expect(encryptedKey).toHaveLength(58);
  });

  it('Should decrypt a BIP38 encoded key', async () => {
    decryptedKey = await wallet.decryptBIP38(encryptedKey, passphrase);
    let decryptedKeyString = decryptedKey.toString('hex');
    expect(typeof decryptedKeyString).toBe('string');
    expect(decryptedKeyString).toHaveLength(64);
  });
});
