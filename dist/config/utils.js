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
const web3_1 = __importDefault(require("web3"));
const user_1 = __importDefault(require("../models/user"));
const wallet_1 = require("./wallet");
const transaction_1 = __importDefault(require("../models/transaction"));
exports.isString = (string) => {
    if (typeof string !== 'string')
        throw TypeError(`${string} is not a string`);
    return string;
};
exports.isNumber = (number) => {
    if (!Number.isInteger(number))
        throw TypeError(`${number} is not a number`);
    return number;
};
exports.createPendingTx = ({ txHash, subject, data }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transaction_1.default.create({
        txHash,
        subject: subject,
        data
    });
});
exports.asciiToHex = (string) => {
    return web3_1.default.utils.asciiToHex(string);
};
exports.toChecksumAddress = (address) => {
    return web3_1.default.utils.toChecksumAddress(address);
};
exports.isSHA256 = (hash) => {
    if (/\b0x[A-Fa-f0-9]{64}\b/.test(hash) === true)
        return hash;
    throw Error(`Given hash "${hash}" is not a valid SHA256 hash`);
};
exports.hexToAscii = (bytes32) => {
    return exports.removeNullBytes(web3_1.default.utils.hexToAscii(bytes32));
};
exports.isEmail = (email) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email) === true)
        return email;
    throw Error(`Given email "${email}" is not a valid email`);
};
exports.web3ArrayToJSArray = (object) => {
    return Object.values(object);
};
exports.removeNullBytes = (string) => {
    return string.replace(/\0/g, '');
};
exports.getKeys = ({ email, passphrase }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email: email });
    const privateKey = yield wallet_1.decryptBIP38(user.encryptedPrivateKey, passphrase);
    const address = wallet_1.generateRSKAddress(privateKey);
    return {
        address,
        privateKey
    };
});
//# sourceMappingURL=utils.js.map