require('dotenv').config();
const ethereumjs = require('ethereumjs-util');
const utils = require('./utils');
const wif = require('wif');
const bip38 = require('bip38');
const { networks } = require('bitcoinjs-lib');
const bip39 = require('bip39');
const bip32 = require('bip32');

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
module.exports.decryptBIP38 = (encryptedKey, passphrase) => {
  try {
    const { privateKey } = bip38.decrypt(encryptedKey, passphrase);
    return privateKey;
  } catch (e) {
    return false;
  }
  throw Error('Address not found');
};

/**
 * Generates a new mnemonic Phrase from an english wordlist
 * @returns {String} Mnemonic Word String
 */
module.exports.generateMnemonic = (strength = 256) => {
  return bip39.generateMnemonic(strength);
};

/**
 * Generates a Public Key from the Mnemonic Phrase, Derived at Coin: 0' Account: (Defaults to 0), Change:0 Index: Defaults to 0
 * @returns {Promise<Buffer>} Public Key
 */
module.exports.generatePrivateKeyFromMnemonic = async ({
  mnemonic,
  coin = 0,
  account = 0,
  index = 0
} = {}) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = bip32.fromSeed(seed);
  return node.derivePath(`m/44'/${coin}'/${account}'/0/${index}`).privateKey;
};

/**
 * Generates a new Wallet Address
 * @param {Buffer} privateKey Private Key
 * @returns {string} Wallet Address
 */
module.exports.generateRSKAddress = privateKey => {
  return utils.toChecksumAddress(
    ethereumjs.privateToAddress(privateKey).toString('hex')
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
