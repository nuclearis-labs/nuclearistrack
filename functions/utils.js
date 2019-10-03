const web3 = require('web3');
const UserModel = require('../models/user');
const Wallet = require('../classes/Wallet');

module.exports.isValidAddress = address => {
  if (!web3.utils.isAddress(address))
    throw TypeError(`Address is not a valid Ethereum address`);
};

module.exports.isString = string => {
  if (typeof string !== 'string') throw TypeError(`${string} is not a string`);
};

module.exports.isNumber = number => {
  if (!Number.isInteger(number)) throw TypeError(`${number} is not a number`);
  return number;
};

module.exports.toBytes32 = string => {
  return web3.utils.fromAscii(string);
};

module.exports.toChecksumAddress = address => {
  return web3.utils.toChecksumAddress(address);
};

module.exports.toAscii = bytes32 => {
  return web3.utils.toAscii(bytes32);
};

module.exports.convertResult = object => {
  const result = Object.values(object.result);
  return result;
};

module.exports.getKeys = async (email, passphrase) => {
  const user = await UserModel.findOne({ email: email });

  const wallet = new Wallet(true);

  wallet.encryptedKey = user.encryptedPrivateKey;
  wallet
    .decryptBIP38(passphrase)
    .generatePublicKey()
    .generateRSKAddress();

  return {
    wallet: wallet.rskAddressFromPublicKey,
    privKey: wallet.privKey.toString('hex')
  };
};
