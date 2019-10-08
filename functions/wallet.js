require('dotenv').config();
const ecc = require('tiny-secp256k1');
const crypto = require('crypto');
const ethereumjs = require('ethereumjs-util');
const utils = require('./utils');
const wif = require('wif');
const bip38 = require('bip38');
const { networks } = require('bitcoinjs-lib');

/**
 * Encrypts a WIF Format PrivateKey using the BIP-38 Implementation
 * @param {string} wifPrivKey Private Key in WIF format
 * @param {string} passphrase Passphrase to encrypt Key
 * @returns {string} Encrypted BIP-38 Key
 */
module.exports.encryptBIP38 = (wifPrivKey, passphrase) => {
  const decoded = wif.decode(wifPrivKey);
  return bip38.encrypt(decoded.privateKey, decoded.compressed, passphrase);
};

/**
 * Decrypts a PrivateKey into WIF format
 * @param {string} encryptedKey Private Key in WIF format
 * @param {string} passphrase Passphrase to encrypt Key
 * @param {number} network Network ID
 * @returns {string} Decrypted Private Key in WIF format
 */
module.exports.decryptBIP38 = (
  encryptedKey,
  passphrase,
  network = networks.testnet.wif
) => {
  const key = bip38.decrypt(encryptedKey, passphrase);
  return wif.encode(network, key.privateKey, key.compressed);
};

/**
 * Generates a new private key from crypto.randomBytes()
 * @returns {Buffer} Private Key as Buffer
 */
module.exports.generatePrivateKey = () => {
  let privKey;
  do {
    privKey = crypto.randomBytes(32);
  } while (!ecc.isPrivate(privKey));
  return privKey;
};

/**
 * Encrypts a WIF Format PrivateKey using the BIP-38 Implementation
 * @param {Buffer} privKey Private Key
 * @param {number} network Network ID
 * @returns {string} Private Key in WIF format
 */
module.exports.generateWifPrivateKey = (
  privKey,
  network = networks.testnet.wif
) => {
  return wif.encode(network, privKey, true);
};

/**
 * Generates a new public key
 * @param {Buffer} privKey Private Key
 * @returns {Buffer} Public Key
 */
module.exports.generatePublicKey = privKey => {
  if (privKey == null) {
    throw new Error(
      'class Wallet => generatePublicKey() is missing a private key'
    );
  }

  if (ecc.isPrivate(privKey)) {
    return ecc.pointFromScalar(privKey, true);
  }
};

/**
 * Generates a new Wallet Address
 * @param {Buffer} publicKey Public Key
 * @returns {string} Wallet Address
 */
module.exports.generateRSKAddress = publicKey => {
  if (publicKey == null) {
    throw new Error(
      'class Wallet => generateRSKAddress() is missing a public key'
    );
  }
  return utils.toChecksumAddress(
    ethereumjs.pubToAddress(publicKey, true).toString('hex')
  );
};

/**
 * Convert Buffer types into hex
 * @param {Buffer} input Input to be converted to hex
 * @returns {string} Converted input to hex
 */
module.exports.toHex = input => {
  return input.toString('hex');
};
