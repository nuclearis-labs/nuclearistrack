var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import niv from 'node-input-validator';
import mongoose from 'mongoose';
import web3 from './web3';
import bip39 from 'bip39';
import { isSHA256 } from './utils';
niv.extendMessages({
    required: 'The :attribute field must not be empty.',
    unique: 'The :attribute already exists.',
    email: 'E-mail must be a valid email address.',
    userType: ':attribute has to be client or supplier',
    sufficientFunds: 'Not sufficient funds to send :value RBTC to :arg0',
    checksumAddress: 'Address :value is not valid checksum Address',
    savedRecord: 'Non existent user record'
}, 'en');
niv.niceNames({
    'body.email': 'email',
    'body.passphrase': 'passphrase',
    'params.id': 'database id',
    'params.expediente': 'expediente',
    newUserName: 'name',
    newUserEmail: 'email',
    newPassphrase: 'passphrase'
});
niv.extend('unique', ({ value, args }) => __awaiter(void 0, void 0, void 0, function* () {
    const field = args[1] || 'email';
    const exists = yield mongoose
        .model(args[0])
        .findOne({ [field]: value })
        .select(field);
    return exists ? false : true;
}));
niv.extend('savedRecord', ({ value, args }) => __awaiter(void 0, void 0, void 0, function* () {
    const field = args[1] || '_id';
    const exists = yield mongoose
        .model(args[0])
        .findOne({ [field]: value })
        .select(field);
    return exists === null ? false : true;
}));
niv.extend('checksumAddress', ({ value }) => __awaiter(void 0, void 0, void 0, function* () {
    return web3.utils.checkAddressChecksum(value);
}));
niv.extend('isSHA256', ({ value }) => __awaiter(void 0, void 0, void 0, function* () {
    return isSHA256(value) ? true : false;
}));
niv.extend('isValidMnemonic', ({ value }) => __awaiter(void 0, void 0, void 0, function* () {
    return bip39.validateMnemonic(value);
}));
export default niv;
//# sourceMappingURL=Validator.js.map