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
 * @param {Buffer} privKey Private Key
 * @param {number} network Network ID
 * @returns {string} Private Key in WIF format
 */
generateWifPrivateKey = (privKey, network = networks.testnet.wif) => {
  return wif.encode(network, privKey, true);
};

/**
 * Encrypts a WIF Format PrivateKey using the BIP-38 Implementation
 * @param {string} wifPrivKey Private Key in WIF format
 * @param {string} passphrase Passphrase to encrypt Key
 * @returns {string} Encrypted BIP-38 Key
 */
module.exports.encryptBIP38 = (privKey, passphrase) => {
  const decoded = wif.decode(generateWifPrivateKey(privKey));
  return bip38.encrypt(decoded.privateKey, decoded.compressed, passphrase);
};

/**
 * Decrypts a PrivateKey into WIF format
 * @param {string} encryptedKey Private Key in WIF format
 * @param {string} passphrase Passphrase to encrypt Key
 * @param {number} network Network ID
 * @returns {Buffer} Decrypted Private Key in Buffer
 */
module.exports.decryptBIP38 = (
  encryptedKey,
  passphrase,
  network = networks.testnet.wif
) => {
  const { privateKey } = bip38.decrypt(encryptedKey, passphrase);
  return privateKey;
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
