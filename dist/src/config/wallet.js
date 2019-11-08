var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config();
import ethereumjs from 'ethereumjs-util';
import { toChecksumAddress } from './utils';
import wif from 'wif';
import bip38 from 'bip38';
import { networks } from 'bitcoinjs-lib';
import bip39 from 'bip39';
import bip32 from 'bip32';
import { AssertionError } from 'assert';
const generateWifPrivateKey = (privKey, network = networks.testnet.wif) => {
    return wif.encode(network, privKey, true);
};
export const encryptBIP38 = (privKey, passphrase) => {
    const decoded = wif.decode(generateWifPrivateKey(privKey), networks.testnet.wif);
    return bip38.encrypt(decoded.privateKey, decoded.compressed, passphrase);
};
export const decryptBIP38 = (encryptedKey, passphrase) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { privateKey } = bip38.decrypt(encryptedKey, passphrase);
        return privateKey;
    }
    catch (e) {
        console.log(e.message);
        if (e instanceof AssertionError) {
            throw Error('Passphrase or User incorrect');
        }
    }
});
export const generateMnemonic = (strength = 256) => {
    return bip39.generateMnemonic(strength);
};
export const generatePrivateKeyFromMnemonic = ({ mnemonic, coin = '0', account = 0, index = 0 }) => __awaiter(void 0, void 0, void 0, function* () {
    const seed = yield bip39.mnemonicToSeed(mnemonic);
    const node = bip32.fromSeed(seed);
    return node.derivePath(`m/44'/${coin}'/${account}'/0/${index}`).privateKey;
});
export const generateRSKAddress = (privateKey) => {
    try {
        return toChecksumAddress(ethereumjs.privateToAddress(privateKey).toString('hex'));
    }
    catch (e) {
        console.log(e);
    }
};
export const toHex = (input) => {
    return input.toString('hex');
};
//# sourceMappingURL=wallet.js.map