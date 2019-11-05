const niv = require('node-input-validator');
const mongoose = require('mongoose');
const web3 = require('./web3');
const bip39 = require('bip39');
const { isSHA256 } = require('../functions/utils');

niv.extendMessages(
  {
    required: 'The :attribute field must not be empty.',
    unique: 'The :attribute already exists.',
    email: 'E-mail must be a valid email address.',
    userType: ':attribute has to be client or supplier',
    sufficientFunds: 'Not sufficient funds to send :value RBTC to :arg0',
    checksumAddress: 'Address :value is not valid checksum Address',
    savedRecord: 'Non existent user record'
  },
  'en'
);

niv.niceNames({
  'body.email': 'email',
  'body.passphrase': 'passphrase',
  'params.id': 'database id',
  'params.expediente': 'expediente',
  newUserName: 'name',
  newUserEmail: 'email',
  newPassphrase: 'passphrase'
});

niv.extend('unique', async ({ value, args }) => {
  const field = args[1] || 'email';

  const exists = await mongoose
    .model(args[0])
    .findOne({ [field]: value })
    .select(field);

  return exists ? false : true;
});

niv.extend('savedRecord', async ({ value, args }) => {
  const field = args[1] || '_id';

  const exists = await mongoose
    .model(args[0])
    .findOne({ [field]: value })
    .select(field);
  return exists === null ? false : true;
});

niv.extend('sufficientFunds', async ({ value, args }) => {
  const balance = await web3.eth.getBalance(args[0]);
  if (Number(web3.utils.fromWei(balance)) < Number(value)) {
    return false;
  }
  return true;
});

niv.extend('checksumAddress', async ({ value }) => {
  return web3.utils.checkAddressChecksum(value);
});

niv.extend('isSHA256', async ({ value }) => {
  return isSHA256(value) ? true : false;
});

niv.extend('isValidMnemonic', async ({ value }) => {
  return bip39.validateMnemonic(value);
});

module.exports = niv;
