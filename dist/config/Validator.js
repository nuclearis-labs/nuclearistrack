"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_input_validator_1 = __importDefault(require("node-input-validator"));
const mongoose_1 = __importDefault(require("mongoose"));
const web3_1 = __importDefault(require("./web3"));
const bip39_1 = require("bip39");
const utils_1 = require("./utils");
node_input_validator_1.default.extendMessages({
    required: 'The :attribute field must not be empty.',
    unique: 'The :attribute already exists.',
    email: 'E-mail must be a valid email address.',
    userType: ':attribute has to be client or supplier',
    sufficientFunds: 'Not sufficient funds to send :value RBTC to :arg0',
    checksumAddress: 'Address :value is not valid checksum Address',
    savedRecord: 'Non existent user record'
}, 'en');
node_input_validator_1.default.niceNames({
    'body.email': 'email',
    'body.passphrase': 'passphrase',
    'params.id': 'database id',
    'params.expediente': 'expediente',
    newUserName: 'name',
    newUserEmail: 'email',
    newPassphrase: 'passphrase'
});
node_input_validator_1.default.extend('unique', ({ value, args }) => __awaiter(void 0, void 0, void 0, function* () {
    const field = args[1] || 'email';
    const exists = yield mongoose_1.default
        .model(args[0])
        .findOne({ [field]: value })
        .select(field);
    return exists ? false : true;
}));
node_input_validator_1.default.extend('savedRecord', ({ value, args }) => __awaiter(void 0, void 0, void 0, function* () {
    const field = args[1] || '_id';
    const exists = yield mongoose_1.default
        .model(args[0])
        .findOne({ [field]: value })
        .select(field);
    return exists === null ? false : true;
}));
node_input_validator_1.default.extend('checksumAddress', ({ value }) => __awaiter(void 0, void 0, void 0, function* () {
    return web3_1.default.utils.checkAddressChecksum(value);
}));
node_input_validator_1.default.extend('isSHA256', ({ value }) => __awaiter(void 0, void 0, void 0, function* () {
    return utils_1.isSHA256(value) ? true : false;
}));
node_input_validator_1.default.extend('isValidMnemonic', ({ value }) => __awaiter(void 0, void 0, void 0, function* () {
    return bip39_1.validateMnemonic(value);
}));
exports.default = node_input_validator_1.default;
//# sourceMappingURL=Validator.js.map