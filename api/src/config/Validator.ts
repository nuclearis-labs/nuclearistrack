import niv from 'node-input-validator';
import mongoose from 'mongoose';
import web3 from './web3';
import { validateMnemonic } from 'bip39';
import { isSHA256 } from './utils';

niv.niceNames({
  'body.email': 'email',
  'params.id': 'database id',
  'params.expediente': 'expediente',
  'body.newUserName': 'name',
  'body.newUserEmail': 'email',
  newPassphrase: 'passphrase'
});

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

interface ValueParam {
  value: string;
  args?: string[];
}

niv.extend('unique', async ({ value, args }: ValueParam) => {
  const field = args[1] || 'email';

  const exists = await mongoose
    .model(args[0])
    .findOne({ [field]: value })
    .select(field);

  return exists ? false : true;
});

niv.extend('savedRecord', async ({ value, args }: ValueParam) => {
  const field = args[1] || '_id';

  const exists = await mongoose
    .model(args[0])
    .findOne({ [field]: value })
    .select(field);
  return exists === null ? false : true;
});

niv.extend('checksumAddress', async ({ value }: ValueParam) => {
  return web3.utils.checkAddressChecksum(value);
});

niv.extend('isSHA256', async ({ value }: ValueParam) => {
  return isSHA256(value) ? true : false;
});

niv.extend('isValidMnemonic', async ({ value }: ValueParam) => {
  return validateMnemonic(value);
});

export default niv;
