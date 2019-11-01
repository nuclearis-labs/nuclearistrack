require('dotenv').config();
const ethereumjs = require('ethereumjs-util');
const utils = require('./utils');
const bip39 = require('bip39');
const bip32 = require('bip32');

module.exports.accountDiscovery = async ({
  mnemonic,
  passphrase,
  coin,
  addressToFind
}) => {
  let gap = 0;
  let index = 0;
  while (gap < 20) {
    const privateKey = await this.generatePrivateKeyFromMnemonic({
      mnemonic,
      passphrase,
      coin,
      index
    });

    let address = this.generateRSKAddress(privateKey);
    if (addressToFind === address) {
      return address;
    }
    gap++;
    index++;
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
  passphrase = '',
  mnemonic,
  coin = 0,
  account = 0,
  index = 0
} = {}) => {
  const seed = await bip39.mnemonicToSeed(mnemonic, passphrase);
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
