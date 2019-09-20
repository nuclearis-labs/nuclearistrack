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
    this.encryptedKey = bip38.encrypt(this.privKey, this.publicKey, passphrase);
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
      console.error('Must specify a privateKey');
      return;
    }

    if (ecc.isPrivate(this.privKey)) {
      this.publicKey = ecc.pointFromScalar(this.privKey, true);
      return this;
    }
  }
  generateRSKAddress() {
    if (this.publicKey == null) {
      console.error('Must specify a publicKey');
      return;
    }
    this.rskAddressFromPublicKey = ethereumjs.pubToAddress(
      this.publicKey,
      true
    );
    return this;
  }
  toHex(fields) {
    fields.forEach(element => {
      this[element] = this[element].toString('hex');
    });
    return this;
  }
}

module.exports = Wallet;
