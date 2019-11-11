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
function isString(string) {
    if (typeof string !== 'string')
        throw TypeError(`${string} is not a string`);
    return string;
}
exports.isString = isString;
function isNumber(number) {
    if (!Number.isInteger(number))
        throw TypeError(`${number} is not a number`);
    return number;
}
exports.isNumber = isNumber;
function createPendingTx({ txHash, subject, data }) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield transaction_1.default.create({
            txHash,
            subject: subject,
            data
        });
    });
}
exports.createPendingTx = createPendingTx;
function asciiToHex(string) {
    return web3_1.default.utils.asciiToHex(string);
}
exports.asciiToHex = asciiToHex;
function toChecksumAddress(address) {
    return web3_1.default.utils.toChecksumAddress(address);
}
exports.toChecksumAddress = toChecksumAddress;
function isSHA256(hash) {
    if (/\b0x[A-Fa-f0-9]{64}\b/.test(hash) === true)
        return hash;
    throw TypeError(`Given hash "${hash}" is not a valid SHA256 hash`);
}
exports.isSHA256 = isSHA256;
function hexToAscii(bytes32) {
    return removeNullBytes(web3_1.default.utils.hexToAscii(bytes32));
}
exports.hexToAscii = hexToAscii;
function isEmail(email) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email) === true)
        return email;
    throw TypeError(`Given email "${email}" is not a valid email`);
}
exports.isEmail = isEmail;
function web3ArrayToJSArray(object) {
    return Object.values(object);
}
exports.web3ArrayToJSArray = web3ArrayToJSArray;
function removeNullBytes(string) {
    return string.replace(/\0/g, '');
}
exports.removeNullBytes = removeNullBytes;
function getKeys({ email, passphrase }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findOne({ email: email });
        const privateKey = yield wallet_1.decryptBIP38(user.encryptedPrivateKey, passphrase);
        const address = wallet_1.generateRSKAddress(privateKey);
        return {
            address,
            privateKey
        };
    });
}
exports.getKeys = getKeys;
//# sourceMappingURL=utils.js.map