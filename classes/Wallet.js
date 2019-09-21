require('dotenv').config();
const ecc = require('tiny-secp256k1');
const crypto = require('crypto');
const ethereumjs = require('ethereumjs-util');
const wif = require('wif');
const bip38 = require('bip38');
const { networks } = require('bitcoinjs-lib');

class Wallet {
  constructor(isTestnet) {
    this.network = isTestnet ? networks.testnet.wif : networks.bitcoin.wif;
  }

  encryptBIP38(passphrase) {
    let decoded = wif.decode(this.wifPrivKey);
    this.decodedPrivKey = decoded.privateKey;

    this.encryptedKey = bip38.encrypt(
      this.privKey,
      decoded.compressed,
      passphrase
    );
    return this;
  }

  decryptBIP38(passphrase) {
    let key = bip38.decrypt(this.encryptedKey, passphrase, status => {});
    this.decryptedKey = wif.encode(
      this.network,
      key.privateKey,
      key.compressed
    );
    return this;
  }

  generatePrivateKey() {
    do {
      this.privKey = crypto.randomBytes(32);
    } while (!ecc.isPrivate(this.privKey));
    return this;
  }

  generateWifPrivateKey() {
    this.generatePrivateKey();
    this.wifPrivKey = wif.encode(this.network, this.privKey, true);
    return this;
  }

  generatePublicKey() {
    if (this.privKey == null) {
      throw new Error(
        'class Wallet => generatePublicKey() is missing a private key'
      );
    }

    if (ecc.isPrivate(this.privKey)) {
      this.publicKey = ecc.pointFromScalar(this.privKey, true);
    }
    return this;
  }

  generateRSKAddress() {
    if (this.publicKey == null) {
      throw new Error(
        'class Wallet => generateRSKAddress() is missing a public key'
      );
    }
    this.rskAddressFromPublicKey = ethereumjs.pubToAddress(
      this.publicKey,
      true
    );
    return this;
  }

  toHex(fields) {
    fields.forEach(element => {
      if (!this[element]) {
        throw new Error(`Variable ${element} is not set`);
      }
      this[element] = this[element].toString('hex');
    });
    return this;
  }
}

module.exports = Wallet;
