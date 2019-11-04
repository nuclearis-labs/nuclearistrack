const web3 = require('web3');
const UserModel = require('../models/user');
const wallet = require('./wallet');
const txModel = require('../models/transaction');

module.exports.isString = string => {
  if (typeof string !== 'string') throw TypeError(`${string} is not a string`);
  return string;
};

module.exports.isNumber = number => {
  if (!Number.isInteger(number)) throw TypeError(`${number} is not a number`);
  return number;
};

module.exports.createPendingTx = async ({ txHash, subject, data }) => {
  return await txModel.create({
    txHash,
    subject: subject,
    data
  });
};

module.exports.asciiToHex = string => {
  return web3.utils.asciiToHex(string);
};

module.exports.toChecksumAddress = address => {
  return web3.utils.toChecksumAddress(address);
};

module.exports.isSHA256 = hash => {
  if (/\b0x[A-Fa-f0-9]{64}\b/.test(hash) === true) return hash;
  throw Error(`Given hash "${hash}" is not a valid SHA256 hash`);
};

module.exports.hexToAscii = bytes32 => {
  return this.removeNullBytes(web3.utils.hexToAscii(bytes32));
};

module.exports.isEmail = email => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    ) === true
  )
    return email;
  throw Error(`Given email "${email}" is not a valid email`);
};

module.exports.web3ArrayToJSArray = object => {
  return Object.values(object);
};

module.exports.removeNullBytes = string => {
  return string.replace(/\0/g, '');
};

module.exports.getKeys = async ({ email, passphrase }) => {
  const user = await UserModel.findOne({ email: email });

  const privateKey = await wallet.decryptBIP38(
    user.encryptedPrivateKey,
    passphrase
  );
  const address = wallet.generateRSKAddress(privateKey);

  console.log(address);

  return {
    address,
    privateKey
  };
};
