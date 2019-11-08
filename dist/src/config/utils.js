var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Web3 from 'web3';
import UserModel from '../models/user';
import { generateRSKAddress, decryptBIP38 } from './wallet';
import txModel from '../models/transaction';
export const isString = (string) => {
    if (typeof string !== 'string')
        throw TypeError(`${string} is not a string`);
    return string;
};
export const isNumber = (number) => {
    if (!Number.isInteger(number))
        throw TypeError(`${number} is not a number`);
    return number;
};
export const createPendingTx = ({ txHash, subject, data }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield txModel.create({
        txHash,
        subject: subject,
        data
    });
});
export const asciiToHex = (string) => {
    return Web3.utils.asciiToHex(string);
};
export const toChecksumAddress = (address) => {
    return Web3.utils.toChecksumAddress(address);
};
export const isSHA256 = (hash) => {
    if (/\b0x[A-Fa-f0-9]{64}\b/.test(hash) === true)
        return hash;
    throw Error(`Given hash "${hash}" is not a valid SHA256 hash`);
};
export const hexToAscii = (bytes32) => {
    return removeNullBytes(Web3.utils.hexToAscii(bytes32));
};
export const isEmail = (email) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email) === true)
        return email;
    throw Error(`Given email "${email}" is not a valid email`);
};
export const web3ArrayToJSArray = (object) => {
    return Object.values(object);
};
export const removeNullBytes = (string) => {
    return string.replace(/\0/g, '');
};
export const getKeys = ({ email, passphrase }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel.findOne({ email: email });
    const privateKey = yield decryptBIP38(user.encryptedPrivateKey, passphrase);
    const address = generateRSKAddress(privateKey);
    return {
        address,
        privateKey
    };
});
//# sourceMappingURL=utils.js.map