const web3 = require('web3');

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